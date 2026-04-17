import { NextResponse } from "next/server";
import { runSourceTick } from "@/lib/brain/source-tick";
import { executeLeadGenActions } from "@/lib/brain/lead-gen-executor";
import { runResearchTick } from "@/lib/brain/research-tick";
import { runSequenceTick } from "@/lib/brain/sequence-machine";
import { runSendTick } from "@/lib/brain/sender";
import { runBlastTick } from "@/lib/brain/blast";
import { authorizedCron } from "@/lib/brain/auth";
import { logActivity, loadBrain } from "@/lib/brain-storage";

/**
 * POST /api/brain/tick-hourly
 * Header: x-brain-secret: <BRAIN_CRON_SECRET>
 *
 * Lightweight throughput tick that runs every hour (not once per day).
 * Only runs phases that benefit from frequent execution:
 *   - source   : scrape TechCrunch for new prospects
 *   - leadgen  : match today's plan actions against new eligible prospects
 *   - research : deep-research scraped prospects
 *   - sequence : advance multi-touch email sequences
 *   - send     : actually ship queued emails via Resend
 *   - blast    : process cold-email blast drip
 *
 * Does NOT run: plan, article, fb, score — those are once per day
 * (run-daily owns them).
 *
 * No DailyRun gate — each phase's internal logic (warmup caps, per-domain
 * throttling, queue state) handles idempotency naturally.
 */

export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!authorizedCron(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const started = Date.now();
  const summary = {
    tokens: 0,
    source: null as unknown,
    leadgen: null as unknown,
    research: null as unknown,
    sequence: null as unknown,
    send: null as unknown,
    blast: null as unknown,
    errors: [] as string[],
  };

  // SOURCE — scrape new prospects from TechCrunch
  try {
    const sourced = await runSourceTick();
    summary.source = sourced;
    summary.tokens += sourced.tokens;
    if (sourced.extracted > 0) {
      await logActivity({
        type: "source-run",
        description: `Hourly source: ${sourced.extracted} new prospects (${sourced.sourced} articles scanned)`,
        tokens: sourced.tokens,
      });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    summary.errors.push(`source: ${msg}`);
  }

  // LEADGEN — queue outbound emails from today's plan (if any action still
  // has unmatched eligible prospects)
  try {
    const brain = await loadBrain();
    const todayDate = new Date().toISOString().slice(0, 10);
    const todayPlan = (brain.plans ?? []).find((p) => p.date === todayDate);
    if (todayPlan?.leadGen?.length) {
      const lgSummary = await executeLeadGenActions(todayPlan.leadGen);
      summary.leadgen = lgSummary;
      if (lgSummary.emailsQueued > 0) {
        await logActivity({
          type: "email-queued",
          description: `Hourly leadgen: ${lgSummary.emailsQueued} new emails queued (${lgSummary.prospectsMatched} prospects matched)`,
        });
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    summary.errors.push(`leadgen: ${msg}`);
  }

  // RESEARCH — deep-research newly scraped prospects
  try {
    const researched = await runResearchTick();
    summary.research = researched;
    summary.tokens += researched.tokens;
    if (researched.researched > 0) {
      await logActivity({
        type: "prospect-researched",
        description: `Hourly research: ${researched.researched} prospects researched, ${researched.emailed} emails found`,
        tokens: researched.tokens,
      });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    summary.errors.push(`research: ${msg}`);
  }

  // SEQUENCE — advance multi-touch sequences for prospects who were sent
  // touch 1 N days ago
  try {
    const seqSummary = await runSequenceTick();
    summary.sequence = seqSummary;
    summary.tokens += seqSummary.tokens;
    if (seqSummary.started + seqSummary.advanced > 0) {
      await logActivity({
        type: "sequence-advanced",
        description: `Hourly sequence: started ${seqSummary.started}, advanced ${seqSummary.advanced}, completed ${seqSummary.completed}`,
        tokens: seqSummary.tokens,
      });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    summary.errors.push(`sequence: ${msg}`);
  }

  // SEND — dispatch queued emails (warmup cap + per-domain throttle)
  try {
    const sendSummary = await runSendTick();
    summary.send = sendSummary;
    if (sendSummary.sent > 0) {
      await logActivity({
        type: "email-sent",
        description: `Hourly send: ${sendSummary.sent} sent, ${sendSummary.failed} failed (cap ${sendSummary.warmupCap}, today ${sendSummary.alreadySentToday})`,
      });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    summary.errors.push(`send: ${msg}`);
  }

  // BLAST — cold-email drip
  try {
    const blastSummary = await runBlastTick();
    summary.blast = blastSummary;
    if (blastSummary.ran && blastSummary.sent > 0) {
      await logActivity({
        type: "email-sent",
        description: `Hourly blast: ${blastSummary.sent} sent, ${blastSummary.failed} failed (${blastSummary.totalSent}/${blastSummary.totalRows} total)`,
      });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    summary.errors.push(`blast: ${msg}`);
  }

  return NextResponse.json({
    ok: summary.errors.length === 0,
    summary,
    durationMs: Date.now() - started,
  });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "POST with x-brain-secret header to run an hourly tick",
  });
}
