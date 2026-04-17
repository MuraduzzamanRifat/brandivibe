import { commitArticle, isGithubStorageEnabled } from "../github-storage";
import { addArticle, loadBrain, type Article, type ArticleSpec } from "../brain-storage";
import { scoreSEO } from "./seo";

/**
 * Article executor. Takes a planner ArticleSpec, fetches a hero image from
 * Pexels (free, no generation cost), commits the MDX + PNG to the GitHub
 * repo, and records the Article in brain.json.
 *
 * Requires: PEXELS_API_KEY env var (free at pexels.com/api)
 */

type PexelsPhoto = {
  src: { original: string; large2x: string };
  photographer: string;
  photographer_url: string;
  url: string;
};

type PexelsResponse = {
  photos: PexelsPhoto[];
};

async function fetchPexelsHero(
  query: string,
  usedImageUrls: Set<string>
): Promise<{ imageUrl: string; credit: string; creditUrl: string }> {
  const key: string | undefined = process.env.PEXELS_API_KEY;
  if (!key) throw new Error("PEXELS_API_KEY not set");
  const authHeader = key; // narrowed for closures

  const cleanQuery = query
    .replace(/\b(3d render|cinematic|photorealistic|high.end|editorial|magazine|aesthetic|no text|overlay|lighting|composition)\b/gi, "")
    .trim()
    .slice(0, 100);

  // Fetch a wide pool of candidates (30) across 2 pages so we have many
  // unique photos to choose from — prevents back-to-back duplicates.
  async function fetchPage(page: number): Promise<PexelsPhoto[]> {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(cleanQuery)}&per_page=15&page=${page}&orientation=landscape`;
    const res = await fetch(url, {
      headers: { Authorization: authHeader },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) throw new Error(`Pexels API ${res.status}: ${await res.text()}`);
    const data = (await res.json()) as PexelsResponse;
    return data.photos ?? [];
  }

  const pool = [...(await fetchPage(1)), ...(await fetchPage(2).catch(() => []))];
  if (pool.length === 0) throw new Error(`No Pexels results for query: "${cleanQuery}"`);

  // Prefer photos we haven't used before; fall back to random if all used.
  const unused = pool.filter((p) => !usedImageUrls.has(p.src.large2x));
  const candidates = unused.length > 0 ? unused : pool;
  const picked = candidates[Math.floor(Math.random() * candidates.length)];

  return {
    imageUrl: picked.src.large2x,
    credit: picked.photographer,
    creditUrl: picked.photographer_url,
  };
}

function buildMdx(spec: ArticleSpec, publishedAt: string, heroImageUrl?: string, photoCredit?: { name: string; url: string }): string {
  const fm = [
    "---",
    `title: ${JSON.stringify(spec.title)}`,
    `slug: ${spec.slug}`,
    `excerpt: ${JSON.stringify(spec.excerpt)}`,
    `primaryKeyword: ${JSON.stringify(spec.primaryKeyword)}`,
    `secondaryKeywords: ${JSON.stringify(spec.secondaryKeywords)}`,
    heroImageUrl ? `heroImage: ${JSON.stringify(heroImageUrl)}` : "",
    photoCredit ? `heroCredit: ${JSON.stringify(photoCredit.name)}` : "",
    photoCredit ? `heroCreditUrl: ${JSON.stringify(photoCredit.url)}` : "",
    `publishedAt: ${publishedAt}`,
    "---",
    "",
  ].filter(Boolean).join("\n");
  return fm + spec.body.trim() + "\n";
}

export async function executeArticle(spec: ArticleSpec): Promise<Article> {
  const publishedAt = new Date().toISOString();

  // Collect all previously-used hero image URLs so we don't pick one again.
  const brain = await loadBrain();
  const usedImageUrls = new Set(
    (brain.articles ?? [])
      .map((a) => a.heroImage)
      .filter((u): u is string => Boolean(u))
  );

  let heroImageUrl: string | undefined;
  let photoCredit: { name: string; url: string } | undefined;

  try {
    const pexels = await fetchPexelsHero(
      spec.heroImagePrompt || spec.primaryKeyword,
      usedImageUrls
    );
    heroImageUrl = pexels.imageUrl;
    photoCredit = { name: pexels.credit, url: pexels.creditUrl };
  } catch (err) {
    console.error("[executor] Pexels fetch failed, skipping image:", err);
  }

  const mdx = buildMdx(spec, publishedAt, heroImageUrl, photoCredit);

  if (isGithubStorageEnabled()) {
    // Commit MDX only — hero image is served from Pexels CDN directly,
    // no need to download and re-commit binary files to GitHub.
    await commitArticle(spec.slug, mdx, null);
  }

  const seo = scoreSEO({
    title: spec.title,
    excerpt: spec.excerpt,
    body: spec.body,
    primaryKeyword: spec.primaryKeyword,
  });
  const wordCount = spec.body.split(/\s+/).filter(Boolean).length;

  const article: Article = {
    id: `art_${Date.now()}`,
    slug: spec.slug,
    title: spec.title,
    excerpt: spec.excerpt,
    primaryKeyword: spec.primaryKeyword,
    secondaryKeywords: spec.secondaryKeywords,
    heroImage: heroImageUrl || "",
    seoScore: seo.score,
    wordCount,
    publishedAt,
  };

  await addArticle(article);
  return article;
}
