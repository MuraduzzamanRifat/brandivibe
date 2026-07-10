/**
 * Which glossary terms a service page should link out to.
 *
 * The 12 term pages exist to be cited by AI search for "what is X" queries, but
 * nothing outside /glossary linked into them — so they sat as an island with no
 * internal authority flowing in. Service pages are the right source: a visitor
 * reading about WebGL work is exactly who wants "what is a WebGL website?".
 *
 * Only genuinely-related terms are listed. A service with no matching term gets
 * no module rather than a padded one — an irrelevant link is worse than none.
 */

const MAP: Record<string, readonly string[]> = {
  // --- Web Development
  "website-development": ["premium-website-design", "conversion-focused-web-design"],
  "webgl-3d-experiences": ["webgl-website", "3d-website", "cinematic-web-design"],
  "ecommerce-website": ["high-conversion-website", "conversion-focused-web-design"],
  "website-speed-optimization": ["high-conversion-website"],

  // --- Creative Design
  "ui-ux-design": ["conversion-rate-optimization", "conversion-focused-web-design"],

  // --- AI & Automation
  "ai-automation-systems": ["ai-automation-system"],
  "ai-agent-development": ["custom-ai-agent", "ai-sales-brain"],
  "ai-content-engine": ["autonomous-content-marketing"],

  // --- Digital Marketing
  "seo-services": ["generative-engine-optimization"],
  "seo-audit": ["generative-engine-optimization"],
  "ecommerce-seo": ["high-conversion-website"],

  // --- Software
  "ecommerce-platform": ["high-conversion-website"],
};

/** Glossary slugs related to a service, or an empty list when none genuinely are. */
export function glossaryForService(serviceSlug: string): readonly string[] {
  return MAP[serviceSlug] ?? [];
}
