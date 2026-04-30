import type { RawArticle } from "./techcrunch";

/**
 * Brave Search API source. Runs targeted Google-dork-style queries that
 * surface companies pre-qualified to need exactly Brandivibe's service:
 * startups stuck on cheap platforms (Wix, Squarespace, generic Webflow).
 *
 * Why Brave instead of Google/SerpAPI:
 *   - Free tier: 2,000 queries/month (~2x what we need at 8 queries × 4 ticks/day)
 *   - No credit card required for the free tier
 *   - Identical result quality for site: operator searches
 *
 * Setup: BRAVE_SEARCH_API_KEY env var. Get one at https://brave.com/search/api/
 *
 * Returns RawArticle[] so the existing extractor pipeline picks it up
 * without any code changes downstream.
 */

const ENDPOINT = "https://api.search.brave.com/res/v1/web/search";
const PER_QUERY_RESULTS = 10;

// Each query targets a specific buyer signal combined with a "cheap platform"
// indicator. site: operators find companies HOSTED on the platform, while
// content keywords find ones who PUBLICLY mention being on it.
const QUERIES: Array<{ q: string; label: string }> = [
  { q: "site:wix.com SaaS", label: "Wix · SaaS" },
  { q: "site:wix.com fintech", label: "Wix · fintech" },
  { q: "site:squarespace.com startup", label: "Squarespace · startup" },
  { q: "site:squarespace.com agency", label: "Squarespace · agency" },
  { q: '"powered by webflow" series A', label: "Webflow · Series A" },
  { q: '"build with framer" startup', label: "Framer · startup" },
  { q: '"raised $1M" 2025 site:wix.com', label: "Wix · funded 2025" },
  { q: '"raised $5M" 2025 site:squarespace.com', label: "Squarespace · funded 2025" },
];

type BraveResult = {
  title?: string;
  url?: string;
  description?: string;
  age?: string;
};

type BraveResponse = {
  web?: { results?: BraveResult[] };
};

async function runQuery(query: string, label: string): Promise<RawArticle[]> {
  const key = process.env.BRAVE_SEARCH_API_KEY;
  if (!key) throw new Error("BRAVE_SEARCH_API_KEY not set");

  const url = `${ENDPOINT}?q=${encodeURIComponent(query)}&count=${PER_QUERY_RESULTS}&country=us&safesearch=off`;
  const res = await fetch(url, {
    headers: {
      "X-Subscription-Token": key,
      Accept: "application/json",
      "User-Agent": "Brandivibe/1.0 (+https://brandivibe.com)",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Brave Search ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = (await res.json()) as BraveResponse;
  const results = data.web?.results ?? [];

  return results
    .filter((r): r is BraveResult & { url: string; title: string } => Boolean(r.url && r.title))
    .map((r) => ({
      title: r.title,
      description: `${label} — ${(r.description ?? "").slice(0, 400)}`,
      link: r.url,
      pubDate: r.age ?? "",
      creator: "",
      // Re-use techcrunch as the union member; downstream extractor doesn't
      // care about the source label, just needs a valid RawArticle shape.
      source: "techcrunch" as const,
    }));
}

export async function fetchBraveSearchProspects(): Promise<RawArticle[]> {
  if (!process.env.BRAVE_SEARCH_API_KEY) return [];

  const results = await Promise.allSettled(QUERIES.map((q) => runQuery(q.q, q.label)));

  const articles: RawArticle[] = [];
  const seen = new Set<string>();
  for (const r of results) {
    if (r.status === "rejected") continue;
    for (const article of r.value) {
      // Filter out obvious junk: blog posts, support pages, marketplace listings
      const u = article.link.toLowerCase();
      if (
        u.includes("/blog/") ||
        u.includes("/support/") ||
        u.includes("/help/") ||
        u.includes("/templates/") ||
        u.includes("/marketplace/")
      ) continue;
      if (seen.has(article.link)) continue;
      seen.add(article.link);
      articles.push(article);
    }
  }
  return articles;
}
