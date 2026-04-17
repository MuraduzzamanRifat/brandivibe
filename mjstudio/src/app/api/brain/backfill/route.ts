import { NextResponse } from "next/server";
import { planToday } from "@/lib/brain/planner";
import { executeArticle } from "@/lib/brain/executor";
import { authorizedCron } from "@/lib/brain/auth";
import { loadBrain, logActivity } from "@/lib/brain-storage";

/**
 * POST /api/brain/backfill
 * Header: x-brain-secret: <BRAIN_CRON_SECRET>
 * Body (optional): { count?: number, startAngle?: number }
 *
 * Generates N articles back-to-back, each using a different content angle.
 * Skips FB post and lead-gen execution (backfill is articles only).
 *
 * Stops early if Koyeb's 300s timeout is approaching. Caller can re-run
 * with startAngle = <last angle + 1> to continue.
 */

export const maxDuration = 300;
export const dynamic = "force-dynamic";

const DEFAULT_COUNT = 10;
const SAFETY_MARGIN_MS = 40_000; // bail if < 40s left on the 300s budget

export async function POST(req: Request) {
  if (!authorizedCron(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({})) as {
    count?: number;
    startAngle?: number;
  };
  const count = Math.min(Math.max(body.count ?? DEFAULT_COUNT, 1), 10);
  const startAngle = Math.max(body.startAngle ?? 0, 0);

  const started = Date.now();
  const generated: Array<{ title: string; slug: string; seoScore: number; angle: number }> = [];
  const errors: string[] = [];
  let lastAngleTried = startAngle - 1;

  for (let i = 0; i < count; i++) {
    // Time budget check — Koyeb kills the function at 300s hard
    if (Date.now() - started > 300_000 - SAFETY_MARGIN_MS) {
      errors.push(`stopped early at i=${i} (time budget exhausted)`);
      break;
    }

    const angleIndex = (startAngle + i) % 10;
    lastAngleTried = angleIndex;

    try {
      const plan = await planToday(angleIndex);
      const article = await executeArticle(plan.article);
      generated.push({
        title: article.title,
        slug: article.slug,
        seoScore: article.seoScore,
        angle: angleIndex,
      });
      await logActivity({
        type: "article-published",
        description: `Backfill: "${article.title}" (angle ${angleIndex}, SEO ${article.seoScore})`,
        articleId: article.id,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`angle ${angleIndex}: ${msg}`);
      await logActivity({
        type: "error",
        description: `Backfill failed at angle ${angleIndex}: ${msg}`,
      });
    }
  }

  // Total article count after backfill
  const brain = await loadBrain();
  const totalArticles = (brain.articles ?? []).length;

  return NextResponse.json({
    ok: errors.length === 0,
    generated: generated.length,
    totalArticlesNow: totalArticles,
    lastAngleTried,
    nextAngle: (lastAngleTried + 1) % 10,
    articles: generated,
    errors,
    durationMs: Date.now() - started,
  });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    usage: "POST with x-brain-secret header. Optional body: { count: 1-10, startAngle: 0-9 }",
  });
}
