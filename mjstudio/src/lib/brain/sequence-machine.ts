import {
  loadBrain,
  enqueueOutbound,
  logActivity,
  updateProspectResearch,
  type OutboundEmail,
  type Prospect,
} from "../brain-storage";
import { draftTouch } from "./email-drafter-v2";

/**
 * Phase 3 smart-timing thresholds.
 *   - If the recipient clicked, we can advance in ENGAGED_DAYS (fast nudge).
 *   - If they opened but didn't click, advance in OPENED_DAYS.
 *   - If no opens at all, advance in COLD_DAYS (longer gap, different angle).
 * These apply as floors — nextSendAt is still honored if it's later.
 */
const ENGAGED_DAYS_FLOOR = 2;
const OPENED_DAYS_FLOOR = 3;
const COLD_DAYS_FLOOR = 5;

function lastSentEmailFor(prospectId: string, queue: OutboundEmail[]): OutboundEmail | undefined {
  return queue
    .filter((e) => e.prospectId === prospectId && (e.status === "sent" || e.status === "bounced"))
    .sort((a, b) => {
      const ta = a.sentAt ? new Date(a.sentAt).getTime() : 0;
      const tb = b.sentAt ? new Date(b.sentAt).getTime() : 0;
      return tb - ta;
    })[0];
}

function daysSince(iso?: string): number {
  if (!iso) return 0;
  return (Date.now() - new Date(iso).getTime()) / 86_400_000;
}

/** Decide if this prospect is ready to advance, based on the last email's
 *  engagement metrics. Returns a floor-days value the current gap must exceed. */
function readyToAdvance(lastEmail: OutboundEmail | undefined): { ready: boolean; reason: string } {
  if (!lastEmail || !lastEmail.sentAt) return { ready: false, reason: "no send yet" };
  const days = daysSince(lastEmail.sentAt);
  const opens = lastEmail.metrics?.opens ?? 0;
  const clicks = lastEmail.metrics?.clicks ?? 0;
  if (clicks > 0 && days >= ENGAGED_DAYS_FLOOR) return { ready: true, reason: "clicked+engaged" };
  if (opens > 0 && days >= OPENED_DAYS_FLOOR) return { ready: true, reason: "opened" };
  if (opens === 0 && days >= COLD_DAYS_FLOOR) return { ready: true, reason: "cold-bump" };
  return { ready: false, reason: `only ${days.toFixed(1)}d since send, opens=${opens} clicks=${clicks}` };
}

/**
 * Advances every prospect through the 4-touch cold outbound sequence.
 *
 * Stage semantics:
 *   0 = not started
 *   1 = touch 1 sent, waiting for day-3 gate
 *   2 = touch 2 sent, waiting for day-5 gate (effectively day 8 from start)
 *   3 = touch 3 sent, waiting for day-7 gate (effectively day 15 from start)
 *   4 = touch 4 sent, sequence complete
 *
 * The sender handles the actual send. This module only drafts the next
 * email and pushes it onto the outboundQueue.
 */

const MAX_DRAFTS_PER_TICK = 12;
const MIN_RESEARCH_CONFIDENCE = 70;
const MIN_EMAIL_CONFIDENCE = 60;

export type SequenceTickSummary = {
  started: number;
  advanced: number;
  completed: number;
  skipped: number;
  errors: string[];
  tokens: number;
};

function isInSendWindow(): boolean {
  // Allow any day for brain queueing; sender handles actual send window.
  // We skip queueing on Sat/Sun + Mondays to respect the "Tue-Thu 9-11am" rule.
  const day = new Date().getUTCDay();
  return day === 2 || day === 3 || day === 4; // Tue, Wed, Thu UTC
}

function nextSendWindow(fromDaysOffset: number): string {
  const target = new Date(Date.now() + fromDaysOffset * 86_400_000);
  // Bump forward to next Tue/Wed/Thu at 13:00 UTC (~9am ET)
  while (![2, 3, 4].includes(target.getUTCDay())) {
    target.setUTCDate(target.getUTCDate() + 1);
  }
  target.setUTCHours(13, 0, 0, 0);
  return target.toISOString();
}

