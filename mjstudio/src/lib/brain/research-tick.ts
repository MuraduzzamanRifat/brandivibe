import { loadBrain, updateProspectResearch, logActivity, type Prospect } from "../brain-storage";
import { scrapeWebsite } from "./scraper/website";
import { researchProspect } from "./deep-research";
import { findEmail } from "./email-finder";

/**
 * The research phase of each daily brain tick.
 *
 * For up to MAX_PER_TICK unresearched Tier A/B prospects:
 *   1. Scrape homepage + /about + /team + /pricing + /contact
 *   2. Run deep research (GPT-4o) to extract personalization hooks
 *   3. Find best-guess email (scraped role email, or pattern + MX check)
 *   4. Save everything onto the prospect record
 */

const MAX_PER_TICK = 5;
const MIN_TIER: Record<Prospect["icpTier"], number> = { A: 3, B: 2, C: 1, D: 0 };

export type ResearchTickSummary = {
  scanned: number;
  scraped: number;
  researched: number;
  emailed: number;
  skipped: number;
  errors: string[];
  tokens: number;
};

export async function runResearchTick(): Promise<ResearchTickSummary> {
  const summary: ResearchTickSummary = {
    scanned: 0,
    scraped: 0,
    researched: 0,
    emailed: 0,
    skipped: 0,
    errors: [],
    tokens: 0,
  };

  const brain = await loadBrain();

  const candidates = brain.prospects
    .filter((p) => !p.unsubscribed)
    .filter((p) => !p.deepResearch || !p.emailFinder)
    .filter((p) => MIN_TIER[p.icpTier] >= 2) // A or B only
    .sort((a, b) => MIN_TIER[b.icpTier] - MIN_TIER[a.icpTier]);

  summary.scanned = candidates.length;

  let done = 0;
  for (const prospect of candidates) {
    if (done >= MAX_PER_TICK) break;
    done++;

    try {
      // 1. Scrape if not already scraped
      let scraped = prospect.scraped;
      if (!scraped) {
        const result = await scrapeWebsite(prospect.domain);
        if (!result) {
          summary.skipped++;
          await logActivity({
            type: "prospect-skipped",
            description: `Could not scrape ${prospect.domain} (404 or network failure)`,
            prospectId: prospect.id,
          });
          continue;
        }
        scraped = result;
        summary.scraped++;
        await logActivity({
          type: "prospect-scraped",
          description: `Scraped ${prospect.domain} — tech: ${scraped.techStack.join(", ") || "(none detected)"} · design ${scraped.designScore}/10 · ${scraped.foundEmails.length} emails found`,
          prospectId: prospect.id,
        });
      }

      // 2. Deep research if not done
      let deepResearch = prospect.deepResearch;
      if (!deepResearch) {
        const r = await researchProspect(prospect, scraped);
        if (!r) {
          summary.skipped++;
          await logActivity({
            type: "prospect-skipped",
            description: `Deep research returned null for ${prospect.company} (page too thin)`,
            prospectId: prospect.id,
          });
          await updateProspectResearch(prospect.id, { scraped });
          continue;
        }
        deepResearch = r;
        summary.researched++;
        summary.tokens += r.tokens;
        await logActivity({
          type: "prospect-researched",
          description: `Researched ${prospect.company}: ${r.specificObservation.slice(0, 100)}`,
          prospectId: prospect.id,
          model: r.model,
          tokens: r.tokens,
        });
      }

      // 3. Find email if not already found
      let emailFinder = prospect.emailFinder;
      if (!emailFinder && deepResearch) {
        const res = await findEmail({
          firstName: deepResearch.decisionMaker.firstName || "",
          lastName: deepResearch.decisionMaker.name.split(" ").slice(-1)[0] || "",
          domain: prospect.domain,
          scrapedEmails: scraped.foundEmails,
        });
        if (res) {
          emailFinder = res;
          summary.emailed++;
          await logActivity({
            type: "email-found",
            description: `Best email for ${prospect.company}: ${res.winner} (${res.source}, conf ${res.confidence})`,
            prospectId: prospect.id,
          });
        }
      }

      // Save everything back
      await updateProspectResearch(prospect.id, {
        scraped,
        deepResearch,
        emailFinder,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      summary.errors.push(`${prospect.company}: ${msg}`);
      await logActivity({
        type: "error",
        description: `Research failed for ${prospect.company}: ${msg}`,
        prospectId: prospect.id,
      });
    }
  }

  return summary;
}
