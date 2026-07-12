import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/articles";
import { getCaseStudies } from "@/lib/case-studies";
import { services } from "@/data/services";
import { industries } from "@/data/industries";
import { glossary } from "@/data/glossary";

// Regenerated periodically so CMS-published articles/case studies appear.
export const revalidate = 3600;

const SITE = "https://brandivibe.com";
const PORTFOLIO_SLUGS = [
  "helix", "neuron", "axiom", "pulse", "aurora", "orbit", "monolith", "atrium",
  "uturn", "kindred", "ironwood", "terroir", "octane",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles();
  const caseStudies = await getCaseStudies().catch(() => []);

  // No lastModified on static routes: stamping regeneration time made every
  // entry "change" hourly, which teaches crawlers the field is meaningless.
  // Real dates are kept only where we genuinely know them (articles, case
  // studies below).
  const staticRoutes: MetadataRoute.Sitemap = [
    // Homepage URL matches its canonical exactly (no trailing slash).
    { url: SITE, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/portfolio`, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE}/services`, changeFrequency: "monthly", priority: 0.95 },
    { url: `${SITE}/industries`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE}/glossary`, changeFrequency: "monthly", priority: 0.8 },
    // AI-citation-optimized glossary pages — definitional content for
    // "what is X" queries on ChatGPT, Perplexity, Google AI Overviews.
    ...glossary.map((g) => ({
      url: `${SITE}/glossary/${g.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...services.map((s) => ({
      url: `${SITE}/services/${s.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    // Programmatic SEO: the full service × industry matrix of long-tail
    // commercial-intent landing pages.
    ...services.flatMap((s) =>
      industries.map((i) => ({
        url: `${SITE}/services/${s.slug}/${i.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }))
    ),
    { url: `${SITE}/audit`, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE}/contact`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/case-studies`, changeFrequency: "weekly", priority: 0.95 },
    ...caseStudies.map((c) => ({
      url: `${SITE}/case-studies/${c.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
      ...(c.publishedAt ? { lastModified: new Date(c.publishedAt) } : {}),
    })),
    { url: `${SITE}/journal`, changeFrequency: "daily", priority: 0.9 },
    // Legal pages — the footer linked to these from every page while they 404'd.
    { url: `${SITE}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE}/refund-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE}/poster`, changeFrequency: "monthly", priority: 0.5 },
    // Demo/showcase pages: kept crawlable but below money pages — they
    // mostly dead-end and shouldn't outrank /about or the journal.
    ...PORTFOLIO_SLUGS.map((d) => ({
      url: `${SITE}/${d}`,
      changeFrequency: "monthly" as const,
      priority: 0.55,
    })),
  ];

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE}/journal/${a.slug}`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Server deployment (Vercel) canonicals are non-trailing-slash — emit URLs
  // that match the canonical tags exactly, never redirects.
  return [...staticRoutes, ...articleRoutes];
}
