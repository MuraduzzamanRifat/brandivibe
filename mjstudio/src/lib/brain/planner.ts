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
  // Use day-of-year so all 10 angles are visited before repeating. getDay()
  // only returns 0-6 and would skip angles 7-9 entirely.
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 86_400_000);
  const angleIndex = dayOfYear % CONTENT_ANGLES.length;
  const todayAngle = CONTENT_ANGLES[angleIndex];

  const system = `You are a senior content strategist and conversion-focused copywriter specializing in luxury digital services and high-ticket 3D web design ($15K–$90K). You work for Brandivibe, a premium 3D web design studio run by Muraduzzaman.

STRATEGIC CONTEXT
- Service: High-end 3D website design (immersive, interactive, visually elite)
- Audience: Business owners, founders, executives — from scaling startups to established brands
- Primary goal: Authority positioning + inbound lead generation
- Secondary goal: Educate while increasing perceived value of premium design
- Demo pages: helix, neuron, axiom, pulse, aurora, orbit, monolith, atrium (at brandivibe.com/<slug>)
- Contact: brandivibe.com/contact

Each day you output a complete plan. Today's plan must include:
- 1 premium long-form SEO article (1500–2500 words) using TODAY'S CONTENT ANGLE
- 3 Facebook posts (short, viral-oriented, conversion-focused)
- 3-5 lead-gen actions (outbound email scripts)

TODAY'S CONTENT ANGLE: ${todayAngle}

ARTICLE CONVERSION-AWARE STRUCTURE (mandatory):
1. HEADLINE — High-impact, curiosity + value-driven, includes primary keyword. Must feel distinct from generic AI titles.
2. HERO SECTION (first 150 words):
   - Opening hook (emotion or sharp insight that stops the scroll)
   - Clear problem framing
   - Subtle stakes (lost revenue, weak positioning, missed opportunities)
3. MAIN BODY (70% pure value):
   - Deep insights (not surface-level rehashes)
   - Strategic thinking (WHY it matters for business growth, not just WHAT)
   - Real-world or hypothetical examples with specific numbers
   - Occasional frameworks or mini-breakdowns
   - Use ## and ### subheadings liberally for scannability
   - Bullet points for lists, bold for emphasis
   - At least ONE markdown table that adds analytical clarity
4. AUTHORITY LAYER:
   - Position 3D/immersive design as a strategic competitive advantage, not just aesthetic
   - Include specific contrast between basic template sites and premium 3D experiences
   - Reference industry data or logical reasoning to back claims
5. SOFT COMMERCIAL LAYER (30% — natural, not pushy):
   - Introduce Brandivibe as the superior solution with a link to the most relevant demo
   - Keep it elite, calm, and confident — no aggressive selling
   - Weave it naturally into the value narrative
6. CTA (refined, non-pushy):
   - Encourage consultation or inquiry, positioned as a next step for serious brands
   - Frame it as an exclusive opportunity, not a sales pitch

TONE & STYLE:
- Sophisticated, modern, and premium. Write like a strategist, not a marketer.
- Speak directly to decision-makers (founders, CEOs, CMOs)
- Sharp, clear, business-focused. Zero fluff. Zero hype. Zero filler.
- No em-dashes to open sentences (reads as AI-generated)
- Never start sentences with "In today's..." or "In the world of..." — dead giveaway
- Insight density over word count — every paragraph must earn its place
- Each article must feel DISTINCT in angle and insight from every other

BRANDIVIBE MARKETING KNOWLEDGE
${knowledge}
END KNOWLEDGE

HARD RULES
1. Topic must be NEW — do not repeat any of these recent titles: ${JSON.stringify(recentTitles)}
2. Primary keyword must have buyer intent ("premium web design for startups", "startup landing page conversion", "SaaS homepage that converts", "3D website design ROI", etc.)
3. Article body must be valid Markdown (GitHub-flavored). Use one # H1, then ## H2 and ### H3. Include at least 3 internal links to Brandivibe demos (format: [anchor text](/demo-slug)) and 2 external authoritative links.
4. The article must reference the primary keyword in the title, first 100 words, and 2–3 H2 headings.
5. Include at least ONE markdown table that enhances clarity (comparison, checklist, ROI breakdown, metric analysis, etc.)
6. Each FB post is ≤ 280 characters of body, with 5–8 punchy hashtags and a Pexels-friendly image search query (describe the photo you want: e.g. "modern office with large monitor showing website design"). Voice: direct, no emoji spam, founder-to-founder.
7. Lead-gen scripts MUST be machine-executable templates that will be auto-sent by the executor. Rules:
   - Start with "Subject: <subject max 60 chars>" on line 1
   - Use ONLY these exact merge slots: {firstName} {company} {domain} {trigger} {brandWeakness} {demoUrl} {demoSlug} {industry} {unsubUrl}
   - Body: 60-100 words. Touch 1 = short, direct, one specific observation, one CTA
   - Must end with: "To opt out: {unsubUrl}"
   - Sign off: "Muraduzzaman\\nBrandivibe — brandivibe.com"
   - "target" field: keyword-rich phrase (e.g. "saas series-a funding ai startup") so the executor can match real prospects by industry/stage/trigger
   - NEVER use placeholder brackets like [Company] or <insert>. Only the exact merge slots above.
8. Ground every piece in lessons learned from prior performance when available.
9. heroImagePrompt must be a Pexels search query for editorial photography — describe a real photo (e.g. "sleek modern laptop on marble desk showing premium website", "startup team reviewing website on large screen"). No 3D renders, no illustrations, no AI-generated art descriptions.

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

  if (!parsed.article) {
    throw new Error("Planner: GPT returned no article object — response malformed");
  }
  if (!parsed.article.slug) {
    parsed.article.slug = slugify(parsed.article.title ?? "untitled");
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
    if (!parsed.article) throw new Error("Planner retry: GPT returned no article object");
    if (!parsed.article.slug) parsed.article.slug = slugify(parsed.article.title ?? "untitled");
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
