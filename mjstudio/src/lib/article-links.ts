/**
 * Contextual internal links from each journal essay to the money page it
 * actually supports, plus the glossary term it defines.
 *
 * Before this, every essay linked only to the diffuse `/services#web-development`
 * pillar anchor and nothing linked into the glossary — leaving 12 term pages as
 * an island. Descriptive anchors from topical essays into the matching service
 * page are the internal-linking signal search engines (and LLMs) read as
 * "this site has depth here".
 *
 * Deliberately varied: pointing all twelve at the same service would waste the
 * signal. Each essay maps to the service it genuinely argues for.
 */

export type ArticleLinks = {
  /** Slug of a service detail page under /services/<slug>. */
  service: string;
  /** Slug of a term page under /glossary/<slug>. */
  glossary: string;
};

const DEFAULT_LINKS: ArticleLinks = {
  service: "website-development",
  glossary: "premium-website-design",
};

const MAP: Record<string, ArticleLinks> = {
  // --- 3D / WebGL essays -> the WebGL service
  "3d-website-design-roi-worth-more-than-deck": {
    service: "webgl-3d-experiences",
    glossary: "3d-website",
  },
  "premium-3d-web-design-for-startups-outshines": {
    service: "webgl-3d-experiences",
    glossary: "webgl-website",
  },

  // --- conversion / psychology essays -> product & UX design
  "behavioral-science-premium-web-design-startups": {
    service: "ui-ux-design",
    glossary: "conversion-rate-optimization",
  },
  "saas-homepage-that-converts-importance": {
    service: "ui-ux-design",
    glossary: "high-conversion-website",
  },
  "startup-homepage-strategic-advantage": {
    service: "ui-ux-design",
    glossary: "conversion-focused-web-design",
  },

  // --- craft / first-impression essays -> website development
  "premium-web-design-startups": DEFAULT_LINKS,
  "premium-web-design-first-impressions": {
    service: "website-development",
    glossary: "premium-website-design",
  },
  "premium-web-design-startups-separates-best": {
    service: "website-development",
    glossary: "cinematic-web-design",
  },
  "cheap-websites-kill-premium-opportunities": {
    service: "website-development",
    glossary: "premium-website-design",
  },
  "cost-mediocre-first-impressions-premium-web-design-startups": {
    service: "website-development",
    glossary: "conversion-focused-web-design",
  },
  "roi-premium-web-design-startups": {
    service: "website-development",
    glossary: "high-conversion-website",
  },
  "impact-premium-web-design-startups-case-study": {
    service: "website-development",
    glossary: "high-conversion-website",
  },
};

export function linksForArticle(slug: string): ArticleLinks {
  return MAP[slug] ?? DEFAULT_LINKS;
}
