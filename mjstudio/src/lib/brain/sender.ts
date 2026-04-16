import {
  loadBrain,
  saveBrain,
  logActivity,
  type OutboundEmail,
} from "../brain-storage";

/**
 * Outbound sender. Runs through the queue in time-ordered batches, respects
 * the warmup curve (day 1 = 5, +3/day, steady 50 after day 30) and the
 * per-domain 1-in-3-days cap, and dispatches via Resend.
 *
 * If RESEND_API_KEY is unset, this is a no-op — emails stay queued until
 * the env var appears.
 */

const WARMUP_START = 5;
const WARMUP_STEP = 3;
const WARMUP_CAP_DAYS = 30;
const STEADY_STATE = 50;

function warmupCap(dayIndex: number): number {
  if (dayIndex < 1) return WARMUP_START;
  if (dayIndex >= WARMUP_CAP_DAYS) return STEADY_STATE;
  return WARMUP_START + (dayIndex - 1) * WARMUP_STEP;
}

function domainOf(email: string): string {
  return email.split("@")[1]?.toLowerCase() ?? "";
}

function daysBetween(a: string, b: string): number {
  return Math.floor((new Date(a).getTime() - new Date(b).getTime()) / 86_400_000);
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

  // Initialize sendingSince on first run
  if (!brain.sendingSince) {
    brain.sendingSince = todayStr;
    await saveBrain(brain);
  }
  const dayIndex = daysBetween(now.toISOString(), brain.sendingSince) + 1;
  const cap = warmupCap(dayIndex);
  const alreadyToday = (brain.sendCounts ?? {})[todayStr] ?? 0;
  summary.dayIndex = dayIndex;
  summary.warmupCap = cap;
  summary.alreadySentToday = alreadyToday;

  if (alreadyToday >= cap) {
    return summary;
  }

  const from = process.env.RESEND_FROM_EMAIL || "hello@send.brandivibe.site";
  const replyTo = process.env.RESEND_REPLY_TO || from;

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
      // Mutate in the already-loaded brain — no extra loadBrain needed
      if (queueIdx >= 0) {
        brain.outboundQueue![queueIdx].status = "sent";
        brain.outboundQueue![queueIdx].resendId = result.id;
        brain.outboundQueue![queueIdx].sentAt = new Date().toISOString();
      }
      brain.sendCounts = brain.sendCounts ?? {};
      brain.sendCounts[todayStr] = (brain.sendCounts[todayStr] ?? 0) + 1;
      brain.lastSendByDomain = brain.lastSendByDomain ?? {};
      brain.lastSendByDomain[dom] = new Date().toISOString();
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
