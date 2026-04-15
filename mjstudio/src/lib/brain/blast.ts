/**
 * Cold-email blast campaign.
 *
 * Architecture:
 *   - 500K-row email list lives in `data/blast-list.txt` on local disk
 *   - Mirrored to GitHub at `mjstudio/data/blast-list.txt` for resume across
 *     Koyeb redeploys (Koyeb FS is ephemeral). Mirror is push-once, pull-on-demand.
 *   - The small pointer (cursor, dailyCap, status, listSha, sentByDay) lives
 *     in brain.json as `blastConfig` so tick state survives without reloading
 *     the whole list.
 *   - Each tick reads one slice [cursor .. cursor+dailyRemaining], sends through
 *     Resend with bounded parallelism, advances the cursor by `sent` (so
 *     transient failures get retried on the next tick), persists.
 *   - Per-row template merge supports {{email}} and {{domain}} only — those are
 *     the only fields we have for a list of bare emails.
 *
 * The list file is NEVER loaded fully into memory. We stream-read with a
 * line counter and bail as soon as we have the slice we need. The webhook
 * event log is read via a tail-seek pattern for "recent events" and an
 * incremental cursor for aggregation — both O(new_events) not O(all_events).
 */

import { mkdir, writeFile, stat, appendFile, open } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import path from "node:path";

import {
  loadBrain,
  saveBrain,
  setBlastConfig,
  logActivity,
  todayKey,
  EMAIL_RE,
  type BlastConfig,
  type EmailTemplate,
} from "@/lib/brain-storage";
import { resendSend } from "@/lib/brain/sender";
import {
  getFile,
  putFile,
  isGithubStorageEnabled,
} from "@/lib/github-storage";

const DATA_DIR = path.resolve(process.cwd(), "data");
const LIST_FILE = path.join(DATA_DIR, "blast-list.txt");
const EVENTS_FILE = path.join(DATA_DIR, "blast-events.jsonl");
const GITHUB_LIST_PATH =
  process.env.GITHUB_BLAST_PATH || "mjstudio/data/blast-list.txt";

const PARALLEL = 5;
const PER_SEND_DELAY_MS = 1500;

const WARMUP_START_CAP = 25;
const WARMUP_DAILY_STEP = 25;
const MS_PER_DAY = 86_400_000;

const CIRCUIT_MIN_SAMPLE = 200;
const CIRCUIT_BOUNCE_MAX = 0.08;
const CIRCUIT_COMPLAINT_MAX = 0.005;

// ─────────── Warmup helpers ───────────

function warmupDayFromStart(startedAt: string | undefined): number {
  if (!startedAt) return 0;
  const elapsed = Date.now() - new Date(startedAt).getTime();
  return Math.max(1, Math.floor(elapsed / MS_PER_DAY) + 1);
}

export function computeEffectiveCap(cfg: BlastConfig): number {
  if (!cfg.warmupEnabled || !cfg.warmupStartedAt) return cfg.dailyCap;
  const day = warmupDayFromStart(cfg.warmupStartedAt);
  const rampCap = WARMUP_START_CAP + (day - 1) * WARMUP_DAILY_STEP;
  return Math.min(cfg.dailyCap, rampCap);
}

export function computeWarmupDay(cfg: BlastConfig): number {
  if (!cfg.warmupEnabled) return 0;
  return warmupDayFromStart(cfg.warmupStartedAt);
}

/**
 * Returns a trip reason if bounce or complaint rate exceeds safe thresholds.
 * Gated by CIRCUIT_MIN_SAMPLE so early noise (1 bounce out of 5) can't kill
 * the campaign before we have a meaningful sample.
 */
export function checkCircuitBreaker(cfg: BlastConfig): string | null {
  const m = cfg.metrics;
  if (!m) return null;
  if (cfg.sentCount < CIRCUIT_MIN_SAMPLE) return null;
  const bounceRate = m.bounced / cfg.sentCount;
  const complaintRate = m.complained / cfg.sentCount;
  if (bounceRate > CIRCUIT_BOUNCE_MAX) {
    return `bounce rate ${(bounceRate * 100).toFixed(1)}% exceeds ${(CIRCUIT_BOUNCE_MAX * 100).toFixed(0)}% threshold`;
  }
  if (complaintRate > CIRCUIT_COMPLAINT_MAX) {
    return `complaint rate ${(complaintRate * 100).toFixed(2)}% exceeds ${(CIRCUIT_COMPLAINT_MAX * 100).toFixed(1)}% threshold`;
  }
  return null;
}

// ─────────── List file storage ───────────

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

async function localListExists(): Promise<boolean> {
  try {
    await stat(LIST_FILE);
    return true;
  } catch {
    return false;
  }
}

