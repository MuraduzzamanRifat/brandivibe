import { NextResponse } from "next/server";
import { fetchTechCrunchArticles } from "@/lib/sources/techcrunch";
import { extractProspect } from "@/lib/prospect-extractor";
import { loadBrain, upsertProspect, logActivity } from "@/lib/brain-storage";

/**
 * POST /api/dashboard/source
 * Runs the real sources (TechCrunch for now), passes each article through
 * the GPT-4o extractor, and upserts valid prospects into brain.json.
 *
 * Skips articles we've already seen (dedup by sourceUrl).
 * Capped at MAX_EXTRACT per run to control token spend.
 */

const MAX_EXTRACT = 8;

export async function POST() {
  const started = Date.now();
  const summary = {
    sourced: 0,
    alreadyKnown: 0,
    extracted: 0,
    skipped: 0,
    errors: 0,
    tokens: 0,
  };

  try {
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
            model: "gpt-4o",
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
          model: "gpt-4o",
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

    return NextResponse.json({
      ok: true,
      summary,
      durationMs: Date.now() - started,
    });
  } catch (err) {
    await logActivity({
      type: "error",
      description: `Source run failed: ${err instanceof Error ? err.message : String(err)}`,
      source: "techcrunch",
    });
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
        summary,
      },
      { status: 500 }
    );
  }
}
