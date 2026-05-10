/**
 * Service catalog. Each entry powers /services/[slug] AND the homepage
 * Services section preview. Keep summaries short for the homepage; the
 * detail page renders the full body sections.
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
  tagline: string;
  accent: string;
  /** One-line summary for the homepage card */
  summary: string;
  /** Two-paragraph hero copy on the detail page */
  heroBody: string[];
  /** Bullets shown on both the homepage card AND the detail "What's included" list */
  bullets: string[];
  /** Detail-page-only deep capabilities — usually 6-8 cards */
  capabilities: ServiceCapability[];
  /** Detail-page-only "When you need this" — buyer-recognition list */
  whenYouNeedThis: string[];
  /** 3-4 step process specific to this service */
  process: ServiceProcessStep[];
  /** Concrete deliverables the buyer walks away with */
  deliverables: string[];
  /** Demo slugs from data/demos.ts that exemplify this service */
  relatedDemos: string[];
  /** SEO meta */
  metaTitle: string;
  metaDescription: string;
};

export const services: Service[] = [
  {
    slug: "marketing-sites",
    num: "01",
    title: "Marketing sites",
    tagline: "Homepages built to convert, not decorate.",
    accent: "#84e1ff",
    summary:
      "Premium landing pages for SaaS, fintech, luxury, and 3D-native brands. Next.js, hand-coded, SEO-engineered, shipped in 4-6 weeks.",
    heroBody: [
      "Most agency sites are decorations. We build conversion infrastructure. Every section earns its place: clear value proposition above the fold, social proof where doubt creeps in, a primary CTA that resolves a real next step. The aesthetic carries the brand; the architecture carries the deal.",
      "Each marketing site is hand-coded in Next.js 16 against a TypeScript codebase you own outright. No drag-and-drop builder, no theme tax, no migration trap. The result loads under a second on cellular, ranks for buyer-intent keywords, and reads like a brand that knows exactly who it's talking to.",
    ],
    bullets: ["Next.js 16 + App Router", "CMS integration", "SEO + OG metadata", "95+ Lighthouse"],
    capabilities: [
      {
        title: "Above-the-fold conversion",
        body: "We architect the hero around one decision the visitor must make. Headline, subhead, social proof, and primary CTA — all measured against scroll depth and click-through, not just designer taste.",
      },
      {
        title: "Buyer-intent SEO",
        body: "Every page targets a specific commercial keyword cluster: schema.org Product or Service markup, OG metadata, sitemap.xml, robots.txt, RSS feed, per-page canonicals. Your demo posts get indexed within hours.",
      },
      {
        title: "CMS + content ops",
        body: "Headless CMS integration (Sanity, Contentful, or a markdown-based content folder) so your team ships copy without a developer. Includes auto-revalidation so edits go live in minutes.",
      },
      {
        title: "Performance budget",
        body: "Lighthouse 95+ on mobile, LCP under 1.8s, zero unused CSS shipped. Image optimization, font subsetting, route-level code-splitting, and edge caching tuned per route.",
      },
      {
        title: "Analytics + attribution",
        body: "Plausible / GA4 / Mixpanel wiring with UTM passthrough, session-stitching, conversion events on every meaningful interaction. You see which channel actually drives bookings.",
      },
      {
        title: "Lead capture + integrations",
        body: "Forms wired to Resend, Cal.com, HubSpot, or your CRM of choice. Newsletter opt-in, gated lead magnets, audit-request flows — all production-grade with proper validation.",
      },
    ],
    whenYouNeedThis: [
      "You just raised a round and the deck looks better than your homepage.",
      "Your conversion rate is sub-1% and you can't tell whether it's the copy or the layout.",
      "You're moving upmarket and the current site looks like the old you, not the next you.",
      "You need a site that ranks for buyer keywords without a 12-month SEO retainer.",
      "You're tired of editing a Webflow template that fights you on every change.",
    ],
    process: [
      {
        label: "Week 1",
        title: "Discovery + positioning",
        body: "We map your ICP, value proposition, top 3 buyer objections, and competitor landscape. You leave week 1 with a tight one-pager that defines the entire build.",
      },
      {
        label: "Week 2-3",
        title: "Design + content",
        body: "Pixel-perfect Figma mockups for hero, mid-funnel sections, and footer. Copy drafted alongside design — never bolted on after. Two rounds of revisions.",
      },
      {
        label: "Week 4-5",
        title: "Build + integrations",
        body: "Production Next.js codebase, CMS wiring, analytics events, deploy preview at every commit. Daily progress demos via Loom.",
      },
      {
        label: "Week 6",
        title: "Launch + transfer",
        body: "Domain cutover, post-launch QA across browsers + devices, full handover with documentation, repo access, and 30 days of post-launch support included.",
      },
    ],
    deliverables: [
      "Production Next.js codebase (TypeScript, App Router, ESLint clean)",
      "Figma source file with the full design system",
      "CMS schema + admin walkthrough video",
      "SEO audit report (technical + content)",
      "Deployment pipeline (Vercel / Koyeb / Cloudflare)",
      "30 days of post-launch support",
    ],
    relatedDemos: ["neuron", "axiom", "pulse"],
    metaTitle: "Marketing sites — premium landing pages for founders · Brandivibe",
    metaDescription:
      "Hand-coded Next.js marketing sites built for conversion. SEO, CMS, analytics, and 95+ Lighthouse — shipped in 4-6 weeks. No templates, ever.",
  },

  {
    slug: "3d-webgl",
    num: "02",
    title: "3D & WebGL",
    tagline: "Interactive 3D experiences that price-anchor your brand.",
    accent: "#a78bfa",
    summary:
      "Cinematic hero scenes, real-time product showcases, particle systems, custom shader work. Built with React Three Fiber, optimized for mobile.",
    heroBody: [
      "Static screenshots and stock illustration are the visual language of every B2B SaaS site. Custom WebGL is the language of brands that want to price differently. When the hero of your homepage is an interactive 3D scene tuned to 60fps on a four-year-old phone, you're no longer competing on feature lists — you're competing on craft.",
      "Every 3D build is engineered first. We use React Three Fiber for the scene graph, custom GLSL shaders for material work, and Drei utilities for the heavy lifting. Geometry is simplified for mobile, draw calls are batched, and the entire scene falls back gracefully on devices that can't handle it.",
    ],
    bullets: ["React Three Fiber", "Custom GLSL shaders", "Blender pipelines", "Mobile-optimized"],
    capabilities: [
      {
        title: "Cinematic hero scenes",
        body: "Custom 3D environments that respond to scroll, cursor, or audio. Tuned per-device — your phone gets a simplified mesh, your laptop gets full effects. Same visual language, different polygon budget.",
      },
      {
        title: "Interactive product showcases",
        body: "Rotate-to-explore product configurators, exploded-view diagrams, real-time material swaps. Built for ecommerce and complex product brands where photos can't show the whole story.",
      },
      {
        title: "Custom GLSL shaders",
        body: "Hand-written vertex and fragment shaders for unique material effects: holographic, iridescent, liquid metal, volumetric fog, signed-distance-field text. The looks competitors can't copy.",
      },
      {
        title: "Particle + simulation systems",
        body: "GPU-driven particles, fluid simulations, instanced geometry for swarm effects. Renders 100k+ particles at 60fps on commodity hardware.",
      },
      {
        title: "Blender → web pipeline",
        body: "We handle the full asset chain: Blender modeling, optimization, GLB export, automatic LOD generation. You get the source files and the production assets.",
      },
      {
        title: "Performance + accessibility",
        body: "GPU profiling on every commit. Reduced-motion fallback for users with vestibular disorders. Full keyboard navigation. WebGL-not-supported fallback to a poster image — no broken hero ever.",
      },
    ],
    whenYouNeedThis: [
      "You're selling a physical product and photos don't do it justice.",
      "Your category is crowded and you need an unfair brand advantage.",
      "You want the hero of your site to be the marketing — no demo video required.",
      "You're targeting design-conscious buyers (luxury, aerospace, watches, automotive, premium SaaS).",
      "Your competitor just launched a 3D site and your team is panicking.",
    ],
    process: [
      {
        label: "Week 1",
        title: "Concept + technical scope",
        body: "Sketch direction, technical feasibility on target devices, polygon budget, draw call ceiling. We write the perf contract before any modeling starts.",
      },
      {
        label: "Week 2-3",
        title: "Modeling + shading",
        body: "Blender mesh work, UV unwrapping, custom shader development, lighting rig. Mid-fidelity preview shipped end of week 3.",
      },
      {
        label: "Week 4-5",
        title: "Integration + interaction",
        body: "React Three Fiber scene, scroll/cursor binding, mobile fallbacks, audio sync if relevant. Performance pass on real devices.",
      },
      {
        label: "Week 6",
        title: "Polish + ship",
        body: "Final color grading, motion easing, microinteractions, accessibility audit, GPU profiling, launch.",
      },
    ],
    deliverables: [
      "React Three Fiber components, fully typed",
      "Custom GLSL shader sources",
      "Blender source files + exported GLB assets",
      "LOD pipeline + texture compression presets",
      "Mobile fallback poster image set",
      "Performance profile report (FPS by device class)",
    ],
    relatedDemos: ["helix", "aurora", "orbit"],
    metaTitle: "3D & WebGL websites — cinematic web experiences · Brandivibe",
    metaDescription:
      "Custom 3D and WebGL hero scenes built with React Three Fiber. Mobile-optimized, GLSL shader work, Blender pipelines, accessibility-first. For brands that compete on craft.",
  },

  {
    slug: "motion-design",
    num: "03",
    title: "Motion design",
    tagline: "Micro-interactions and scroll cinematography that make a site feel alive.",
    accent: "#f0abfc",
    summary:
      "Scroll-driven storytelling, page transitions, gesture-aware micro-interactions. Framer Motion + GSAP + Lenis, with reduced-motion fallbacks built in.",
    heroBody: [
      "Motion is the difference between a site that loads and a site that breathes. Done well, it guides the eye, anchors brand voice, and makes content feel choreographed. Done poorly, it's gimmicky decoration that hurts performance and frustrates users on slower connections.",
      "We treat motion as a layer of the design system, not a finishing flourish. Every animation is choreographed against scroll position, viewport intersection, or explicit user intent. Reduced-motion preference is honored automatically. The result reads as cinematic, never busy.",
    ],
    bullets: ["Framer Motion", "Lenis smooth scroll", "GSAP + ScrollTrigger", "Reduced-motion fallbacks"],
    capabilities: [
      {
        title: "Scroll cinematography",
        body: "Scroll-driven hero sequences, parallax depth layers, pinned section transitions, horizontal filmstrip storytelling. The kind of motion that reads as deliberate, not gratuitous.",
      },
      {
        title: "Page transitions",
        body: "Shared element transitions between routes, fade choreography on entry/exit, content-aware speed curves. The site feels like a single fluid surface, not a collection of pages.",
      },
      {
        title: "Micro-interactions",
        body: "Magnetic buttons, cursor-aware tooltips, hover state ladders, custom focus rings, tactile click feedback. The little details that signal a premium product to the people who notice.",
      },
      {
        title: "SVG + path animation",
        body: "Hand-drawn SVG line reveals, animated logo lockups, morphing iconography, signature path animations for brand moments.",
      },
      {
        title: "Smooth scroll without jank",
        body: "Lenis-powered inertial scrolling tuned per device. Touch, trackpad, and mouse wheel all feel right. No motion sickness, no lag.",
      },
      {
        title: "Reduced-motion respect",
        body: "Every animation has a reduced-motion fallback. We test with prefers-reduced-motion: reduce on real devices. Accessibility is the floor, not a checkbox.",
      },
    ],
    whenYouNeedThis: [
      "Your existing site looks fine but feels static next to your competitors.",
      "You want a hero moment that gets shared on Twitter the day you launch.",
      "Your brand has a distinctive voice and you want the motion to match it.",
      "Designers tell you the static designs look great but the live site has no energy.",
      "You're shipping a redesign and want the launch to feel like an event, not a release note.",
    ],
    process: [
      {
        label: "Week 1",
        title: "Motion brief",
        body: "We define the motion vocabulary: timing curves, durations, choreography rules, reduced-motion specifications. Everything downstream references this brief.",
      },
      {
        label: "Week 2",
        title: "Storyboards + prototypes",
        body: "Loom walkthroughs of every scroll moment, page transition, and key micro-interaction. You sign off before any code is written.",
      },
      {
        label: "Week 3-5",
        title: "Implementation",
        body: "Framer Motion + GSAP integration, Lenis tuning, scroll-trigger orchestration. Daily Loom updates as moments come online.",
      },
      {
        label: "Week 6",
        title: "Polish + cross-device",
        body: "Final timing pass on real devices, frame-rate profiling, reduced-motion verification, accessibility audit.",
      },
    ],
    deliverables: [
      "Framer Motion + GSAP + Lenis integration code",
      "Motion design system documentation (timing, easing, reduced-motion rules)",
      "Storyboard Loom library for every scroll moment",
      "Performance report (frame rate by device class)",
      "Accessibility audit covering prefers-reduced-motion + keyboard navigation",
    ],
    relatedDemos: ["axiom", "monolith", "atrium"],
    metaTitle: "Motion design — scroll cinematography for premium websites · Brandivibe",
    metaDescription:
      "Premium motion design with Framer Motion, GSAP, and Lenis. Scroll-driven storytelling, page transitions, micro-interactions — all with reduced-motion fallbacks built in.",
  },

  {
    slug: "full-stack-builds",
    num: "04",
    title: "Full-stack builds",
    tagline: "Dashboards, auth, and payments that don't break under load.",
    accent: "#fcd34d",
    summary:
      "Production TypeScript apps with Postgres, Stripe, and modern auth. Documented, tested, and built so a future engineer thanks you instead of cursing you.",
    heroBody: [
      "Most agencies stop at the marketing site. We finish the loop. Authenticated dashboards, billing flows, internal tools, customer-facing portals — built on the same stack as the marketing site so the team that ships your homepage also ships your product surface.",
      "Every full-stack build is end-to-end TypeScript: typed API contracts, typed database schema, typed UI props. The codebase is opinionated where it matters (lint rules, file conventions, error handling) and pragmatic where it doesn't. Your next engineer can be productive on day one.",
    ],
    bullets: ["TypeScript everywhere", "Postgres + Drizzle", "Stripe + webhooks", "Clerk / Supabase auth"],
    capabilities: [
      {
        title: "Authenticated dashboards",
        body: "Role-based access, audit logs, multi-tenant scoping, organization invites. Built on Clerk or Supabase Auth depending on your billing model and compliance posture.",
      },
      {
        title: "Stripe + payment flows",
        body: "One-time charges, subscriptions, metered billing, customer portal, webhook reconciliation, dunning. Every Stripe event mapped to a specific domain action so you never have ghost subscribers.",
      },
      {
        title: "Postgres + schema design",
        body: "Drizzle ORM with type-safe migrations, indexed access patterns, row-level security where appropriate. We model the domain first, then the schema — never the other way.",
      },
      {
        title: "Background jobs + queues",
        body: "Inngest, Trigger.dev, or BullMQ depending on your runtime. Email sending, webhook delivery, scheduled tasks, retries with exponential backoff — all observable from a single dashboard.",
      },
      {
        title: "Internal admin tools",
        body: "The unsexy interfaces that keep a business running: customer support views, content moderation queues, refund flows, manual override consoles. Built fast so your team isn't bottlenecked by engineering.",
      },
      {
        title: "Observability + ops",
        body: "Sentry for errors, structured logging via Pino, health-check endpoints, on-call runbooks. Your site doesn't just work — you can prove it works at 3am.",
      },
    ],
    whenYouNeedThis: [
      "Your marketing site is great but the product surface looks like it was built by a different team.",
      "You're losing customers in the signup or billing flow and don't know which step.",
      "Your team is duct-taping no-code tools because real engineering hasn't been done yet.",
      "You need a customer dashboard, an internal admin, and a billing portal — and want them to share one design system.",
      "You're hiring a CTO and want a clean codebase to hand them on day one.",
    ],
    process: [
      {
        label: "Week 1",
        title: "Domain + schema design",
        body: "We map your domain entities, access patterns, billing model, and compliance needs into a Drizzle schema and a typed API contract before writing a single feature.",
      },
      {
        label: "Week 2-3",
        title: "Auth + billing foundations",
        body: "Clerk or Supabase Auth wired with org invites + RBAC. Stripe customer + subscription objects modeled, webhooks deployed, billing portal live in dev.",
      },
      {
        label: "Week 4-5",
        title: "Feature surface",
        body: "Dashboards, internal admin, customer-facing flows. Daily Loom walkthroughs. Each feature ships with at least one integration test against a real Postgres instance.",
      },
      {
        label: "Week 6",
        title: "Hardening + handover",
        body: "Sentry wiring, performance audit, security review, runbooks, README walkthrough. You receive the repo, the deployment pipeline, and a 90-minute handover call.",
      },
    ],
    deliverables: [
      "TypeScript monorepo or single-app codebase",
      "Drizzle schema + migrations + seed scripts",
      "Stripe integration with webhook reconciliation",
      "Auth (Clerk or Supabase) with RBAC + org invites",
      "Sentry + structured logging + health checks",
      "On-call runbook + README + 90-min handover call",
      "30 days of post-launch support",
    ],
    relatedDemos: ["neuron", "uturn", "atrium"],
    metaTitle: "Full-stack builds — TypeScript apps with auth, Stripe, and Postgres · Brandivibe",
    metaDescription:
      "Production-grade full-stack TypeScript apps. Postgres + Drizzle, Stripe billing, Clerk or Supabase auth, observability built in. Built so your next engineer can ship on day one.",
  },
];
