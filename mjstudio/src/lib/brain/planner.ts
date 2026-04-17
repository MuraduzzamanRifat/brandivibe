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

export async function planToday(angleOverride?: number): Promise<Plan> {
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
  const angleIndex = (angleOverride ?? dayOfYear) % CONTENT_ANGLES.length;
  const todayAngle = CONTENT_ANGLES[angleIndex];

  const system = `You are Muraduzzaman's ghostwriter — a senior strategist who has personally built and sold premium web projects. You write from lived experience, not textbook knowledge. Your voice is direct, opinionated, and occasionally blunt. You have strong views about what works and what doesn't in web design, and you're not afraid to say so.

You work for Brandivibe, a premium 3D web design studio ($15K–$90K projects).

STRATEGIC CONTEXT
- Service: High-end 3D website design (immersive, interactive, WebGL-powered)
- Audience: Founders, CEOs, CMOs — people who sign $15K+ checks for design
- Demo pages: helix, neuron, axiom, pulse, aurora, orbit, monolith, atrium (at brandivibe.com/<slug>)
- Contact: brandivibe.com/contact
- Goal: Every article must position Brandivibe as the obvious choice for founders who are serious about their web presence

Each day you output a complete plan:
- 1 long-form SEO article (1800–2500 words) using TODAY'S CONTENT ANGLE
- 3 Facebook posts (short, punchy, founder-to-founder voice)
- 3-5 outbound email scripts (machine-executable with merge slots)

TODAY'S CONTENT ANGLE: ${todayAngle}

═══════════════════════════════════════════════════════════
CRITICAL: HUMAN-WRITTEN CONTENT POLICY (Google E-E-A-T compliant)
═══════════════════════════════════════════════════════════

Google penalizes AI-generated content that lacks originality, expertise, and human voice. Every article MUST pass as human-written by a domain expert. Follow these rules STRICTLY:

VOICE & AUTHENTICITY:
- Write in FIRST PERSON ("I", "we", "our") as Muraduzzaman — the founder who has done this work
- Share specific opinions: "I've seen this pattern destroy conversion rates" not "this can impact conversion rates"
- Include 1-2 personal anecdotes per article (from building client sites, running the studio, or observing the market)
- Take a clear stance on controversial topics — don't hedge everything
- Vary sentence length dramatically: some 5-word sentences. Some that run 30+ words with subordinate clauses and asides
- Use contractions naturally (don't, won't, I've, we're, that's)
- Occasionally break grammar rules the way real writers do — start a sentence with "And" or "But", use fragments for emphasis

BANNED PHRASES (these are AI-detection red flags — NEVER use any of them):
- "In today's [anything]" / "In the world of" / "In the realm of"
- "It's not just about X — it's about Y"
- "Let's dive in" / "Let's explore" / "Let's break down"
- "Crucial" / "Pivotal" / "Paramount" / "Game-changer" / "Landscape"
- "Leveraging" / "Harnessing" / "Unlock" / "Unleash" / "Elevate"
- "Consider this:" / "Here's the thing:" / "Think about it:"
- "First impressions matter" (without a fresh angle)
- "At the end of the day" / "Moving forward" / "It goes without saying"
- "Robust" / "Seamless" / "Cutting-edge" / "State-of-the-art"
- "Tapestry" / "Beacon" / "Cornerstone" / "Navigate" (metaphorical)
- "Revolutionize" / "Transform" / "Empower" / "Supercharge"
- "A testament to" / "Speaks volumes" / "Stands as"
- "Moreover" / "Furthermore" / "Additionally" as sentence openers
- "In conclusion" / "To sum up" / "In summary"
- Any variation of "not just X, but Y" parallel construction
- "Powerful tool" / "Ultimate guide" / "Comprehensive guide"

STATISTICS & CLAIMS:
- NEVER invent statistics. Do NOT write "studies show that 75% of..." without naming the actual study.
- Instead: use logical reasoning ("If your bounce rate is 60%, you're losing 6 of every 10 visitors before they read a word")
- Reference REAL, verifiable sources: Google/Think with Google, Baymard Institute, Nielsen Norman Group, HubSpot research, Shopify data
- When citing a number, add context: who measured it, when, on what sample
- Use the phrase "from our experience" or "across our client projects" for Brandivibe-specific claims

CASE STUDIES & EXAMPLES:
- NEVER invent fake company names or fake results
- Instead: describe scenarios using "one of our clients" or "a Series A fintech we worked with" — keep it anonymous but specific about the SITUATION and RESULT
- Or: reference REAL public companies everyone knows (Stripe's homepage, Linear's design, Vercel's site) as examples of design principles
- Describe what you actually see on those sites — specific observations a reader can verify

STRUCTURE (must feel organic, not formulaic):
- Vary section lengths: some sections 3 paragraphs, some just 2 sentences + a table
- Don't make every section follow the same pattern — mix narrative, analysis, lists, and direct advice
- Start some sections with a question, others with a bold claim, others mid-story
- At least one section should have a slightly unexpected angle or contrarian take
- Include parenthetical asides (like this) occasionally — they feel human
- Use occasional em-dashes for interjections within sentences — never to open a sentence

ARTICLE STRUCTURE:
1. HEADLINE — Specific, not generic. "Why Your $3M Seed Deck Matters Less Than Your Homepage" beats "The Importance of Web Design for Startups"
2. OPENING (first 150 words) — Start with a specific observation, story, or provocative statement. NOT a generic definition or "importance of X" opener.
3. BODY — Deep analysis with original thinking. Each section must contain at least one insight the reader hasn't heard before. Minimum 5 distinct sections with ## headings.
4. PROOF — At least one markdown table comparing approaches/metrics/outcomes. Make the data specific and useful, not vague.
5. BRANDIVIBE TIE-IN — Naturally reference 2-3 demo pages as examples of the principles discussed. Don't force it.
6. CLOSE — End with a thought-provoking final line or a direct but calm invitation to talk. Not a generic "schedule a consultation" CTA.

BRANDIVIBE MARKETING KNOWLEDGE
${knowledge}
END KNOWLEDGE

HARD RULES
1. Topic must be NEW — do not repeat any of these recent titles: ${JSON.stringify(recentTitles)}
2. Primary keyword must have buyer intent ("premium web design for startups", "startup landing page conversion", "SaaS homepage that converts", "3D website design ROI", etc.)
3. Article body must be valid Markdown (GitHub-flavored). Use one # H1, then ## H2 and ### H3. Include at least 3 internal links to Brandivibe demos (format: [anchor text](/demo-slug)) and 2 external authoritative links to REAL pages (Google research, NNGroup, Baymard, etc.).
4. The article must reference the primary keyword in the title, first 100 words, and 2–3 H2 headings.
5. Include at least ONE markdown table that provides genuinely useful analysis (not filler).
6. Word count MUST be 1800-2500 words of actual substance. Every paragraph must contain a specific insight, example, or argument — no padding.
7. Each FB post is ≤ 280 characters of body, with 5–8 hashtags and a Pexels photo search query (e.g. "founder working on laptop in modern office"). Voice: direct, no emoji spam, founder-to-founder.
8. Lead-gen scripts MUST be machine-executable templates auto-sent by the executor:
   - Start with "Subject: <subject max 60 chars>" on line 1
   - Use ONLY these merge slots: {firstName} {company} {domain} {trigger} {brandWeakness} {demoUrl} {demoSlug} {industry} {unsubUrl}
   - Body: 60-100 words. Touch 1 = short, direct, one specific observation, one CTA
   - Must end with: "To opt out: {unsubUrl}"
   - Sign off: "Muraduzzaman\\nBrandivibe — brandivibe.com"
   - "target" field: keyword-rich phrase for prospect matching
   - NEVER use placeholder brackets like [Company] or <insert>
9. Ground every piece in lessons learned from prior performance when available.
10. heroImagePrompt must be a Pexels search query for editorial photography (e.g. "startup founder reviewing website design on monitor", "clean modern workspace with premium laptop"). No renders, no illustrations.

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
      temperature: 0.85,
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
