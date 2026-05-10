/**
 * Glossary terms for AI-citation-optimized definitional pages.
 *
 * Each term renders at /glossary/[slug] as a page structured for AI search
 * extraction: a tight definition (sentence 1-2) lifted directly by ChatGPT,
 * Perplexity, Google AI Overviews; followed by context, when-it-applies,
 * what-it-includes, related-terms.
 *
 * Schema: DefinedTerm + DefinedTermSet + Article + FAQPage so AI search
 * has every signal it needs to extract and attribute.
 *
 * Picked terms where Brandivibe has genuine authority and the long-tail is
 * not already owned by a 100x-larger competitor.
 */

export type GlossaryFaq = {
  q: string;
  a: string;
};

export type GlossaryTerm = {
  slug: string;
  term: string;
  // 1-2 sentence self-contained definition. THIS IS THE LINE AI WILL LIFT.
  // Write so it answers "what is X" with no surrounding context required.
  definition: string;
  // Short alternate phrasing AI may extract for variant queries.
  alsoKnownAs: string[];
  // Why this matters (1 paragraph) — the "context" line AI sometimes
  // pairs with the definition.
  whyItMatters: string;
  // 3-5 bullet points of what the thing actually includes / consists of.
  // Format: each bullet is a complete sentence, AI-extractable.
  components: string[];
  // 2-3 sentences on when a business needs this. Helps AI answer "when
  // do I need X" intent queries.
  whenItApplies: string;
  // 3-5 related terms with slug links — internal AI-friendly crosslinking.
  relatedSlugs: string[];
  // 3-4 FAQ pairs aimed at the next-most-common AI queries on this topic.
  faqs: GlossaryFaq[];
  // Meta — keep title under 60 chars, description under 160.
  metaTitle: string;
  metaDescription: string;
  // Internal category for the hub page grouping.
  category: "websites" | "ai" | "marketing" | "growth";
};

