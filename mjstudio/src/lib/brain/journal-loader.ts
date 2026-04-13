import matter from "gray-matter";
import { marked } from "marked";
import { getRawFile, isGithubStorageEnabled } from "../github-storage";
import { readFile } from "fs/promises";
import path from "path";

/**
 * Loads a published journal article from disk or from GitHub.
 *
 * During normal operation the executor commits MDX files to
 * `mjstudio/content/journal/<slug>.mdx` in the repo. When a request comes
 * in for /journal/<slug>, this loader:
 *   1. tries the local disk (works in dev + immediately after deploy)
 *   2. falls back to GitHub Contents API so freshly generated articles are
 *      visible without waiting for a Koyeb rebuild
 */

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
  raw: string;
};

const CONTENT_DIR = path.resolve(process.cwd(), "content", "journal");

async function loadRaw(slug: string): Promise<string | null> {
  try {
    return await readFile(path.join(CONTENT_DIR, `${slug}.mdx`), "utf8");
  } catch {
    // fall through to GitHub
  }
  if (isGithubStorageEnabled()) {
    try {
      return await getRawFile(`mjstudio/content/journal/${slug}.mdx`);
    } catch {
      return null;
    }
  }
  return null;
}

export async function loadArticle(slug: string): Promise<LoadedArticle | null> {
  const raw = await loadRaw(slug);
  if (!raw) return null;
  const { data, content } = matter(raw);
  const html = await marked.parse(content, { gfm: true, breaks: false });
  return {
    frontmatter: data as LoadedArticle["frontmatter"],
    html: typeof html === "string" ? html : String(html),
    raw,
  };
}
