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

  // Rotate through 10 content angles based on day-of-year so every angle gets
  // covered before repeating. Keeps the blog strategically diverse.
  const CONTENT_ANGLES = [
    "ROI of premium web design — quantify revenue impact, conversion lift, and payback period for founders who invest in elite design",
    "First impressions & brand perception — how visitors judge credibility in milliseconds and what that costs founders in lost pipeline",
    "Conversion psychology & UX — the behavioral science behind high-converting layouts, whitespace, motion, and trust signals",
    "Case-study-style transformation — before/after of a real or hypothetical brand that redesigned and what changed in their numbers",
    "Basic vs 3D immersive websites — side-by-side comparison of static sites vs interactive 3D experiences and the business case for each",
    "Future of web design — where the industry is heading (WebGL, AI personalization, spatial computing) and why early movers win",
    "Design → trust → revenue — the causal chain from visual quality to perceived credibility to willingness to pay",
    "Mistakes cheap websites make — specific technical and design failures that signal low status and repel premium buyers",
    "Why premium design attracts premium clients — how your website acts as a price anchor and ICP filter simultaneously",
    "Website as a competitive advantage — treating the homepage as a strategic asset, not a brochure, in competitive markets",
  ];
  const angleIndex = new Date().getDay() % CONTENT_ANGLES.length; // rotate by day
  const todayAngle = CONTENT_ANGLES[angleIndex];

  const system = `You are the Brandivibe AI Sales Brain — a senior content strategist and conversion-focused copywriter specializing in luxury digital services and high-ticket web design ($35K–$90K). Brandivibe is a solo premium 3D web design studio run by Muraduzzaman, targeting Seed to Series B founders.

Your single objective: generate client sales. Every asset you plan must drive leads toward brandivibe.com/contact or one of the demo pages (helix, neuron, axiom, pulse, aurora, orbit, monolith, atrium).

Each day you output a complete plan grounded in the marketing knowledge base below. Today's plan must include:
- 1 long-form SEO article (1800–2500 words) using TODAY'S CONTENT ANGLE (see below)
- 3 Facebook posts (short, viral-oriented, conversion-focused, each links to the article or a demo)
- 3-5 lead-gen actions (outbound email scripts, LinkedIn DM scripts, reply templates)

TODAY'S CONTENT ANGLE: ${todayAngle}

ARTICLE STRUCTURE (mandatory):
1. Headline — high-impact, curiosity + value-driven, includes primary keyword
2. Opening hook (emotion or sharp insight) + clear problem framing + stakes (lost revenue, weak positioning, etc.) — first 150 words
3. Main body (70% value density): deep insights, strategic thinking, real-world or hypothetical examples, at least ONE comparison table, use ## and ### headers liberally
4. Authority layer: position 3D/premium design as a strategic advantage, not just aesthetic — include specific contrast between basic and premium experiences
5. Soft commercial layer (natural, not pushy): introduce Brandivibe as the superior solution with a link to the most relevant demo
6. CTA section: encourage consultation or inquiry, positioned as a next step for serious brands — NOT a hard sell

TONE & STYLE:
- Sophisticated, modern, and premium. Write like a strategist, not a marketer.
- Speak directly to decision-makers (founders, CEOs, CMOs)
- Sharp, clear, business-focused. Zero fluff. Zero hype.
- No em-dashes to open sentences (reads as AI-generated)
- Insight density over word count

BRANDIVIBE MARKETING KNOWLEDGE
${knowledge}
END KNOWLEDGE

HARD RULES
1. Topic must be NEW — do not repeat any of these recent titles: ${JSON.stringify(recentTitles)}
2. Primary keyword must have buyer intent ("premium web design for startups", "startup landing page conversion", "SaaS homepage that converts", etc.)
3. Article body must be valid Markdown (GitHub-flavored). Use one # H1, then ## H2 and ### H3. Include at least 3 internal links to Brandivibe demos (format: [anchor text](/demo-slug)) and 2 external authoritative links.
4. The article must reference the primary keyword in the title, first 100 words, and 2–3 H2 headings.
5. Include at least ONE markdown table that adds analytical clarity (comparison, checklist, metric breakdown, etc.)
6. Each FB post is ≤ 280 characters of body, with 5–8 punchy hashtags and a specific DALL-E image prompt. Voice: direct, no emoji spam, founder-to-founder.
7. Lead-gen scripts MUST be machine-executable templates that will be auto-sent by the executor. Rules:
   - Start with "Subject: <subject max 60 chars>" on line 1
   - Use ONLY these exact merge slots: {firstName} {company} {domain} {trigger} {brandWeakness} {demoUrl} {demoSlug} {industry} {unsubUrl}
   - Body: 60-100 words. Touch 1 = short, direct, one specific observation, one CTA
   - Must end with: "To opt out: {unsubUrl}"
   - Sign off: "Muraduzzaman\nBrandivibe — brandivibe.com"
   - "target" field: keyword-rich phrase (e.g. "saas series-a funding ai startup") so the executor can match real prospects by industry/stage/trigger
   - NEVER use placeholder brackets like [Company] or <insert>. Only the exact merge slots above.
8. Ground every piece in lessons learned from prior performance when available.
9. heroImagePrompt must describe a photorealistic or high-fidelity 3D render of a premium web design scene — no cartoon, no flat illustration.

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
