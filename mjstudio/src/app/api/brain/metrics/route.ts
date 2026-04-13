import { NextResponse } from "next/server";
import { loadBrain } from "@/lib/brain-storage";

/**
 * GET /api/brain/metrics
 * 30-day rollup: tokens spent, articles published, FB posts, avg SEO,
 * engagement rate, learning insight count.
 */
export async function GET() {
  const brain = await loadBrain();
  const now = Date.now();
  const WINDOW = 30 * 24 * 60 * 60 * 1000;
  const within = (ts: string) => now - new Date(ts).getTime() < WINDOW;

  const articles = (brain.articles ?? []).filter((a) => within(a.publishedAt));
  const fbAll = brain.fbQueue ?? [];
  const fbPublished = fbAll.filter((p) => p.publishedAt && within(p.publishedAt));
  const fbQueued = fbAll.filter((p) => p.status === "queued");
  const plans = (brain.plans ?? []).filter((p) => within(p.date + "T00:00:00.000Z"));
  const activities = (brain.activities ?? []).filter((a) => within(a.timestamp));

  const totalTokens = activities.reduce((s, a) => s + (a.tokens ?? 0), 0);
  const avgSeo = articles.length
    ? Math.round(articles.reduce((s, a) => s + a.seoScore, 0) / articles.length)
    : 0;
  const totalPageviews = articles.reduce((s, a) => s + (a.metrics?.pageviews ?? 0), 0);
  const totalReach = fbPublished.reduce((s, p) => s + (p.metrics?.reach ?? 0), 0);
  const totalClicks = fbPublished.reduce((s, p) => s + (p.metrics?.clicks ?? 0), 0);

  return NextResponse.json({
    window: "30d",
    tokens: totalTokens,
    articles: articles.length,
    fbPublished: fbPublished.length,
    fbQueued: fbQueued.length,
    plansExecuted: plans.filter((p) => p.executed).length,
    plansTotal: plans.length,
    avgSeo,
    totalPageviews,
    totalReach,
    totalClicks,
    insights: (brain.learning ?? []).length,
    learning: (brain.learning ?? []).slice(0, 10),
  });
}
