/**
 * Portfolio demo list.
 *
 * To add a new demo, drop a new object in this array. Brandivibe's Featured
 * Work section will render it automatically.
 *
 * Videos and posters live under `mjstudio/public/work/*`. To refresh the
 * video loops for every demo, run `node scripts/screenshot.mjs` while the
 * mjstudio dev server is running (it captures all sub-routes on localhost:3000).
 */

export type DemoKind = "landing" | "website" | "shopify";

export type Demo = {
  num: string;
  name: string;
  /** Short positioning line (shown in cards) */
  category: string;
  /** Internal classification for the /portfolio filter tabs */
  kind: DemoKind;
  description: string;
  tags: string[];
  href: string;
  video: string | null;
  poster: string | null;
  gradient: string;
  year: string;
  role: string;
  /** Marks placeholder demos awaiting full build-out */
  comingSoon?: boolean;
};

export const demos: Demo[] = [
  {
    num: "01",
    name: "Helix",
    category: "Crypto · DeFi · Liquid Staking",
    description:
      "Institutional-grade DeFi protocol landing with custom WebGL hero, real-time TVL dashboard, and a trust-first security narrative.",
    tags: ["Next.js", "R3F", "Custom shaders", "Wagmi"],
    href: "/helix",
    kind: "landing",
    video: "/work/helix.webm",
    poster: "/work/helix.jpg",
    gradient: "from-[#fbbf24]/30 via-[#8b5cf6]/15 to-[#0a0a1e]",
    year: "2026",
    role: "Design · Build · WebGL",
  },
  {
    num: "02",
    name: "Neuron",
    category: "B2B SaaS · AI Platform",
    description:
      "AI agent platform with an interactive code playground, 3-tier pricing, subtle neural-network 3D accent, and a restrained editorial rhythm built for enterprise buyers.",
    tags: ["Next.js", "R3F particles", "Playground", "Stripe"],
    href: "/neuron",
    kind: "landing",
    video: "/work/neuron.webm",
    poster: "/work/neuron.jpg",
    gradient: "from-[#e0e7ff]/20 via-[#a78bfa]/15 to-[#0a0a1e]",
    year: "2026",
    role: "Design · Build · DX",
  },
  {
    num: "03",
    name: "Axiom",
    category: "Fintech · Global Payments · Infrastructure",
    description:
      "Serious institutional fintech brand for a cross-border payments API. Instrument Serif + teal accents + a rotating data slab, with a live FX ticker and 147-country rails showcase.",
    tags: ["Next.js", "R3F", "Instrument Serif", "Live ticker"],
    href: "/axiom",
    kind: "landing",
    video: "/work/axiom.webm",
    poster: "/work/axiom.jpg",
    gradient: "from-[#14b8a6]/25 via-[#fef3c7]/8 to-[#0a0e1a]",
    year: "2026",
    role: "Design · Build · WebGL",
  },
  {
    num: "04",
    name: "Pulse",
    category: "Healthcare · Telehealth · Clinical AI",
    description:
      "A calming healthcare brand for a telehealth platform. Soft cream background, DM Serif Display, sage accents, breathing 3D blob hero, and an FDA-cleared AI triage story.",
    tags: ["Next.js", "R3F", "DM Serif", "HIPAA-ready"],
    href: "/pulse",
    kind: "landing",
    video: "/work/pulse.webm",
    poster: "/work/pulse.jpg",
    gradient: "from-[#a7f3d0]/30 via-[#fafaf7]/10 to-[#0a0a0a]",
    year: "2026",
    role: "Design · Build · DX",
  },
  {
    num: "05",
    name: "Aurora",
    category: "Luxury · Swiss Haute Horlogerie",
    description:
      "A cinematic luxury watchmaker brand. Black + gold Playfair Display, 87-piece limited edition story, rotating gold 3D orb, chapter-based heritage timeline. Appointment-only CTAs.",
    tags: ["Next.js", "R3F", "Playfair", "Heritage storytelling"],
    href: "/aurora",
    kind: "website",
    video: "/work/aurora.webm",
    poster: "/work/aurora.jpg",
    gradient: "from-[#fde68a]/25 via-[#d4a017]/12 to-[#07060a]",
    year: "2026",
    role: "Design · Build · WebGL",
  },
  {
    num: "06",
    name: "Orbit",
    category: "Luxury EV · Electric Hypercar",
    description:
      "Aggressive premium automotive brand for a limited-edition electric hypercar. Black + acid-green Space Grotesk, full-spec telemetry section, rotating 3D vehicle form, reservation-only CTAs.",
    tags: ["Next.js", "R3F", "Space Grotesk", "Telemetry"],
    href: "/orbit",
    kind: "website",
    video: "/work/orbit.webm",
    poster: "/work/orbit.jpg",
    gradient: "from-[#84ff6b]/25 via-[#05060a]/10 to-[#05060a]",
    year: "2026",
    role: "Design · Build · WebGL",
  },
  {
    num: "07",
    name: "Monolith",
    category: "Architecture · Studio",
    description:
      "A restrained architecture firm brand. Concrete background, Cormorant Garamond serif, 3D standing form hero, four projects / fifteen years narrative, Porto + Tokyo dual-studio footer.",
    tags: ["Next.js", "R3F", "Cormorant", "Editorial grid"],
    href: "/monolith",
    kind: "website",
    video: "/work/monolith.webm",
    poster: "/work/monolith.jpg",
    gradient: "from-[#c9c5bf]/40 via-[#e7e3dc]/20 to-[#1a1a1a]/10",
    year: "2026",
    role: "Design · Build · DX",
  },
  {
    num: "08",
    name: "Atrium",
    category: "Venture Capital · Firm",
    description:
      "An institutional VC firm brand. Navy + champagne Libre Caslon Text, gold 3D sphere hero, 47-company portfolio table, founding-partners thesis quote, decade-horizon positioning.",
    tags: ["Next.js", "R3F", "Libre Caslon", "Portfolio table"],
    href: "/atrium",
    kind: "website",
    video: "/work/atrium.webm",
    poster: "/work/atrium.jpg",
    gradient: "from-[#e8d49a]/20 via-[#0e162b]/10 to-[#0a1020]",
    year: "2026",
    role: "Design · Build · WebGL",
  },
  {
    num: "09",
    name: "UTurn Store",
    category: "Ecommerce · Capsule Atelier",
    description:
      "A luxury-conversion homepage for a capsule clothing brand — 8-section controlled funnel, delayed selling, cream + ink + burnt-sienna palette, Cormorant italic headlines, four seasonal releases of fifty pieces each.",
    tags: ["Next.js", "Conversion funnel", "Editorial", "Framer Motion"],
    href: "/uturn",
    kind: "shopify",
    // Webm not generated yet — run `node scripts/screenshot-sections.mjs`
    // while dev server is running to capture. Until then, fallback text shows.
    video: null,
    poster: null,
    gradient: "from-[#a64b2a]/20 via-[#f3efe6]/10 to-[#0f0e0c]",
    year: "2026",
    role: "Design · Build · Conversion",
  },
  {
    num: "10",
    name: "Kindred",
    category: "Shopify · Luxury Skincare",
    description:
      "An editorial skincare brand running on Shopify. Cream base, rose accents, Cormorant serif, ingredient-forward storytelling, ritual-based product bundles, subscription-first funnel.",
    tags: ["Shopify", "Editorial", "Subscription", "Ritual-based UX"],
    href: "/kindred",
    kind: "shopify",
    video: null,
    poster: null,
    gradient: "from-[#f5d4c3]/25 via-[#f3efe6]/12 to-[#1a0f0a]",
    year: "2026",
    role: "Design · Shopify · Brand",
  },
  {
    num: "11",
    name: "Ironwood",
    category: "Shopify · Streetwear Drops",
    description:
      "A drop-model streetwear store. Black + acid yellow palette, brutalist grid, countdown-driven releases, limited-run drops with waitlist mechanics, editorial lookbook chapters.",
    tags: ["Shopify", "Drop mechanics", "Brutalist", "Countdown"],
    href: "/ironwood",
    kind: "shopify",
    video: null,
    poster: null,
    gradient: "from-[#facc15]/20 via-[#0a0a0a]/10 to-[#0a0a0a]",
    year: "2026",
    role: "Design · Shopify · Launch ops",
  },
  {
    num: "12",
    name: "Terroir",
    category: "Shopify · Specialty Coffee",
    description:
      "A single-origin coffee roaster. Warm cream + forest green palette, Playfair headlines, farmer-first origin stories, brewing guides, subscribe-to-box with quarterly seasonal rotation.",
    tags: ["Shopify", "Origin storytelling", "Subscription box", "Editorial"],
    href: "/terroir",
    kind: "shopify",
    video: null,
    poster: null,
    gradient: "from-[#166534]/20 via-[#f5e6c8]/10 to-[#14110e]",
    year: "2026",
    role: "Design · Shopify · Brand",
  },
];
