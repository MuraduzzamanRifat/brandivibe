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

export type Demo = {
  num: string;
  name: string;
  category: string;
  description: string;
  tags: string[];
  href: string;
  video: string | null;
  poster: string | null;
  gradient: string;
  year: string;
  role: string;
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
    video: "/work/atrium.webm",
    poster: "/work/atrium.jpg",
    gradient: "from-[#e8d49a]/20 via-[#0e162b]/10 to-[#0a1020]",
    year: "2026",
    role: "Design · Build · WebGL",
  },
];
