import type { EmailFinderResult } from "../../brain-storage";
import { generateEmailPatterns, type Candidate } from "./patterns";
import {
  isValidSyntax,
  isDisposable,
  hasMxRecords,
  detectCatchAllProvider,
} from "./validators";

/**
 * Finds the best-guess email for a prospect. Strategy:
 *
 * 1. If the scraper already found a role email on the target domain
 *    (hello@, founder@, contact@), use it with high confidence.
 * 2. Otherwise generate patterns from (firstName, lastName, domain),
 *    filter by syntax + disposable blacklist, gate on MX record existence,
 *    and cap confidence at 60 if the MX is a known catch-all provider.
 *
 * Returns null if no confident guess can be produced. The caller must
 * honor that and not send.
 */

export async function findEmail(params: {
  firstName: string;
  lastName: string;
  domain: string;
  scrapedEmails: string[];
}): Promise<EmailFinderResult | null> {
  const { firstName, lastName, domain, scrapedEmails } = params;
  const d = domain.toLowerCase().replace(/^www\./, "");
  if (!d) return null;

  const candidates: Candidate[] = [];

  // 1. Scraper wins — these are real emails pulled from the live site
  const onTarget = scrapedEmails.filter((e) => e.endsWith(`@${d}`));
  for (const e of onTarget) {
    candidates.push({
      email: e,
      score: 95,
      reason: "scraped from live website",
    });
  }
  // Role addresses on other domains (less trustworthy but still usable)
  const roleOffTarget = scrapedEmails.filter((e) => !e.endsWith(`@${d}`));
  for (const e of roleOffTarget) {
    candidates.push({
      email: e,
      score: 70,
      reason: "scraped role email (off-target domain)",
    });
  }

  // 2. Pattern guesses from name
  const patternCandidates = generateEmailPatterns(firstName, lastName, d);
  candidates.push(...patternCandidates);

  // Syntax + disposable filter
  const syntaxValid = candidates.filter(
    (c) => isValidSyntax(c.email) && !isDisposable(c.email)
  );
  if (syntaxValid.length === 0) return null;

  // MX check — if the domain has no MX at all, nothing is deliverable
  const mxOk = await hasMxRecords(d);
  if (!mxOk) return null;

  // Catch-all cap — if the provider is Google/Outlook, we can't verify
  // specific local parts, so max confidence drops to 60.
  const isCatchAll = await detectCatchAllProvider(d);
  const capped = syntaxValid.map((c) => {
    if (isCatchAll && !c.reason.startsWith("scraped")) {
      return { ...c, score: Math.min(c.score, 60) };
    }
    return c;
  });

  // Pick winner
  capped.sort((a, b) => b.score - a.score);
  const winner = capped[0];
  if (!winner) return null;

  return {
    winner: winner.email,
    source: winner.reason.startsWith("scraped") ? "scraped" : "pattern",
    confidence: winner.score,
    candidates: capped.slice(0, 10),
    createdAt: new Date().toISOString(),
  };
}
