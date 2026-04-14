import { getOpenAI, MODELS } from "../openai";
import { loadMarketingKnowledge } from "../marketing-knowledge";
import type { DeepResearch, ScrapedSite, Prospect } from "../brain-storage";

/**
 * Deep research analyzer v2 — evidence-enforced.
 *
 * Failure mode of v1 (the "Vercel audit incident"): the scraper only saw
 * body text, the model hallucinated negative claims like "homepage lacks
 * contact info" when in fact the contact button was just inside <button>
 * tags the scraper deleted. Embarrassing.
 *
 * v2 fixes:
 *   1. Scraper now extracts structural data (nav, buttons, headings, title)
 *      and explicit boolean flags (hasContact, hasPricing, hasTeam, etc).
 *      We pass those facts into the prompt so the model knows what's
 *      actually there.
 *   2. The prompt FORBIDS negative claims about features that the scraper
 *      already confirmed exist via the boolean flags.
 *   3. Every observation must include an `evidence` field quoting an exact
 *      substring (case-insensitive) from the scraped content.
 *   4. After parsing, we fact-check every quote against the raw HTML +
 *      structured data. If any quote can't be found, the entire response
 *      is rejected and the model is re-prompted with the failures.
 */

type EvidencedObservation = {
  observation: string;
  fix: string;
  evidence: string;
};

type RawDeepResearch = {
  sharpest: { observation: string; impact: string; evidence: string };
  fixes: EvidencedObservation[];
  topPriority: string;
  designScore: number;
  designScoreReasoning: string;
  industryName: string;
  techStackSummary: string;
  budget: string;
  decisionMaker: { name: string; role: string; firstName: string };
  confidence: number;
};

const MAX_ATTEMPTS = 3;

function lowerHaystack(scraped: ScrapedSite): string {
  return (
    (scraped.rawHomepage || "") +
    "\n" +
    scraped.homepage +
    "\n" +
    (scraped.about ?? "") +
    "\n" +
    (scraped.team ?? "") +
    "\n" +
    (scraped.pricing ?? "") +
    "\n" +
    (scraped.contact ?? "") +
    "\n" +
    scraped.structure.title +
    "\n" +
    scraped.structure.metaDescription +
    "\n" +
    scraped.structure.h1.join("\n") +
    "\n" +
    scraped.structure.h2.join("\n") +
    "\n" +
    scraped.structure.h3.join("\n") +
    "\n" +
    scraped.structure.navLinks.map((n) => `${n.text} ${n.href}`).join("\n") +
    "\n" +
    scraped.structure.buttons.join("\n") +
    "\n" +
    scraped.structure.footerLinks.join("\n")
  ).toLowerCase();
}

