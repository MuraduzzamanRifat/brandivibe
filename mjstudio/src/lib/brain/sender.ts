import {
  loadBrain,
  saveBrain,
  logActivity,
  type OutboundEmail,
} from "../brain-storage";
import {
  pickNextSender,
  recordSend,
  tripCircuitBreaker,
  poolDailyCapacity,
} from "./sender-rotation";

/**
 * Outbound sender with multi-account rotation. Each enabled SenderAccount has
 * its own warmup curve + daily cap; the rotator picks the lowest-utilized
 * eligible account on every send so volume is spread across all senders.
 *
 * Falls back gracefully when no senderAccounts are configured: uses the
 * legacy RESEND_FROM_EMAIL single-sender flow with the original 50/day cap.
 *
 * If RESEND_API_KEY is unset, this is a no-op — emails stay queued.
 */

// Legacy single-sender warmup constants (only used when senderAccounts pool is empty)
const LEGACY_WARMUP_START = 5;
const LEGACY_WARMUP_STEP = 3;
const LEGACY_WARMUP_CAP_DAYS = 30;
const LEGACY_STEADY_STATE = 50;

function legacyWarmupCap(dayIndex: number): number {
  if (dayIndex < 1) return LEGACY_WARMUP_START;
  if (dayIndex >= LEGACY_WARMUP_CAP_DAYS) return LEGACY_STEADY_STATE;
  return LEGACY_WARMUP_START + (dayIndex - 1) * LEGACY_WARMUP_STEP;
}

function domainOf(email: string): string {
  return email.split("@")[1]?.toLowerCase() ?? "";
}

function daysBetween(a: string, b: string): number {
  return Math.floor((new Date(a).getTime() - new Date(b).getTime()) / 86_400_000);
}

/** Resend errors that indicate domain/reputation trouble — pause the sender. */
function isReputationError(error: string): boolean {
  const e = error.toLowerCase();
  return (
    e.includes("recipient blocked") ||
    e.includes("domain not verified") ||
    e.includes("invalid from address") ||
    e.includes("blocked due to") ||
    e.includes("suppressed")
  );
}

export type ResendSendBody = {
  from: string;
  to: string[];
  subject: string;
  text: string;
  reply_to?: string;
  headers?: Record<string, string>;
};

type ResendResponse = { id?: string; error?: { message?: string; name?: string } };

export async function resendSend(body: ResendSendBody): Promise<{ ok: boolean; id?: string; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "RESEND_API_KEY not set" };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => ({}))) as ResendResponse;
  if (!res.ok || json.error) {
    return { ok: false, error: json.error?.message ?? `HTTP ${res.status}` };
  }
  return { ok: true, id: json.id };
}

export type SendTickSummary = {
  dayIndex: number;
  warmupCap: number;
  alreadySentToday: number;
  attempted: number;
  sent: number;
  suppressed: number;
  failed: number;
  errors: string[];
};

