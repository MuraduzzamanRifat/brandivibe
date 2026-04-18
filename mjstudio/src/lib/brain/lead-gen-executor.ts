import {
  loadBrain,
  saveBrain,
  logActivity,
  type LeadGenAction,
  type Prospect,
  type OutboundEmail,
} from "../brain-storage";
import { classifySubjectStyle } from "./learning/aggregator";
import { createHmac } from "crypto";

/**
 * Lead-gen executor — Phase 6.5 of the daily brain tick.
 *
 * The planner generates `leadGen` actions with personalized script templates.
 * This module closes the loop: it matches each action against real prospects
 * in brain.json, personalizes the template, and enqueues outbound emails
 * — all without any human input.
 *
 * Matching logic:
 *   Extract signal words from `action.target` description. Score each
 *   prospect by how many signal words appear in their industry/stage/trigger.
 *   Take the top N matches that are tier A/B, have an email, and haven't
 *   started a sequence yet.
 *
 * Merge slots filled automatically:
 *   {firstName}      → prospect.deepResearch.decisionMaker.firstName or first word of founder
 *   {company}        → prospect.company
 *   {domain}         → prospect.domain
 *   {trigger}        → prospect.trigger (funding/launch event)
 *   {brandWeakness}  → prospect.brandWeakness or deepResearch.specificObservation
 *   {demoSlug}       → prospect.bestFitDemo
 *   {demoUrl}        → https://brandivibe.com/{bestFitDemo}
 *   {industry}       → prospect.industry
 *   {unsubUrl}       → HMAC-signed unsubscribe link
 */

const MAX_PER_ACTION = 3; // max prospects to email per lead-gen action per day
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "hello@send.brandivibe.site";
const REPLY_TO = process.env.RESEND_REPLY_TO || FROM_EMAIL;

function unsubscribeUrl(prospectId: string): string {
  const secret = process.env.BRAIN_CRON_SECRET || "fallback-secret";
  const sig = createHmac("sha256", secret).update(prospectId).digest("hex").slice(0, 16);
  return `https://brandivibe.com/api/brain/unsubscribe?p=${encodeURIComponent(prospectId)}&s=${sig}`;
}

function nextSendWindow(offsetDays = 0): string {
  const target = new Date(Date.now() + offsetDays * 86_400_000);
  // Send on Tue/Wed/Thu at 13:00 UTC (~9am ET) — best cold email open rates
  while (![2, 3, 4].includes(target.getUTCDay())) {
    target.setUTCDate(target.getUTCDate() + 1);
  }
  target.setUTCHours(13, 0, 0, 0);
  return target.toISOString();
}

function scoreMatch(prospect: Prospect, targetDesc: string): number {
  const haystack = [
    prospect.industry,
    prospect.stage,
    prospect.trigger,
    prospect.company,
    prospect.domain,
  ]
    .join(" ")
    .toLowerCase();

  const needles = targetDesc
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3); // ignore short words

  return needles.filter((n) => haystack.includes(n)).length;
}

function personalize(script: string, prospect: Prospect): string {
  const dr = prospect.deepResearch;
  const firstName =
    dr?.decisionMaker?.firstName ||
    prospect.founder?.split(" ")[0] ||
    "there";

  const weakness =
    prospect.brandWeakness ||
    dr?.specificObservation ||
    "your homepage conversion rate";

  const unsubUrl = unsubscribeUrl(prospect.id);
  // Tracked booking link — routes through /api/brain/book so we capture
  // click intent before redirecting to Cal.com / Calendly.
  const bookingUrl = `https://brandivibe.com/api/brain/book?p=${encodeURIComponent(prospect.id)}`;

  return script
    .replace(/\{firstName\}/gi, firstName)
    .replace(/\{company\}/gi, prospect.company)
    .replace(/\{domain\}/gi, prospect.domain)
    .replace(/\{trigger\}/gi, prospect.trigger || "your recent launch")
    .replace(/\{brandWeakness\}/gi, weakness)
    .replace(/\{demoSlug\}/gi, prospect.bestFitDemo)
    .replace(/\{demoUrl\}/gi, `https://brandivibe.com/${prospect.bestFitDemo}`)
    .replace(/\{industry\}/gi, prospect.industry)
    .replace(/\{unsubUrl\}/gi, unsubUrl)
    .replace(/\{unsubscribeUrl\}/gi, unsubUrl)
    .replace(/\{bookingUrl\}/gi, bookingUrl);
}

function extractSubjectAndBody(script: string): { subject: string; body: string } {
  // Planner wraps subject in "Subject: ..." on first line
  const lines = script.trim().split("\n");
  const subjectLine = lines[0];
  if (/^subject:/i.test(subjectLine)) {
    return {
      subject: subjectLine.replace(/^subject:\s*/i, "").trim(),
      body: lines.slice(1).join("\n").trim(),
    };
  }
  // Fallback: first line is subject
  return {
    subject: subjectLine.trim().slice(0, 65),
    body: lines.slice(1).join("\n").trim() || script.trim(),
  };
}