function quoteFound(quote: string, haystack: string): boolean {
  if (!quote || quote.length < 4) return false;
  const q = quote.toLowerCase().replace(/\s+/g, " ").trim();
  // Try the full quote first
  if (haystack.includes(q)) return true;
  // Then try removing punctuation + retry (handles smart quotes, ellipses, etc)
  const stripped = q.replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
  if (stripped.length >= 6 && haystack.replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").includes(stripped))
    return true;
  // Last resort: every word over 4 chars must appear (handles paraphrases)
  const words = stripped.split(" ").filter((w) => w.length >= 4);
  if (words.length >= 3 && words.every((w) => haystack.includes(w))) return true;
  return false;
}

function violatesNegativeClaim(observation: string, scraped: ScrapedSite): string | null {
  const o = observation.toLowerCase();
  const s = scraped.structure;
  // The model said "lacks contact" but we know the page has contact.
  if ((/\b(no|lack|missing|without|don'?t have|absent)\b/.test(o)) && /contact|reach\s*out|talk\s*to\s*sales|get in touch/.test(o) && s.hasContact)
    return "claimed missing contact info but scraper detected contact link/button on the page";
  if ((/\b(no|lack|missing|without|don'?t have|absent)\b/.test(o)) && /pricing|plans|pricing\s*page/.test(o) && s.hasPricing)
    return "claimed missing pricing but scraper detected pricing link/page";
  if ((/\b(no|lack|missing|without|don'?t have|absent)\b/.test(o)) && /team|about\s*us|about\s*page|leadership/.test(o) && s.hasTeam)
    return "claimed missing team/about page but scraper detected one";
  if ((/\b(no|lack|missing|without|don'?t have|absent)\b/.test(o)) && /blog|articles|writing/.test(o) && s.hasBlog)
    return "claimed missing blog but scraper detected one";
  if ((/\b(no|lack|missing|without|don'?t have|absent)\b/.test(o)) && /careers|jobs/.test(o) && s.hasCareers)
    return "claimed missing careers but scraper detected one";
  // Forbid telling the prospect what tech stack they use back to them — useless and embarrassing
  if (/\bthey use\b|\byou use\b|\byour stack\b|\btech stack is\b/.test(o) && /\bnext\.?js|react|tailwind|webflow|wordpress\b/.test(o))
    return "do not tell the prospect what stack they use back to them — they already know";
  return null;
}

export async function researchProspect(
  prospect: Prospect,
  scraped: ScrapedSite
): Promise<DeepResearch | null> {
  const combinedCopy =
    (scraped.homepage ?? "") +
    "\n" +
    (scraped.about ?? "") +
    "\n" +
    (scraped.pricing ?? "") +
    "\n" +
    (scraped.team ?? "");

  if (combinedCopy.trim().length < 200) return null;

  const openai = getOpenAI();
  const knowledge = await loadMarketingKnowledge();
  const haystack = lowerHaystack(scraped);
  const s = scraped.structure;

  // Build the "known facts" section the model is forbidden from contradicting
  const knownFacts: string[] = [];
  if (s.hasContact) knownFacts.push("This site HAS a contact link or button (do not claim it is missing).");
  if (s.hasPricing) knownFacts.push("This site HAS a pricing page (do not claim it is missing).");
  if (s.hasTeam) knownFacts.push("This site HAS a team or about page (do not claim it is missing).");
  if (s.hasBlog) knownFacts.push("This site HAS a blog (do not claim it is missing).");
  if (s.hasCareers) knownFacts.push("This site HAS a careers page (do not claim it is missing).");
  if (s.hasLogin) knownFacts.push("This site HAS a login / dashboard area (suggests an existing product).");
  if (knownFacts.length === 0) knownFacts.push("(no facts pre-confirmed)");

  const system = `You are the Brandivibe research analyst. You analyze a prospect's live website and produce structured observations the cold outbound drafter will use.

ABSOLUTE RULES (violation = your response is rejected and you are re-prompted):

1. EVERY observation must include an "evidence" field that is a 6-30 word VERBATIM substring from the scraped content shown below. Not paraphrased. Not invented. Quoted.

2. NEVER claim something is "missing", "lacking", "absent", or "without" if the structured signals or the boolean flags below say it exists. The scraper already verified these facts.

3. NEVER tell the prospect what tech stack they use ("you use Next.js"). They already know. The scraper detected stack only so you understand the technical level — never repeat it back to them.

4. Observations must be SPECIFIC and SHARP. "Your homepage could be stronger" is rejected. "The hero video autoplay pushes LCP to 4.2s on mobile" is accepted (if you can quote evidence).

5. If the page is from a mega-brand (Stripe, Vercel, Linear, Figma, Notion, Apple, Google, etc), set confidence to 20 or below — these are not real prospects.

6. If you cannot find sharp, specific, evidenced observations, set confidence to 30 or below. The drafter will skip the prospect rather than send generic sludge.

KNOWN FACTS ABOUT THIS SITE (the scraper already verified these — do not contradict):
${knownFacts.map((f) => `- ${f}`).join("\n")}

BRANDIVIBE MARKETING KNOWLEDGE BASE
${knowledge}

Return STRICT JSON with this exact shape (no markdown fences, no prose):
{
  "sharpest": {
    "observation": string,
    "impact": string,
    "evidence": string
  },
  "fixes": [
    { "observation": string, "fix": string, "evidence": string },
    { "observation": string, "fix": string, "evidence": string },
    { "observation": string, "fix": string, "evidence": string }
  ],
  "topPriority": string,
  "designScore": number,
  "designScoreReasoning": string,
  "industryName": string,
  "techStackSummary": string,
  "budget": string,
  "decisionMaker": { "name": string, "role": string, "firstName": string },
  "confidence": number
}`;

  const user = `PROSPECT
Company: ${prospect.company}
Domain: ${prospect.domain}
Industry hint: ${prospect.industry}

DETECTED TECH STACK (do NOT repeat back to them)
${scraped.techStack.join(", ") || "(none detected)"}

PAGE TITLE: ${s.title}
META DESCRIPTION: ${s.metaDescription}

H1 HEADINGS:
${s.h1.map((h) => `- "${h}"`).join("\n") || "(none)"}

H2 HEADINGS (first 10):
${s.h2.slice(0, 10).map((h) => `- "${h}"`).join("\n") || "(none)"}

NAV LINKS:
${s.navLinks.map((l) => `- ${l.text} → ${l.href}`).join("\n") || "(none)"}

BUTTONS / CTAs:
${s.buttons.map((b) => `- "${b}"`).join("\n") || "(none)"}

FOOTER LINKS:
${s.footerLinks.slice(0, 20).join(", ") || "(none)"}

CONTACT EMAILS FOUND ON SITE: ${scraped.foundEmails.slice(0, 5).join(", ") || "(none)"}

PAGE BODY TEXT (homepage, trimmed)
${(scraped.homepage ?? "").slice(0, 4500)}

PRICING PAGE TEXT (if available)
${(scraped.pricing ?? "").slice(0, 1500) || "(not available)"}

ABOUT/TEAM TEXT (if available)
${(scraped.about ?? scraped.team ?? "").slice(0, 1500) || "(not available)"}

Now produce the strict JSON. Every observation MUST include a quoted evidence substring from the content above. If you cannot ground an observation in a real quote, omit it and lower confidence accordingly.`;

  let lastFailure = "";

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const completion = await openai.chat.completions.create({
      model: MODELS.QUALITY,
      response_format: { type: "json_object" },
      temperature: 0.35,
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: lastFailure
            ? `${user}\n\nPREVIOUS ATTEMPT FAILED VALIDATION: ${lastFailure}\nFix and return the entire JSON again.`
            : user,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content ?? "{}";
    let parsed: RawDeepResearch;
    try {
      parsed = JSON.parse(content);
    } catch {
      lastFailure = "invalid JSON";
      continue;
    }

    // ─────────── Fact-check ───────────
    const failures: string[] = [];

    if (!parsed.sharpest?.observation || !parsed.sharpest?.evidence) {
      failures.push("missing sharpest.observation or sharpest.evidence");
    } else {
      if (!quoteFound(parsed.sharpest.evidence, haystack)) {
        failures.push(`sharpest.evidence quote not found in scraped content: "${parsed.sharpest.evidence.slice(0, 80)}"`);
      }
      const neg = violatesNegativeClaim(parsed.sharpest.observation, scraped);
      if (neg) failures.push(`sharpest.observation ${neg}`);
    }

    if (!Array.isArray(parsed.fixes) || parsed.fixes.length < 3) {
      failures.push("must have at least 3 fixes in the fixes array");
    } else {
      parsed.fixes.slice(0, 3).forEach((f, i) => {
        if (!f.evidence) failures.push(`fixes[${i}] missing evidence`);
        else if (!quoteFound(f.evidence, haystack))
          failures.push(`fixes[${i}].evidence quote not found in content: "${f.evidence.slice(0, 80)}"`);
        const neg = violatesNegativeClaim(f.observation, scraped);
        if (neg) failures.push(`fixes[${i}].observation ${neg}`);
      });
    }

    if (failures.length > 0) {
      lastFailure = failures.join("; ");
      continue;
    }

    // ─────────── Build DeepResearch shape ───────────
    return {
      realWeaknesses: [
        parsed.sharpest.observation,
        ...parsed.fixes.slice(0, 3).map((f) => f.observation),
      ],
      specificObservation: parsed.sharpest.observation,
      oneSentenceImpact: parsed.sharpest.impact,
      currentPainArea: parsed.sharpest.observation.split(".")[0].slice(0, 80),
      observation1: parsed.fixes[0]?.observation ?? "",
      observation2: parsed.fixes[1]?.observation ?? "",
      observation3: parsed.fixes[2]?.observation ?? "",
      fix1OneLine: parsed.fixes[0]?.fix ?? "",
      fix2OneLine: parsed.fixes[1]?.fix ?? "",
      fix3OneLine: parsed.fixes[2]?.fix ?? "",
      topPriorityObservation: parsed.topPriority,
      fixTimeEstimate: "1-2 weeks",
      conversionMetric: "homepage conversion rate",
      industryName: parsed.industryName,
      techStackSummary: parsed.techStackSummary,
      currentDesignScore: parsed.designScore,
      budget: parsed.budget,
      decisionMaker: parsed.decisionMaker ?? { name: "", role: "", firstName: "" },
      confidence: parsed.confidence,
      createdAt: new Date().toISOString(),
      model: completion.model,
      tokens: completion.usage?.total_tokens ?? 0,
    };
  }

  // All attempts failed validation — return null so the caller skips the prospect
  return null;
}