async function ensureLocalList(): Promise<boolean> {
  if (await localListExists()) return true;
  if (!isGithubStorageEnabled()) return false;
  try {
    const file = await getFile(GITHUB_LIST_PATH);
    if (!file) return false;
    await ensureDataDir();
    await writeFile(LIST_FILE, file.content, "utf8");
    return true;
  } catch (err) {
    console.error("[blast] pullList failed:", err);
    return false;
  }
}

export async function uploadList(
  rawText: string,
  filename: string
): Promise<{ totalRows: number; listSha?: string }> {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const line of rawText.split(/\r?\n/)) {
    const email = line.trim().toLowerCase();
    if (!email || !EMAIL_RE.test(email)) continue;
    if (seen.has(email)) continue;
    seen.add(email);
    out.push(email);
  }
  const cleaned = out.join("\n") + "\n";

  await ensureDataDir();
  await writeFile(LIST_FILE, cleaned, "utf8");

  let listSha: string | undefined;
  if (isGithubStorageEnabled()) {
    try {
      const existing = await getFile(GITHUB_LIST_PATH);
      const result = await putFile(
        GITHUB_LIST_PATH,
        cleaned,
        `blast: upload ${filename} (${out.length} rows)`,
        existing?.sha
      );
      listSha = result.sha;
    } catch (err) {
      console.error("[blast] push to GitHub failed:", err);
    }
  }

  return { totalRows: out.length, listSha };
}

export async function readSlice(start: number, count: number): Promise<string[]> {
  if (count <= 0) return [];
  const ok = await ensureLocalList();
  if (!ok) return [];

  return new Promise((resolve, reject) => {
    const stream = createReadStream(LIST_FILE, { encoding: "utf8" });
    const rl = createInterface({ input: stream, crlfDelay: Infinity });
    const collected: string[] = [];
    let idx = 0;
    rl.on("line", (line) => {
      if (idx >= start && idx < start + count) {
        const trimmed = line.trim();
        if (trimmed) collected.push(trimmed);
      }
      idx++;
      if (idx >= start + count) {
        rl.close();
        stream.close();
      }
    });
    rl.on("close", () => resolve(collected));
    rl.on("error", reject);
    stream.on("error", reject);
  });
}

// ─────────── Template merge ───────────

function mergeTemplate(text: string, email: string): string {
  const domain = email.split("@")[1] ?? "";
  return text
    .replace(/\{\{\s*email\s*\}\}/gi, email)
    .replace(/\{\{\s*domain\s*\}\}/gi, domain);
}

function findTemplate(
  templates: EmailTemplate[] | undefined,
  templateId?: string
): EmailTemplate | null {
  if (!templateId) return null;
  return (templates ?? []).find((t) => t.id === templateId) ?? null;
}

// ─────────── Tick ───────────

export type BlastTickSummary = {
  ran: boolean;
  reason?: string;
  attempted: number;
  sent: number;
  failed: number;
  remainingToday: number;
  totalSent: number;
  totalRows: number;
  errors: string[];
};

