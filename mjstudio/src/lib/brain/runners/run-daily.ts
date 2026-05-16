import { planToday } from "@/lib/brain/planner";
import { executeArticle } from "@/lib/brain/executor";
import { queueOrPublishFbPost } from "@/lib/brain/fb";
import { scoreYesterday } from "@/lib/brain/scorer";
import { runSourceTick } from "@/lib/brain/source-tick";
import { executeLeadGenActions } from "@/lib/brain/lead-gen-executor";
import { runResearchTick } from "@/lib/brain/research-tick";
import { runSequenceTick } from "@/lib/brain/sequence-machine";
import { runSendTick } from "@/lib/brain/sender";
import { runBlastTick } from "@/lib/brain/blast";
import {
  addPlan,
  markPlanExecuted,
  logActivity,
  getOrCreateRun,
  updateRun,
  todayKey,
  loadBrain,
  bustBrainCache,
} from "@/lib/brain-storage";

/**
 * Runner for the full daily brain tick — extracted verbatim from the POST
 * handler of `src/app/api/brain/run-daily/route.ts` so it runs under `tsx`
 * inside GitHub Actions with no `next/*` imports and no HTTP layer.
 *
 * IDEMPOTENT + RESUMABLE. Every phase consults a DailyRun ledger keyed by
 * today's date before doing work, so re-running the same day picks up where
 * the last call left off — no duplicate GPT-4o / DALL-E spend. Safe to call
 * N times per day (the workflow calls it twice, 30s apart, for resume).
 *
 * Returns the same summary shape the route returned.
 */

const FB_SLOTS = 3;

export type RunDailySummary = {
  date: string;
  resumed: boolean;
  phases: Record<string, unknown>;
  tokens: number;
  errors: string[];
  ok: boolean;
};

