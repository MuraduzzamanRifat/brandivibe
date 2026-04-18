import type { ScrapedSite } from "../brain-storage";

/**
 * Detects whether a prospect's website is ALREADY premium-designed — in
 * which case Brandivibe should NOT pitch them (they don't need us).
 *
 * We reject a prospect if any of these are true:
 *   - Design score is already 7+ (heuristic site quality)
 *   - Tech stack contains 3D / WebGL / advanced animation libraries
 *   - HTML contains unmistakable premium markers (Spline embed, Lottie,
 *     custom shader canvas, video hero, etc.)
 *
 * The point: Brandivibe targets founders whose site looks cheap or
 * basic — Squarespace, Wordpress Elementor, plain Next.js landing,
 * early-stage template sites. Not studios that already invested $20K+.
 */

const PREMIUM_ANIMATION_TECH = [
  "three.js",
  "threejs",
  "@react-three/fiber",
  "@react-three/drei",
  "r3f",
  "webgl",
  "gsap",
  "lottie",
  "spline",
  "framer-motion",
  "motion.dev",
  "rive",
];

// Regex markers that appear in the raw HTML of sites using premium stacks.
// Tuned to minimize false positives — each pattern corresponds to a real
// production integration (not just a word mention in a blog post).
const PREMIUM_HTML_MARKERS: RegExp[] = [
  /<canvas[^>]*(?:webgl|three|r3f)/i,
  /my\.spline\.design|spline\.design\/embed/i,
  /lottiefiles\.com\/(?:animations|players)/i,
  /"\s*@react-three\s*\//i,
  /threejs\.org/i,
  /rive\.app\/(?:community|public)/i,
  /gsap\.(?:registerPlugin|timeline|to|from)\b/i,
  /data-framer-name=/i, // indicates a Framer-hosted site (premium template service)
  /\.webflow\.io\/|cdn\.webflow\.com/i, // high-end Webflow sites
];

const DESIGN_SCORE_PREMIUM_CUTOFF = 7;

export type PremiumDetectResult = {
  isPremium: boolean;
  reasons: string[];
  matchedTech: string[];
  matchedMarkers: string[];
};

export function detectPremiumDesign(scraped: ScrapedSite): PremiumDetectResult {
  const reasons: string[] = [];
  const matchedTech: string[] = [];
  const matchedMarkers: string[] = [];

  // 1. Design score gate
  if (scraped.designScore >= DESIGN_SCORE_PREMIUM_CUTOFF) {
    reasons.push(`design score ${scraped.designScore}/10 is already premium (cutoff ${DESIGN_SCORE_PREMIUM_CUTOFF})`);
  }

  // 2. Tech stack gate
  const stackLower = scraped.techStack.map((t) => t.toLowerCase());
  for (const tech of PREMIUM_ANIMATION_TECH) {
    if (stackLower.some((s) => s.includes(tech))) {
      matchedTech.push(tech);
    }
  }
  if (matchedTech.length > 0) {
    reasons.push(`tech stack already includes premium animation libs: ${matchedTech.join(", ")}`);
  }

  // 3. Raw HTML marker gate
  for (const pattern of PREMIUM_HTML_MARKERS) {
    const match = scraped.rawHomepage.match(pattern);
    if (match) {
      matchedMarkers.push(match[0].slice(0, 60));
      if (matchedMarkers.length >= 3) break; // no point collecting more
    }
  }
  if (matchedMarkers.length > 0) {
    reasons.push(`HTML contains premium markers: ${matchedMarkers.length} found`);
  }

  return {
    isPremium: reasons.length > 0,
    reasons,
    matchedTech,
    matchedMarkers,
  };
}
