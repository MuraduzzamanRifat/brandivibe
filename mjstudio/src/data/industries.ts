/**
 * Industry catalog for programmatic SEO.
 *
 * Each industry pairs with each service to generate a unique long-tail
 * landing page at /services/[slug]/[industry]. Content per page is built
 * by combining the Industry record (industry-specific framing) with the
 * Service record (capabilities, process, deliverables) — producing a page
 * that's substantively different from both the parent service page and
 * sibling industry pages.
 *
 * Picked for Brandivibe's ICP: high-ticket, conversion-sensitive,
 * visual-heavy, English-speaking founder-led companies.
 */

export type Industry = {
  slug: string;
  name: string;
  pluralName: string;
  shortLabel: string;
  intro: string;
  // Industry-specific pain points — generic across services, but specific
  // to the industry vertical itself. Each page combines these with the
  // service's whenYouNeedThis to give the visitor 5 industry signals they
  // recognize as their own.
  painPoints: string[];
  // 3 brand examples for proof in meta descriptions and on-page social
  // proof. Avoid claiming these as Brandivibe customers — they're
  // recognizable industry references only.
  examples: string[];
  buyerPersona: string;
  conversionFrame: string;
  industrySignal: string;
  // Service-specific framing — one sentence per service slug telling the
  // visitor why this service matters for THIS industry. This is the line
  // that makes each /services/[slug]/[industry] page unique vs. its
  // siblings. Keys must match service.slug values from data/services.ts.
  serviceFraming: Record<string, string>;
  // Industry-specific FAQ used in addition to the service's generic FAQs.
  // These are the questions a founder in this industry actually types.
  industryFaqs: Array<{ q: string; a: string }>;
};