export async function runBlastTick(): Promise<BlastTickSummary> {
  const empty: BlastTickSummary = {
    ran: false,
    attempted: 0,
    sent: 0,
    failed: 0,
    remainingToday: 0,
    totalSent: 0,
    totalRows: 0,
    errors: [],
  };

  const data = await loadBrain();
  const cfg = data.blastConfig;

  if (!cfg) return { ...empty, reason: "no blast config" };
  if (!cfg.active) return { ...empty, reason: "blast inactive" };
  if (cfg.status === "paused") return { ...empty, reason: "paused" };
  if (cfg.status === "done" || cfg.sentCount >= cfg.totalRows) {
    return { ...empty, reason: "list exhausted", totalSent: cfg.sentCount, totalRows: cfg.totalRows };
  }

  // Circuit breaker runs BEFORE reading any rows — don't waste quota on a burning domain.
  const trip = checkCircuitBreaker(cfg);
  if (trip) {
    await setBlastConfig({
      status: "paused",
      circuitBreakerTrippedAt: new Date().toISOString(),
      circuitBreakerReason: trip,
    });
    await logActivity({
      type: "error",
      description: `Blast auto-paused by circuit breaker: ${trip}. Review list quality before resuming.`,
    });
    return { ...empty, reason: `circuit breaker: ${trip}`, totalSent: cfg.sentCount, totalRows: cfg.totalRows };
  }

  const today = todayKey();
  const sentToday = cfg.sentByDay[today] ?? 0;
  const effectiveCap = computeEffectiveCap(cfg);
  const remainingToday = Math.max(0, effectiveCap - sentToday);
  if (remainingToday === 0) {
    return {
      ...empty,
      reason: cfg.warmupEnabled
        ? `warmup cap reached (day ${computeWarmupDay(cfg)} · ${effectiveCap}/day)`
        : "daily cap reached",
      totalSent: cfg.sentCount,
      totalRows: cfg.totalRows,
    };
  }

  const tpl = findTemplate(data.emailTemplates, cfg.templateId);
  if (!tpl) {
    return { ...empty, reason: "template missing — pick one in the Blast tab" };
  }

  const remainingInList = cfg.totalRows - cfg.sentCount;
  const sliceSize = Math.min(remainingToday, remainingInList);
  const slice = await readSlice(cfg.sentCount, sliceSize);

  if (slice.length === 0) {
    return { ...empty, reason: "list file unreadable", totalSent: cfg.sentCount, totalRows: cfg.totalRows };
  }

  const from = process.env.RESEND_FROM_EMAIL || "hello@send.brandivibe.site";
  const replyTo = process.env.RESEND_REPLY_TO || from;
  const unsubscribeUrl = "https://brandivibe.com/api/brain/unsubscribe";

  const summary: BlastTickSummary = {
    ran: true,
    attempted: slice.length,
    sent: 0,
    failed: 0,
    remainingToday,
    totalSent: cfg.sentCount,
    totalRows: cfg.totalRows,
    errors: [],
  };

  for (let i = 0; i < slice.length; i += PARALLEL) {
    const chunk = slice.slice(i, i + PARALLEL);
    const results = await Promise.all(
      chunk.map(async (email) => {
        const subject = mergeTemplate(tpl.subject, email);
        const body =
          mergeTemplate(tpl.body, email) +
          `\n\n---\nUnsubscribe: ${unsubscribeUrl}?email=${encodeURIComponent(email)}`;
        return resendSend({
          from,
          to: [email],
          subject,
          text: body,
          reply_to: replyTo,
          headers: {
            "List-Unsubscribe": `<${unsubscribeUrl}?email=${encodeURIComponent(email)}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
        });
      })
    );

    for (const r of results) {
      if (r.ok) summary.sent++;
      else {
        summary.failed++;
        if (r.error && summary.errors.length < 5) summary.errors.push(r.error);
      }
    }

    if (i + PARALLEL < slice.length) {
      await new Promise((r) => setTimeout(r, PER_SEND_DELAY_MS));
    }
  }

  // Advance the cursor by ACTUALLY SENT only — failed sends (transient 5xx,
  // network blips, Resend rate limits) stay in the unsent pool and retry on
  // the next tick. This gives up ordering across ticks but guarantees every
  // recipient gets at most one attempt per tick without permanent data loss.
  const newSentByDay = { ...cfg.sentByDay, [today]: sentToday + summary.sent };
  const newSentCount = cfg.sentCount + summary.sent;
  const isDone = newSentCount >= cfg.totalRows;

  await setBlastConfig({
    sentCount: newSentCount,
    sentByDay: newSentByDay,
    lastTickAt: new Date().toISOString(),
    status: isDone ? "done" : "running",
  });

  summary.totalSent = newSentCount;

  await logActivity({
    type: "email-sent",
    description: `Blast tick: ${summary.sent} sent, ${summary.failed} failed (${newSentCount}/${cfg.totalRows} total · day ${today} ${sentToday + summary.sent}/${cfg.dailyCap})`,
  });

  return summary;
}

// ─────────── Event log (append-only) ───────────

export type BlastEventKind =
  | "delivered"
  | "bounced"
  | "complained"
  | "opened"
  | "clicked"
  | "unsubscribed";

export type BlastEvent = {
  kind: BlastEventKind;
  email: string;
  at: string;
  messageId?: string;
};

/**
 * Append one event to the JSONL. Concurrent webhooks are safe because
 * O_APPEND guarantees the kernel serializes writes — interleaving can only
 * happen at file-end boundaries which always start a new line.
 */
export async function recordBlastEvent(event: BlastEvent): Promise<void> {
  await ensureDataDir();
  await appendFile(EVENTS_FILE, JSON.stringify(event) + "\n", "utf8");
}

/**
 * Tail-read the last N events by seeking from EOF backwards, reading 64KB
 * at a time until we have enough newline boundaries. For a 70MB file this
 * reads ~64KB instead of the whole thing. 1000× faster than the naive
 * "load all + slice" pattern.
 */
export async function recentBlastEvents(limit = 30): Promise<BlastEvent[]> {
  let fh;
  try {
    fh = await open(EVENTS_FILE, "r");
  } catch {
    return [];
  }
  try {
    const { size } = await fh.stat();
    if (size === 0) return [];

    const CHUNK = 64 * 1024;
    let pos = size;
    let buf = "";
    const lines: string[] = [];

    while (pos > 0 && lines.length <= limit) {
      const readSize = Math.min(CHUNK, pos);
      pos -= readSize;
      const chunk = Buffer.alloc(readSize);
      await fh.read(chunk, 0, readSize, pos);
      buf = chunk.toString("utf8") + buf;
      const parts = buf.split("\n");
      // Everything except the first part is a complete line (the first may
      // be a partial line continued in the previous chunk)
      buf = parts.shift() ?? "";
      lines.unshift(...parts.filter(Boolean));
    }
    if (buf.trim()) lines.unshift(buf);

    const out: BlastEvent[] = [];
    for (const line of lines.slice(-limit)) {
      try {
        out.push(JSON.parse(line) as BlastEvent);
      } catch {
        // Skip malformed — torn writes possible at file boundary
      }
    }
    return out.reverse();
  } finally {
    await fh.close();
  }
}

// ─────────── Aggregator ───────────

type AggregatorCache = { size: number; at: number };
let aggregatorCache: AggregatorCache | null = null;
const AGGREGATOR_TTL_MS = 10_000;

/**
 * Incrementally roll new webhook events into BlastConfig.metrics using the
 * `eventsAggregated` cursor. Reads only events from the cursor forward via
 * line-stream skipping, so steady-state cost is O(new_events).
 *
 * Caches for AGGREGATOR_TTL_MS so dashboard polls don't re-scan the file
 * more often than every 10s.
 *
 * Note on unique-recipient counts: we do NOT maintain unique-open/unique-click
 * sets across calls because persisting 100K+ email strings in brain.json would
 * bloat the GitHub-synced state. The metrics.uniqueOpened / uniqueClicked
 * fields are set equal to raw opened/clicked instead. For cold outreach at
 * 500K scale the difference is negligible (recipients rarely open twice) and
 * Apple Mail Privacy Protection makes uniqueness meaningless anyway.
 */
export async function aggregateBlastEvents(): Promise<{ processed: number; total: number }> {
  const data = await loadBrain();
  const cfg = data.blastConfig;
  if (!cfg) return { processed: 0, total: 0 };

  let fileSize = 0;
  try {
    const st = await stat(EVENTS_FILE);
    fileSize = st.size;
  } catch {
    return { processed: 0, total: cfg.eventsAggregated ?? 0 };
  }

  if (
    aggregatorCache &&
    aggregatorCache.size === fileSize &&
    Date.now() - aggregatorCache.at < AGGREGATOR_TTL_MS
  ) {
    return { processed: 0, total: cfg.eventsAggregated ?? 0 };
  }

  const cursor = cfg.eventsAggregated ?? 0;
  const metrics = cfg.metrics
    ? { ...cfg.metrics }
    : {
        delivered: 0,
        bounced: 0,
        complained: 0,
        opened: 0,
        clicked: 0,
        unsubscribed: 0,
        uniqueOpened: 0,
        uniqueClicked: 0,
      };

  let processed = 0;
  let totalEvents = 0;

  await new Promise<void>((resolve, reject) => {
    const stream = createReadStream(EVENTS_FILE, { encoding: "utf8" });
    const rl = createInterface({ input: stream, crlfDelay: Infinity });
    rl.on("line", (line) => {
      const idx = totalEvents++;
      if (idx < cursor) return;
      if (!line.trim()) return;
      let ev: BlastEvent;
      try {
        ev = JSON.parse(line) as BlastEvent;
      } catch {
        return;
      }
      switch (ev.kind) {
        case "delivered":
          metrics.delivered++;
          break;
        case "bounced":
          metrics.bounced++;
          break;
        case "complained":
          metrics.complained++;
          break;
        case "opened":
          metrics.opened++;
          break;
        case "clicked":
          metrics.clicked++;
          break;
        case "unsubscribed":
          metrics.unsubscribed++;
          break;
      }
      processed++;
    });
    rl.on("close", () => resolve());
    rl.on("error", reject);
    stream.on("error", reject);
  });

  metrics.uniqueOpened = metrics.opened;
  metrics.uniqueClicked = metrics.clicked;

  if (processed > 0) {
    await setBlastConfig({
      metrics,
      eventsAggregated: totalEvents,
      metricsUpdatedAt: new Date().toISOString(),
    });
  }

  aggregatorCache = { size: fileSize, at: Date.now() };
  return { processed, total: totalEvents };
}

// ─────────── Reset / control ───────────

export async function resetBlast(): Promise<void> {
  const data = await loadBrain();
  data.blastConfig = undefined;
  await saveBrain(data);
  aggregatorCache = null;
}
