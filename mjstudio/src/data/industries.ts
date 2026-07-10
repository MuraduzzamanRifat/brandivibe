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

import { services } from "./services";

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
      "ai-content-engine":
        "Most SaaS teams start a blog, publish for a month, then let it stall when the sprint gets busy. An always-on engine keeps use-case and comparison content flowing, ranking you for the terms buyers search long before they reach your pricing page.",
      "ai-agent-development":
        "SaaS onboarding is essentially a guided conversation, and much of your support is the same handful of questions asked a hundred ways. An agent that knows your product walks new users to their first 'aha' and answers when your team is offline.",
      "ai-automation-systems":
        "The unglamorous work between signup and paying customer — enriching a new lead, nudging a stalled trial, routing a demo to the right rep — is exactly what should run quietly in the background, so a small team punches well above its headcount.",
      "motion-graphics":
        "Software is invisible, which is why a good explainer earns its keep — a few seconds of motion can make an abstract tool click in a way a wall of feature copy never could.",
      "graphic-design":
        "When a rival's Series B site makes them look like the category leader, a scattered visual identity gives the game away. Consistent design across your site, deck, and app is what makes a young SaaS read as the safe, serious choice.",
      "ui-ux-design":
        "In SaaS the product and the marketing site make the same promise — if the interface fights the user, activation drops before value ever lands. Research-led design makes the right path the obvious one, from signup through first success.",
      "video-production":
        "A prospect will watch a short product tour before they'll book a demo they're unsure about. Well-made video lets people see the software working and feel the outcome, lowering the commitment it takes to say yes.",
      "social-media-content":
        "SaaS buyers lurk long before they sign up — following founders, saving posts, watching how you think. A steady stream of content keeps you in their feed, so when the need finally lands you're the name they already trust.",
      "content-writing":
        "The fastest way to lose a SaaS visitor is a homepage that lists features instead of the outcome they came for. Copy that names the problem in their words, then shows the payoff, turns a passing glance into a signup.",
      "content-distribution":
        "Most SaaS teams pour effort into a launch post or a solid guide, send it once, and move on. Deliberate distribution puts each piece in front of the communities, feeds, and inboxes where your buyers actually gather.",
      "online-reputation-management":
        "Before a SaaS buyer trials you, they check G2, Reddit, and what the last team said. Steadily earning honest reviews and shaping what surfaces there means the research phase works for you instead of quietly disqualifying you.",
      "social-media-management":
        "A dormant company account reads as a dormant company — and in a fast-moving category, that's a quiet red flag to careful buyers. We keep your channels active and responsive so a live product looks like one, without eating your team's week.",
      "youtube-ads":
        "SaaS demand is won long before the search — a buyer has to know the category exists and know you're in it. YouTube puts a memorable product story in front of the exact people who'll be shopping for it soon.",
      "linkedin-ads":
        "For sales-led SaaS, the whole game is reaching the few job titles who actually sign. LinkedIn lets us target by role, company, and seniority, so budget goes to real buyers instead of the curious tourists that clog your pipeline.",
      "facebook-ads":
        "Meta is where you catch SaaS buyers off the clock — and where retargeting keeps you in front of the trial that stalled. We build campaigns that turn idle scrolling into signups and bring warm visitors back before they forget you.",
      "seo-audit":
        "When organic signups plateau, the cause is usually buried — thin comparison pages, a blog with no structure, technical debt Google quietly penalises. A proper audit hands you the plain-English list of what's actually holding your rankings back.",
      "guest-posts":
        "SaaS category terms are fiercely contested, and content alone won't outrank an incumbent — search engines want to see trusted sites vouch for you. Genuine links from relevant publications build the authority those rankings quietly require.",
      "google-business-profile":
        "Most SaaS lives online, but you're still a real company someone will look up — and a complete, claimed Google My Business (GMB) profile returns a credible business rather than an empty box. It's a small trust signal that reassures cautious buyers.",
      "app-store-optimization":
        "If your SaaS ships a mobile app, the store listing is a discovery channel your website can't reach — people searching the category right inside the App Store. Tuning that listing turns those searches into installs that feed your activation funnel.",
      "ecommerce-seo":
        "If your SaaS sells through a marketplace of templates, plugins, or add-ons, those listing pages are shopfronts that rise or fall on search. We help each one rank for the specific need it solves, so shoppers arrive ready to buy.",
      "local-seo":
        "Pure SaaS rarely needs foot traffic, but if you sell into a specific region or run a local sales presence, ranking for '[category] software [city]' captures buyers who trust a provider that feels close to home.",
      "seo-services":
        "For SaaS, organic search is the channel that keeps paying after you stop spending — the opposite of ad CAC that climbs every month. Steady SEO compounds rankings for the buyer-intent terms your rivals are renting by the click.",
      "mobile-app":
        "Plenty of SaaS earns its stickiness on mobile — the quick check, the on-the-go approval, the notification that pulls a user back in. A well-built companion app turns your product into something people reach for daily, not only at their desk.",
      "project-management":
        "Sales-led SaaS often runs customer onboarding as a project — implementation steps, stakeholders, go-live dates — buried in spreadsheets that hide the risk. Software shaped to your onboarding flow keeps every rollout on track so new accounts reach value instead of stalling.",
      "payroll-management":
        "A SaaS team that hires fast — contractors, remote staff, people across borders — quickly outgrows basic payroll, and the month-end scramble gets risky. Software built around your actual pay structure gets everyone paid right and on time.",
      "hr-management":
        "Headcount is usually a SaaS company's biggest cost and its fastest-changing part — onboarding, leave, and records sprawl across scattered docs the moment you grow. HR software that fits how you actually run keeps all of it in one calm place as you scale.",
      "accounting-finance":
        "SaaS finance has its own quirks — recurring revenue, deferred billing, churn and expansion that generic ledgers handle clumsily. Software tuned to a subscription model gives founders a clear, current read on the numbers investors ask about next.",
      "ecommerce-platform":
        "Self-serve SaaS hinges on the checkout — plans, seats, upgrades, and add-ons a buyer should purchase without emailing sales. A platform built for that flow makes buying as frictionless as the product you're selling.",
      "erp":
        "As a SaaS scales, the seams show — billing in one tool, provisioning in another, finance reconciling by hand. Connecting those operations into one system means a new signup, its entitlements, and its invoicing stop living on separate islands.",
      "crm":
        "Hybrid SaaS sells in two motions at once — self-serve trials and sales-led deals — and off-the-shelf CRMs rarely model both cleanly. A CRM that mirrors how your team really works keeps product signals and pipeline in one view so no warm account slips.",
      "website-speed-optimization":
        "At the top of a SaaS funnel, every slow second is a signup you never see — visitors judge the product by the site and bounce before the hero even paints. Tightening load speed protects the conversions your ad spend already paid to earn.",
      "website-maintenance":
        "A SaaS site is never finished — new features, pricing changes, launch pages, and a changelog that keeps moving. Steady maintenance keeps all of it fast, secure, and current, so the marketing site never lags behind the product it sells.",
      "webgl-3d-experiences":
        "Every SaaS site borrows the same hero, logo strip, and pricing grid, so buyers treat them as interchangeable. An interactive 3D experience makes a visitor stop, feel the craft, and read you as the next-generation player before they've compared a single feature.",
      "ecommerce-website":
        "If your SaaS ships hardware, a companion device, or branded kit, that store is a buying experience in its own right. A storefront built for trust and effortless checkout makes the physical side of your product feel as considered as the software.",
      "website-development":
        "Your marketing site is the top of every SaaS funnel, and a template hands you the same hero as every rival. A custom build around your own funnel makes value land in three seconds and the next step — trial or demo — the obvious one.",
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
      "ai-content-engine":
        "Shoppers research before they buy — comparison guides, how-to-choose posts, material and care articles. An always-on engine keeps that library growing, so you capture demand at every stage without a weekly content scramble.",
      "ai-agent-development":
        "Most of your inbox is the same handful of questions — where's my order, will this fit, can I return it. An agent that answers them instantly in your brand voice recovers sales that would otherwise stall at the cart.",
      "ai-automation-systems":
        "Order tags, inventory syncs, supplier chasing, review requests — the operational tax grows with every order you ship. Automating the repetitive pieces lets you scale volume without scaling the team you'd hire to keep up.",
      "motion-graphics":
        "A product in motion sells harder than a still — fabric moving, a mechanism working, a before-and-after. Short animated moments give your ads and product pages the thing that makes a scrolling thumb stop.",
      "graphic-design":
        "When your ad, your site, and your unboxing all look like one brand, shoppers trust you over the lookalike undercutting you on Amazon. Consistent design is what separates a brand from a listing.",
      "ui-ux-design":
        "Every extra tap between product and paid is somewhere buyers leak out, especially on mobile. We design the browse-to-checkout path so the next step is always obvious and the friction that quietly kills conversion just isn't there.",
      "video-production":
        "Shoppers who can't hold the product decide from what they can see. Well-made product and brand video shows how it works, how it feels, and why it's worth the price — answering the doubts a photo leaves open.",
      "social-media-content":
        "DTC discovery happens in the feed now, and a quiet account reads as a quiet brand. A steady stream of on-brand posts and reels keeps you in front of buyers between purchases and feeds your ad account with creative that already performs.",
      "content-writing":
        "Product copy finishes the selling your photos start — the detail that answers a hesitation, the line that makes someone want it. We write descriptions and pages that move browsers toward add-to-cart, not just fill the field.",
      "content-distribution":
        "You've already made the lookbook, the guide, the launch video — and most of it gets seen once, then forgotten. We push each piece across the channels your shoppers actually use, so the work you paid for keeps earning reach.",
      "online-reputation-management":
        "Shoppers read reviews before they trust you with a card, and a thin or shaky rating stalls the sale without a word. We help you earn more genuine reviews and handle the hard ones with care, so what buyers find reassures them.",
      "social-media-management":
        "Buyers land on your profile and scan the comments before they trust a new brand with a card, and questions left hanging cost you the sale. We run your channels end to end — planning, posting, and replying — so social stays active and actually answers people.",
      "youtube-ads":
        "YouTube is where you can actually show a product working before you ask for the sale — the demo, the testimonial, the story. We build campaigns that reach the right viewers with real proof and send warmed-up shoppers back to your store.",
      "linkedin-ads":
        "If you sell wholesale, into offices, or a considered product a professional signs off on, LinkedIn reaches the exact roles and companies that place bigger, repeat orders — the accounts worth far more than a single consumer sale.",
      "facebook-ads":
        "Meta still creates most DTC demand, but rising CPMs punish weak creative and loose targeting. We build campaigns that find your best customers and pair them with a landing experience that actually converts the click you paid for.",
      "seo-audit":
        "Big catalogs hide big SEO problems — duplicate product pages, thin collections, crawl budget wasted on filters. A thorough audit shows exactly what's holding your rankings back and which fixes will bring shoppers, all in plain English.",
      "guest-posts":
        "Search engines rank stores they trust, and trust is built partly by real sites linking to you. We earn genuine features and links from relevant publications, so your product and category pages climb past rivals with thinner backing.",
      "google-business-profile":
        "If you run a showroom, a flagship, or local pickup, a polished Google My Business (GMB) profile turns nearby searches into store visits and orders — the local demand a purely online presence never captures.",
      "app-store-optimization":
        "If you've invested in a shopping app, installs are where its returns begin — and most apps sit buried in search. We tune your App Store and Google Play listing so the shoppers already looking for what you sell find and download it.",
      "ecommerce-seo":
        "Paid traffic keeps getting pricier; a page that ranks doesn't. We build the product and category-page SEO that brings ready-to-buy shoppers straight to you, so a growing share of your sales stops depending on ad spend.",
      "local-seo":
        "Plenty of online shoppers still search 'near me' when they want something today or want to see it first. If you have any physical presence, ranking in local results and maps captures buyers your national SEO quietly misses.",
      "seo-services":
        "Durable DTC growth needs a traffic source you don't rent from Meta and Google. Ongoing SEO builds that compounding organic channel — content, authority, and technical health together — so your reach keeps growing even when you pause ad spend.",
      "mobile-app":
        "Your best repeat customers shouldn't have to re-find you in a browser every time. A well-made shopping app gives them one-tap reordering, push notifications, and a faster checkout — turning occasional buyers into a loyal, higher-value base.",
      "project-management":
        "A launch or seasonal drop touches buying, creative, ads, and fulfilment at once, and things slip in the handoffs. Custom project software keeps every drop on schedule, so nothing lands late or half-ready.",
      "payroll-management":
        "DTC teams scale up with seasonal and warehouse staff, and payroll turns messy fast — variable hours, overtime, contractors. Software built around how you actually staff gets everyone paid right and on time, without the month-end scramble.",
      "hr-management":
        "Every hire brings paperwork — contracts, onboarding, leave, reviews — and in a fast-growing brand it stacks up faster than anyone plans for. HR software keeps it all in one tidy place, so people management never becomes the thing slowing you down.",
      "accounting-finance":
        "E-commerce margin lives in the details — COGS, shipping, returns, ad spend, platform fees across every channel. Finance software that pulls it together shows what each order truly earns, not just what it rang up at checkout.",
      "ecommerce-platform":
        "When your catalog, promotions, or fulfilment logic outgrow what an off-the-shelf platform allows, you spend your days fighting the tool. A platform built around how you actually sell lifts that ceiling and makes the day-to-day genuinely easy to run.",
      "erp":
        "As orders and SKUs multiply, stock, purchasing, and finance drift into separate spreadsheets that never quite agree. A custom ERP connects them into one source of truth, so you can trust your inventory numbers and stop reconciling by hand.",
      "crm":
        "The money in DTC is in the second and third order, and that lives in customer history most stores never organise. A CRM built around how you sell keeps segments, purchase history, and lifetime value ready to act on, so retention isn't guesswork.",
      "website-speed-optimization":
        "On mobile, where most of your traffic and the widest conversion gap sit, every extra second of load costs you carts. We find what's dragging your store down and fix it, so pages snap open and shoppers stay long enough to buy.",
      "website-maintenance":
        "A store that breaks mid-sale, or a checkout bug you spot days too late, costs real orders. Proactive maintenance keeps your apps, theme, and checkout healthy and secure, so the site is never the reason a sale didn't happen.",
      "webgl-3d-experiences":
        "Shoppers can't pick your product up, so let them turn it, open it, and see it from every angle. Interactive 3D on the product page gives buyers a confidence flat photos can't, and sets you apart from every generic storefront.",
      "ecommerce-website":
        "Your storefront is where the sale is won or lost, and a generic theme makes premium products look interchangeable. We build stores that show your products at their best, earn trust fast, and make checkout smooth enough that buyers actually finish.",
      "website-development":
        "Beyond the store itself, launches and campaigns need landing pages that load fast and point at one clear action. We build those from scratch, tuned to a single next step, so the traffic you pay for lands somewhere built to sell.",
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
      "ai-content-engine":
        "Buyers research a neighbourhood for months before they ever ring an agent, and the firm whose market updates and area guides keep turning up in that research becomes the trusted local voice — the engine keeps that library growing without pulling you off listings.",
      "ai-agent-development":
        "Buyers browse listings late at night and expect an answer before the interest cools; an agent that qualifies the enquiry, answers neighbourhood questions, and books a showing after hours means you wake up to a booked diary instead of a cold lead.",
      "ai-automation-systems":
        "Most deals slip in the follow-up gap, not the first call — automations that route new enquiries, trigger the nurture sequence, and keep listings synced across portals make sure nobody falls through while you're out at a viewing.",
      "motion-graphics":
        "A property sells on how it makes someone feel, and a few seconds of well-crafted motion — a listing reveal, a neighbourhood flythrough — carries that feeling as people scroll far better than a static photo grid ever will.",
      "graphic-design":
        "Your brand lands on the yard sign, the brochure and the listing sheet all at once, and when those look like they belong to a luxury house rather than a stock template, sellers trust you with the higher-value instructions.",
      "ui-ux-design":
        "A buyer scanning listings decides in seconds whether to keep going, so the search, gallery and map have to feel effortless — and the enquiry form should appear only once the page has earned enough trust for someone to fill it in.",
      "video-production":
        "Nothing sells a high-end home like seeing it move — light through the windows, the flow from room to room — and a properly shot tour film does the walkthrough for out-of-town and overseas buyers who'll never make the first viewing in person.",
      "social-media-content":
        "Sellers pick the agent whose feed already looks busy and credible, so a steady run of new listings, just-solds and local snapshots quietly proves you're the active name in the area long before anyone picks up the phone.",
      "content-writing":
        "A listing description that captures the light in a room and the life of a street does far more than count bedrooms, and copy that reads like a knowledgeable local — not an MLS export — is what turns a browse into an enquiry.",
      "content-distribution":
        "A beautiful listing film or neighbourhood guide is wasted if only your existing followers ever see it; getting it in front of the buyers actively looking in that postcode is what turns a nice piece of content into booked viewings.",
      "online-reputation-management":
        "A seller deciding who to trust with the biggest asset they own will Google your name first, and a steady flow of genuine reviews — with the occasional hard one handled gracefully — often settles the instruction before you've even met.",
      "social-media-management":
        "Agents are out at viewings exactly when the good posting windows hit, so having your channels planned and posted for you keeps the presence sellers judge you by alive and consistent even in the weeks you never touch it.",
      "youtube-ads":
        "A new development or a standout listing deserves to reach people actually thinking about moving, and video placed around local and lifestyle viewing puts the property in front of them while the emotion of a good tour does the persuading.",
      "linkedin-ads":
        "Commercial deals and investor relationships turn on reaching the right principals — fund managers, corporate property heads, relocation leads — and LinkedIn is where you put your offering in front of those exact titles rather than hoping they stumble on you.",
      "facebook-ads":
        "Most people browsing homes aren't searching yet — they're scrolling — so Meta lets you put the right listing in front of the right neighbourhood and retarget the ones who lingered, turning idle interest into a booked viewing.",
      "seo-audit":
        "If the big portals are outranking you for your own patch, an audit shows exactly why — the slow listing pages, the thin neighbourhood content, the technical gaps — and hands you a plain plan to win back searches that should already be yours.",
      "guest-posts":
        "Search engines trust local authority, and genuine features in area publications, lifestyle titles and partner sites tell Google your firm is a real fixture in the market — which is what lifts you past the template broker for competitive local searches.",
      "google-business-profile":
        "When someone searches for an estate agent in your town, the Google My Business (GMB) listings in the map pack get the calls, so a fully built-out profile with current photos and real reviews often decides who they walk in to before a website is even opened.",
      "app-store-optimization":
        "If you've invested in a property-search app, buyers only find it when it surfaces for the searches they actually type, and tuning the listing so it ranks and reads as trustworthy is the difference between installs that stick and an app nobody discovers.",
      "ecommerce-seo":
        "Your listing and development pages are the products buyers search for, and treating them with the same ranking discipline an online store gives its bestsellers — clean structure, rich detail, fast loads — is what pushes them above the portals for high-intent searches.",
      "local-seo":
        "Property is won on the ground — 'family homes in the village', 'flats near the station' — so local SEO puts your firm in the map results and area searches where buyers with a postcode in mind are already looking, not the generic national terms the portals own.",
      "seo-services":
        "The big portals spend heavily to own search, but they can't out-local a firm that patiently builds neighbourhood pages, guides and authority — a steady SEO programme slowly turns organic search from their traffic source into yours.",
      "mobile-app":
        "Serious buyers check for new homes constantly, and an app that pushes an alert the moment something matching their search lists — with saved favourites and one-tap showing requests — keeps them inside your world instead of drifting back to the portals.",
      "project-management":
        "A development or a busy sales pipeline carries dozens of moving deadlines — staging, photography, launch, offers, completion — and software built around how your team actually runs a listing keeps every party clear on what's due next without the endless chasing.",
      "payroll-management":
        "Agent pay is rarely a flat salary — it's commission splits, tiers and deal-by-deal deductions — and payroll built for that reality gets everyone paid correctly and on time, so the maths behind a closed deal never turns into a monthly argument.",
      "hr-management":
        "Brokerages run on a rotating roster of agents, licences and contractors, and HR software that keeps records, renewals and onboarding in one place means a new agent is productive on day one instead of buried in paperwork.",
      "accounting-finance":
        "Between client deposits held in trust, referral fees and commissions split across a deal, real estate books tangle fast — finance software built to track it cleanly gives you an honest, current view of what's genuinely earned versus what's merely under offer.",
      "ecommerce-platform":
        "The moment you take money online — a reservation deposit, an off-plan instalment, a booking fee — the checkout and everything behind it has to just work, and a platform built for that lets buyers pay with confidence while you run the back office without a fight.",
      "erp":
        "A developer juggling inventory, sales, contractors and finance across spreadsheets loses the thread fast; one connected system that ties unit availability to sales to cash flow means everyone's working from the same truth instead of last week's export.",
      "crm":
        "Real estate has a long memory — the buyer who wasn't ready last year is this year's completion — and a CRM shaped around your pipeline keeps every lead, viewing and preference to hand so the right follow-up lands at the right moment.",
      "website-speed-optimization":
        "Your listings live and die on image-heavy galleries, and when those crawl on mobile the visitor is gone before the first photo even paints — tightening load times means buyers see the property instead of a spinner, and stay long enough to enquire.",
      "website-maintenance":
        "Listings, prices and status change by the day, and a site left to drift starts showing sold homes and broken galleries that quietly cost you trust — steady upkeep keeps the feed accurate and the site fast so it always reflects what's really available.",
      "webgl-3d-experiences":
        "A multi-million-pound home shown in the same flat gallery as a starter flat undersells it; an immersive 3D walkthrough lets a buyer move through the space and feel the scale, which is how premium developers justify premium pricing before a single viewing.",
      "ecommerce-website":
        "If part of your business sells online — furnishing packages, staging add-ons, fractional investment shares — those buyers are spending real money on trust alone, so the storefront has to feel as considered and secure as the properties beside it, or the doubt shows before checkout.",
      "website-development":
        "Buyers can't tell you from the broker down the street when you share the same template, so a site built from scratch around your inventory and your market — fast, premium, the enquiry always in reach — is what makes you look like the firm worth calling.",
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
      "ai-content-engine":
        "Guests search destination guides and seasonal experiences long before they look at rooms, and a steady stream of local, on-brand articles catches them at the dreaming stage and pulls them toward a direct booking rather than an OTA.",
      "ai-agent-development":
        "Guests ask about availability, dietary options, and check-in times at midnight from another time zone, and an agent in your brand voice answers instantly and hands booking-ready guests to your team instead of letting a ready booking slip away overnight.",
      "ai-automation-systems":
        "The gap between a good stay and a memorable one is often the pre-arrival note and the post-visit thank-you, and automations trigger those touchpoints on time every time, so a small team can deliver personal service at scale.",
      "motion-graphics":
        "A still photo can't carry the feeling of candlelight or a coastline at golden hour, and short motion pieces let a hotel or restaurant show the mood of the experience in the split second a scroller decides whether to keep watching.",
      "graphic-design":
        "A guest meets your brand across menus, signage, key cards, and welcome notes, and each touchpoint either deepens the story or breaks it; consistent design makes the whole stay feel considered rather than assembled.",
      "ui-ux-design":
        "Most bookings are lost not on price but on friction — a fiddly date picker, a hidden rate, one form field too many. We design a booking path so clear that guests finish it on their phone instead of bouncing to an app that just works better.",
      "video-production":
        "Nobody books a room from a spec sheet; they book the feeling of arriving. A well-made film of the property, the plates, and the small rituals sells that feeling in a way photos and copy never quite reach.",
      "social-media-content":
        "Travellers and diners do much of their trip planning on Instagram and TikTok, saving places long before they book, and a steady feed of atmosphere, dishes, and behind-the-scenes moments keeps you in that consideration set until the dates land.",
      "content-writing":
        "Your homepage shouldn't read like a rate card; it should read like the reason someone books you over the place next door. We write the property and menu story so it carries the emotion that actually drives a reservation.",
      "content-distribution":
        "A beautiful property film or chef feature only earns its cost if the right travellers actually see it, so we place your best pieces across the channels and communities where people plan trips and choose where to eat.",
      "online-reputation-management":
        "In hospitality a review score is the booking decision — guests filter you out below a certain rating before they ever reach your site. We build the habit of asking happy guests at the right moment and answering the rest with care future readers notice.",
      "social-media-management":
        "A dormant Instagram reads like a closed kitchen — travellers checking your grid want recent, lively proof the experience is still going strong — so we keep the channels current and on-voice, and the last post never looks like last season.",
      "youtube-ads":
        "YouTube lets you put the actual experience — the suite, the tasting menu, the view — in front of people already dreaming about a getaway or a special night out, then follow up with the ones who leaned in toward a direct booking.",
      "linkedin-ads":
        "The highest-value hospitality bookings often aren't individual guests but the planners filling your calendar with offsites, conferences, and corporate events, and LinkedIn puts your venue in front of the exact event leads and executive assistants who book them.",
      "facebook-ads":
        "Meta is where a lazy scroll turns into 'let's book that weekend' — its targeting reaches people by location, life event, and travel intent, and its visual formats suit a property or restaurant that sells on how it looks and feels.",
      "seo-audit":
        "OTAs outrank your own site for your own property name because their technical SEO is relentless and yours has gaps; an audit shows exactly which fixes let guests searching for you land on your booking page instead of Booking.com's.",
      "guest-posts":
        "Getting featured in the travel guides, city lists, and food blogs your guests already read does two jobs at once — it sends real booking-minded readers and it tells search engines your property deserves to rank above the aggregators.",
      "google-business-profile":
        "'Restaurants near me' and the map pack decide a huge share of same-day bookings and walk-ins, and a fully built-out Google profile with current photos, menus, and hours is often the very first impression a nearby guest gets of you.",
      "app-store-optimization":
        "If you've built a loyalty or booking app to escape aggregator fees, it only pays back when guests can actually find it; we tune the listing so people searching your name or category install yours instead of the big travel app's.",
      "ecommerce-seo":
        "Gift vouchers, experience packages, and signature retail are high-margin revenue that many venues bury out of sight, and e-commerce SEO gets those pages ranking so people searching for a gift or a getaway find yours ready to buy.",
      "local-seo":
        "Hospitality is won or lost locally — the guest typing 'boutique hotel [city]' or 'brunch near me' is ready to book today — so we make sure you own that local search moment instead of ceding it to the OTA or the chain.",
      "seo-services":
        "Every booking that starts on a search engine and ends on an OTA is margin you paid to rent, and steady SEO builds the organic visibility that brings those guests to your own site first, where the booking costs you nothing to acquire.",
      "mobile-app":
        "A guest app turns a one-time stay into a relationship — mobile check-in, room service, table booking, and a loyalty balance in one place — and every repeat booking it drives is one you never pay an OTA commission on.",
      "project-management":
        "Opening a new site, running a renovation, or coordinating a big event pulls in kitchen, front-of-house, contractors, and suppliers at once, and software that shows who owns what and what's due keeps the launch date from quietly slipping.",
      "payroll-management":
        "Hospitality payroll is genuinely hard — split shifts, tips, overtime, and constant turnover — and getting it wrong erodes the trust of staff you're already working hard to hold onto, so custom payroll handles the variable-hours reality and makes payday just work.",
      "hr-management":
        "Hospitality lives with churn and seasonal hiring that would overwhelm a spreadsheet, and HR software that keeps records, rotas, and onboarding organised means every new starter is productive sooner and nothing about compliance slips through the cracks.",
      "accounting-finance":
        "Hospitality margins are thin enough that a small slip in food cost or an unnoticed supplier creep decides the month, and finance software that keeps the numbers current gives you the clear, real-time picture those decisions actually need.",
      "ecommerce-platform":
        "Gift cards, event tickets, and packaged experiences are yours to sell directly, and a purpose-built platform lets you take those payments on your own terms rather than wedging them into a tool built for shipping boxes.",
      "erp":
        "As a group grows past one site, stock, purchasing, suppliers, and finance start living in disconnected tools that never quite agree, and a connected system built around how you actually operate gives every location one honest version of the numbers.",
      "crm":
        "A returning guest who told you their anniversary date and wine preference should never feel like a stranger on the next visit, and a CRM built around your guest history turns those details into the repeat bookings and referrals OTAs can't touch.",
      "website-speed-optimization":
        "The very photos that sell your property are what drag your pages down, and a guest on hotel wifi or a phone won't wait for a hero image to decode; we keep the imagery cinematic while making the page load before impatience wins.",
      "website-maintenance":
        "Rates, menus, opening hours, and seasonal offers change constantly, and a booking engine that goes down during a demand spike costs you real reservations; steady maintenance keeps everything current and the booking flow always open for business.",
      "webgl-3d-experiences":
        "The closest a website can get to the feeling of walking in is an immersive, moving experience — a 3D room tour or a scene that breathes as you scroll — and that atmosphere is exactly what shifts a guest from third-party browsing to booking direct.",
      "ecommerce-website":
        "When you sell stays, experiences, gift vouchers, or a signature product line, the store has to feel as trustworthy and effortless as the hospitality itself, because a checkout that fumbles a gift purchase quietly hands the sale, and the goodwill, elsewhere.",
      "website-development":
        "Your website is the deciding moment between 'let's just book through the app' and 'let's book direct'; built from scratch around your story and a frictionless booking path, it earns the direct reservation a stock template keeps giving away.",
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
      "ai-content-engine":
        "FinTech buyers research for weeks and increasingly ask an AI assistant which provider is safe before they ever reach you. A steady flow of accurate, expert articles is how you become the name those answers point to, with a person checking every claim before it goes live.",
      "ai-agent-development":
        "FinTech support is mostly the same account, transaction, and reset questions, but every answer has to be right and logged. An agent that handles the routine with a full audit trail and hands sensitive cases to a person keeps response times low without cutting a compliance corner.",
      "ai-automation-systems":
        "So much of FinTech operations is structured and repetitive: onboarding checks, reconciliations, recurring reports. But regulation means a human has to stay in the loop at the right moments. We automate the predictable pieces and leave the judgment calls exactly where they belong.",
      "motion-graphics":
        "FinTech products are often invisible, money moving between systems nobody sees. Motion makes the abstract concrete: a short, clean explainer that shows how your product actually works builds more confidence in a cautious visitor than a full page of feature copy ever could.",
      "graphic-design":
        "When visitors judge whether you're safe by how put-together you look, a consistent identity across every touchpoint reads as maturity. Scattered, sloppy design whispers early and risky; a coherent brand kit says this is a real company you can trust with your money.",
      "ui-ux-design":
        "In FinTech the interface is the product, and a confusing signup or a clumsy KYC step reads as a red flag right when trust matters most. We design flows where the safe, correct path is the obvious one, so people finish onboarding instead of quietly backing out.",
      "video-production":
        "Nothing answers the silent 'who's actually behind this?' like seeing the real people and the real product. A well-made founder story or product walkthrough gives cautious prospects a reason to believe before they commit their money, in a way that written copy alone never quite manages.",
      "social-media-content":
        "A cautious FinTech buyer will follow you quietly for weeks, and what they see tells them whether you really know your space. A steady stream of clear, credible posts explaining how you handle money and risk turns that quiet watching into confidence by the time they're ready to sign up.",
      "content-writing":
        "FinTech copy usually swings between hype and legalese, and buyers trust neither. We write the plain, honest middle: pages that explain what you do, name the real worries about security and regulatory standing, and answer them in language a careful person actually believes.",
      "content-distribution":
        "Great FinTech content that nobody sees does nothing for a brand still building its name. We push each piece through the channels where your buyers and the people they trust already gather, so your best explainers earn real reach and third-party credibility instead of sitting on a blog.",
      "online-reputation-management":
        "In FinTech, one prominent complaint about a frozen account or a security scare can end a signup before it starts. We help you earn steady, genuine goodwill and make sure the first thing people find reflects a trustworthy company, not an unanswered horror story.",
      "social-media-management":
        "A FinTech brand that posts once a quarter looks like one that might vanish with your balance. We keep your channels consistently active in a careful, on-brand voice and handle public questions thoughtfully, because how you answer worries in the open is itself a trust signal.",
      "youtube-ads":
        "FinTech is a considered purchase, so the point of a YouTube campaign isn't an instant signup, it's to be the trusted name a viewer remembers when they finally start looking. We build video that explains your value clearly and earns recall, not just a cheap view.",
      "linkedin-ads":
        "B2B FinTech sells to finance, operations, and compliance leaders who ignore broad advertising. LinkedIn lets us reach those exact titles at the companies you want, with messaging that speaks to their real question: will this be secure, compliant, and worth the switch.",
      "facebook-ads":
        "Consumer FinTech lives and dies on acquisition cost, and cheap clicks from people who'll never trust you with money are worse than none. We build Meta creative that pre-qualifies on trust and intent, so the people who click are the ones genuinely open to switching.",
      "seo-audit":
        "FinTech search is graded on a stricter curve, because Google holds anything touching people's money to its highest bar. An audit shows exactly where your site falls short of that standard, from thin trust signals to technical gaps, so you fix what's actually holding rankings back.",
      "guest-posts":
        "In FinTech, who vouches for you matters as much as what you say. Genuine features and links from respected finance and tech publications tell both Google and cautious buyers that credible sites take you seriously, the kind of third-party proof you can't manufacture on your own pages.",
      "google-business-profile":
        "Most FinTech lives online, but if you have a walk-in branch or a currency-exchange desk, people look you up on Google before trusting you in person. A complete, credible profile with real hours, photos, and reviews shows there's a genuine, staffed business behind the brand.",
      "app-store-optimization":
        "For a FinTech app, the store listing is a trust checkpoint, because people read the ratings and reviews before they'll hand over their bank details. We tune your listing to rank for the right searches and lead with the proof and clarity that turn a cautious browser into an install.",
      "ecommerce-seo":
        "If your FinTech sells anything with a cart, a card, a device, or a marketplace of financial products, those product and category pages are where buyers decide. We help them rank for the specific, high-intent searches shoppers actually use, so ready-to-buy visitors land on the page that answers them.",
      "local-seo":
        "When a FinTech serves a set area — advisers, a lending office, branch appointments — nearby customers search before they'll trust anyone with their money. We help you surface in the map pack and local results for those searches, so the credible option they find close by is you.",
      "seo-services":
        "FinTech rankings are earned slowly, because Google trusts money-related sites only once they've proven real expertise. We run the patient, honest program of technical health, authority content, and credible links that compounds into organic traffic long after ad budgets stop paying out.",
      "mobile-app":
        "For most FinTechs the app is the whole relationship, where people check balances, move money, and decide whether to trust you. We build apps that feel fast, secure, and genuinely reliable, because in finance a single slow or glitchy moment can be enough to lose the account.",
      "project-management":
        "FinTech teams juggle product, compliance, and engineering work that all has to line up, and a missed review or dropped handoff carries real regulatory weight. We build project tools shaped around how your team actually works, so who owns what and what's due next is never in question.",
      "payroll-management":
        "FinTech teams often span contractors, multiple entities, and equity-heavy packages that off-the-shelf payroll handles clumsily. We build payroll tooling that fits your real structure, so calculations, deductions, and payslips stay accurate and on time, and hold up to the scrutiny a finance company invites.",
      "hr-management":
        "Finance companies hire under extra scrutiny, with background checks, certifications, and records that have to be right. We build HR tooling that keeps onboarding, leave, and people data organised and audit-ready, so a fast-scaling FinTech team stays compliant without burying the founders in admin.",
      "accounting-finance":
        "Nobody is held to a higher standard on their own numbers than a FinTech. We build accounting and finance tooling that automates reconciliation and gives you a clear, current view of the money, because when finance is your product, sloppy internal books aren't a risk you can afford.",
      "ecommerce-platform":
        "If commerce is part of your FinTech, selling cards, devices, or plans at scale, you need a store you can actually run day to day rather than fight. We build a bespoke platform tuned for a smooth, secure checkout and simple management, so growing the range never becomes the bottleneck.",
      "erp":
        "As a FinTech adds products, entities, and partners, the operational data scatters across tools that don't talk to each other. We build an ERP that connects finance, operations, and people into one reliable system, so reporting is trustworthy and nothing important lives in a spreadsheet nobody owns.",
      "crm":
        "B2B FinTech deals are long and trust-heavy, with compliance reviews and several stakeholders before anyone signs. We build a CRM shaped around that real sales motion, so every conversation, objection, and follow-up is captured and nothing stalls a deal you've spent months earning.",
      "website-speed-optimization":
        "A sluggish site quietly undermines a FinTech: if the page struggles to load, visitors assume the product behind it will too. We find what's dragging your site down and fix it, so the first thing people feel is fast and solid, the way anything handling their money should be.",
      "website-maintenance":
        "In FinTech, an outdated or broken site doesn't just look untidy, it reads as 'do they even watch their own security?' We keep your site patched, monitored, and current, so it stays fast and safe and never sends the accidental signal that you've stopped paying attention.",
      "webgl-3d-experiences":
        "FinTech buyers judge safety by polish, and most category sites look identical. A tasteful, interactive 3D moment, used to make an abstract product tangible rather than for show, signals the design maturity of a Mercury or Ramp and closes the trust gap before a word is read.",
      "ecommerce-website":
        "When a FinTech sells a physical product like a card or a device, the store is where a cautious buyer decides you're legitimate. We build a storefront that makes browsing a pleasure and every trust cue obvious, so handing over payment details feels as safe as the product promises.",
      "website-development":
        "Your marketing site is where a stranger decides whether to trust you with their money, and a templated build quietly says 'not yet.' We craft a fast, premium site from scratch that answers the real questions about security and standing and makes signing up the obvious next step.",
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
      "ai-content-engine":
        "In crypto, narratives turn over weekly and a project that goes quiet starts to look abandoned. A steady flow of explainers and updates, checked before they publish, keeps your site current with the market and gives newcomers something to read besides the whitepaper.",
      "ai-agent-development":
        "Your community asks the same wallet, transaction, and contract questions around the clock and across every channel. An agent that answers them accurately, with current chain context, keeps holders calm and frees your core team for shipping and governance.",
      "ai-automation-systems":
        "Between allowlist checks, governance reminders, and cross-posting the same announcement to Discord, Telegram, and X, the busywork never stops. Automations handle the structured pieces on schedule, so your team spends its hours on the protocol, not the admin.",
      "motion-graphics":
        "Most people will never open your whitepaper, but they'll watch a thirty-second explainer. Motion turns staking, bridging, and tokenomics into something a newcomer actually understands, and something that stands out as they scroll a crowded feed.",
      "graphic-design":
        "In crypto, a scrappy or inconsistent look reads as a warning sign before anyone hears the pitch. A coherent identity across your site, socials, and exchange listings signals a project that's built to last, not another anon launch.",
      "ui-ux-design":
        "The gap between a curious visitor and a connected wallet is where most Web3 projects quietly lose people. Interface design that makes connecting, minting, or staking feel obvious removes the friction that's costing you conversions you never see.",
      "video-production":
        "A good video does the trust-building a whitepaper can't. Whether it's a launch film or a founder talking through the vision, seeing real faces and a clear story counters the anonymity that makes crypto buyers hesitate.",
      "social-media-content":
        "Crypto moves on memes, screenshots, and momentum, and generic corporate posts get scrolled straight past. Content made in the native voice of the space — sharp graphics, clips, and threads people actually reshare — is what earns you a place on the timeline.",
      "content-writing":
        "Your tokenomics and tech are the real substance, but dense jargon buries them. Writing that explains what you're building in plain language, without dumbing it down, lets serious buyers grasp the value the whitepaper hides.",
      "content-distribution":
        "You can write a sharp thread or explainer and still watch it die in a quiet timeline. Getting each piece in front of the right communities, aggregators, and crypto-native channels turns work you've already done into reach that grows your holder base.",
      "online-reputation-management":
        "In crypto, one 'rug' accusation or a wave of FUD can shape how newcomers see you before they check a single fact. Steadily managing what people find, and responding with care, protects the trust your community and your token both rest on.",
      "social-media-management":
        "A Web3 project is judged partly on whether anyone's home. Keeping your channels posting, replying, and on-voice every day — not only when there's news — signals a team that's still shipping, which is half of why people keep holding.",
      "youtube-ads":
        "YouTube is where crypto-curious viewers go to understand a project before they commit. Campaigns that reach them mid-research put your explainer in front of people already trying to learn, rather than cold scrollers who'll never care.",
      "linkedin-ads":
        "Not every Web3 deal happens on Twitter. When you're chasing exchange listings, institutional partners, or infrastructure buyers, LinkedIn reaches the specific decision-makers who sign those deals, an audience Crypto Twitter simply can't.",
      "facebook-ads":
        "Meta keeps a tight leash on crypto ads, so reaching a mainstream audience here takes campaigns built to stay within the rules while still landing. Done right, it puts your project in front of the people who never open Crypto Twitter.",
      "seo-audit":
        "Most Web3 sites are built for the screenshot, not the crawler: heavy on animation, close to invisible in search. An audit shows exactly where your JavaScript-rendered pages are losing rankings, so people searching your name and category can actually find you.",
      "guest-posts":
        "Getting featured and linked on established crypto and tech publications does two jobs at once. It lifts your search authority and places your name where researchers and would-be holders already trust the source.",
      "google-business-profile":
        "Most Web3 projects are borderless, but if you run an exchange desk, a regional office, or a physical crypto business, a proper Google My Business (GMB) profile lets local searchers confirm you're real and reachable, a rare trust signal in a space full of anonymous teams.",
      "app-store-optimization":
        "If your wallet, exchange, or dApp lives in the app stores, that listing is where installs are won or lost. Optimising it means people searching for a wallet or a place to trade find yours, not one of the copycats crypto is full of.",
      "ecommerce-seo":
        "If you sell NFTs, mint passes, or branded merch, those collection and product pages are storefronts search engines can rank. E-commerce SEO brings ready-to-buy collectors straight to your drops, not just the ones who already follow your Twitter.",
      "local-seo":
        "A crypto exchange, ATM operator, or advisory firm tied to a real place is still found the old-fashioned way — someone nearby searching for it. Ranking in local results and the map means those people reach you instead of an offshore name they can't verify.",
      "seo-services":
        "Search is the channel most crypto projects ignore, which is exactly what makes it winnable. Ranking for your project name, token, and category means that when the hype sends someone to Google, they land on you, not a scam clone or a rival's comparison page.",
      "mobile-app":
        "Crypto never sleeps, and neither do your users; they check prices, portfolios, and positions from their phones. A mobile app that feels fast and trustworthy keeps holders engaged in the moments they'd otherwise never open a browser.",
      "project-management":
        "Web3 teams are usually distributed, async, and part-anonymous, with contributors scattered across time zones. Project software built around how you actually coordinate keeps roadmap, deliverables, and hand-offs visible, so nothing stalls between people who never share an office.",
      "payroll-management":
        "Paying a global roster of contributors, some in fiat and some in stablecoins across a dozen jurisdictions, is messier than off-the-shelf payroll assumes. Software shaped around how your team is actually paid keeps payouts accurate and on time, without the monthly scramble.",
      "hr-management":
        "Bringing on contributors who may only ever be known by a handle, across contracts and core roles, doesn't fit tidy HR templates. A system shaped around how your people actually join and get access keeps onboarding and records straight as you grow past the founding crew.",
      "accounting-finance":
        "Between a token treasury, on-chain flows, and ordinary fiat expenses, Web3 finance is harder to keep straight than most tools assume. Software built for that reality gives you a clear, current view of the runway and treasury your community keeps asking about.",
      "ecommerce-platform":
        "Whether you're selling merch, mint passes, or token-gated products, an off-the-shelf cart chokes on wallet payments and gated access. A platform built for that handles the crypto-native mechanics and stays simple to run once the drop goes live.",
      "erp":
        "For a crypto business with real operations, a mining outfit, a hardware line, an exchange back office, the pieces sprawl across on-chain and off-chain systems. One connected platform stops orders, finance, and inventory from living on separate islands nobody reconciles.",
      "crm":
        "Your relationships span investors, exchange contacts, KOLs, and partner protocols, and most of it lives in someone's DMs. A CRM built around how Web3 deals actually happen keeps those threads in one place, so no listing or partnership slips.",
      "website-speed-optimization":
        "The 3D, heavy animation, and wallet libraries that make a crypto site feel premium are also what drag it to a crawl on mobile. We find what's slowing you down and fix it, so the site that wows on desktop doesn't lose people on a phone.",
      "website-maintenance":
        "In crypto, a neglected site is a target — front-end hijacks and unpatched dependencies have cost users real funds. Ongoing care that keeps everything patched and secure protects both your holders' money and the trust you've worked to build.",
      "webgl-3d-experiences":
        "This is the service that decides how serious your project looks. Web3 buyers judge quality in the first scroll, so an immersive 3D site — with tokenomics you can explore and motion that screenshots cleanly — reads as top-tier before anyone reads a word.",
      "ecommerce-website":
        "For an NFT drop or a merch line, the store itself is a trust test; collectors won't connect a wallet to something that feels sketchy. A store built to look legitimate and check out smoothly turns interest into orders instead of second-guessing.",
      "website-development":
        "Your project site has to do three things at once: look legitimate, explain the substance, and lead visitors toward connecting or joining. A custom build gives that a clear structure, instead of stranding people between a flashy hero and a buried whitepaper.",
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
      "ai-content-engine":
        "Agencies preach content consistency to clients, then let their own blog sit untouched for months. An always-on engine keeps your thinking published, with a human edit before anything ships, so the expertise prospects check before briefing you is actually there when they look.",
      "ai-agent-development":
        "Most inbound briefs need the same qualifying questions before you can tell there's real budget behind them. An agent that runs that first conversation scores fit and books the genuine ones onto a partner's calendar, so you stop giving free discovery to briefs going nowhere.",
      "ai-automation-systems":
        "Agencies sell systems to clients while running their own shop on heroics: proposals rebuilt from scratch, updates chased by hand, renewals that quietly slip. Automating that admin tax hands your senior people their billable hours back and stops the follow-ups depending on who remembered.",
      "motion-graphics":
        "A shop's showreel and pitch deck get judged on craft in the first few seconds. Motion that's genuinely well-made in your own brand does the convincing a static slide can't: it lets a prospect feel the standard of your work instead of taking your word for it.",
      "graphic-design":
        "Nothing undercuts a creative shop faster than a scruffy identity of its own, with mismatched decks, off-brand socials, and a logo that drifts. A tight, consistent brand across every touchpoint is the quiet proof you'd hold the same standard on a client's.",
      "ui-ux-design":
        "When you pitch UX work, your own site is exhibit A; if it's awkward to navigate, the room discounts everything you claim. A portfolio and enquiry flow designed with real rigour demonstrates the discipline you're asking clients to pay for.",
      "video-production":
        "A case-study film sells harder than its written version ever could; a prospect watching your process and hearing a client vouch for you is already half-briefed. We plan and cut the videos that make your best work impossible to skim past.",
      "social-media-content":
        "Prospects and future hires check your feed to see whether the shop is alive and making things. A steady stream of on-brand posts and reels keeps you visibly working, so when someone's finally ready to brief an agency, yours is the name already in their head.",
      "content-writing":
        "Most agency sites hide behind vague craft-speak that could belong to anyone. Copy that says plainly who you're for and what you actually do starts qualifying the brief before it lands, so more enquiries arrive with real budget and a genuine fit.",
      "content-distribution":
        "You produce sharp thinking, then watch it die on a single post your own followers barely see. Getting each piece in front of the right founders and marketing leads turns work you've already done into inbound, rather than content only your existing network ever reads.",
      "online-reputation-management":
        "When a prospect takes you to their CFO, the first thing that CFO does is search your name, and old reviews, directory listings, and stray chatter set the tone before your call. A steady flow of genuine reviews makes that search work in your favour.",
      "social-media-management":
        "The cobbler's-children problem hits agencies hardest: buried in client work, your own channels go quiet for weeks. Handing the whole thing to a steady pair of hands keeps your presence consistent, so you never look dormant to someone deciding whether to reach out.",
      "youtube-ads":
        "Agency hiring starts long before the brief; a founder remembers the shop whose thinking they kept seeing. YouTube puts your point of view in front of the exact decision-makers you want, so your name already feels familiar by the time they're ready to hire.",
      "linkedin-ads":
        "Your best clients have a job title and a company size you can name exactly. LinkedIn puts your work directly in front of those people, rather than leaving you to hope a referral eventually carries you to whoever actually holds the budget.",
      "facebook-ads":
        "A prospect who studied your portfolio and then went quiet isn't lost, just busy. Meta retargeting keeps your strongest work in front of people who've already shown interest, holding you top of mind through the slow stretch between first look and real brief.",
      "seo-audit":
        "If search is anywhere in what you sell, a prospect who finds your own site invisible on Google draws the obvious conclusion. A plain-English audit shows exactly what's holding you back and gives you an honest baseline before you spend a penny fixing it.",
      "guest-posts":
        "Getting featured in the design and marketing publications your peers actually read earns two things at once: the links search engines trust, and your name in the rooms where reputations get made and referrals quietly start.",
      "google-business-profile":
        "Plenty of briefs start with someone searching for an agency in their city, and a thin Google My Business (GMB) listing hands those to the shop down the road. Real work, current photos, and genuine reviews turn it into a credible shopfront, not an empty pin.",
      "app-store-optimization":
        "If building apps is part of what you sell, launching a client's app into a silent store undercuts the whole win, because nobody installs what they can't find. Knowing how to make a listing rank and convert lets you carry the result past launch day.",
      "ecommerce-seo":
        "When you take on e-commerce clients, ranking their product and category pages is where you prove ROI in numbers a CFO respects. Building that into your offer turns one-off store builds into the ongoing organic-growth work that keeps a retainer alive.",
      "local-seo":
        "To become the agency your region calls first, you need to surface across every local search nearby businesses run, not just hold one map pin. Consistent citations, location pages, and reviews make you the local default instead of a national name they'll never actually meet.",
      "seo-services":
        "Referrals are flattering, but you can't forecast them; some quarters the phone rings, some it doesn't. Steady organic growth builds a pipeline you can actually plan around, so new business stops living or dying on who happened to recommend you this month.",
      "mobile-app":
        "Clients increasingly fold an app into the brief, and turning that part down can send the whole account to a shop that says yes. Being able to ship a genuinely good iPhone and Android build keeps the relationship, and its margin, with you.",
      "project-management":
        "A creative shop lives or dies on utilisation, and generic tools bury who's on what under a pile of notifications. Project software shaped to how your studio actually runs shows deadlines, capacity, and what's next at a glance, so nothing slips while everyone's heads-down on delivery.",
      "payroll-management":
        "Agencies run on a messy mix of salaried staff, contractors, and project freelancers, and payday turns into a monthly scramble across spreadsheets. Payroll built for that reality gets everyone paid accurately and on time without eating a partner's afternoon each cycle.",
      "hr-management":
        "Somewhere past a handful of people, a creative shop's HR lives in scattered docs and someone's memory: leave, onboarding, who signed what. Software that keeps it organised means you can grow the team without the admin quietly becoming a partner's second job.",
      "accounting-finance":
        "Agencies can look busy and still lose money when nobody knows which projects actually made margin. Finance software that keeps the numbers current and readable shows you real project profitability, so you price the next brief from evidence rather than hope.",
      "ecommerce-platform":
        "When a retail client outgrows off-the-shelf and wants a store that isn't bent to fit a template, being able to build a fast bespoke platform means the ambitious brief stays with you, and so does the storefront only you know how to maintain.",
      "erp":
        "Past a certain size, a studio's projects, finance, resourcing, and people live in separate tools that don't talk, and reconciling them by hand eats real time. A connected system built around how you run replaces the copy-paste with one source of truth.",
      "crm":
        "Agency pipelines don't fit a sales-team template; briefs arrive warm, stall for months, then move fast. A CRM shaped to how your new business actually flows keeps every lead and past conversation tidy, so a promising thread never goes cold for want of a follow-up.",
      "website-speed-optimization":
        "The irony of a beautiful agency site is that all that motion and imagery can crawl on first load, and a prospect left waiting for your hero to appear has already started judging your engineering. Tightening speed keeps the craft without making people wait to see it.",
      "website-maintenance":
        "Your own site is the last thing that gets attention when clients are shouting, so it quietly rots: plugins age, a page breaks, and you hear about it from a prospect. Ongoing care keeps the work that wins you work healthy and current without stealing billable time.",
      "webgl-3d-experiences":
        "The ambitious briefs, the ones with real budget, increasingly ask for something immersive a standard build can't touch. Delivering true interactive 3D, on your own site and your clients', moves you out of the template tier and into the shops called for flagship work.",
      "ecommerce-website":
        "A store that converts is a design-and-trust problem before it's a tech one: cart drop-off, mobile checkout, whether the product feels worth buying. Delivering storefronts that actually turn visits into orders gives your e-commerce clients results in the one metric they truly care about.",
      "website-development":
        "For an agency the website is the work on display, and a template build quietly says you'd hand a client a template too. A fast, custom site that makes the next step obvious does your first round of convincing before anyone even picks up the call.",
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
      "ai-content-engine":
        "In healthcare, anything you publish gets read as medical guidance, so accuracy and a clinician's eye aren't optional. The engine keeps a steady flow of patient-friendly, on-brand articles moving, with a real human sign-off before a single word goes live.",
      "ai-agent-development":
        "Patients and providers ask the same questions at all hours — booking, coverage, what happens next — but tone and scope matter enormously here. An agent that stays inside the boundaries you set, logs every exchange, and hands anything clinical to a human keeps people cared for without overstepping.",
      "ai-automation-systems":
        "Intake, scheduling, insurance checks, and follow-up reminders eat your team's day and still get missed. Automations handle the structured, repeatable steps while keeping patient data routed to your secure systems, so nothing slips and nothing sensitive lands where it shouldn't.",
      "motion-graphics":
        "The hardest part of health marketing is making a complex treatment or mechanism understandable in seconds. A clear animated explainer turns dense clinical science into something a patient or a busy provider actually grasps, without dumbing it down or overselling the result.",
      "graphic-design":
        "In healthcare, a scrappy or inconsistent look reads as an unproven operation, and that costs you trust before a word is read. A steady visual system across your site, patient materials, and clinical decks tells buyers you're an organisation to rely on.",
      "ui-ux-design":
        "Your users are anxious patients and time-pressed clinicians, not power users with time to learn. Interfaces that make the right action obvious — book, upload, understand a result — cut confusion, reduce support calls, and stop people abandoning a flow that matters.",
      "video-production":
        "Trust in healthcare is built by people, not paragraphs. A patient telling their story or a clinician explaining your approach on camera does what a spec sheet never can — it lets a cautious buyer feel the care behind the product before they commit.",
      "social-media-content":
        "A quiet health brand looks like one that closed. A steady stream of accurate, genuinely useful posts — myth-busting, explaining, reassuring — keeps you visible and trusted through the long stretches of a considered, high-stakes buying decision.",
      "content-writing":
        "Healthcare copy usually swings between cold legalese and vague reassurance. Writing that turns clinical detail into plain, warm language, without overstating what you're allowed to claim, helps the right reader understand you and feel safe enough to act.",
      "content-distribution":
        "The people you need — specialists, procurement leads, the right patients — don't all gather in one place. Getting your best content into the professional networks and communities they actually read means your research and stories earn the reach they deserve.",
      "online-reputation-management":
        "Before anyone books or refers, they search your name, and in healthcare a single unanswered complaint carries outsized weight. Steadily earning honest reviews and answering the hard ones with care keeps that first impression in line with the standard of care you actually give.",
      "social-media-management":
        "Health audiences notice when a channel goes silent or replies carelessly to a sensitive comment. Handing it to people who keep the voice consistent and know what not to say keeps your presence active and safe, without pulling your team off the work that matters.",
      "youtube-ads":
        "Ad platforms restrict what health brands can say, so a hard sell rarely clears review or lands well. YouTube gives you room to educate first — showing how something works and who it helps — so the right viewer arrives already understanding and half-convinced.",
      "linkedin-ads":
        "One of your biggest leaks is demo requests from curious clinicians who can't sign a contract. LinkedIn lets you aim spend at the medical directors, procurement leads, and executives who actually hold the budget, so the conversations you start are worth having.",
      "facebook-ads":
        "For patient-facing health brands, Meta is where demand often starts — but its rules on health targeting and claims trip up most campaigns. Ads built to speak to the person without crossing those lines turn a quiet scroll into a signup, a booking, or a first order.",
      "seo-audit":
        "Healthcare sits under Google's strictest quality bar, so the reasons a page won't rank are rarely the obvious ones. A thorough audit shows where you're missing the authorship, structure, and technical signals clinical search demands — in plain terms, with a clear order to fix them.",
      "guest-posts":
        "In a field Google judges on trust, links from credible medical and health publications do more than lift rankings — they place you beside sources readers already respect. We earn genuine features on relevant sites, never the low-quality links that put a health brand at risk.",
      "google-business-profile":
        "When someone needs a clinic or practice, they search nearby and decide from what they see on the map — hours, services, reviews, photos. A properly optimised Google My Business (GMB) profile makes sure a searching patient finds you, trusts what they see, and picks you over the practice down the road.",
      "app-store-optimization":
        "For a health app, the listing has to earn trust in the same breath it earns the install, because people are handing over their symptoms and their data. Tuning it to rank for the searches patients really use, with a listing that reads credible, turns browsers into downloads.",
      "ecommerce-seo":
        "Selling health products online means ranking pages that can't lean on the wild claims a bad-faith seller might fake. We build category and product SEO that brings in ready-to-buy shoppers using honest, compliant language that search engines and cautious buyers both trust.",
      "local-seo":
        "Patients choose care close to home, so ranking in the local results for each clinic and provider is where the enquiries are won. We make sure every location surfaces when someone nearby searches your exact service, not just your head-office postcode.",
      "seo-services":
        "Because ad platforms limit what you can pay to say, organic search is often your steadiest, most credible channel, and the one competitors underinvest in. Patient, authority-building SEO grows traffic that arrives already trusting you, and keeps compounding long after a campaign ends.",
      "mobile-app":
        "A health app has to feel simple for a nervous first-timer and a less confident older user alike, and stay reliable when it's tracking something that matters. We build apps that are calm to use and handle sensitive data with the care the setting demands.",
      "project-management":
        "Health projects carry regulatory milestones and clinical dependencies where a missed step has real consequences. Software built around how your teams actually coordinate keeps trials, launches, and approvals visible and on track, instead of scattered across inboxes and spreadsheets.",
      "payroll-management":
        "Health payrolls are rarely simple — shift differentials, on-call rates, per-diem clinicians, and multiple locations all have to land correctly. Payroll built for that complexity gets every nurse, locum, and staffer paid right and on time, without someone reconciling spreadsheets at midnight.",
      "hr-management":
        "In healthcare, HR is also compliance — licences expire, certifications lapse, and mandatory training has to be provable. Software that tracks credentials and onboarding alongside the usual records keeps your clinical staff qualified and your organisation ready for an audit.",
      "accounting-finance":
        "Healthcare finances are tangled with insurance reimbursement, claims cycles, and payer mixes that ordinary tools handle badly. Software shaped around how the money actually flows in your setting gives you an accurate, current picture instead of numbers that are always a step behind.",
      "ecommerce-platform":
        "Selling health products online often means more than a cart — prescription steps, subscriptions, and rules about what can be sold to whom. A platform built around those realities stays easy for customers to shop and simple for your team to run, without bolted-on workarounds.",
      "erp":
        "As a health operation grows across sites and suppliers, critical things — medical stock, orders, compliance records, finance — end up stranded in separate systems. One connected ERP built around how you really work means a supply gap or a cost overrun is visible before it becomes a problem.",
      "crm":
        "Health sales are long and involve many hands — a clinician champion, a procurement lead, a finance sign-off — over months. A CRM shaped around that reality keeps every touch and stakeholder in view, so nothing stalls because someone lost track of where a deal stood.",
      "website-speed-optimization":
        "A worried patient won't wait on a slow page — they leave for whoever loads first, and a sluggish site quietly undercuts the credibility they came to check. We find and fix what's slowing you down, so those visitors stay and search rewards it.",
      "website-maintenance":
        "In healthcare, a security lapse or an outdated claim on your site isn't just embarrassing — it risks patient trust and possibly compliance. Steady, proactive care keeps the site secure, current, and available, so the place patients rely on to reach you is never the thing that breaks.",
      "webgl-3d-experiences":
        "Some health stories only click when you can turn them over yourself — how something moves through the body, what a procedure actually involves. An interactive 3D experience lets a cautious buyer explore the science at their own pace, and signals a seriousness no flat brochure can match.",
      "ecommerce-website":
        "People buying anything for their health hesitate more and scrutinise harder. A store that surfaces the real credibility — sourcing, approvals, honest guidance — and makes checkout feel safe and effortless turns that caution into confidence, and confidence into orders you can count on.",
      "website-development":
        "Your website carries the credibility a peer-reviewed paper carries in academia, yet most health sites read like brochures that bury the proof. A site built to lead with your clinical evidence and make one clear next step obvious turns cautious visitors into the demos and enquiries you actually want.",
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

// Build-time guard: every service must have a serviceFraming entry in every
// industry. Without this, a service slug added or renamed in services.ts
// silently falls back to boilerplate on all its /services/<svc>/<industry>
// pages (the exact rot this rebuild fixed). A missing key throws during the
// static build, so the gap can never ship unnoticed.
{
  const missing: string[] = [];
  for (const ind of industries) {
    for (const s of services) {
      if (!ind.serviceFraming[s.slug]) missing.push(`${ind.slug} → ${s.slug}`);
    }
  }
  if (missing.length > 0) {
    throw new Error(
      `industries.ts: ${missing.length} service×industry framing(s) missing — ${missing
        .slice(0, 5)
        .join(", ")}${missing.length > 5 ? " …" : ""}. Add them to serviceFraming.`
    );
  }
}
