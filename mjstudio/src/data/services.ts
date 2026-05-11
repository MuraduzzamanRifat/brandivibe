/**
 * Service catalog. Each entry powers /services/[slug] AND the homepage
 * Services section preview. Keep summaries short for the homepage; the
 * detail page renders the full body sections.
 *
 * Voice: persuasive, specific, fear-of-loss aware. Every section earns
 * its place by triggering one of: authority, urgency, social proof,
 * outcome clarity, or competitor anxiety.
 */

export type ServiceProcessStep = {
  label: string;
  title: string;
  body: string;
};

export type ServiceCapability = {
  title: string;
  body: string;
};

export type Service = {
  slug: string;
  num: string;
  title: string;
  hook: string;
  tagline: string;
  accent: string;
  summary: string;
  heroBody: string[];
  bullets: string[];
  capabilities: ServiceCapability[];
  whenYouNeedThis: string[];
  process: ServiceProcessStep[];
  deliverables: string[];
  relatedDemos: string[];
  metaTitle: string;
  metaDescription: string;
};

export const services: Service[] = [
  {
    slug: "webgl-website",
    num: "01",
    title: "WebGL Website Development",
    hook: "Most Websites Look Good. Ours Make Money.",
    tagline: "Ultra-fast interactive websites engineered to impress users and convert them in seconds.",
    accent: "#84e1ff",
    summary:
      "High-converting 3D websites built to outclass your competitors and turn visitors into customers — fast.",
    heroBody: [
      "Your website has 3 seconds to convince a visitor you're worth their attention. A static template doesn't cut it anymore. We build cinematic WebGL websites that load fast, look premium, and trigger the buying decision before the visitor scrolls.",
      "Every site is hand-coded in Next.js with custom 3D, motion, and conversion architecture. No drag-and-drop builders. No theme tax. The result: a website that runs like a sales employee, not a digital brochure.",
    ],
    bullets: ["Custom WebGL + 3D", "Sub-second load time", "Conversion-first layout", "Mobile-perfect"],
    capabilities: [
      {
        title: "Cinematic first impression",
        body: "Custom 3D hero scenes that anchor your brand as premium within the first 2 seconds. Visitors don't bounce — they lean in.",
      },
      {
        title: "Conversion-engineered layout",
        body: "Every section earns its place: clear value prop above the fold, social proof where doubt creeps in, primary CTA that resolves a real next step.",
      },
      {
        title: "Sub-second load time",
        body: "LCP under 1.8s on cellular. Lighthouse 95+. Your visitors don't wait — and Google rewards you for it in rankings.",
      },
      {
        title: "Mobile-perfect performance",
        body: "60fps animations on phones from 2020. WebGL fallbacks where the GPU isn't there. The site never feels slow, never feels broken.",
      },
      {
        title: "Built-in analytics + lead capture",
        body: "Every meaningful interaction is a tracked event. Forms wired to Resend, Cal.com, your CRM. You see which channel actually drives bookings.",
      },
      {
        title: "You own the codebase",
        body: "Production Next.js + TypeScript. No platform lock-in. Hire any developer to extend it later — they'll thank you for the clean handover.",
      },
    ],
    whenYouNeedThis: [
      "Your competitors just launched a slicker site and your conversion rate is sliding.",
      "You raised a round and the deck looks better than your homepage.",
      "Your current site looks like the old you, not the next you.",
      "Visitors land and bounce — you don't know if it's the copy or the layout.",
      "You're moving upmarket and need a homepage that justifies a premium price tag.",
    ],
    process: [
      {
        label: "Week 1",
        title: "Strategy + positioning",
        body: "We map your ICP, top 3 buyer objections, and competitor landscape. You leave week 1 with a tight brief that defines the entire build.",
      },
      {
        label: "Week 2-3",
        title: "Design + 3D direction",
        body: "Pixel-perfect Figma mockups + 3D scene direction. Copy drafted alongside design — never bolted on after. Two rounds of revisions.",
      },
      {
        label: "Week 4-5",
        title: "Build + integrations",
        body: "Production Next.js codebase, custom WebGL, CMS wiring, analytics events, deploy preview at every commit. Daily Loom progress demos.",
      },
      {
        label: "Week 6",
        title: "Launch + transfer",
        body: "Domain cutover, post-launch QA across browsers + devices, full handover with documentation, repo access, and 30 days of post-launch support.",
      },
    ],
    deliverables: [
      "Production Next.js codebase (TypeScript, App Router, ESLint clean)",
      "Custom WebGL scenes + GLSL shaders",
      "Figma source file with the full design system",
      "CMS integration + admin walkthrough video",
      "Lighthouse 95+ performance report",
      "30 days of post-launch support",
    ],
    relatedDemos: ["octane", "helix", "aurora"],
    metaTitle: "WebGL Website Development — Custom 3D Sites That Convert · Brandivibe",
    metaDescription:
      "Hand-coded WebGL websites built for conversion. Sub-second load, custom 3D, mobile-perfect, engineered to turn visitors into paying customers in 6 weeks.",
  },

  {
    slug: "seo-optimization",
    num: "02",
    title: "SEO Optimization",
    hook: "SEO Alone Is Dead. AI-Powered Growth Wins Now.",
    tagline: "Rank higher on Google and capture buyers searching for your services every single day.",
    accent: "#a78bfa",
    summary:
      "Show up where buyers are already searching. Modern SEO that compounds — not the keyword-stuffing playbook from 2015.",
    heroBody: [
      "Most agencies sell SEO like it's still 2015 — keyword density, backlink farms, monthly retainers that show up as a spreadsheet you can't read. The Google algorithm has moved on. Today's rankings reward expertise, intent-match, and genuine authority. We build for that.",
      "Our SEO engagements are full-funnel: technical audit, content strategy aligned to buyer intent, AI-powered article publishing pipeline, schema-rich markup, and on-page optimization that compounds. You stop renting traffic from ads and start owning it.",
    ],
    bullets: ["Technical SEO audit", "Buyer-intent content", "Schema + structured data", "AI content pipeline"],
    capabilities: [
      {
        title: "Technical SEO that actually works",
        body: "Core Web Vitals tuned to Google's quality bar, sitemap.xml, robots.txt, canonical tags, schema.org JSON-LD, OG metadata. Your site stops fighting the crawler and starts working with it.",
      },
      {
        title: "Buyer-intent keyword strategy",
        body: "We don't chase vanity keywords. We map every page to a specific commercial-intent query — the searches your future customers are typing right now.",
      },
      {
        title: "AI-powered content engine",
        body: "Optional add-on: an autonomous content engine that publishes long-form, E-E-A-T-compliant articles to your blog daily. Your competitors can't keep up because they're still writing one post a week.",
      },
      {
        title: "Schema markup that earns rich results",
        body: "Product, Service, FAQPage, Organization, Article schemas — done right so Google shows you stars, prices, and FAQ accordions in the search results page itself.",
      },
      {
        title: "On-page conversion-rate optimization",
        body: "Ranking is half the battle. Once visitors arrive, the page has to convert. We tune headlines, social proof placement, and CTAs against real heatmap data.",
      },
      {
        title: "Backlink + authority strategy",
        body: "Real backlinks from real sites — guest posts, expert roundups, podcast features. No PBNs, no link farms. The kind that survives the next algorithm update.",
      },
    ],
    whenYouNeedThis: [
      "You're spending more on Google Ads than you can sustain and need organic traffic to take over.",
      "Your competitors are ranking page-1 for terms you should own.",
      "You publish articles but they don't bring in leads.",
      "You hired an SEO agency and got a monthly report nobody can decipher.",
      "You're launching a category and need to own it before competitors catch on.",
    ],
    process: [
      {
        label: "Week 1",
        title: "Audit + opportunity map",
        body: "Full technical SEO audit, competitor gap analysis, keyword opportunity map. You see exactly what's broken and where the biggest wins are.",
      },
      {
        label: "Week 2",
        title: "Technical fixes + on-page",
        body: "Core Web Vitals optimization, schema markup, internal linking, on-page rewrites. Foundational fixes that move rankings before any new content.",
      },
      {
        label: "Week 3-4",
        title: "Content strategy + execution",
        body: "Pillar articles + cluster pieces aligned to buyer intent. AI content pipeline (if added) lights up daily publishing.",
      },
      {
        label: "Ongoing",
        title: "Track + iterate",
        body: "Monthly ranking reports tied to revenue, not vanity. Quarterly strategy reviews to double-down on what's working.",
      },
    ],
    deliverables: [
      "Full technical SEO audit + prioritized fix list",
      "Competitor gap analysis",
      "Buyer-intent keyword map (50+ terms)",
      "Schema.org markup deployed across the site",
      "Pillar + cluster content strategy",
      "Monthly ranking + traffic dashboard",
    ],
    relatedDemos: ["axiom", "neuron", "atrium"],
    metaTitle: "SEO Optimization — Buyer-Intent Search Strategy · Brandivibe",
    metaDescription:
      "Modern SEO that compounds. Technical audits, buyer-intent content, AI publishing pipeline, schema-rich markup. Rank for what your customers are actually searching.",
  },

  {
    slug: "ai-automation",
    num: "03",
    title: "AI Automation Systems",
    hook: "Your Competitors Already Use AI. Why Are You Still Manual?",
    tagline: "Eliminate repetitive work with intelligent AI workflows that run while you sleep.",
    accent: "#f0abfc",
    summary:
      "Replace manual operations with AI workflows that source leads, qualify them, send outreach, follow up — 24/7, no breaks, no salary.",
    heroBody: [
      "Every business runs on repetitive work: sourcing leads, drafting emails, sorting customer messages, posting content, following up. Each one is a 30-minute task you do daily — adding up to 15 hours a week of pure tax. We replace it with AI systems that never sleep.",
      "Our automation systems aren't off-the-shelf Zapier cobble-ups. They're custom-built workflows — GPT-4o for the thinking, native APIs for the actions, self-healing logs for the operations. Your team stops doing busywork and starts doing the work only humans can do.",
    ],
    bullets: ["Lead generation automation", "Cold outreach systems", "Content publishing", "Self-learning workflows"],
    capabilities: [
      {
        title: "Autonomous lead radar",
        body: "Scans 5+ sources every 15 minutes — TechCrunch, Product Hunt, Hacker News, BetaList, Google search dorks. Filters by ICP fit. Adds qualified leads to your pipeline without you lifting a finger.",
      },
      {
        title: "AI-powered cold outreach",
        body: "Personalized email sequences with smart timing. Click signals trigger faster follow-ups. Open signals trigger different angles. Bounces auto-pause sender domains. Every email feels human; every send is automated.",
      },
      {
        title: "Self-publishing content engine",
        body: "Daily long-form articles drafted, fact-checked, hero-imaged, and published to your site without a writer. SEO-optimized, brand-voice-aligned, plagiarism-free. Your competitors can't keep up.",
      },
      {
        title: "Smart CRM + lead scoring",
        body: "Every prospect tracked from cold to closed. AI scores intent based on opens, clicks, replies, site visits. Hot leads bubble up automatically — no manual triage.",
      },
      {
        title: "Self-learning A/B experiments",
        body: "The system runs experiments on itself — angles, subject styles, sender accounts. Picks winners after 14 days. Auto-applies what works. Gets smarter every week with zero intervention.",
      },
      {
        title: "Daily digest + alerts",
        body: "One email each morning summarizing yesterday's performance. Real-time alerts if anything breaks. You glance once and know the system is working.",
      },
    ],
    whenYouNeedThis: [
      "You spend 2+ hours a day on outreach, lead sourcing, or follow-ups.",
      "Your competitors are scaling without hiring and you're losing ground.",
      "You hired a virtual assistant and they still can't keep up.",
      "You're stuck in inbox jail every morning.",
      "You want a business that grows when you take a vacation, not stalls.",
    ],
    process: [
      {
        label: "Week 1",
        title: "Workflow audit + design",
        body: "We map every repetitive task in your operation, score them by time saved, and design the automation system that replaces them.",
      },
      {
        label: "Week 2-3",
        title: "Build + integrate",
        body: "Custom GPT-4o workflows, API integrations, scheduling, error handling. Each automation tested against real data before going live.",
      },
      {
        label: "Week 4",
        title: "Train + deploy",
        body: "We watch the system run for 7 days, tune it against real signal, then hand over the dashboard + runbook.",
      },
      {
        label: "Ongoing",
        title: "Monitor + evolve",
        body: "Optional retainer: monthly tune-ups as your business changes, new automations as you spot new repetitive tasks.",
      },
    ],
    deliverables: [
      "Custom AI workflow architecture",
      "Lead sourcing + outreach system",
      "Content publishing pipeline",
      "CRM + lead scoring dashboard",
      "Daily digest email + monitoring alerts",
      "Self-healing logs + audit trail",
    ],
    relatedDemos: ["neuron", "axiom", "helix"],
    metaTitle: "AI Automation Systems — Workflows That Run 24/7 · Brandivibe",
    metaDescription:
      "Custom AI automation systems that source leads, run cold outreach, publish content, and follow up automatically. Replace 15 hours of weekly busywork with software that never sleeps.",
  },

  {
    slug: "digital-marketing",
    num: "04",
    title: "Digital Marketing Strategy",
    hook: "Stop Burning Ad Budget On Audiences That Don't Convert.",
    tagline: "Data-driven campaigns engineered to generate leads, sales, and long-term brand growth.",
    accent: "#fcd34d",
    summary:
      "Multi-channel marketing where every dollar is attributable. Paid, organic, email, retargeting — coordinated, measured, profitable.",
    heroBody: [
      "Most marketing budgets are graveyards. Money pours into Google Ads, Meta, agencies, freelancers, content creators — and the spreadsheet tracking ROI is a fiction. We build marketing systems where every dollar is attributable, every channel earns its place, and growth is something you can plan for, not pray for.",
      "Our strategies start with one question: who's the most valuable customer you're not yet reaching? Then we engineer the funnel — paid acquisition, organic content, email nurture, retargeting — to find them, qualify them, and convert them. Every campaign tracked against revenue, not vanity metrics.",
    ],
    bullets: ["Paid acquisition strategy", "Email + nurture funnels", "Retargeting + LTV", "Attribution modeling"],
    capabilities: [
      {
        title: "Paid acquisition that earns",
        body: "Google Ads, Meta, LinkedIn — built to ROAS targets, not spray-and-pray reach metrics. Creative testing, audience layering, and bid strategies tied to lifetime value, not first-click revenue.",
      },
      {
        title: "Email + nurture funnels",
        body: "Drip sequences that convert cold subscribers into customers. Welcome flows, abandoned-flow rescues, post-purchase upsells, win-backs. Every email earns its place in the sequence.",
      },
      {
        title: "Retargeting + lookalike audiences",
        body: "Visitors who didn't convert the first time become your warmest audience. Smart frequency caps, creative rotation, and segment-aware messaging that doesn't feel stalker-ish.",
      },
      {
        title: "Attribution + revenue modeling",
        body: "Multi-touch attribution that tells you which channel actually drives revenue — not just which one got the last click. UTM hygiene, server-side tracking, customer-level reporting.",
      },
      {
        title: "Content distribution strategy",
        body: "Your articles, videos, and case studies engineered for maximum amplification. Repurposing pipeline, paid amplification of organic winners, syndication relationships.",
      },
      {
        title: "Conversion rate optimization",
        body: "Heatmap audits, A/B testing on landing pages, checkout flow analysis. Most growth comes from converting more of the traffic you already have, not buying more.",
      },
    ],
    whenYouNeedThis: [
      "You're scaling ad spend but ROAS is sliding and nobody can explain why.",
      "Your CMO left and the marketing function is duct-tape.",
      "You're getting traffic but not buyers — the funnel leaks somewhere and you don't know where.",
      "You're launching a product and need a coordinated multi-channel rollout.",
      "You want to stop relying on word-of-mouth and build predictable demand.",
    ],
    process: [
      {
        label: "Week 1",
        title: "Audit + funnel diagnosis",
        body: "Full audit of paid, organic, email, retargeting. Heatmap review on landing pages. We identify the leak — and the fastest win.",
      },
      {
        label: "Week 2",
        title: "Strategy + ICP refinement",
        body: "Customer segmentation, ICP scoring, channel allocation, budget re-balance. You see exactly where every dollar goes and why.",
      },
      {
        label: "Week 3-4",
        title: "Campaign launch + creative",
        body: "Ad creative production, copy, landing page optimization, email sequences. First wave goes live with measurable hypotheses.",
      },
      {
        label: "Ongoing",
        title: "Optimize + scale winners",
        body: "Weekly performance reviews, creative iteration, budget reallocation toward winners. Compounding growth, not flat-line spending.",
      },
    ],
    deliverables: [
      "Full marketing audit + diagnosis",
      "ICP + customer segmentation report",
      "Channel allocation + budget plan",
      "Ad creative production (5+ variations)",
      "Email + nurture sequence build",
      "Attribution dashboard tied to revenue",
    ],
    relatedDemos: ["pulse", "uturn", "kindred"],
    metaTitle: "Digital Marketing Strategy — Revenue-Tied Growth Campaigns · Brandivibe",
    metaDescription:
      "Multi-channel marketing where every dollar is attributable. Paid, organic, email, retargeting — all measured against revenue, not vanity metrics.",
  },

  {
    slug: "ai-agent-development",
    num: "05",
    title: "AI Agent Development",
    hook: "Hire An AI Employee That Never Sleeps, Never Quits.",
    tagline: "Custom AI agents trained to handle customer support, sales, lead qualification, and operations — automatically.",
    accent: "#86efac",
    summary:
      "AI agents that work like a senior employee — handling support tickets, qualifying leads, closing routine sales, all 24/7 without a salary or sick days.",
    heroBody: [
      "The customer support rep, the SDR, the operations coordinator — these roles are increasingly being automated. Not by chatbots that frustrate users, but by AI agents trained on your specific business, your specific tone, and your specific decision-making rules.",
      "We build AI agents that act, not just respond. They look up customer data, schedule meetings, escalate edge cases, write proposals, and refund orders — within the boundaries you set. They run on GPT-4o or Claude depending on the task, and they integrate directly with your existing tools.",
    ],
    bullets: ["Custom-trained agents", "Multi-tool integration", "Voice + chat support", "Human handoff logic"],
    capabilities: [
      {
        title: "Customer support agents",
        body: "Handles 70%+ of routine support tickets — order status, returns, password resets, FAQ answers. Escalates complex issues to humans with full context attached. Your support team focuses on the 30% that matters.",
      },
      {
        title: "Lead qualification agents",
        body: "Conducts a structured discovery conversation with inbound leads. Scores fit, books qualified prospects directly to your calendar, sends 'not a fit' a polite no. Your sales team only talks to qualified buyers.",
      },
      {
        title: "Sales-closing agents (low-ticket)",
        body: "For repeatable, low-ticket products: agent handles the entire sale from question to checkout. Answers objections, sends proposals, processes payments. Works while you sleep.",
      },
      {
        title: "Operations + admin agents",
        body: "Internal agents that file expense reports, update CRM records, draft project status updates, schedule meetings. The boring 20% of your team's calendar — gone.",
      },
      {
        title: "Multi-tool integration",
        body: "Agents that actually do things: read Gmail, write to Notion, query Postgres, charge Stripe, send Slack messages. Powered by function-calling APIs and your existing stack.",
      },
      {
        title: "Voice + chat interfaces",
        body: "Deploy as web chat widgets, WhatsApp bots, voice phone agents (via Twilio or Vapi), or Slack DM agents. Same brain, multiple surfaces.",
      },
    ],
    whenYouNeedThis: [
      "Your support team is drowning and hiring more people just delays the problem.",
      "You're booking demo calls with prospects who weren't a fit anyway.",
      "Your team spends hours on admin work that could be automated.",
      "You want to scale customer touchpoints without scaling headcount.",
      "Your competitors deploy 24/7 chat and it's making you look slow by comparison.",
    ],
    process: [
      {
        label: "Week 1",
        title: "Use case + scope",
        body: "We pick the highest-leverage agent to build first. Map decision rules, escalation logic, tool integrations, and success metrics.",
      },
      {
        label: "Week 2-3",
        title: "Build + train",
        body: "Agent development, prompt engineering, function-calling integrations, evaluation suite. Tested against 100+ real edge cases before launch.",
      },
      {
        label: "Week 4",
        title: "Pilot + tune",
        body: "Deployed to a fraction of traffic. Daily review of conversations. Tune prompts, expand or restrict scope based on real performance.",
      },
      {
        label: "Ongoing",
        title: "Scale + monitor",
        body: "Full deployment with monitoring dashboard. Quarterly retraining as your business evolves and the model improves.",
      },
    ],
    deliverables: [
      "Custom AI agent (GPT-4o or Claude-based)",
      "Function-calling integrations with your stack",
      "Web chat widget OR voice phone agent OR WhatsApp bot",
      "Evaluation suite + monitoring dashboard",
      "Conversation logs + analytics",
      "Quarterly retraining included for 12 months",
    ],
    relatedDemos: ["neuron", "atrium", "helix"],
    metaTitle: "AI Agent Development — Custom AI Employees For Your Business · Brandivibe",
    metaDescription:
      "Custom AI agents trained to handle support, sales, qualification, operations. GPT-4o or Claude-powered, deployable as chat / voice / WhatsApp / Slack.",
  },
];
