import matter from "gray-matter";
import { marked } from "marked";
import { readFile } from "fs/promises";
import path from "path";
import articlesData from "@/data/articles.json";

/**
 * Article store for the journal.
 *
 * Metadata lives in src/data/articles.json (committed by the /admin panel).
 * Each article's body is a Markdown file at content/journal/<slug>.mdx.
 * Everything is read at build time — the site is a static export.
 */

export type ArticleMeta = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  heroImage: string;
  seoScore?: number;
  wordCount: number;
  publishedAt: string;
};

export function getArticles(): ArticleMeta[] {
  return (articlesData as ArticleMeta[]).slice();
}

export function getArticle(slug: string): ArticleMeta | undefined {
  return (articlesData as ArticleMeta[]).find((a) => a.slug === slug);
}

export type LoadedArticle = {
  frontmatter: {
    title: string;
    slug: string;
    excerpt: string;
    primaryKeyword: string;
    secondaryKeywords: string[];
    heroImage: string;
    publishedAt: string;
  };
  html: string;
};

const CONTENT_DIR = path.resolve(process.cwd(), "content", "journal");

export async function loadArticle(slug: string): Promise<LoadedArticle | null> {
  let raw: string;
  try {
    raw = await readFile(path.join(CONTENT_DIR, `${slug}.mdx`), "utf8");
  } catch {
    return null;
  }
  const { data, content } = matter(raw);
  const html = await marked.parse(content, { gfm: true, breaks: false });
  return {
    frontmatter: data as LoadedArticle["frontmatter"],
    html: typeof html === "string" ? html : String(html),
  };
}