async function queueEmailForTouch(
  prospect: Prospect,
  touch: 1 | 2 | 3 | 4,
  dayOffset: number,
  from: string,
  replyTo: string
): Promise<{ ok: boolean; tokens: number; error?: string }> {
  const drafted = await draftTouch(prospect, touch);
  if (!drafted) {
    return { ok: false, tokens: 0, error: "drafter returned null after 3 attempts" };
  }

  const email: OutboundEmail = {
    id: `out_${Date.now()}_${Math.random().toString(36).slice(2, 8)}_t${touch}`,
    prospectId: prospect.id,
    sequenceTouch: touch,
    subject: drafted.subject,
    body: drafted.body,
    to: prospect.emailFinder?.winner ?? prospect.email,
    from,
    replyTo,
    sendAt: nextSendWindow(dayOffset),
    createdAt: new Date().toISOString(),
    status: "queued",
    model: drafted.model,
    tokens: drafted.tokens,
  };

  await enqueueOutbound(email);
  await logActivity({
    type: "email-drafted",
    description: `Drafted touch ${touch} for ${prospect.company}: "${email.subject}"`,
    prospectId: prospect.id,
    emailId: email.id,
    model: drafted.model,
    tokens: drafted.tokens,
  });
  return { ok: true, tokens: drafted.tokens };
}

export async function runSequenceTick(): Promise<SequenceTickSummary> {
  const summary: SequenceTickSummary = {
    started: 0,
    advanced: 0,
    completed: 0,
    skipped: 0,
    errors: [],
    tokens: 0,
  };

  const brain = await loadBrain();
  const from = process.env.RESEND_FROM_EMAIL || "hello@send.brandivibe.site";
  const replyTo = process.env.RESEND_REPLY_TO || from;
  const now = Date.now();

  let drafts = 0;
  for (const prospect of brain.prospects) {
    if (drafts >= MAX_DRAFTS_PER_TICK) break;
    if (prospect.unsubscribed) continue;
    if (!prospect.deepResearch || prospect.deepResearch.confidence < MIN_RESEARCH_CONFIDENCE) continue;
    if (!prospect.emailFinder || prospect.emailFinder.confidence < MIN_EMAIL_CONFIDENCE) continue;

    const seq = prospect.sequence;

    // Start the sequence — draft touch 1
    if (!seq || seq.stage === 0) {
      if (!isInSendWindow()) {
        summary.skipped++;
        continue;
      }
      const r = await queueEmailForTouch(prospect, 1, 0, from, replyTo);
      drafts++;
      summary.tokens += r.tokens;
      if (r.ok) {
        summary.started++;
      } else {
        summary.errors.push(`${prospect.company} touch 1: ${r.error}`);
      }
      continue;
    }

    // Already at stage 4 — sequence done
    if (seq.stage === 4) {
      continue;
    }

    // Mid-sequence — check if the gate has passed
    if (seq.lastOutcome === "replied" || seq.lastOutcome === "unsubscribed" || seq.lastOutcome === "stopped") {
      continue;
    }

    const lastEmail = lastSentEmailFor(prospect.id, brain.outboundQueue ?? []);

    // Bounce → mark lost, stop advancing.
    if (lastEmail?.metrics?.bounced) {
      await updateProspectResearch(prospect.id, { status: "lost" });
      summary.skipped++;
      await logActivity({
        type: "email-bounced",
        description: `${prospect.company} last touch bounced — stopping sequence`,
        prospectId: prospect.id,
      });
      continue;
    }

    // Smart timing: advance based on engagement signal, not a fixed cadence.
    const gate = readyToAdvance(lastEmail);
    if (!gate.ready) {
      // Fall back to the hardcoded nextSendAt gate if we have one
      if (!seq.nextSendAt) {
        summary.skipped++;
        continue;
      }
      if (new Date(seq.nextSendAt).getTime() > now) {
        summary.skipped++;
        continue;
      }
    }

    const nextTouch = (seq.stage + 1) as 1 | 2 | 3 | 4;
    const r = await queueEmailForTouch(prospect, nextTouch, 0, from, replyTo);
    drafts++;
    summary.tokens += r.tokens;
    if (r.ok) {
      summary.advanced++;
      if (nextTouch === 4) summary.completed++;
      await logActivity({
        type: "sequence-advanced",
        description: `${prospect.company} advanced to touch ${nextTouch}`,
        prospectId: prospect.id,
      });
    } else {
      summary.errors.push(`${prospect.company} touch ${nextTouch}: ${r.error}`);
    }
  }

  return summary;
}
