import { fetchTechCrunchArticles, type RawArticle } from "../sources/techcrunch";
import { fetchProductHuntArticles } from "../sources/producthunt";
import { fetchHackerNewsShowHN } from "../sources/hackernews";
import { fetchBetaListArticles } from "../sources/betalist";
import { extractProspect } from "../prospect-extractor";
import { loadBrain, upsertProspect, logActivity } from "../brain-storage";

/**
 * Source tick — runs inside the daily brain cron (before research tick).
 *
 * Fans out across 4 sources (TechCrunch, Product Hunt, Hacker News Show HN,
 * BetaList), runs each article through the GPT-4o prospect extractor, and
 * upserts valid A/B-tier prospects into brain.json. Deduplicates by sourceUrl
 * so re-runs are safe.
 *
 * Sources are fetched in parallel. Individual source failures are logged but
 * don't abort the tick — we want partial success when one feed is down.
 *
 * Cap: MAX_EXTRACT per tick to control token spend (~8 articles = ~$0.08).
 * Articles are shuffled so no single source dominates when we hit the cap.
 */

const MAX_EXTRACT = 8;

export type SourceTickSummary = {
  sourced: number;
  alreadyKnown: number;
  extracted: number;
  skipped: number;
  errors: number;
  tokens: number;
  bySource: Record<string, number>;
};

async function fetchAll(): Promise<{ articles: RawArticle[]; sourceErrors: string[] }> {
  const results = await Promise.allSettled([
    fetchTechCrunchArticles(),
    fetchProductHuntArticles(),
    fetchHackerNewsShowHN(),
    fetchBetaListArticles(),
  ]);
  const names = ["techcrunch", "producthunt", "hackernews", "betalist"];
  const sourceErrors: string[] = [];
  const articles: RawArticle[] = [];
  results.forEach((r, i) => {
    if (r.status === "fulfilled") {
      articles.push(...r.value);
    } else {
      sourceErrors.push(`${names[i]}: ${r.reason instanceof Error ? r.reason.message : String(r.reason)}`);
    }
  });
  return { articles, sourceErrors };
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export async function runSourceTick(): Promise<SourceTickSummary> {
  const summary: SourceTickSummary = {
    sourced: 0,
    alreadyKnown: 0,
    extracted: 0,
    skipped: 0,
    errors: 0,
    tokens: 0,
    bySource: {},
  };

  const { articles: rawArticles, sourceErrors } = await fetchAll();
  // Log feed-fetch failures but keep processing — one broken source shouldn't
  // kill the whole tick.
  for (const err of sourceErrors) {
    await logActivity({
      type: "error",
      description: `Source fetch failed — ${err}`,
      source: "techcrunch",
    });
  }
  const articles = shuffle(rawArticles);
  summary.sourced = articles.length;

  const brain = await loadBrain();
  const seenUrls = new Set(
    brain.prospects.map((p) => p.sourceUrl).filter(Boolean) as string[]
  );

  let processed = 0;
  for (const article of articles) {
    if (processed >= MAX_EXTRACT) break;
    if (seenUrls.has(article.link)) {
      summary.alreadyKnown++;
      continue;
    }
    processed++;

    try {
      const result = await extractProspect(article);
      summary.tokens += result.tokens;

      if (!result.ok) {
        summary.skipped++;
        await logActivity({
          type: "prospect-skipped",
          description: `Skipped [${article.source}] "${article.title.slice(0, 80)}" — ${result.reason}`,
          source: article.source,
          tokens: result.tokens,
        });
        continue;
      }

      await upsertProspect(result.prospect);
      summary.extracted++;
      summary.bySource[article.source] = (summary.bySource[article.source] ?? 0) + 1;
      await logActivity({
        type: "prospect-added",
        description: `Added ${result.prospect.company} via ${article.source} (${result.prospect.icpTier}-tier, ${result.prospect.industry}) — ${result.prospect.trigger}`,
        prospectId: result.prospect.id,
        source: article.source,
        tokens: result.tokens,
      });
    } catch (err) {
      summary.errors++;
      await logActivity({
        type: "error",
        description: `Extractor failed on [${article.source}] "${article.title.slice(0, 80)}": ${err instanceof Error ? err.message : String(err)}`,
        source: article.source,
      });
    }
  }

  return summary;
}
