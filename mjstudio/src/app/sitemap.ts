import type { MetadataRoute } from "next";
import { loadBrain } from "@/lib/brain-storage";
import { services } from "@/data/services";
import { industries } from "@/data/industries";
import { glossary } from "@/data/glossary";

const SITE = "https://brandivibe.com";
const PORTFOLIO_SLUGS = [
  "helix", "neuron", "axiom", "pulse", "aurora", "orbit", "monolith", "atrium",
  "uturn", "kindred", "ironwood", "terroir",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const brain = await loadBrain();
  const articles = brain.articles ?? [];

  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, changeFrequency: "weekly", priority: 1, lastModified: now },
    { url: `${SITE}/about`, changeFrequency: "monthly", priority: 0.7, lastModified: now },
    { url: `${SITE}/portfolio`, changeFrequency: "weekly", priority: 0.95, lastModified: now },
    { url: `${SITE}/services`, changeFrequency: "monthly", priority: 0.95, lastModified: now },
    { url: `${SITE}/industries`, changeFrequency: "monthly", priority: 0.85, lastModified: now },
    { url: `${SITE}/glossary`, changeFrequency: "monthly", priority: 0.8, lastModified: now },
    // AI-citation-optimized glossary pages — definitional content for
    // "what is X" queries on ChatGPT, Perplexity, Google AI Overviews.
    ...glossary.map((g) => ({
      url: `${SITE}/glossary/${g.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      lastModified: now,
    })),
    ...services.map((s) => ({
      url: `${SITE}/services/${s.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.85,
      lastModified: now,
    })),
    // Programmatic SEO: 5 services × 8 industries = 40 long-tail
    // commercial-intent landing pages.
    ...services.flatMap((s) =>
      industries.map((i) => ({
        url: `${SITE}/services/${s.slug}/${i.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        lastModified: now,
      }))
    ),
    { url: `${SITE}/audit`, changeFrequency: "weekly", priority: 0.95, lastModified: now },
    { url: `${SITE}/journal`, changeFrequency: "daily", priority: 0.9, lastModified: now },
    { url: `${SITE}/poster`, changeFrequency: "monthly", priority: 0.5, lastModified: now },
    ...PORTFOLIO_SLUGS.map((d) => ({
      url: `${SITE}/${d}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      lastModified: now,
    })),
  ];

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE}/journal/${a.slug}`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...articleRoutes];
}