export async function runSendTick(): Promise<SendTickSummary> {
  const summary: SendTickSummary = {
    dayIndex: 0,
    warmupCap: 0,
    alreadySentToday: 0,
    attempted: 0,
    sent: 0,
    suppressed: 0,
    failed: 0,
    errors: [],
  };

  const brain = await loadBrain();
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  // Initialize sendingSince on first run (used for legacy single-sender mode)
  if (!brain.sendingSince) {
    brain.sendingSince = todayStr;
    await saveBrain(brain);
  }

  // Multi-sender mode: pool capacity is the sum of every enabled account's
  // current effective cap. Single-sender mode (no accounts configured): the
  // legacy global warmup curve.
  const pool = poolDailyCapacity(brain, now);
  const usingPool = pool.enabledAccounts > 0;

  const dayIndex = daysBetween(now.toISOString(), brain.sendingSince) + 1;
  const legacyCap = legacyWarmupCap(dayIndex);
  const legacyAlready = (brain.sendCounts ?? {})[todayStr] ?? 0;

  // Effective sending budget for this tick
  const cap = usingPool ? pool.capacity : legacyCap;
  const alreadyToday = usingPool ? pool.sentToday : legacyAlready;
  summary.dayIndex = dayIndex;
  summary.warmupCap = cap;
  summary.alreadySentToday = alreadyToday;

  if (alreadyToday >= cap) {
    return summary;
  }

  const fallbackFrom = process.env.RESEND_FROM_EMAIL || "hello@send.brandivibe.site";
  const fallbackReplyTo = process.env.RESEND_REPLY_TO || fallbackFrom;

  const queue = (brain.outboundQueue ?? [])
    .filter((e) => e.status === "queued" && new Date(e.sendAt).getTime() <= now.getTime())
    .sort((a, b) => new Date(a.sendAt).getTime() - new Date(b.sendAt).getTime());

  const remainingToday = cap - alreadyToday;
  const toAttempt = queue.slice(0, remainingToday);
  summary.attempted = toAttempt.length;

  // Track send results so we can log activities after the single saveBrain call.
  type SendResult = { email: OutboundEmail; ok: boolean; resendId?: string; error?: string };
  const sendResults: SendResult[] = [];

  for (const email of toAttempt) {
    const prospect = brain.prospects.find((p) => p.id === email.prospectId);
    const queueIdx = (brain.outboundQueue ?? []).findIndex((e) => e.id === email.id);

    // Unsubscribed → suppress in-place, no network call
    if (prospect?.unsubscribed) {
      if (queueIdx >= 0) {
        brain.outboundQueue![queueIdx].status = "suppressed";
        brain.outboundQueue![queueIdx].failReason = "prospect unsubscribed";
      }
      summary.suppressed++;
      continue;
    }

    // Per-domain 1-in-3-days cap
    const dom = domainOf(email.to);
    const lastSent = (brain.lastSendByDomain ?? {})[dom];
    if (lastSent) {
      const hoursSince = (now.getTime() - new Date(lastSent).getTime()) / 3_600_000;
      if (hoursSince < 72) {
        const newSendAt = new Date(now.getTime() + 24 * 3_600_000).toISOString();
        if (queueIdx >= 0) brain.outboundQueue![queueIdx].sendAt = newSendAt;
        continue;
      }
    }

    // Pick the next eligible sender from the pool. If the pool isn't
    // configured, fall back to the legacy single-sender env vars.
    let from: string;
    let replyTo: string;
    let senderId: string | undefined;
    if (usingPool) {
      const pick = pickNextSender(brain, now);
      if (!pick) {
        // Pool exhausted mid-tick — stop attempting; remaining emails stay queued
        break;
      }
      const fromName = pick.account.fromName ?? "Muraduzzaman at Brandivibe";
      from = `${fromName} <${pick.account.fromEmail}>`;
      replyTo = pick.account.replyTo ?? fallbackReplyTo;
      senderId = pick.account.id;
    } else {
      from = fallbackFrom;
      replyTo = fallbackReplyTo;
    }

    // Actually send
    const result = await resendSend({
      from,
      to: [email.to],
      subject: email.subject,
      text: email.body,
      reply_to: replyTo,
      headers: {
        "List-Unsubscribe": `<${extractUnsubscribeLink(email.body) || "https://brandivibe.com/api/brain/unsubscribe"}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });

    if (result.ok) {
      if (queueIdx >= 0) {
        brain.outboundQueue![queueIdx].status = "sent";
        brain.outboundQueue![queueIdx].resendId = result.id;
        brain.outboundQueue![queueIdx].sentAt = new Date().toISOString();
        // Track which sender shipped this email — useful for per-account
        // performance breakdowns in the digest + experiment framework
        if (senderId) {
          const meta = brain.outboundQueue![queueIdx].meta ?? {};
          brain.outboundQueue![queueIdx].meta = { ...meta, senderId };
        }
      }
      // Update legacy counters too so the daily digest still tracks total volume
      brain.sendCounts = brain.sendCounts ?? {};
      brain.sendCounts[todayStr] = (brain.sendCounts[todayStr] ?? 0) + 1;
      brain.lastSendByDomain = brain.lastSendByDomain ?? {};
      brain.lastSendByDomain[dom] = new Date().toISOString();

      // Per-sender accounting in the rotation pool
      if (usingPool && senderId) {
        const account = (brain.senderAccounts ?? []).find((a) => a.id === senderId);
        if (account) recordSend(account, now);
      }

      if (prospect) {
        prospect.sequence = prospect.sequence ?? { stage: 0 };
        prospect.sequence.stage = email.sequenceTouch as 1 | 2 | 3 | 4;
        prospect.sequence.lastSentAt = new Date().toISOString();
        prospect.sequence.lastOutcome = "sent";
        prospect.sequence.nextSendAt = nextTouchDate(email.sequenceTouch);
      }
      summary.sent++;
    } else {
      if (queueIdx >= 0) {
        brain.outboundQueue![queueIdx].status = "failed";
        brain.outboundQueue![queueIdx].failReason = result.error;
      }
      summary.failed++;
      summary.errors.push(`${email.to}: ${result.error}`);

      // If the failure smells like a reputation problem, pause this sender
      // until manually reviewed — keeps a flagged domain from poisoning more
      // emails.
      if (usingPool && senderId && result.error && isReputationError(result.error)) {
        const account = (brain.senderAccounts ?? []).find((a) => a.id === senderId);
        if (account) tripCircuitBreaker(account, result.error, now);
      }
    }

    sendResults.push({ email, ok: result.ok, resendId: result.id, error: result.error });
  }

  // Single save for all mutations in this tick
  if (sendResults.length > 0) {
    await saveBrain(brain);
  }

  // Activity logs AFTER the save (logActivity does its own load+save each time,
  // which is acceptable for audit trail purposes — there are at most ~50/day)
  for (const { email, ok, error } of sendResults) {
    if (ok) {
      await logActivity({
        type: "email-sent",
        description: `Sent touch ${email.sequenceTouch} to ${email.to}: "${email.subject}"`,
        prospectId: email.prospectId,
        emailId: email.id,
      });
    } else {
      await logActivity({
        type: "email-failed",
        description: `Send failed for ${email.to}: ${error}`,
        prospectId: email.prospectId,
        emailId: email.id,
      });
    }
  }

  return summary;
}

function nextTouchDate(currentTouch: OutboundEmail["sequenceTouch"]): string | undefined {
  const cadenceDays: Record<number, number> = { 1: 3, 2: 5, 3: 7 };
  const offset = cadenceDays[currentTouch];
  if (!offset) return undefined;
  return new Date(Date.now() + offset * 86_400_000).toISOString();
}

function extractUnsubscribeLink(body: string): string | null {
  const m = body.match(/https:\/\/brandivibe\.com\/api\/brain\/unsubscribe\?[^\s)]*/);
  return m ? m[0] : null;
}
