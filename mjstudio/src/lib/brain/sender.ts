import {
  loadBrain,
  saveBrain,
  updateOutbound,
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

  for (const email of toAttempt) {
    const prospect = brain.prospects.find((p) => p.id === email.prospectId);

    // Unsubscribed → suppress
    if (prospect?.unsubscribed) {
      await updateOutbound(email.id, { status: "suppressed", failReason: "prospect unsubscribed" });
      summary.suppressed++;
      continue;
    }

    // Per-domain 1-in-3-days cap
    const dom = domainOf(email.to);
    const lastSent = (brain.lastSendByDomain ?? {})[dom];
    if (lastSent) {
      const hoursSince = (now.getTime() - new Date(lastSent).getTime()) / 3_600_000;
      if (hoursSince < 72) {
        // Push it out by 24h
        const newSendAt = new Date(now.getTime() + 24 * 3_600_000).toISOString();
        await updateOutbound(email.id, { sendAt: newSendAt });
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
      await updateOutbound(email.id, {
        status: "sent",
        resendId: result.id,
        sentAt: new Date().toISOString(),
      });
      summary.sent++;
      // Bump counters
      const fresh = await loadBrain();
      fresh.sendCounts = fresh.sendCounts ?? {};
      fresh.sendCounts[todayStr] = (fresh.sendCounts[todayStr] ?? 0) + 1;
      fresh.lastSendByDomain = fresh.lastSendByDomain ?? {};
      fresh.lastSendByDomain[dom] = new Date().toISOString();
      // Update prospect sequence state
      const p = fresh.prospects.find((x) => x.id === email.prospectId);
      if (p) {
        p.sequence = p.sequence ?? { stage: 0 };
        p.sequence.stage = email.sequenceTouch as 1 | 2 | 3 | 4;
        p.sequence.lastSentAt = new Date().toISOString();
        p.sequence.lastOutcome = "sent";
        p.sequence.nextSendAt = nextTouchDate(email.sequenceTouch);
      }
      await saveBrain(fresh);
      await logActivity({
        type: "email-sent",
        description: `Sent touch ${email.sequenceTouch} to ${email.to}: "${email.subject}"`,
        prospectId: email.prospectId,
        emailId: email.id,
      });
    } else {
      await updateOutbound(email.id, {
        status: "failed",
        failReason: result.error,
      });
      summary.failed++;
      summary.errors.push(`${email.to}: ${result.error}`);
      await logActivity({
        type: "email-failed",
        description: `Send failed for ${email.to}: ${result.error}`,
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
