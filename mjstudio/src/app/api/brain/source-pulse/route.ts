import { NextResponse } from "next/server";
import { authorizedCron } from "@/lib/brain/auth";
import { fetchTechCrunchArticles } from "@/lib/sources/techcrunch";
import { fetchProductHuntArticles } from "@/lib/sources/producthunt";
import { fetchHackerNewsShowHN } from "@/lib/sources/hackernews";
import { fetchBetaListArticles } from "@/lib/sources/betalist";
import { fetchBraveSearchProspects } from "@/lib/sources/brave-search";
import { loadBrain, saveBrain, logActivity } from "@/lib/brain-storage";

/**
 * POST /api/brain/source-pulse
 * Header: x-brain-secret: <BRAIN_CRON_SECRET>
 *
 * Lightweight source-only tick. Runs every 15 minutes. Only scrapes feeds
 * and stages new article URLs as a "raw signals" pool — does NOT spend GPT
 * tokens on extraction. The hourly/daily ticks consume from this pool.
 *
 * Why split this out?
 *   - The full source-tick costs ~$0.08 per run (8 GPT-4o extractions).
 *   - At 15-min cadence that would be $7.68/day = $230/month.
 *   - This pulse just collects URLs — pennies of bandwidth, no token cost.
 *   - The next hourly tick consumes the staged pool, extracts up to 8.
 *
 * Result: feed scanning happens 96 times/day, GPT extraction stays at
 * ~24/day. Best of both — always-on prospecting without runaway spend.
 */

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!authorizedCron(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const started = Date.now();
  const summary = {
    fetched: 0,
    new: 0,
    bySource: {} as Record<string, number>,
    errors: [] as string[],
  };

  // Promise.allSettled so one broken feed doesn't kill the pulse
  const results = await Promise.allSettled([
    fetchTechCrunchArticles(),
    fetchProductHuntArticles(),
    fetchHackerNewsShowHN(),
    fetchBetaListArticles(),
    // Brave Search — only runs when BRAVE_SEARCH_API_KEY is set; otherwise
    // returns [] without an error so the rest of the pulse continues.
    fetchBraveSearchProspects(),
  ]);

  const feeds = ["techcrunch", "producthunt", "hackernews", "betalist", "brave"];
  const allArticles = results.flatMap((r, i) => {
    if (r.status === "fulfilled") return r.value;
    summary.errors.push(`${feeds[i]}: ${r.reason instanceof Error ? r.reason.message : String(r.reason)}`);
    return [];
  });

  summary.fetched = allArticles.length;
  if (allArticles.length === 0) {
    return NextResponse.json({ ok: false, summary, durationMs: Date.now() - started });
  }

  const brain = await loadBrain();
  brain.rawSourcePool = brain.rawSourcePool ?? [];

  // Dedupe against both the existing pool AND already-extracted prospects
  const seenUrls = new Set([
    ...brain.rawSourcePool.map((s) => s.link),
    ...brain.prospects.map((p) => p.sourceUrl).filter((u): u is string => Boolean(u)),
  ]);

  for (const article of allArticles) {
    if (seenUrls.has(article.link)) continue;
    brain.rawSourcePool.push({
      link: article.link,
      title: article.title.slice(0, 200),
      description: article.description.slice(0, 500),
      pubDate: article.pubDate,
      source: article.source,
      stagedAt: new Date().toISOString(),
    });
    summary.new++;
    summary.bySource[article.source] = (summary.bySource[article.source] ?? 0) + 1;
    seenUrls.add(article.link);
  }

  // Cap pool at 500 — older entries either got extracted or expired
  if (brain.rawSourcePool.length > 500) {
    brain.rawSourcePool = brain.rawSourcePool.slice(-500);
  }

  if (summary.new > 0) {
    await saveBrain(brain);
    await logActivity({
      type: "source-run",
      description: `Source pulse: ${summary.new} new signals staged (${Object.entries(summary.bySource).map(([k, v]) => `${k}:${v}`).join(", ")})`,
    });
  }

  return NextResponse.json({ ok: true, summary, durationMs: Date.now() - started });
}

export async function GET() {
  return NextResponse.json({ ok: true, usage: "POST with x-brain-secret to stage new feed signals" });
}
