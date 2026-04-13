/**
 * Portfolio demo list.
 *
 * To add a new demo, drop a new object in this array. MJ Studio's Featured
 * Work section will render it automatically.
 *
 * Videos and posters live under `mjstudio/public/work/*`. To refresh the
 * video loop for an existing demo, run `node scripts/screenshot.mjs` after
 * the target site's dev server is running.
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
    href: "http://localhost:3001",
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
    href: "http://localhost:3002",
    video: "/work/neuron.webm",
    poster: "/work/neuron.jpg",
    gradient: "from-[#e0e7ff]/20 via-[#a78bfa]/15 to-[#0a0a1e]",
    year: "2026",
    role: "Design · Build · DX",
  },
  // Example of a future demo:
  //
  // {
  //   num: "03",
  //   name: "Aurora",
  //   category: "Luxury · DTC Brand",
  //   description: "Premium skincare DTC site with cinematic product scenes.",
  //   tags: ["Next.js", "R3F", "Shopify"],
  //   href: "https://aurora-brandivibe.koyeb.app",
  //   video: "/work/aurora.webm",
  //   poster: "/work/aurora.jpg",
  //   gradient: "from-[#fde68a]/30 via-[#fb7185]/15 to-[#0a0a1e]",
  //   year: "2026",
  //   role: "Design · Build · 3D",
  // },
];
