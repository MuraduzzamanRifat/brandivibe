import { getOpenAI, MODELS } from "./openai";
import { loadMarketingKnowledge } from "./marketing-knowledge";
import type { Prospect, Industry, IcpTier } from "./brain-storage";
import type { RawArticle } from "./sources/techcrunch";

/**
 * Takes a raw article and asks GPT-4o to extract a structured Prospect —
 * grounded in our ICP doc. Returns null if the article isn't ICP-fit.
 *
 * HONESTY RULE: the model MUST leave email empty ("") if not stated in
 * the article. We do not hallucinate contact info.
 */

type ExtractorOutput = {
  fit: boolean;
  reason?: string;
  company?: string;
  domain?: string;
  founder?: string;
  role?: string;
  email?: string;
  linkedin?: string;
  industry?: Industry;
  stage?: string;
  recentFunding?: { amount: string; date: string; round: string };
  trigger?: string;
  icpTier?: IcpTier;
  icpScore?: number;
  bestFitDemo?: Prospect["bestFitDemo"];
  brandWeakness?: string;
  estimatedBudget?: string;
  notes?: string;
};

export type ExtractResult =
  | { ok: true; prospect: Prospect; tokens: number }
  | { ok: false; reason: string; tokens: number };

export async function extractProspect(article: RawArticle): Promise<ExtractResult> {
  const openai = getOpenAI();
  const knowledge = await loadMarketingKnowledge();

  const system = `You are the prospect research engine for Brandivibe, a premium web design studio ($35-90K projects).

You will be given a news article. Decide if the company described is an ICP fit, and if so, extract structured data.

MARKETING KNOWLEDGE (authoritative — ground all scoring here):
${knowledge}

HONESTY RULES (non-negotiable):
1. NEVER invent contact emails. If the article doesn't state an email, return email: "".
2. NEVER invent founder names. If unclear, set founder: "" and role: "".
3. If the company is clearly out of ICP (wrong stage, wrong industry, too big, too small), set fit: false with a reason.
4. Score honestly against the 8-point ICP criteria in the knowledge base.

Return strict JSON with this shape:
{
  "fit": boolean,
  "reason": string (if not fit, why),
  "company": string,
  "domain": string (best guess from article, e.g. "company.com"),
  "founder": string ("" if unknown),
  "role": string ("" if unknown),
  "email": string ("" if not in article),
  "linkedin": string ("" if unknown),
  "industry": "crypto"|"saas"|"fintech"|"ai"|"healthcare"|"luxury"|"ev"|"architecture"|"vc",
  "stage": string (e.g. "Seed", "Series A"),
  "recentFunding": { "amount": string, "date": string, "round": string } | null,
  "trigger": string (one sentence — what makes them reachable NOW),
  "icpTier": "A"|"B"|"C"|"D",
  "icpScore": number (0-8),
  "bestFitDemo": "helix"|"neuron"|"axiom"|"pulse"|"aurora"|"orbit"|"monolith"|"atrium",
  "brandWeakness": string (one specific observation about their current brand),
  "estimatedBudget": string (e.g. "$35-50K"),
  "notes": string
}`;

  const user = `ARTICLE
Title: ${article.title}
Published: ${article.pubDate}
Author: ${article.creator}
Link: ${article.link}
Description: ${article.description}`;

  const completion = await openai.chat.completions.create({
    model: MODELS.QUALITY,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  const tokens = completion.usage?.total_tokens ?? 0;
  const content = completion.choices[0]?.message?.content ?? "{}";
  let parsed: ExtractorOutput;
  try {
    parsed = JSON.parse(content);
  } catch {
    return { ok: false, reason: "extractor returned invalid JSON", tokens };
  }

  if (!parsed.fit) {
    return { ok: false, reason: parsed.reason ?? "not ICP fit", tokens };
  }

  const now = new Date().toISOString();
  const prospect: Prospect = {
    id: `tc_${Buffer.from(article.link).toString("base64url").slice(0, 16)}`,
    company: parsed.company ?? "",
    domain: parsed.domain ?? "",
    founder: parsed.founder ?? "",
    role: parsed.role ?? "",
    email: parsed.email ?? "",
    linkedin: parsed.linkedin || undefined,
    industry: (parsed.industry ?? "saas") as Industry,
    stage: parsed.stage ?? "",
    recentFunding: parsed.recentFunding ?? undefined,
    trigger: parsed.trigger ?? article.title,
    icpTier: (parsed.icpTier ?? "C") as IcpTier,
    icpScore: parsed.icpScore ?? 0,
    bestFitDemo: (parsed.bestFitDemo ?? "neuron") as Prospect["bestFitDemo"],
    brandWeakness: parsed.brandWeakness ?? "",
    estimatedBudget: parsed.estimatedBudget ?? "",
    status: "new",
    notes: parsed.notes,
    source: "techcrunch",
    sourceUrl: article.link,
    createdAt: now,
    updatedAt: now,
  };

  if (!prospect.company) {
    return { ok: false, reason: "extractor returned no company name", tokens };
  }

  return { ok: true, prospect, tokens };
}
