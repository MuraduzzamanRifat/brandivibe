import { getOpenAI, MODELS } from "../openai";
import { loadMarketingKnowledge } from "../marketing-knowledge";
import { loadBrain, type Plan, type ArticleSpec, type FbPostSpec, type LeadGenAction } from "../brain-storage";
import { scoreSEO } from "./seo";

/**
 * Autonomous planner. Reads marketing knowledge + recent learning + recently
 * published topics, asks GPT-4o for a complete daily plan (article, 3 FB
 * posts, lead-gen actions) grounded in the Brandivibe sales motion.
 *
 * If the article SEO score is below 75, re-prompt once with the fixes.
 */

type PlannerOutput = {
  article: ArticleSpec;
  fbPosts: FbPostSpec[];
  leadGen: LeadGenAction[];
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 72);
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function planToday(): Promise<Plan> {
  const openai = getOpenAI();
  const knowledge = await loadMarketingKnowledge();
  const brain = await loadBrain();

  const recentTitles = (brain.articles ?? []).slice(0, 14).map((a) => a.title);
  const recentLearning = (brain.learning ?? []).slice(0, 10).map((l) => l.insight);
  const topPerformers = (brain.articles ?? [])
    .filter((a) => a.metrics)
    .sort((a, b) => (b.metrics?.pageviews ?? 0) - (a.metrics?.pageviews ?? 0))
    .slice(0, 5)
    .map((a) => ({ title: a.title, pageviews: a.metrics?.pageviews ?? 0, rating: a.rating }));

  const system = `You are the Brandivibe AI Sales Brain. Brandivibe is a solo premium web design studio targeting Seed to Series B founders at $35-90K per project (founded and run by Muraduzzaman).

Your single objective: generate client sales. Every asset you plan must drive leads toward brandivibe.com/contact or one of the demo pages (helix, neuron, axiom, pulse, aurora, orbit, monolith, atrium).

Each day you output a complete plan grounded in the marketing knowledge base below. Today's plan must include:
- 1 SEO blog article (1500-2200 words) in the "elite website conversion" niche
- 3 Facebook posts (short, viral-oriented, conversion-focused, each links to the article or a demo)
- 3-5 lead-gen actions (outbound email scripts, LinkedIn DM scripts, reply templates)

BRANDIVIBE MARKETING KNOWLEDGE
${knowledge}
END KNOWLEDGE

HARD RULES
1. Topic must be NEW — do not repeat any of these recent titles: ${JSON.stringify(recentTitles)}
2. Primary keyword must have buyer intent ("premium web design for", "startup landing page conversion", "SaaS homepage rewrite", etc). No fluffy "5 tips" listicles unless the list is concrete and advanced.
3. Article body must be in valid Markdown (GitHub-flavored). Use one # H1, then ## H2 and ### H3. Include code/math only when it increases credibility. Include at least 3 internal links to Brandivibe demos (format: [anchor text](/demo-slug)) and 2 external authoritative links.
4. The article must reference the primary keyword in the title, first 100 words, and 2-3 H2 headings.
5. Each FB post is ≤ 280 characters of body, with 5-8 punchy hashtags and a specific DALL-E image prompt. Voice: direct, no emoji spam, founder-to-founder.
6. Lead-gen scripts must be personalized templates with clear variables like {firstName} {company} {trigger}, not generic.
7. Ground every piece in lessons learned from prior performance when available.

PRIOR LEARNING (most recent first)
${recentLearning.length ? recentLearning.map((l, i) => `${i + 1}. ${l}`).join("\n") : "(no data yet — first run)"}

TOP PERFORMING ARTICLES
${topPerformers.length ? JSON.stringify(topPerformers, null, 2) : "(no traffic data yet)"}

Return strict JSON with this shape — no markdown fences, no prose:
{
  "article": {
    "title": string,
    "slug": string,
    "excerpt": string,
    "primaryKeyword": string,
    "secondaryKeywords": string[],
    "outline": string[],
    "body": string,
    "heroImagePrompt": string
  },
  "fbPosts": [
    { "body": string, "imagePrompt": string, "hashtags": string[], "articleSlug": string }
  ],
  "leadGen": [
    { "kind": "outbound-email"|"linkedin-dm"|"reply"|"reshare", "target": string, "script": string, "rationale": string }
  ]
}`;

  const user = `Generate today's plan. Date: ${today()}.`;

  async function callModel(extraSystem?: string): Promise<{ parsed: PlannerOutput; tokens: number; model: string }> {
    const completion = await openai.chat.completions.create({
      model: MODELS.QUALITY,
      response_format: { type: "json_object" },
      temperature: 0.7,
      messages: [
        { role: "system", content: extraSystem ? `${system}\n\n${extraSystem}` : system },
        { role: "user", content: user },
      ],
    });
    const content = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content) as PlannerOutput;
    return {
      parsed,
      tokens: completion.usage?.total_tokens ?? 0,
      model: completion.model,
    };
  }

  let { parsed, tokens, model } = await callModel();

  if (!parsed.article?.slug) {
    parsed.article.slug = slugify(parsed.article.title);
  }

  const seo = scoreSEO({
    title: parsed.article.title,
    excerpt: parsed.article.excerpt,
    body: parsed.article.body,
    primaryKeyword: parsed.article.primaryKeyword,
  });

  if (seo.score < 75) {
    const retry = await callModel(
      `The first draft scored ${seo.score}/100 on SEO. Fix these issues and return the WHOLE plan again:\n${seo.fixes.map((f) => `- ${f}`).join("\n")}`
    );
    parsed = retry.parsed;
    tokens += retry.tokens;
    model = retry.model;
    if (!parsed.article?.slug) parsed.article.slug = slugify(parsed.article.title);
  }

  const plan: Plan = {
    id: `plan_${Date.now()}`,
    date: today(),
    article: parsed.article,
    fbPosts: parsed.fbPosts ?? [],
    leadGen: parsed.leadGen ?? [],
    model,
    tokens,
    executed: false,
  };

  return plan;
}