export type LeadGenExecSummary = {
  actionsProcessed: number;
  prospectsMatched: number;
  emailsQueued: number;
  skipped: number;
  errors: string[];
};

export async function executeLeadGenActions(
  actions: LeadGenAction[],
  opts: { plannerAngle?: number } = {}
): Promise<LeadGenExecSummary> {
  const summary: LeadGenExecSummary = {
    actionsProcessed: 0,
    prospectsMatched: 0,
    emailsQueued: 0,
    skipped: 0,
    errors: [],
  };

  const emailActions = actions.filter((a) => a.kind === "outbound-email");
  if (!emailActions.length) return summary;

  const brain = await loadBrain();

  // Prospects eligible for lead-gen execution:
  // - tier A or B
  // - has email (emailFinder.winner exists)
  // - has deep research (needed for personalization)
  // - not unsubscribed
  // - sequence not started yet (stage 0 or undefined)
  // - not already in outboundQueue (avoid duplicates)
  const alreadyQueued = new Set(
    (brain.outboundQueue ?? []).map((e) => e.prospectId)
  );

  const eligible = brain.prospects.filter(
    (p) =>
      (p.icpTier === "A" || p.icpTier === "B") &&
      p.emailFinder?.winner &&
      p.deepResearch &&
      !p.unsubscribed &&
      p.status !== "lost" && // excludes premium-already sites marked by research tick
      (!p.sequence || p.sequence.stage === 0) &&
      !alreadyQueued.has(p.id)
  );

  if (!eligible.length) {
    await logActivity({
      type: "lead-gen-skipped",
      description: `Lead-gen executor: no eligible prospects yet (need tier A/B with email + research)`,
    });
    return summary;
  }

  // Collect all emails and mutations in-memory, then do ONE saveBrain.
  const pendingEmails: OutboundEmail[] = [];
  const pendingLogs: Array<Parameters<typeof logActivity>[0]> = [];
  let sendWindowOffset = 0;

  for (const action of emailActions) {
    summary.actionsProcessed++;

    const ranked = eligible
      .map((p) => ({ prospect: p, score: scoreMatch(p, action.target) }))
      .filter((x) => x.score >= 1)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.prospect.icpTier === "A" ? -1 : 1;
      })
      .slice(0, MAX_PER_ACTION);

    summary.prospectsMatched += ranked.length;

    for (const { prospect } of ranked) {
      try {
        const personalizedScript = personalize(action.script, prospect);
        const { subject, body } = extractSubjectAndBody(personalizedScript);

        if (!subject || !body || body.length < 50) {
          summary.skipped++;
          continue;
        }

        const finalBody = /unsubscribe|opt.out/i.test(body)
          ? body
          : `${body}\n\n---\nTo unsubscribe: ${unsubscribeUrl(prospect.id)}`;

        const email: OutboundEmail = {
          id: `out_lg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}_t1`,
          prospectId: prospect.id,
          sequenceTouch: 1,
          subject,
          body: finalBody,
          to: prospect.emailFinder!.winner,
          from: FROM_EMAIL,
          replyTo: REPLY_TO,
          sendAt: nextSendWindow(sendWindowOffset),
          createdAt: new Date().toISOString(),
          status: "queued",
          model: "lead-gen-template",
          tokens: 0,
          meta: {
            plannerAngle: opts.plannerAngle,
            industry: prospect.industry,
            icpTier: prospect.icpTier,
            subjectStyle: classifySubjectStyle(subject),
            leadGenKind: action.kind,
          },
        };

        pendingEmails.push(email);

        // CRITICAL: advance sequence stage so sequence-machine (Phase 7) doesn't
        // see stage=0 and queue a duplicate touch-1.
        prospect.sequence = prospect.sequence ?? { stage: 0 };
        prospect.sequence.stage = 1;
        prospect.sequence.nextSendAt = nextSendWindow(sendWindowOffset);

        summary.emailsQueued++;
        sendWindowOffset++;

        pendingLogs.push({
          type: "email-queued",
          description: `Lead-gen queued touch 1 for ${prospect.company} (${prospect.emailFinder!.winner}): "${subject}"`,
          prospectId: prospect.id,
          emailId: email.id,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        summary.errors.push(`${prospect.company}: ${msg}`);
        pendingLogs.push({
          type: "error",
          description: `Lead-gen executor failed for ${prospect.company}: ${msg}`,
          prospectId: prospect.id,
        });
      }
    }
  }

  if (pendingEmails.length > 0) {
    // Single brain save: push all emails + updated sequence states at once.
    brain.outboundQueue = brain.outboundQueue ?? [];
    brain.outboundQueue.push(...pendingEmails);
    if (brain.outboundQueue.length > 2000) {
      brain.outboundQueue = brain.outboundQueue.slice(-2000);
    }
    await saveBrain(brain);
  }

  // Log activities after the save (each logActivity does its own load+save;
  // doing these last keeps them from racing with the bulk save above).
  for (const log of pendingLogs) {
    await logActivity(log);
  }

  return summary;
}
