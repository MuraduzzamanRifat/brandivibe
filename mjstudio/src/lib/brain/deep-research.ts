import { getOpenAI, MODELS } from "../openai";
import { loadMarketingKnowledge } from "../marketing-knowledge";
import type { DeepResearch, ScrapedSite, Prospect } from "../brain-storage";

/**
 * Deep research analyzer. Takes scraped site content + prospect metadata,
 * asks GPT-4o to produce structured observations the drafter will use as
 * merge slots in the cold email sequence.
 *
 * HONESTY RULES:
 * - Every observation must be traceable to something in the scraped text
 *   or the detected tech stack. No invented features.
 * - If the page content is too thin (< 200 chars), return confidence 0
 *   and the caller stops the pipeline.
 */

export async function researchProspect(
  prospect: Prospect,
  scraped: ScrapedSite
): Promise<DeepResearch | null> {
  const combinedCopy =
    (scraped.homepage ?? "") +
    "\n\n" +
    (scraped.about ?? "") +
    "\n\n" +
    (scraped.pricing ?? "") +
    "\n\n" +
    (scraped.team ?? "");

  if (combinedCopy.trim().length < 200) return null;

  const openai = getOpenAI();
  const knowledge = await loadMarketingKnowledge();

  const system = `You are the Brandivibe research analyst. You analyze a prospect's live website and produce structured observations that the outbound email drafter will use as personalization merge slots.

HARD HONESTY RULES (enforced, non-negotiable):
1. Every observation must quote or paraphrase something that actually appears in the scraped content below. Never invent features, claims, or design details.
2. \`specificObservation\` must be concrete ("hero video autoplay blocks LCP and runs 14MB") not generic ("your site could be stronger").
3. If you cannot produce a concrete observation, set confidence to 30 or lower so the caller knows to skip this prospect.
4. Decision maker \`firstName\` must be from the scraped text (team page, about page, founder bio). If no name is discoverable, use "" and cap confidence at 50.
5. The \`closestDemo\` must be one of: helix, neuron, axiom, pulse, aurora, orbit, monolith, atrium. Pick by industry + design language fit, not randomly.

BRANDIVIBE MARKETING KNOWLEDGE BASE (ground your observations here)
${knowledge}

Return STRICT JSON with this exact shape — no markdown fences, no prose outside JSON:
{
  "realWeaknesses": string[3-5],         // specific, traceable to scraped content
  "specificObservation": string,         // the single sharpest observation for email 1
  "oneSentenceImpact": string,           // what the observation is costing them in plain english
  "currentPainArea": string,             // short phrase: "homepage performance" / "brand consistency"
  "observation1": string,                // for email 2 bullet 1
  "observation2": string,                // for email 2 bullet 2
  "observation3": string,                // for email 2 bullet 3
  "fix1OneLine": string,                 // one-line fix for observation 1
  "fix2OneLine": string,
  "fix3OneLine": string,
  "topPriorityObservation": string,      // which of the 3 matters most
  "fixTimeEstimate": string,             // "2-day" / "1-week"
  "conversionMetric": string,            // "signup rate" / "demo bookings" / "contact form fills"
  "industryName": string,                // "DeFi" / "fintech" / "AI infra"
  "techStackSummary": string,            // "WordPress + Elementor"
  "currentDesignScore": number,          // 1-10
  "budget": string,                      // "$35-50K" / "$50-90K"
  "decisionMaker": {
    "name": string,                      // full name if found in scraped text, else ""
    "role": string,                      // "CEO" / "Head of Marketing" / ""
    "firstName": string                  // first name only for {firstName} merge slot
  },
  "confidence": number                   // 0-100, honest about how grounded these observations are
}`;

  const user = `PROSPECT
Company: ${prospect.company}
Domain: ${prospect.domain}
Industry: ${prospect.industry}
Known stage: ${prospect.stage}
ICP tier: ${prospect.icpTier}
Current trigger: ${prospect.trigger}
Estimated budget: ${prospect.estimatedBudget}

DETECTED TECH STACK
${scraped.techStack.join(", ") || "(none detected)"}

HEURISTIC DESIGN SCORE: ${scraped.designScore}/10

FOUND CONTACT SIGNALS
Emails on site: ${scraped.foundEmails.slice(0, 5).join(", ") || "(none)"}
Socials: ${JSON.stringify(scraped.foundSocials)}

SCRAPED PAGE CONTENT (homepage + about + pricing + team, trimmed to ~6K chars each)
--- HOMEPAGE ---
${(scraped.homepage ?? "").slice(0, 4000)}

--- ABOUT ---
${(scraped.about ?? "").slice(0, 2000)}

--- PRICING ---
${(scraped.pricing ?? "").slice(0, 1500)}

--- TEAM ---
${(scraped.team ?? "").slice(0, 2000)}

Produce the JSON now.`;

  const completion = await openai.chat.completions.create({
    model: MODELS.QUALITY,
    response_format: { type: "json_object" },
    temperature: 0.4,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  const content = completion.choices[0]?.message?.content ?? "{}";
  let parsed: Omit<DeepResearch, "createdAt" | "model" | "tokens">;
  try {
    parsed = JSON.parse(content);
  } catch {
    return null;
  }

  return {
    ...parsed,
    createdAt: new Date().toISOString(),
    model: completion.model,
    tokens: completion.usage?.total_tokens ?? 0,
  };
}
