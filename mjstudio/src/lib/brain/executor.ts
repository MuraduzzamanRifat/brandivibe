import { commitArticle, isGithubStorageEnabled } from "../github-storage";
import { addArticle, type Article, type ArticleSpec } from "../brain-storage";
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

async function fetchPexelsHero(query: string): Promise<{ buffer: Buffer; credit: string; creditUrl: string }> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) throw new Error("PEXELS_API_KEY not set");

  // Use the primary keyword / image prompt as search query — strip art-direction
  // words so we get clean editorial photography
  const cleanQuery = query
    .replace(/\b(3d render|cinematic|photorealistic|high.end|editorial|magazine|aesthetic|no text|overlay|lighting|composition)\b/gi, "")
    .trim()
    .slice(0, 100);

  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(cleanQuery)}&per_page=5&orientation=landscape`;
  const res = await fetch(url, {
    headers: { Authorization: key },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`Pexels API ${res.status}: ${await res.text()}`);

  const data = (await res.json()) as PexelsResponse;
  const photo = data.photos?.[0];
  if (!photo) throw new Error(`No Pexels results for query: "${cleanQuery}"`);

  // Download the large2x version (1880px wide — good for hero)
  const imgRes = await fetch(photo.src.large2x, { signal: AbortSignal.timeout(20_000) });
  if (!imgRes.ok) throw new Error(`Pexels image download failed: ${imgRes.status}`);
  const arrayBuffer = await imgRes.arrayBuffer();

  return {
    buffer: Buffer.from(arrayBuffer),
    credit: photo.photographer,
    creditUrl: photo.photographer_url,
  };
}

function buildMdx(spec: ArticleSpec, publishedAt: string, photoCredit?: { name: string; url: string }): string {
  const fm = [
    "---",
    `title: ${JSON.stringify(spec.title)}`,
    `slug: ${spec.slug}`,
    `excerpt: ${JSON.stringify(spec.excerpt)}`,
    `primaryKeyword: ${JSON.stringify(spec.primaryKeyword)}`,
    `secondaryKeywords: ${JSON.stringify(spec.secondaryKeywords)}`,
    `heroImage: /journal/${spec.slug}-hero.jpg`,
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

  let heroBuffer: Buffer | null = null;
  let photoCredit: { name: string; url: string } | undefined;

  try {
    const pexels = await fetchPexelsHero(spec.heroImagePrompt || spec.primaryKeyword);
    heroBuffer = pexels.buffer;
    photoCredit = { name: pexels.credit, url: pexels.creditUrl };
  } catch (err) {
    console.error("[executor] Pexels fetch failed, skipping image:", err);
  }

  const mdx = buildMdx(spec, publishedAt, photoCredit);

  if (isGithubStorageEnabled() && heroBuffer) {
    await commitArticle(spec.slug, mdx, heroBuffer);
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
    heroImage: `/journal/${spec.slug}-hero.jpg`,
    seoScore: seo.score,
    wordCount,
    publishedAt,
  };

  await addArticle(article);
  return article;
}