export const industries: Industry[] = [
  {
    slug: "saas",
    name: "SaaS",
    pluralName: "SaaS companies",
    shortLabel: "Software-as-a-Service",
    intro:
      "SaaS companies live or die by activation. The website is the top of the funnel — and the funnel leaks at every step where the page fails to communicate value in 3 seconds. Visitors who don't sign up don't churn later; they never enter the pipeline.",
    painPoints: [
      "Your homepage describes features instead of outcomes — visitors don't see themselves in the copy.",
      "Free-trial signups are flat, but Google Ads CAC keeps climbing month over month.",
      "Demo requests come from prospects who aren't your ICP and waste sales cycles.",
      "Self-serve activation drops off between signup and first 'aha' moment.",
      "Your competitors raised a Series B and their website looks like the next category leader; yours looks like 2021.",
    ],
    examples: ["Linear", "Vercel", "Notion"],
    buyerPersona: "Founder, Head of Growth, or Head of Marketing at a seed-to-Series-B SaaS company",
    conversionFrame: "Free-trial signup, demo request, or pricing page → checkout",
    industrySignal: "fast-moving, self-serve PLG motion or hybrid sales-led",
    serviceFraming: {
      "webgl-website":
        "SaaS websites compete in a category where every site looks the same. A custom WebGL homepage signals you're the next-gen player and converts visitors before they comparison-shop.",
      "seo-optimization":
        "SaaS SEO is a category-vs-feature war. We rank you for the buyer-intent terms your competitors are paying $30/click for — and own them organically.",
      "ai-automation":
        "SaaS operations are template-perfect for AI: lead enrichment, demo qualification, support triage, content publishing. Each saved hour compounds across the customer lifecycle.",
      "digital-marketing":
        "SaaS marketing wins on retention math, not acquisition. We build full-funnel campaigns where every dollar is attributable to LTV — not last-click vanity.",
      "ai-agent-development":
        "SaaS support and onboarding are AI-agent native: 70% of support tickets are routine, and onboarding is a guided conversation. We deploy agents that handle both 24/7.",
    },
    industryFaqs: [
      {
        q: "Does this work for early-stage SaaS without product-market fit yet?",
        a: "Yes — pre-PMF SaaS often benefits the most. A converting website lets you test messaging cheaper than running ads, and the data you gather feeds your positioning iteration.",
      },
      {
        q: "How does this compare to using a Webflow template for a SaaS site?",
        a: "Templates make every SaaS look the same — same hero, same logo strip, same pricing grid. Custom-built means you stand out, you own the codebase, and you don't pay platform tax forever.",
      },
    ],
  },
  {
    slug: "ecommerce",
    name: "E-commerce",
    pluralName: "e-commerce brands",
    shortLabel: "Direct-to-consumer e-commerce",
    intro:
      "E-commerce conversion is a knife fight. Add-to-cart rate, checkout completion, AOV — every fraction of a percent compounds across thousands of sessions. The brands that win are obsessive about page speed, mobile UX, and the emotional pull of the product story.",
    painPoints: [
      "Mobile conversion rate is half your desktop rate — and 70% of your traffic is mobile.",
      "Cart abandonment is climbing and you can't tell if it's shipping cost, page speed, or trust signals.",
      "Your Shopify theme looks generic — visitors can't tell you apart from the dropshipper undercutting you on Amazon.",
      "Email and SMS flows are converting, but homepage and PLP traffic don't make it that far.",
      "Paid ROAS is sliding because Meta CPMs keep rising and your landing page is doing none of the lift.",
    ],
    examples: ["Allbirds", "Glossier", "Aesop"],
    buyerPersona: "Founder, CMO, or Head of E-commerce at a $1M-$50M ARR DTC brand",
    conversionFrame: "Add-to-cart → checkout completion at higher AOV",
    industrySignal: "mobile-first, brand-driven, conversion-obsessed",
    serviceFraming: {
      "webgl-website":
        "E-commerce sites that feel cinematic outperform generic Shopify themes by double-digit conversion lift. We build storefronts that turn product detail pages into experiences buyers can't get elsewhere.",
      "seo-optimization":
        "E-commerce SEO is a long game of category, collection, and product-page ranking. We build the technical foundation and content layer that compound into organic traffic taking over from paid.",
      "ai-automation":
        "E-commerce operations are repetitive at scale: inventory updates, supplier emails, customer service triage, post-purchase flows. AI workflows replace the team you'd otherwise hire to handle them.",
      "digital-marketing":
        "E-commerce marketing is a multi-channel orchestration problem: Meta, Google, email, SMS, retargeting. We build the attribution layer first so every channel earns its budget against contribution margin.",
      "ai-agent-development":
        "E-commerce support is 80% returns, shipping, sizing, and stock questions. A custom AI agent handles all of it 24/7, escalates the rare complex case to humans, and keeps your support team focused on retention.",
    },
    industryFaqs: [
      {
        q: "Do you work with Shopify, or do you replace it?",
        a: "Both — we build custom Next.js storefronts on top of Shopify's headless API for brands that need a unique experience, and we also work directly inside Shopify themes for brands not ready to leave the standard stack.",
      },
      {
        q: "Will a custom e-commerce site hurt my SEO compared to a vanilla Shopify theme?",
        a: "No — we ship server-rendered Next.js with full schema markup (Product, AggregateRating, BreadcrumbList) and Lighthouse 95+ scores. Custom builds typically rank better than templated stores because the code is leaner.",
      },
    ],
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    pluralName: "real estate firms",
    shortLabel: "Residential and commercial real estate",
    intro:
      "Real estate is the most visual category on the web — and most real estate websites look like a 2014 MLS feed. Premium agents and developers compete for attention with luxury brands, not other agents. The website has to match.",
    painPoints: [
      "Listings load slow on mobile and visitors bounce before the gallery even appears.",
      "Buyers can't tell your firm apart from the broker down the street with the same template.",
      "Your $5M+ listings are presented in the same gallery format as your $400K starter homes.",
      "Lead capture forms convert at <1% because the page hasn't built enough trust by the time the visitor reaches them.",
      "Zillow and Realtor.com are eating your direct traffic because their UX is better than yours.",
    ],
    examples: ["Compass", "The Agency", "Sotheby's International Realty"],
    buyerPersona: "Brokerage founder, marketing director, or developer marketing high-end inventory",
    conversionFrame: "Listing inquiry, agent contact, or showing booking",
    industrySignal: "high-ticket, visual-first, trust-driven",
    serviceFraming: {
      "webgl-website":
        "Real estate sites earn or lose listings on first impression. A cinematic 3D-driven website with smooth gallery transitions and motion-rich listing pages communicates premium inventory the way a Compass or Sotheby's site does.",
      "seo-optimization":
        "Real estate SEO is hyper-local and intent-rich. We rank you for neighborhood + property-type long-tail queries that buyers use, not the generic 'homes for sale' terms Zillow already owns.",
      "ai-automation":
        "Real estate ops are listing-heavy: photo curation, listing copy, MLS updates, follow-up sequences. AI workflows draft listing descriptions, schedule showings, and qualify leads while you're at the next showing.",
      "digital-marketing":
        "Real estate marketing wins on local visibility plus retargeting precision. We build geo-targeted Google + Meta campaigns paired with retargeting flows that follow visitors from listing view to inquiry.",
      "ai-agent-development":
        "Real estate inquiries are 24/7 — buyers browse listings at 10pm. A custom AI agent qualifies inquiries, books showings, and answers neighborhood questions while your team sleeps.",
    },
    industryFaqs: [
      {
        q: "Can the website integrate with my MLS feed and CRM?",
        a: "Yes — we build feeds that pull MLS listings (RETS or IDX) into the site dynamically, and integrate with Follow Up Boss, BoomTown, kvCORE, or your custom CRM via webhooks.",
      },
      {
        q: "How does this compete with Compass or Sotheby's-style sites?",
        a: "We use the same WebGL and motion stack the top luxury brokerages use — Three.js, Framer Motion, server-rendered Next.js. The gap isn't tools; it's design judgment and conversion architecture, which is what we sell.",
      },
    ],
  },
  {
    slug: "hospitality",
    name: "Hospitality",
    pluralName: "hospitality brands",
    shortLabel: "Hotels, restaurants, and experiential brands",
    intro:
      "Hospitality is sold on emotion. The hotel, the restaurant, the experience — visitors decide whether to book in the first 5 seconds based on how the site feels. A standard booking-engine widget on a stock template loses to a competitor whose site makes the visitor want to pack a bag.",
    painPoints: [
      "Direct bookings are flat — guests find you, then book through Booking.com, and you pay 15% commission.",
      "Your photos are stunning, but the website crops, compresses, and frames them like an afterthought.",
      "The booking flow on mobile feels broken — guests bounce to OTA apps that work better.",
      "Your restaurant or hotel brand story is rich, but the homepage reads like a price sheet.",
      "Reviews on Google and TripAdvisor are 4.8 stars; your website doesn't surface a single one.",
    ],
    examples: ["Aman Resorts", "Equinox Hotels", "Eleven Madison Park"],
    buyerPersona: "Owner, GM, or marketing director at a boutique hotel, restaurant group, or experiential brand",
    conversionFrame: "Direct booking, reservation, or experience purchase",
    industrySignal: "experiential, premium, narrative-driven",
    serviceFraming: {
      "webgl-website":
        "Hospitality websites win on atmosphere. A WebGL-driven site with cinematic transitions, custom typography, and immersive room or menu pages signals the experience guests are about to book — and shifts bookings from OTAs to direct.",
      "seo-optimization":
        "Hospitality SEO is local + intent-rich: 'boutique hotel [city]', 'tasting menu [neighborhood]'. We optimize the long-tail queries that bring guests with conviction, not OTA window-shoppers.",
      "ai-automation":
        "Hospitality ops are guest-touchpoint heavy: pre-arrival emails, in-stay nudges, post-visit reviews. AI workflows handle the personalized communication that makes a 4-star property feel like 5.",
      "digital-marketing":
        "Hospitality marketing is a calendar problem: low-season fill, high-season yield management, geo-targeted campaigns by source market. We build the channel mix that flexes with your occupancy curve.",
      "ai-agent-development":
        "Hospitality inquiries arrive at all hours and need warm, knowledgeable responses. A custom AI agent answers questions about rooms, menus, availability, and policies in your brand voice — and routes booking-ready inquiries to your team.",
    },
    industryFaqs: [
      {
        q: "Can the website integrate with my PMS or booking engine?",
        a: "Yes — we integrate with Mews, Cloudbeds, SiteMinder, Resy, OpenTable, and most major hospitality stacks via API, so the booking flow stays inside your site instead of redirecting to a third-party widget.",
      },
      {
        q: "Will this actually move bookings from OTAs to direct?",
        a: "When the website feels worth booking direct on, yes. A premium site plus parity-pricing and a simple loyalty hook typically shifts 10-25% of OTA-sourced bookings to direct within 6 months.",
      },
    ],
  },
  {
    slug: "fintech",
    name: "FinTech",
    pluralName: "FinTech companies",
    shortLabel: "Financial technology",
    intro:
      "FinTech is sold on trust. Every visitor is asking the same silent question — should I move my money through this site? The website is the answer. Trust is built (or broken) in the first 8 seconds: the design, the proof points, the security signals, the brand maturity.",
    painPoints: [
      "Visitors land, glance at the design, and silently disqualify you as 'not safe enough for my money'.",
      "Compliance copy fills the page, but the buyer's actual concerns (security, regulatory standing, who's behind this) aren't visibly answered.",
      "Conversion to signup is below benchmark, and you can't tell whether it's the offer, the proof, or the page itself.",
      "Your competitors have a Series B website; you have a Series A budget — and the gap shows.",
      "AI search and ChatGPT are starting to recommend competitors when prospects ask 'what's the best [your category]'.",
    ],
    examples: ["Mercury", "Ramp", "Plaid"],
    buyerPersona: "Founder, CMO, or marketing lead at a seed-to-Series-B FinTech",
    conversionFrame: "Account signup, demo request, or waitlist conversion",
    industrySignal: "trust-sensitive, compliance-aware, design-driven",
    serviceFraming: {
      "webgl-website":
        "FinTech websites need to feel like trust at first glance. We build sites with the design maturity of Mercury and Ramp — typography, motion, and proof architecture that close the trust gap before the visitor reads a word.",
      "seo-optimization":
        "FinTech SEO is a content-authority game — Google and AI search reward sites with deep, accurate, expert content. We build the topical authority that gets you cited as the answer for 'what is [your category]' queries.",
      "ai-automation":
        "FinTech ops are compliance-and-customer-heavy: KYC, transaction support, fraud triage, recurring reports. AI workflows handle the structured pieces while keeping humans in the loop where regulation requires it.",
      "digital-marketing":
        "FinTech CAC is brutal — every channel needs to earn its budget against LTV, not first-click signups. We build attribution and retention modeling that show which acquisition spend pays back in 6 months vs. 24.",
      "ai-agent-development":
        "FinTech support is 70% repetitive (account questions, transaction status, password resets) and 30% complex. A custom AI agent handles the 70% with full audit trails for compliance, and escalates the rest with context attached.",
    },
    industryFaqs: [
      {
        q: "Can you handle the compliance and security requirements of a FinTech site?",
        a: "Yes — we build with SOC 2 and PCI-aware patterns: server-side rendering, encrypted data flows, audit logging, and integration with your existing identity, KYC, and fraud stacks. We don't store sensitive data; we route it to your authoritative systems.",
      },
      {
        q: "How do we communicate trust on the homepage without burying the page in legal copy?",
        a: "Trust is signaled by design quality, named team members, recognizable investors and partners, security certifications surfaced visually (not just in footers), and copy written by someone who's read your terms. We own all of this in the build.",
      },
    ],
  },
  {
    slug: "web3",
    name: "Web3",
    pluralName: "Web3 and crypto projects",
    shortLabel: "Web3, crypto, and blockchain",
    intro:
      "Web3 lives on aesthetic. The community decides in the first scroll whether your project is serious, well-funded, and worth attention — or another anon meme launch. The website is the proof. Tokenomics matter; design matters more, because most visitors will not read the whitepaper.",
    painPoints: [
      "Your token launch website looks like a template, and the community calls it a 'rug-able UI' before listening to the pitch.",
      "Telegram and Discord drive the conversation; the website doesn't translate that energy into conversion.",
      "Wallet-connect drop-off is high — the on-ramp from visitor to connected wallet is friction-loaded.",
      "Whitepaper and docs are buried; visitors leave without finding the substance behind the visuals.",
      "Competitors with worse fundamentals raise more attention because their site renders better on Twitter screenshots.",
    ],
    examples: ["Ethereum.org", "Uniswap", "OpenSea"],
    buyerPersona: "Founder, CMO, or marketing lead at a Web3 protocol, dApp, NFT project, or crypto exchange",
    conversionFrame: "Wallet connect, whitepaper download, or community join",
    industrySignal: "aesthetic-driven, community-first, technical-substance + visual-marketing",
    serviceFraming: {
      "webgl-website":
        "Web3 lives on visuals. A WebGL-rendered site with tokenomics visualized, smooth wallet-connect flows, and a hero that screenshots cleanly on Crypto Twitter signals you're in the top 1% of project quality.",
      "seo-optimization":
        "Web3 SEO is a wild west — most projects ignore it, which is why ranking for category terms is faster here than anywhere else. We rank you for the queries that matter (project name, token name, category) before competitors catch on.",
      "ai-automation":
        "Web3 operations are community-heavy: Discord moderation, Telegram FAQ, Twitter responses, governance voting reminders. AI workflows handle the structured community ops while humans focus on the governance and product.",
      "digital-marketing":
        "Web3 marketing is paid + earned + viral mixed in unfamiliar ratios. We build the campaign mix that combines KOL programs, paid social, programmatic, and content amplification to grow community and TVL.",
      "ai-agent-development":
        "Web3 support is the same 20 questions across 50 platforms — wallet errors, transaction stuck, contract questions. A custom AI agent answers all of them with up-to-date chain data and escalates the rare technical edge case to humans.",
    },
    industryFaqs: [
      {
        q: "Do you work with token launches, NFT projects, and DeFi protocols?",
        a: "Yes — we've shipped sites for protocol launches, NFT collections, DAO governance portals, and exchange landing pages. The motion stack (Three.js, GLSL, Framer Motion) is well-suited to the visual demands of Web3.",
      },
      {
        q: "Can the site handle wallet-connect, contract reads, and on-chain data?",
        a: "Yes — we integrate WalletConnect, RainbowKit, wagmi, viem, and ethers depending on your stack. We render token balances, NFT inventories, and on-chain stats server-side or client-side as the use case demands.",
      },
    ],
  },
  {
    slug: "agencies",
    name: "Agencies",
    pluralName: "agencies",
    shortLabel: "Marketing, design, and development agencies",
    intro:
      "Agencies sell taste. The website is the work. If the agency's own site looks worse than the work it claims to deliver, prospects assume the case studies are exaggerated. Most agency websites are stuck on the same template stack their clients are stuck on — which is why most agencies struggle to charge a premium.",
    painPoints: [
      "Your case studies are strong, but the website doesn't make a prospect believe you can do their build.",
      "You're competing with agencies that have a smaller team but a better-looking site, and they win the pitches.",
      "Your inbound leads are the wrong fit — small budgets, vague briefs — because the site doesn't pre-qualify.",
      "You spend 20 hours per pitch and the website doesn't do any of the upfront convincing for you.",
      "Prospects find you through referrals, but the website is what they show their CFO — and the CFO is unimpressed.",
    ],
    examples: ["Active Theory", "Resn", "Lusion"],
    buyerPersona: "Agency founder, partner, or new business lead at a 5-50 person creative shop",
    conversionFrame: "Inbound brief submission, RFP qualification, or partner introduction",
    industrySignal: "taste-driven, portfolio-led, premium-positioned",
    serviceFraming: {
      "webgl-website":
        "Agency websites are the entire pitch. A custom WebGL site with motion craft and conversion architecture proves the work better than any case study can — because the prospect is experiencing your taste live.",
      "seo-optimization":
        "Agency SEO is geo + service + intent: '[city] WebGL agency', 'Shopify Plus partner agency'. We rank you for the buyer-intent queries that send you briefed prospects, not random portfolio drive-bys.",
      "ai-automation":
        "Agency operations are the meta-irony — agencies sell systems but run on chaos. AI workflows handle proposal drafts, lead qualification, project status updates, retainer renewals, and the admin tax that eats partner time.",
      "digital-marketing":
        "Agencies sell marketing but rarely market themselves well. We build inbound machines for agencies: SEO + content + LinkedIn + outbound, with the same attribution rigor you'd build for your clients.",
      "ai-agent-development":
        "Agency new-business is repetitive — 80% of inbound briefs need the same qualifying questions. A custom AI agent runs the discovery conversation, scores fit, and books the qualified prospects directly to your partner's calendar.",
    },
    industryFaqs: [
      {
        q: "Won't building our agency site for us feel like outsourcing your own craft?",
        a: "Many of the best-known agencies (Active Theory, Resn, others) commission outside studios for their own sites — because building your own site while running client work always slips, and the result is usually worse than what you ship for clients.",
      },
      {
        q: "Will the build be private — we don't want to share trade secrets in process?",
        a: "Yes — every agency engagement is NDA-covered, and we never publish process artifacts (Figma files, code snippets, decisions) without your written approval. The codebase is yours.",
      },
    ],
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    pluralName: "healthcare and MedTech companies",
    shortLabel: "Healthcare, MedTech, and digital health",
    intro:
      "Healthcare is sold on credibility. Every visitor is making a high-stakes decision — about their health, their patients' health, or millions of dollars of clinical infrastructure. The website carries the credibility burden the way a peer-reviewed paper would in academia.",
    painPoints: [
      "Visitors land, the page feels like a brochure, and they leave to find a competitor with a more authoritative presence.",
      "Compliance copy crowds out the actual value prop, and the page reads like a legal document.",
      "Demo requests come from non-buyers (curious clinicians without budget) instead of decision-makers.",
      "Your clinical proof points (peer-reviewed studies, FDA clearances, hospital partners) are buried instead of leading.",
      "Patients or providers can't tell what you actually do in the first 5 seconds — the page describes the science but not the outcome.",
    ],
    examples: ["Hims & Hers", "Ro", "Tempus"],
    buyerPersona: "Founder, CMO, or marketing lead at a digital health, telehealth, MedTech, or clinical-software company",
    conversionFrame: "Demo request, patient signup, or partnership inquiry",
    industrySignal: "compliance-aware, credibility-driven, conversion-cautious",
    serviceFraming: {
      "webgl-website":
        "Healthcare websites need to feel as serious as the decision they're asking the visitor to make. We build sites with the typographic and motion maturity of Tempus or Ro — design that signals credibility and clears the trust bar before the visitor reads a word.",
      "seo-optimization":
        "Healthcare SEO is YMYL (Your Money or Your Life) — Google's quality bar is the highest in any vertical. We build E-E-A-T-compliant content with named clinician authorship, peer-cited sources, and the schema markup that surfaces in clinical search.",
      "ai-automation":
        "Healthcare operations are documentation-heavy: intake forms, scheduling, follow-up reminders, insurance verification. AI workflows handle the structured pieces with HIPAA-aware data routing — keeping PHI in your authoritative systems.",
      "digital-marketing":
        "Healthcare marketing is constrained — paid platforms restrict ad copy, SEO is YMYL-throttled, and the buyer journey is multi-touch. We build the integrated funnel that respects the constraints and still drives qualified pipeline.",
      "ai-agent-development":
        "Healthcare patient and provider inquiries are repetitive (appointment booking, insurance questions, basic clinical questions) but require care in tone and scope. A custom AI agent handles the routine 70% within the boundaries you set, with full audit logging and human escalation paths.",
    },
    industryFaqs: [
      {
        q: "Can you build with HIPAA, GDPR, or HITRUST in mind?",
        a: "Yes — we build with privacy-by-design patterns: PHI never touches the public website, sensitive flows route to your authoritative systems (Epic, Cerner, custom EHR), and we work with your compliance team on data flow diagrams and BAAs where relevant.",
      },
      {
        q: "Do you have experience with FDA-cleared MedTech, telehealth, or clinical-software brands?",
        a: "Yes — we've built sites for clinical-software, telehealth, and MedTech brands. We treat regulatory copy as a design problem (where it goes, how it's surfaced) rather than a legal afterthought, which keeps the page conversion-strong without compromising disclosure.",
      },
    ],
  },
];

export function getIndustry(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}
