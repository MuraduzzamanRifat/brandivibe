import { getOpenAI } from "../openai";
import { commitArticle, isGithubStorageEnabled } from "../github-storage";
import { addArticle, type Article, type ArticleSpec } from "../brain-storage";
import { scoreSEO } from "./seo";

/**
 * Article executor. Takes a planner ArticleSpec, generates a DALL-E hero
 * image, commits the MDX + PNG to the GitHub repo, and records the Article
 * in brain.json.
 */

type DalleResponse = {
  data: Array<{ url?: string; b64_json?: string }>;
};

async function generateHero(prompt: string): Promise<Buffer> {
  const openai = getOpenAI();
  const res = (await openai.images.generate({
    model: "dall-e-3",
    prompt: `${prompt}. High-end editorial magazine aesthetic, cinematic lighting, rich detail, no text overlay.`,
    size: "1792x1024",
    quality: "hd",
    response_format: "b64_json",
    n: 1,
  })) as unknown as DalleResponse;
  const b64 = res.data[0]?.b64_json;
  if (!b64) throw new Error("DALL-E returned no image");
  return Buffer.from(b64, "base64");
}

function buildMdx(spec: ArticleSpec, publishedAt: string): string {
  const fm = [
    "---",
    `title: ${JSON.stringify(spec.title)}`,
    `slug: ${spec.slug}`,
    `excerpt: ${JSON.stringify(spec.excerpt)}`,
    `primaryKeyword: ${JSON.stringify(spec.primaryKeyword)}`,
    `secondaryKeywords: ${JSON.stringify(spec.secondaryKeywords)}`,
    `heroImage: /journal/${spec.slug}-hero.png`,
    `publishedAt: ${publishedAt}`,
    "---",
    "",
  ].join("\n");
  return fm + spec.body.trim() + "\n";
}

export async function executeArticle(spec: ArticleSpec): Promise<Article> {
  const publishedAt = new Date().toISOString();
  const mdx = buildMdx(spec, publishedAt);

  let heroPng: Buffer | null = null;
  try {
    heroPng = await generateHero(spec.heroImagePrompt);
  } catch (err) {
    console.error("[executor] DALL-E failed, skipping image:", err);
  }

  if (isGithubStorageEnabled() && heroPng) {
    await commitArticle(spec.slug, mdx, heroPng);
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
    heroImage: `/journal/${spec.slug}-hero.png`,
    seoScore: seo.score,
    wordCount,
    publishedAt,
  };

  await addArticle(article);
  return article;
}
