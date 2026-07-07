import matter from "gray-matter";
import { marked } from "marked";
import { readFile } from "fs/promises";
import path from "path";
import data from "@/data/case-studies.json";

/**
 * Case-study (portfolio) store — mirrors the article store.
 *
 * Metadata lives in src/data/case-studies.json (committed by the /admin panel).
 * Each case study's write-up is a Markdown file at content/case-studies/<slug>.mdx.
 * Read at build time — the site is a static export.
 */

export type CaseMetric = { label: string; value: string };

export type CaseStudyMeta = {
  id: string;
  slug: string;
  title: string;
  client: string;
  industry: string;
  services: string[];
  excerpt: string;
  heroImage: string;
  metrics: CaseMetric[];
  featured?: boolean;
  publishedAt: string;
};

function all(): CaseStudyMeta[] {
  return (data as CaseStudyMeta[]).slice();
}

export function getCaseStudies(): CaseStudyMeta[] {
  return all().sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getFeaturedCaseStudies(limit = 3): CaseStudyMeta[] {
  const sorted = getCaseStudies();
  const featured = sorted.filter((c) => c.featured);
  return (featured.length ? featured : sorted).slice(0, limit);
}

export function getCaseStudy(slug: string): CaseStudyMeta | undefined {
  return all().find((c) => c.slug === slug);
}

export type LoadedCaseStudy = {
  frontmatter: {
    title: string;
    slug: string;
    client: string;
    excerpt: string;
    heroImage: string;
    publishedAt: string;
  };
  html: string;
};

const CONTENT_DIR = path.resolve(process.cwd(), "content", "case-studies");

export async function loadCaseStudy(slug: string): Promise<LoadedCaseStudy | null> {
  let raw: string;
  try {
    raw = await readFile(path.join(CONTENT_DIR, `${slug}.mdx`), "utf8");
  } catch {
    return null;
  }
  const { data: fm, content } = matter(raw);
  const html = await marked.parse(content, { gfm: true, breaks: false });
  return {
    frontmatter: fm as LoadedCaseStudy["frontmatter"],
    html: typeof html === "string" ? html : String(html),
  };
}
