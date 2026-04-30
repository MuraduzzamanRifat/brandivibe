import type { MetadataRoute } from "next";
import { loadBrain } from "@/lib/brain-storage";

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
    { url: `${SITE}/portfolio`, changeFrequency: "weekly", priority: 0.95, lastModified: now },
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
