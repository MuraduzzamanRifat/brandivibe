import type { RawArticle } from "./techcrunch";

/**
 * Hacker News "Show HN" source via the free Algolia API. Returns recent
 * Show HN posts — founders announcing they've shipped something new, often
 * with a bare-bones website. Strong ICP match for Brandivibe.
 *
 * API: https://hn.algolia.com/api/v1/search_by_date?tags=show_hn
 * No auth, generous rate limit.
 */

const API_URL =
  "https://hn.algolia.com/api/v1/search_by_date?tags=show_hn&hitsPerPage=30";

type HnHit = {
  objectID: string;
  title?: string;
  story_text?: string;
  url?: string;
  author?: string;
  created_at?: string;
};

type HnResponse = {
  hits: HnHit[];
};

export async function fetchHackerNewsShowHN(): Promise<RawArticle[]> {
  const res = await fetch(API_URL, {
    headers: { "User-Agent": "Brandivibe/1.0 (+https://brandivibe.com)" },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`HN Algolia ${res.status}`);
  const data = (await res.json()) as HnResponse;

  const items: RawArticle[] = [];
  for (const hit of data.hits ?? []) {
    // Only keep Show HNs that link to an external URL (not self-text posts).
    // Self-text ones can't be scraped as a website.
    if (!hit.title || !hit.url) continue;
    // Strip the "Show HN: " prefix for cleaner titles fed to the extractor.
    const cleanTitle = hit.title.replace(/^show hn:\s*/i, "");
    items.push({
      title: cleanTitle,
      description: (hit.story_text || "").slice(0, 500),
      link: hit.url,
      pubDate: hit.created_at || "",
      creator: hit.author || "",
      source: "hackernews",
    });
  }
  return items;
}