export async function runDaily(): Promise<RunDailySummary> {
  const date = todayKey();
  const run = await getOrCreateRun(date, FB_SLOTS);

  const summary: RunDailySummary = {
    date,
    resumed: run.phases.plan !== "pending",
    phases: { ...run.phases },
    tokens: 0,
    errors: [],
    ok: true,
  };

  // ---------------- PHASE 1: PLAN ----------------
  if (run.phases.plan !== "done") {
    try {
      const plan = await planToday();
      await addPlan(plan);
      summary.tokens += plan.tokens;
      await updateRun(date, (r) => {
        r.planId = plan.id;
        r.phases.plan = "done";
      });
      await logActivity({
        type: "plan-generated",
        description: `Planned "${plan.article.title}" + ${plan.fbPosts.length} FB posts + ${plan.leadGen.length} lead-gen actions`,
        planId: plan.id,
        model: plan.model,
        tokens: plan.tokens,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      summary.errors.push(`plan: ${msg}`);
      await updateRun(date, (r) => {
        r.phases.plan = "failed";
        r.lastError = msg;
      });
      await logActivity({ type: "error", description: `Planner failed: ${msg}` });
      summary.ok = false;
      const final0 = await getOrCreateRun(date, FB_SLOTS);
      summary.phases = { ...final0.phases };
      return summary; // plan is fatal — nothing downstream can run
    }
  }

  bustBrainCache();
  const todayRun = await getOrCreateRun(date, FB_SLOTS);
  const { plans } = await loadBrain();
  const plan = (plans ?? []).find((p) => p.id === todayRun.planId);
  if (!plan) {
    summary.errors.push("plan missing after phase 1");
    summary.ok = false;
    return summary;
  }

  // ---------------- PHASE 2: ARTICLE ----------------
  if (todayRun.phases.article !== "done" && todayRun.phases.article !== "skipped") {
    try {
      const article = await executeArticle(plan.article);
      await updateRun(date, (r) => {
        r.phases.article = "done";
      });
      await logActivity({
        type: "article-published",
        description: `Published "${article.title}" (SEO ${article.seoScore}/100, ${article.wordCount} words)`,
        articleId: article.id,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      summary.errors.push(`article: ${msg}`);
      await updateRun(date, (r) => {
        r.phases.article = "failed";
        r.lastError = msg;
      });
      await logActivity({ type: "error", description: `Article executor failed: ${msg}` });
      // Continue — FB posts and score still have value.
    }
  }

  // ---------------- PHASE 3: FB POSTS (per-slot idempotency) ----------------
  for (let i = 0; i < FB_SLOTS; i++) {
    const current = (await getOrCreateRun(date, FB_SLOTS)).phases.fb[i];
    if (current === "done") continue;
    const spec = plan.fbPosts?.[i];
    if (!spec) {
      await updateRun(date, (r) => {
        r.phases.fb[i] = "done";
      });
      continue;
    }
    try {
      const post = await queueOrPublishFbPost(spec);
      await updateRun(date, (r) => {
        r.phases.fb[i] = "done";
      });
      await logActivity({
        type: post.status === "published" ? "fb-published" : "fb-queued",
        description:
          post.status === "published"
            ? `Published FB post: ${post.body.slice(0, 80)}`
            : `Queued FB post for approval: ${post.body.slice(0, 80)}`,
        fbPostId: post.id,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      summary.errors.push(`fb[${i}]: ${msg}`);
      await updateRun(date, (r) => {
        r.phases.fb[i] = "failed";
        r.lastError = msg;
      });
      await logActivity({ type: "error", description: `FB post ${i} failed: ${msg}` });
    }
  }

  await markPlanExecuted(plan.id);

  // ---------------- PHASE 4: SCORE ----------------
  if ((await getOrCreateRun(date, FB_SLOTS)).phases.score !== "done") {
    try {
      const scored = await scoreYesterday();
      summary.tokens += scored.tokens;
      if (scored.insightsLearned > 0) {
        await logActivity({
          type: "insight-learned",
          description: `Learned ${scored.insightsLearned} insight from ${scored.articlesScored} articles + ${scored.fbPostsScored} FB posts`,
          tokens: scored.tokens,
        });
      }
      if (scored.articlesScored + scored.fbPostsScored > 0) {
        await logActivity({
          type: "metrics-pulled",
          description: `Pulled metrics: ${scored.articlesScored} articles, ${scored.fbPostsScored} FB posts`,
        });
      }
      await updateRun(date, (r) => {
        r.phases.score = "done";
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      summary.errors.push(`score: ${msg}`);
      await updateRun(date, (r) => {
        r.phases.score = "failed";
        r.lastError = msg;
      });
      await logActivity({ type: "error", description: `Scorer failed: ${msg}` });
    }
  }

  // ---------------- PHASE 5: SOURCE ----------------
  if ((await getOrCreateRun(date, FB_SLOTS)).phases.source !== "done") {
    try {
      const sourced = await runSourceTick();
      summary.tokens += sourced.tokens;
      await updateRun(date, (r) => {
        r.phases.source = "done";
      });
      await logActivity({
        type: "source-run",
        description: `Source tick: ${sourced.sourced} articles fetched, ${sourced.extracted} new prospects added, ${sourced.alreadyKnown} already known`,
        tokens: sourced.tokens,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      summary.errors.push(`source: ${msg}`);
      await updateRun(date, (r) => {
        r.phases.source = "failed";
        r.lastError = msg;
      });
      await logActivity({ type: "error", description: `Source tick failed: ${msg}` });
    }
  }

  // ---------------- PHASE 6: LEAD-GEN EXECUTION ----------------
  if ((await getOrCreateRun(date, FB_SLOTS)).phases.leadgen !== "done") {
    try {
      const lgSummary = await executeLeadGenActions(plan.leadGen ?? [], {
        plannerAngle: plan.angleIndex,
      });
      await updateRun(date, (r) => {
        r.phases.leadgen = "done";
      });
      if (lgSummary.emailsQueued > 0) {
        await logActivity({
          type: "email-queued",
          description: `Lead-gen executor: ${lgSummary.actionsProcessed} actions → ${lgSummary.prospectsMatched} prospects matched → ${lgSummary.emailsQueued} emails queued`,
        });
      } else {
        await logActivity({
          type: "lead-gen-skipped",
          description: `Lead-gen executor: ${lgSummary.actionsProcessed} actions processed, 0 emails queued (${lgSummary.skipped} skipped)`,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      summary.errors.push(`leadgen: ${msg}`);
      await updateRun(date, (r) => {
        r.phases.leadgen = "failed";
        r.lastError = msg;
      });
      await logActivity({ type: "error", description: `Lead-gen executor failed: ${msg}` });
    }
  }

  // ---------------- PHASE 7: RESEARCH ----------------
  if ((await getOrCreateRun(date, FB_SLOTS)).phases.research !== "done") {
    try {
      const researched = await runResearchTick();
      summary.tokens += researched.tokens;
      await updateRun(date, (r) => {
        r.phases.research = "done";
      });
      await logActivity({
        type: "prospect-researched",
        description: `Research tick: scraped ${researched.scraped}, researched ${researched.researched}, emails found ${researched.emailed}, skipped ${researched.skipped}`,
        tokens: researched.tokens,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      summary.errors.push(`research: ${msg}`);
      await updateRun(date, (r) => {
        r.phases.research = "failed";
        r.lastError = msg;
      });
      await logActivity({ type: "error", description: `Research tick failed: ${msg}` });
    }
  }

  // ---------------- PHASE 8: SEQUENCE ----------------
  if ((await getOrCreateRun(date, FB_SLOTS)).phases.sequence !== "done") {
    try {
      const seqSummary = await runSequenceTick();
      summary.tokens += seqSummary.tokens;
      await updateRun(date, (r) => {
        r.phases.sequence = "done";
      });
      await logActivity({
        type: "sequence-advanced",
        description: `Sequence tick: started ${seqSummary.started}, advanced ${seqSummary.advanced}, completed ${seqSummary.completed}`,
        tokens: seqSummary.tokens,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      summary.errors.push(`sequence: ${msg}`);
      await updateRun(date, (r) => {
        r.phases.sequence = "failed";
        r.lastError = msg;
      });
      await logActivity({ type: "error", description: `Sequence tick failed: ${msg}` });
    }
  }

  // ---------------- PHASE 9: SEND ----------------
  if ((await getOrCreateRun(date, FB_SLOTS)).phases.send !== "done") {
    try {
      const sendSummary = await runSendTick();
      await updateRun(date, (r) => {
        r.phases.send = "done";
      });
      if (sendSummary.sent > 0 || sendSummary.failed > 0) {
        await logActivity({
          type: "email-sent",
          description: `Send tick: ${sendSummary.sent} sent, ${sendSummary.failed} failed (day ${sendSummary.dayIndex}, cap ${sendSummary.warmupCap}, already-sent-today ${sendSummary.alreadySentToday})`,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      summary.errors.push(`send: ${msg}`);
      await updateRun(date, (r) => {
        r.phases.send = "failed";
        r.lastError = msg;
      });
      await logActivity({ type: "error", description: `Send tick failed: ${msg}` });
    }
  }

  // ---------------- PHASE 10: BLAST ----------------
  if ((await getOrCreateRun(date, FB_SLOTS)).phases.blast !== "done") {
    try {
      const blastSummary = await runBlastTick();
      await updateRun(date, (r) => {
        r.phases.blast = "done";
      });
      if (blastSummary.ran) {
        await logActivity({
          type: "email-sent",
          description: `Blast tick: ${blastSummary.sent} sent, ${blastSummary.failed} failed (${blastSummary.totalSent}/${blastSummary.totalRows} total)`,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      summary.errors.push(`blast: ${msg}`);
      await updateRun(date, (r) => {
        r.phases.blast = "failed";
        r.lastError = msg;
      });
      await logActivity({ type: "error", description: `Blast tick failed: ${msg}` });
    }
  }

  const final = await getOrCreateRun(date, FB_SLOTS);
  summary.phases = { ...final.phases };
  summary.ok = summary.errors.length === 0;
  return summary;
}