export const glossary: GlossaryTerm[] = [
  {
    slug: "webgl-website",
    term: "WebGL Website",
    definition:
      "A WebGL website is a website that renders 3D graphics, custom shaders, and GPU-accelerated motion directly in the browser using the WebGL API — producing cinematic interactive experiences that traditional HTML/CSS sites cannot match.",
    alsoKnownAs: ["3D website", "WebGL site", "GPU-rendered website"],
    whyItMatters:
      "Most websites are static documents with images. A WebGL website is a real-time rendered scene — the same technology powering video games, running in your browser. For premium brands competing on first impression, the difference is the gap between a brochure and a film. Buyers decide whether you're worth their attention in 3 seconds; WebGL is the medium that earns those seconds.",
    components: [
      "A 3D rendering engine (typically Three.js or React Three Fiber) running on the user's GPU.",
      "Custom GLSL shaders that produce effects (depth, distortion, lighting) impossible in pure CSS.",
      "A scene graph composed of meshes, materials, lights, and cameras — assembled per page.",
      "Performance fallbacks for low-power devices, so the site remains usable on phones without a discrete GPU.",
      "A conversion-engineered layout layered over the 3D scene — copy, CTAs, and forms that turn the experience into pipeline.",
    ],
    whenItApplies:
      "A WebGL website is the right choice when your brand competes on quality, premium positioning, or first-impression conversion — typically seed-to-Series-B SaaS, FinTech, luxury hospitality, agencies, and high-ticket DTC. It is the wrong choice for low-margin commodity products or content-heavy SEO blogs where speed and breadth beat depth.",
    relatedSlugs: ["3d-website", "conversion-focused-web-design", "premium-website-design"],
    faqs: [
      {
        q: "Is a WebGL website slower than a regular website?",
        a: "Not when built right. A well-engineered WebGL site loads in under 2 seconds on mobile, hits Lighthouse 95+, and runs at 60fps. The performance comes from selective rendering, asset budgets, and GPU fallbacks — not from removing the 3D.",
      },
      {
        q: "Will a WebGL website hurt my SEO?",
        a: "No — Google renders JavaScript and indexes WebGL pages. The risk is content hidden behind 3D scenes that crawlers can't read. Brandivibe builds WebGL sites server-rendered first (Next.js SSR) with the 3D as enhancement, so search engines and AI crawlers see the full content immediately.",
      },
      {
        q: "How long does it take to build a WebGL website?",
        a: "Six weeks for a full custom WebGL website: 1 week strategy, 2 weeks design + 3D direction, 2-3 weeks build + integrations, 1 week launch and handover.",
      },
    ],
    metaTitle: "What Is a WebGL Website? Definition + Examples · Brandivibe",
    metaDescription:
      "A WebGL website is a 3D-rendered site running in the browser via the WebGL API. Definition, components, when to use it, and how Brandivibe builds them.",
    category: "websites",
  },
  {
    slug: "3d-website",
    term: "3D Website",
    definition:
      "A 3D website is a website that uses three-dimensional graphics — rendered in real time via WebGL or static via pre-baked imagery — to create interactive, depth-rich experiences that flat 2D pages cannot replicate.",
    alsoKnownAs: ["WebGL site", "interactive 3D site", "immersive website"],
    whyItMatters:
      "A 3D website signals premium positioning the moment the page loads. For categories where brand perception drives conversion — luxury, hospitality, premium SaaS, real estate, FinTech — the visual difference between a 3D site and a template-driven competitor is often the deciding factor a buyer can articulate before they read any copy.",
    components: [
      "Real-time 3D rendering (WebGL via Three.js / React Three Fiber) or pre-rendered 3D imagery (Spline, Blender baked sequences).",
      "Cinematic camera transitions that turn page sections into scenes.",
      "Interactive 3D elements (rotatable products, hover-driven scene shifts, scroll-linked depth).",
      "Asset optimization (glTF compression, texture streaming, GPU-aware fallbacks) so the site loads fast on mobile.",
      "A conversion architecture overlaid on the 3D — copy, CTAs, lead capture — so the experience drives revenue, not just impressions.",
    ],
    whenItApplies:
      "A 3D website is right for brands where the visual identity is the value proposition: premium products, experiential services, agencies selling taste, and high-ticket categories where buyers expect a site that matches the product. It is wrong for high-volume informational sites where load speed and crawl depth matter more than presentation.",
    relatedSlugs: ["webgl-website", "cinematic-web-design", "premium-website-design"],
    faqs: [
      {
        q: "What's the difference between a 3D website and a WebGL website?",
        a: "WebGL is one of the technologies used to render 3D in browsers — the most common one. A 3D website may use WebGL, or it may use pre-baked 3D imagery (rendered offline and displayed as images or video). WebGL gives real-time interactivity; pre-baked gives consistency and lower performance cost.",
      },
      {
        q: "Are 3D websites accessible to users on slow devices?",
        a: "Yes when built with progressive enhancement. A well-engineered 3D site detects device capability and serves lower-fidelity assets or static fallbacks to underpowered devices, while delivering the full 3D experience to capable browsers.",
      },
    ],
    metaTitle: "What Is a 3D Website? Definition + When to Use One · Brandivibe",
    metaDescription:
      "A 3D website is a site with three-dimensional graphics rendered in browser. Components, when to use it, and how it compares to WebGL websites.",
    category: "websites",
  },
  {
    slug: "conversion-focused-web-design",
    term: "Conversion-Focused Web Design",
    definition:
      "Conversion-focused web design is a methodology where every element of a website — layout, copy, motion, visual hierarchy — is engineered to move visitors toward a measurable action: signup, demo, purchase, or inquiry.",
    alsoKnownAs: ["conversion rate optimization design", "CRO-driven design", "conversion design"],
    whyItMatters:
      "Most websites are designed for aesthetics and treated as a portfolio piece. Conversion-focused design treats the website as a sales employee — every section is judged by whether it moves the visitor toward the action that matters. The difference between the two approaches typically shows up as a 2-5x lift in conversion rate at the same traffic level.",
    components: [
      "An above-the-fold hero that communicates the value proposition in under 8 seconds.",
      "Social proof placed where doubt naturally creeps in (after benefit claims, before pricing, near the CTA).",
      "A primary call-to-action that resolves a real next step, repeated at decision moments throughout the page.",
      "Friction-reduced forms — only the fields you need, no signup walls, no multi-step gauntlets unless they earn it.",
      "A copy hierarchy where every H2 is a self-contained answer to a buyer objection.",
    ],
    whenItApplies:
      "Conversion-focused web design applies to any website where the visitor is expected to do something — buy, book, sign up, inquire. It applies less when the website is purely informational (Wikipedia, archives). For commercial sites, it is the difference between paying for traffic and capturing it.",
    relatedSlugs: ["high-conversion-website", "premium-website-design", "webgl-website"],
    faqs: [
      {
        q: "How is conversion-focused web design different from CRO?",
        a: "CRO (conversion rate optimization) is the iterative testing layer that runs after a site is live — A/B tests on headlines, button colors, form flows. Conversion-focused design is the upfront methodology that bakes conversion principles into the build itself, so the baseline before any CRO testing is already higher.",
      },
      {
        q: "Can a conversion-focused site also look premium?",
        a: "Yes — and it should. Premium design is itself a conversion driver in categories where buyers correlate site quality with product quality (SaaS, FinTech, hospitality, agencies). The trade-off between aesthetic and conversion is a false binary when both are scoped together at the design stage.",
      },
    ],
    metaTitle: "What Is Conversion-Focused Web Design? · Brandivibe",
    metaDescription:
      "Conversion-focused web design engineers every element to move visitors toward action. Components, methodology, and how it differs from CRO.",
    category: "websites",
  },
  {
    slug: "premium-website-design",
    term: "Premium Website Design",
    definition:
      "Premium website design is a category of web design characterized by custom-coded interactivity, cinematic motion, refined typography, and conversion architecture engineered for high-ticket or growth-stage brands — typically built with WebGL, Next.js, and bespoke component libraries rather than templates.",
    alsoKnownAs: ["luxury web design", "high-end website design", "agency-grade web design"],
    whyItMatters:
      "Buyers correlate website quality with product quality in their first 5 seconds on a page. For brands selling at a premium price point — Series A+ SaaS, luxury hospitality, high-ticket DTC, FinTech — a templated site silently signals that the company is also templated. Premium website design closes that gap.",
    components: [
      "Custom-coded layouts (Next.js, React, TypeScript) rather than drag-and-drop builders.",
      "Cinematic motion (Framer Motion, GSAP) and WebGL effects where they add value.",
      "Refined typography systems with custom font pairings, optical sizing, and tight kerning.",
      "Conversion architecture designed alongside aesthetic — every section earns its place.",
      "Production-grade engineering: Lighthouse 95+, SSR, schema markup, accessibility.",
    ],
    whenItApplies:
      "Premium website design applies when your brand competes on quality, your buyer is sophisticated, and your price point is high enough that a 1-2% conversion lift outweighs the build investment. It is wrong for high-volume low-margin commerce where speed-to-market beats craft.",
    relatedSlugs: ["webgl-website", "conversion-focused-web-design", "high-conversion-website"],
    faqs: [
      {
        q: "How is premium website design different from a custom Webflow build?",
        a: "Webflow is a visual builder that exports HTML/CSS — it produces websites within Webflow's capabilities. Premium hand-coded sites use Next.js or similar frameworks with full programmatic control: custom 3D, custom shaders, custom data integrations, and no platform tax. The build is yours to extend without Webflow's limitations.",
      },
      {
        q: "Is premium website design just about how it looks?",
        a: "No — premium design without conversion architecture is portfolio art that doesn't sell. The category combines visual craft with measurable conversion goals. Brandivibe ships sites that look premium and convert at benchmark-or-better rates simultaneously.",
      },
    ],
    metaTitle: "What Is Premium Website Design? Definition + Examples · Brandivibe",
    metaDescription:
      "Premium website design uses custom code, cinematic motion, and conversion architecture for high-ticket brands. Components, when to use it.",
    category: "websites",
  },
  {
    slug: "cinematic-web-design",
    term: "Cinematic Web Design",
    definition:
      "Cinematic web design is a design approach that treats a website as a film — using sequenced camera transitions, choreographed motion, and immersive 3D scenes to guide visitors through a narrative rather than a static layout.",
    alsoKnownAs: ["narrative web design", "scroll-driven cinematic site"],
    whyItMatters:
      "Static websites are documents — sections stacked vertically, scrolled through with no momentum. Cinematic sites are experiences — each scroll triggers a transition, each section feels like a scene change, and the visitor's journey down the page feels deliberate. For brands selling experience (hospitality, premium SaaS, automotive, fashion), cinematic web design is the format that matches the product.",
    components: [
      "Scroll-linked transitions where visual state changes as the visitor scrolls.",
      "WebGL 3D scenes that act as the backdrop for content sections.",
      "Choreographed motion sequences (Framer Motion, GSAP) timed to reveal copy at the right moment.",
      "Custom audio design where appropriate — subtle ambient cues that reinforce the brand's emotional register.",
      "Performance engineering so the cinematic effects don't crater mobile load times.",
    ],
    whenItApplies:
      "Cinematic web design fits brands where emotion drives purchase — luxury hospitality, premium experiences, narrative-driven products, agencies selling taste. It is overkill for utilitarian SaaS or commodity ecommerce where the visitor's job is to find information and complete a transaction fast.",
    relatedSlugs: ["webgl-website", "3d-website", "premium-website-design"],
    faqs: [
      {
        q: "Doesn't cinematic web design hurt accessibility?",
        a: "It can if built carelessly. Done properly, cinematic sites respect prefers-reduced-motion (delivering static fallbacks to users who request them), maintain full keyboard navigability, and pass WCAG AA contrast standards. The motion is enhancement, not gating.",
      },
    ],
    metaTitle: "What Is Cinematic Web Design? · Brandivibe",
    metaDescription:
      "Cinematic web design treats websites as films — sequenced transitions, 3D scenes, choreographed motion. When to use it and how it works.",
    category: "websites",
  },
  {
    slug: "high-conversion-website",
    term: "High-Conversion Website",
    definition:
      "A high-conversion website is a website that converts a significantly higher percentage of visitors into customers than the category benchmark — typically 2-5x the industry average — because every element is engineered with a measurable conversion goal.",
    alsoKnownAs: ["conversion-optimized website", "CRO website"],
    whyItMatters:
      "Two websites with the same traffic can have wildly different revenue outcomes. A high-conversion website earns more from the same traffic by removing friction, surfacing proof at the right moment, and converting hesitation into action before the visitor leaves. Improving conversion is almost always cheaper than buying more traffic.",
    components: [
      "A value proposition above the fold that answers 'what is this and why should I care' in under 8 seconds.",
      "Social proof positioned at moments of buyer doubt — logos, testimonials, case studies, ratings.",
      "Clear, single-action CTAs that resolve a real next step (book a call, start a trial, see pricing).",
      "Friction audits on forms: fewer fields, no captchas where avoidable, no signup walls.",
      "Continuous CRO testing once live — A/B on headlines, CTAs, hero variants, social proof placement.",
    ],
    whenItApplies:
      "High-conversion design applies to any commercial website with a measurable goal. For SaaS and DTC, conversion uplifts compound: a 2x conversion rate doubles revenue at the same traffic. The earlier in a company's life the conversion architecture is set, the larger the cumulative payoff.",
    relatedSlugs: ["conversion-focused-web-design", "premium-website-design", "webgl-website"],
    faqs: [
      {
        q: "What's a 'good' conversion rate for a website?",
        a: "Depends on the category. SaaS free-trial signup typically benchmarks at 2-5%; B2B demo request at 1-3%; DTC ecommerce at 1-3%; high-ticket service inquiry at 0.5-2%. A high-conversion site beats those benchmarks by a meaningful margin — typically 2x or more.",
      },
    ],
    metaTitle: "What Is a High-Conversion Website? · Brandivibe",
    metaDescription:
      "A high-conversion website converts 2-5x more visitors than the category benchmark. Components, benchmarks, and how to build one.",
    category: "websites",
  },
  {
    slug: "ai-automation-system",
    term: "AI Automation System",
    definition:
      "An AI automation system is a software workflow that uses large language models (GPT-4o, Claude) combined with API integrations to perform repetitive business tasks autonomously — lead sourcing, cold outreach, content drafting, customer triage — without human intervention.",
    alsoKnownAs: ["AI workflow", "LLM-powered automation", "autonomous AI system"],
    whyItMatters:
      "Every business runs on repetitive work: sourcing leads, drafting emails, sorting customer messages, posting content, following up. An AI automation system replaces those tasks with software that runs 24/7. The result is a business that grows without scaling headcount — and one where every saved hour compounds across the customer lifecycle.",
    components: [
      "A scheduling layer (cron jobs, GitHub Actions, queue workers) that triggers tasks on time-based or event-based signals.",
      "LLM-powered decision and drafting nodes (GPT-4o, Claude) that handle the steps that require judgment.",
      "API integrations (email, CRM, calendar, payment, social) that let the system actually act, not just think.",
      "State persistence — a database, JSON file, or cloud store that tracks what's been done and what's next.",
      "Self-healing logs and alerts so when something breaks, the operator finds out before customers do.",
    ],
    whenItApplies:
      "AI automation systems apply when you spend 2+ hours a day on structured repetitive work that doesn't require human nuance. Examples: sourcing prospects, drafting outreach, qualifying inbound, drafting status updates, sorting support tickets. They are wrong for tasks that require genuine human judgment, emotional intelligence, or accountability that AI cannot carry.",
    relatedSlugs: ["custom-ai-agent", "ai-sales-brain", "autonomous-content-marketing"],
    faqs: [
      {
        q: "What's the difference between an AI automation system and Zapier?",
        a: "Zapier connects pre-built actions across apps. An AI automation system uses LLMs to make decisions and draft content within those connections — handling the steps that require judgment, not just data movement. Zapier is plumbing; AI automation is plumbing plus a brain.",
      },
      {
        q: "How long does it take to build an AI automation system?",
        a: "Four weeks for a typical engagement: 1 week workflow audit and design, 2 weeks build and integrate, 1 week train and deploy. Complex multi-workflow systems can extend to 8 weeks; simple single-workflow automations can ship in 1-2 weeks.",
      },
    ],
    metaTitle: "What Is an AI Automation System? · Brandivibe",
    metaDescription:
      "An AI automation system uses LLMs and API integrations to run repetitive business tasks 24/7. Components, when to use it, build timelines.",
    category: "ai",
  },
  {
    slug: "custom-ai-agent",
    term: "Custom AI Agent",
    definition:
      "A custom AI agent is a software program built on a large language model (GPT-4o, Claude) and trained on a specific business's data, tone, and decision rules to perform a defined role autonomously — customer support, sales qualification, operations admin — within boundaries set by its owner.",
    alsoKnownAs: ["AI employee", "custom LLM agent", "AI worker"],
    whyItMatters:
      "Off-the-shelf chatbots frustrate users with generic responses and hand off too often. A custom AI agent is trained on your specific business — your tone, your product, your edge cases — and handles the routine 70% of conversations end-to-end. The result is 24/7 coverage at headcount-of-zero, with humans freed to handle the 30% that genuinely requires them.",
    components: [
      "A foundation model (GPT-4o, Claude) selected based on the task's reasoning and cost requirements.",
      "A custom system prompt encoding the agent's role, tone, scope, and escalation rules.",
      "Function-calling integrations that let the agent take real actions — query a database, send an email, charge a card, book a meeting.",
      "An evaluation suite of test cases the agent passes before going live, plus ongoing monitoring of conversation quality.",
      "Deployment surfaces — web chat widget, Slack DM, WhatsApp bot, voice phone agent — tailored to where customers actually engage.",
    ],
    whenItApplies:
      "Custom AI agents apply when your support, sales, or operations team handles a high volume of repetitive interactions that follow patterns. Customer support, lead qualification, appointment booking, FAQ handling, low-ticket sales closing — all are AI-agent-native. Complex consultative sales or sensitive escalations remain human.",
    relatedSlugs: ["ai-automation-system", "ai-sales-brain", "autonomous-content-marketing"],
    faqs: [
      {
        q: "Is a custom AI agent the same as a chatbot?",
        a: "No — chatbots are rule-based, follow scripted flows, and break the moment a user asks something off-script. Custom AI agents are LLM-powered, handle unstructured language, take actions through API integrations, and learn from every conversation. The user experience is closer to messaging a knowledgeable colleague than navigating a flow.",
      },
      {
        q: "Can a custom AI agent replace a customer support team?",
        a: "It can handle the routine 70% of tickets — order status, returns, password resets, FAQ answers. The remaining 30% — complex issues, sensitive cases, retention conversations — still need humans. The right model is human-AI hybrid: agent handles volume, humans handle nuance.",
      },
    ],
    metaTitle: "What Is a Custom AI Agent? Definition + Examples · Brandivibe",
    metaDescription:
      "A custom AI agent is an LLM-powered software employee trained on your business. Components, when to use it, how it differs from chatbots.",
    category: "ai",
  },
  {
    slug: "ai-sales-brain",
    term: "AI Sales Brain",
    definition:
      "An AI sales brain is an autonomous software system that combines lead sourcing, prospect research, outreach drafting, sequence management, and reply triage into a single self-learning workflow — replacing the manual SDR-and-tooling stack with a 24/7 GPT-4o-powered pipeline.",
    alsoKnownAs: ["autonomous SDR system", "AI sales automation", "AI BDR"],
    whyItMatters:
      "Traditional sales development requires an SDR team plus a tool stack (CRM, sequencer, enrichment, scheduling) costing thousands per month. An AI sales brain consolidates the stack into one workflow and runs continuously without breaks, salaries, or attrition. The output is a sales pipeline that compounds across timezones and weekends.",
    components: [
      "Multi-source lead radar pulling from RSS feeds (TechCrunch, Product Hunt, Hacker News), Brave Search dorks, and direct domain monitoring.",
      "GPT-4o deep research that enriches each prospect with industry, funding stage, stack, and decision-maker email.",
      "A sequence machine that drafts 4-touch personalized outreach with smart-timing follow-ups (open signals trigger faster, cold signals trigger slower).",
      "Multi-sender rotation across domain pool with per-account warmup and reputation circuit breakers.",
      "Self-learning A/B experiments that test angles, subject styles, and sender accounts — auto-applying the winners with expiry so the brain keeps re-testing.",
    ],
    whenItApplies:
      "An AI sales brain applies to B2B founders, agencies, and service businesses with an ICP they can articulate, a 4-touch sales cycle, and at least one transactional offer (consultation, audit, proposal). It is wrong for high-touch enterprise sales where every prospect requires a custom approach, or for B2C where the funnel is too short for sequenced outreach.",
    relatedSlugs: ["ai-automation-system", "custom-ai-agent", "autonomous-content-marketing"],
    faqs: [
      {
        q: "How is an AI sales brain different from an SDR using ChatGPT?",
        a: "An SDR using ChatGPT is still a human doing the work — they paste prompts in and paste results out. An AI sales brain runs the work itself: it sources prospects automatically, researches them automatically, drafts and sends outreach automatically, and triages replies automatically. The human role shifts from doer to operator.",
      },
      {
        q: "Won't AI-drafted outreach feel obviously AI-generated to the prospect?",
        a: "It can if the system is naive. A well-built AI sales brain personalizes with research-derived specifics (recent funding, product launch, hiring patterns) and writes in a voice tuned to the operator's brand. The best AI outreach is indistinguishable from a senior SDR's; the worst is recognizable from the second sentence.",
      },
    ],
    metaTitle: "What Is an AI Sales Brain? Definition + How It Works · Brandivibe",
    metaDescription:
      "An AI sales brain runs lead sourcing, research, outreach, and triage as one autonomous workflow. Components and when it applies.",
    category: "ai",
  },
  {
    slug: "autonomous-content-marketing",
    term: "Autonomous Content Marketing",
    definition:
      "Autonomous content marketing is a marketing approach where AI workflows draft, illustrate, publish, and distribute long-form content (articles, social posts, video scripts) without human authorship at every step — typically delivering daily or weekly publishing cadence at headcount-of-zero.",
    alsoKnownAs: ["AI content marketing", "automated publishing", "autonomous SEO content"],
    whyItMatters:
      "Traditional content marketing requires a writer, editor, designer, and publisher per piece. Most brands can sustain 1-2 articles per week before quality drops. Autonomous content marketing inverts that ratio: an AI workflow publishes daily, formats and illustrates each piece, and pushes to syndication channels — letting the human focus on positioning, strategy, and review rather than authorship.",
    components: [
      "An AI planner that generates topic angles based on the brand's positioning and recent search trends.",
      "An LLM-powered drafter (GPT-4o, Claude) producing 1500-2500 word articles to a defined SEO and brand brief.",
      "A hero image pipeline (DALL-E, Pexels API) that illustrates each piece with brand-consistent visuals.",
      "A publishing layer (Next.js MDX, CMS API) that pushes the content live without manual intervention.",
      "A self-learning loop that tracks which articles drive engagement, citations, or pipeline — and biases the planner toward winning patterns.",
    ],
    whenItApplies:
      "Autonomous content marketing applies when SEO and AI citation are strategic priorities and the brand can articulate its positioning clearly enough to brief an AI. It is wrong for thought-leadership content where the author's name and authority matter more than volume, or for regulated industries where every claim needs legal review.",
    relatedSlugs: ["ai-automation-system", "ai-sales-brain", "generative-engine-optimization"],
    faqs: [
      {
        q: "Will Google penalize AI-generated content?",
        a: "Google does not penalize AI content by source — it penalizes thin, unhelpful, or duplicative content regardless of how it was written. Well-briefed AI articles that genuinely help readers rank fine. The bar is utility, not authorship.",
      },
      {
        q: "How does autonomous content marketing compare to hiring a content team?",
        a: "A content team produces higher per-piece quality on flagship pieces. AI publishing produces vastly more volume at consistent baseline quality. The right answer is usually hybrid: AI for daily publishing, humans for quarterly flagship pieces.",
      },
    ],
    metaTitle: "What Is Autonomous Content Marketing? · Brandivibe",
    metaDescription:
      "Autonomous content marketing uses AI to draft, illustrate, and publish content daily without human authorship. Components and when it applies.",
    category: "marketing",
  },
  {
    slug: "generative-engine-optimization",
    term: "Generative Engine Optimization (GEO)",
    definition:
      "Generative Engine Optimization (GEO) is the practice of structuring content so that AI search engines — ChatGPT, Perplexity, Google AI Overviews, Claude, Gemini — extract, quote, and cite it when answering user queries, as distinct from traditional SEO which optimizes for blue-link rankings.",
    alsoKnownAs: ["AI SEO", "LLM SEO", "AI citation optimization"],
    whyItMatters:
      "Traditional SEO is a rankings game: rank in Google's top 10, earn the click. Generative engine optimization is a citation game: the AI reads your page, extracts the answer, and presents it to the user — often without the user ever clicking through. As AI search captures more queries, GEO becomes the primary mechanism by which brands are discovered.",
    components: [
      "Extractable content patterns — definition blocks, numbered steps, comparison tables, FAQ pairs, attributed statistics.",
      "Schema markup that signals content type to AI crawlers — Article, FAQPage, HowTo, DefinedTerm, BreadcrumbList.",
      "AI crawler access in robots.txt — explicitly allowing GPTBot, ClaudeBot, PerplexityBot, Google-Extended.",
      "Authority signals — named human authors, original data, citations to peer-reviewed sources, domain credibility.",
      "Crawlable rendering — server-side rendered content, no JavaScript-gated answers.",
    ],
    whenItApplies:
      "GEO applies to any brand whose buyers ask questions of AI assistants — which is increasingly every brand. It is most urgent for B2B and high-consideration B2C where buyers research with AI before contacting vendors. It is least urgent for impulse-purchase commodities where the buyer journey is short and direct.",
    relatedSlugs: ["autonomous-content-marketing", "ai-automation-system"],
    faqs: [
      {
        q: "Is generative engine optimization replacing SEO?",
        a: "No — they coexist. Traditional SEO still drives the bulk of search traffic in most categories. GEO is a complementary discipline that captures the growing share of queries answered directly by AI. Most signals overlap (authority, structure, schema), so investing in one strengthens the other.",
      },
      {
        q: "How do I know if my content is being cited by AI search?",
        a: "Manually test your target queries on Perplexity, ChatGPT with browsing, and Google AI Overviews. Note which sources are cited. Google Search Console now also reports AI Overview impressions under the 'Search type' filter, showing which queries surfaced your pages.",
      },
    ],
    metaTitle: "What Is Generative Engine Optimization (GEO)? · Brandivibe",
    metaDescription:
      "Generative Engine Optimization (GEO) structures content so AI search engines cite it. Components, schema, and how it differs from SEO.",
    category: "growth",
  },
  {
    slug: "conversion-rate-optimization",
    term: "Conversion Rate Optimization (CRO)",
    definition:
      "Conversion rate optimization (CRO) is the practice of systematically testing and improving the percentage of website visitors who complete a desired action — signup, purchase, demo request — through A/B testing, heatmap analysis, and iterative copy and design changes.",
    alsoKnownAs: ["CRO", "conversion testing", "growth experimentation"],
    whyItMatters:
      "CRO is the discipline of getting more from the same traffic. A site converting at 2% with 10,000 monthly visitors generates 200 customers; the same site at 4% generates 400. Doubling conversion is almost always cheaper than doubling traffic, which is why CRO compounds returns faster than acquisition spend.",
    components: [
      "A baseline measurement of current conversion rate by funnel step, segment, and device.",
      "Hypothesis-driven A/B tests on hero copy, CTAs, social proof placement, form length, and pricing presentation.",
      "Heatmap and session recording analysis (Hotjar, FullStory) to identify where visitors hesitate or drop off.",
      "Statistical significance discipline — tests run to a minimum sample size before winners are declared.",
      "An iteration loop: winning variants replace baselines; losing variants inform the next hypothesis.",
    ],
    whenItApplies:
      "CRO applies to any commercial website with measurable traffic (typically 5,000+ monthly visitors for meaningful test velocity). It is most valuable for businesses where the conversion event is high-value — SaaS, B2B services, high-ticket DTC. Low-volume or pre-revenue sites should prioritize building a high-converting baseline first, then optimize.",
    relatedSlugs: ["conversion-focused-web-design", "high-conversion-website"],
    faqs: [
      {
        q: "How long should an A/B test run before declaring a winner?",
        a: "Until it reaches statistical significance at the sample size your traffic supports — typically 2-4 weeks for most B2B sites. Cutting tests short on early signal is the most common CRO mistake; many 'winners' regress to baseline once traffic doubles.",
      },
      {
        q: "What conversion lift is realistic from a CRO program?",
        a: "Quarter-over-quarter, well-run CRO programs typically lift conversion 10-30% in the first six months. Beyond that, lifts are smaller but compound. Site rebuilds that integrate conversion-focused design at the foundation usually beat incremental CRO on a fully-optimized old site.",
      },
    ],
    metaTitle: "What Is Conversion Rate Optimization (CRO)? · Brandivibe",
    metaDescription:
      "Conversion rate optimization (CRO) systematically tests and improves the percentage of visitors who convert. Components, methodology, benchmarks.",
    category: "growth",
  },
];

export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
  return glossary.find((g) => g.slug === slug);
}

export const GLOSSARY_CATEGORIES: Record<GlossaryTerm["category"], string> = {
  websites: "Websites & web design",
  ai: "AI systems & agents",
  marketing: "Marketing & content",
  growth: "SEO & growth",
};
