import { fetchTechCrunchArticles } from "../sources/techcrunch";
import { extractProspect } from "../prospect-extractor";
import { loadBrain, upsertProspect, logActivity } from "../brain-storage";

/**
 * Source tick — runs inside the daily brain cron (before research tick).
 *
 * Scrapes TechCrunch for fresh funding/launch triggers, runs each article
 * through the GPT-4o prospect extractor, and upserts valid A/B-tier
 * prospects into brain.json. Deduplicates by sourceUrl so re-runs are safe.
 *
 * Cap: MAX_EXTRACT per tick to control token spend (~8 articles = ~$0.08).
 */

const MAX_EXTRACT = 8;

export type SourceTickSummary = {
  sourced: number;
  alreadyKnown: number;
  extracted: number;
  skipped: number;
  errors: number;
  tokens: number;
};

export async function runSourceTick(): Promise<SourceTickSummary> {
  const summary: SourceTickSummary = {
    sourced: 0,
    alreadyKnown: 0,
    extracted: 0,
    skipped: 0,
    errors: 0,
    tokens: 0,
  };

  const articles = await fetchTechCrunchArticles();
  summary.sourced = articles.length;

  await logActivity({
    type: "source-run",
    description: `Fetched ${articles.length} trigger articles from TechCrunch`,
    source: "techcrunch",
  });

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
          description: `Skipped "${article.title.slice(0, 80)}" — ${result.reason}`,
          source: "techcrunch",
          tokens: result.tokens,
        });
        continue;
      }

      await upsertProspect(result.prospect);
      summary.extracted++;
      await logActivity({
        type: "prospect-added",
        description: `Added ${result.prospect.company} (${result.prospect.icpTier}-tier, ${result.prospect.industry}) — ${result.prospect.trigger}`,
        prospectId: result.prospect.id,
        source: "techcrunch",
        tokens: result.tokens,
      });
    } catch (err) {
      summary.errors++;
      await logActivity({
        type: "error",
        description: `Extractor failed on "${article.title.slice(0, 80)}": ${err instanceof Error ? err.message : String(err)}`,
        source: "techcrunch",
      });
    }
  }

  return summary;
}
