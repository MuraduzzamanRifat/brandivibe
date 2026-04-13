import { NextResponse } from "next/server";
import { planToday } from "@/lib/brain/planner";
import { executeArticle } from "@/lib/brain/executor";
import { queueOrPublishFbPost } from "@/lib/brain/fb";
import { scoreYesterday } from "@/lib/brain/scorer";
import { addPlan, markPlanExecuted, logActivity } from "@/lib/brain-storage";

/**
 * POST /api/brain/run-daily
 * Header: x-brain-secret: <BRAIN_CRON_SECRET>
 *
 * Orchestrates one full brain tick: plan → execute → score.
 * Called daily by GitHub Actions (.github/workflows/brain-daily.yml).
 * Also callable manually from /dashboard via the "Run brain now" button.
 *
 * Long-running: generates article + up to 3 DALL-E images. 5-min max.
 */

export const maxDuration = 300;
export const dynamic = "force-dynamic";

function authorized(req: Request): boolean {
  const secret = process.env.BRAIN_CRON_SECRET;
  if (!secret) return true; // if unset, allow (dev mode)
  const provided = req.headers.get("x-brain-secret");
  return provided === secret;
}

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const started = Date.now();
  const summary = {
    planned: false,
    articlePublished: false,
    fbPostsQueued: 0,
    fbPostsPublished: 0,
    scored: { articlesScored: 0, fbPostsScored: 0, insightsLearned: 0, tokens: 0 },
    tokens: 0,
    errors: [] as string[],
  };

  // 1. PLAN
  let plan;
  try {
    plan = await planToday();
    await addPlan(plan);
    summary.planned = true;
    summary.tokens += plan.tokens;
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
    await logActivity({ type: "error", description: `Planner failed: ${msg}` });
    return NextResponse.json({ ok: false, summary, durationMs: Date.now() - started }, { status: 500 });
  }

  // 2. EXECUTE - article
  try {
    const article = await executeArticle(plan.article);
    summary.articlePublished = true;
    await logActivity({
      type: "article-published",
      description: `Published "${article.title}" (SEO ${article.seoScore}/100, ${article.wordCount} words)`,
      articleId: article.id,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    summary.errors.push(`article: ${msg}`);
    await logActivity({ type: "error", description: `Article executor failed: ${msg}` });
  }

  // 3. EXECUTE - FB posts (sequential to avoid DALL-E rate limits)
  for (const spec of plan.fbPosts) {
    try {
      const post = await queueOrPublishFbPost(spec);
      if (post.status === "published") {
        summary.fbPostsPublished++;
        await logActivity({
          type: "fb-published",
          description: `Published FB post: ${post.body.slice(0, 80)}`,
          fbPostId: post.id,
        });
      } else {
        summary.fbPostsQueued++;
        await logActivity({
          type: "fb-queued",
          description: `Queued FB post for approval: ${post.body.slice(0, 80)}`,
          fbPostId: post.id,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      summary.errors.push(`fb: ${msg}`);
      await logActivity({ type: "error", description: `FB post failed: ${msg}` });
    }
  }

  await markPlanExecuted(plan.id);

  // 4. SCORE - pull yesterday's metrics + extract insight
  try {
    summary.scored = await scoreYesterday();
    summary.tokens += summary.scored.tokens;
    if (summary.scored.insightsLearned > 0) {
      await logActivity({
        type: "insight-learned",
        description: `Learned ${summary.scored.insightsLearned} insight from ${summary.scored.articlesScored} articles + ${summary.scored.fbPostsScored} FB posts`,
        tokens: summary.scored.tokens,
      });
    }
    if (summary.scored.articlesScored + summary.scored.fbPostsScored > 0) {
      await logActivity({
        type: "metrics-pulled",
        description: `Pulled metrics: ${summary.scored.articlesScored} articles, ${summary.scored.fbPostsScored} FB posts`,
      });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    summary.errors.push(`score: ${msg}`);
    await logActivity({ type: "error", description: `Scorer failed: ${msg}` });
  }

  return NextResponse.json({ ok: true, summary, durationMs: Date.now() - started });
}
