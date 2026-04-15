import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadArticle } from "@/lib/brain/journal-loader";
import { loadBrain } from "@/lib/brain-storage";
import "./article.css";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brain = await loadBrain();
  const meta = (brain.articles ?? []).find((a) => a.slug === slug);
  if (!meta) return { title: "Not found" };
  return {
    title: `${meta.title} · Brandivibe Journal`,
    description: meta.excerpt,
    keywords: [meta.primaryKeyword, ...meta.secondaryKeywords],
    alternates: { canonical: `/journal/${slug}` },
    openGraph: {
      title: meta.title,
      description: meta.excerpt,
      url: `/journal/${slug}`,
      type: "article",
      publishedTime: meta.publishedAt,
      images: meta.heroImage ? [{ url: meta.heroImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.excerpt,
      images: meta.heroImage ? [meta.heroImage] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await loadArticle(slug);
  if (!article) notFound();

  const { frontmatter, html } = article;
  const brain = await loadBrain();
  const meta = (brain.articles ?? []).find((a) => a.slug === slug);

  const articleSchema = meta
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: frontmatter.title,
        description: frontmatter.excerpt,
        datePublished: frontmatter.publishedAt,
        dateModified: frontmatter.publishedAt,
        author: {
          "@type": "Organization",
          name: "Brandivibe",
          url: "https://brandivibe.com",
        },
        publisher: {
          "@type": "Organization",
          "@id": "https://brandivibe.com/#organization",
          name: "Brandivibe",
          url: "https://brandivibe.com",
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://brandivibe.com/journal/${slug}`,
        },
        ...(frontmatter.heroImage && {
          image: {
            "@type": "ImageObject",
            url: frontmatter.heroImage.startsWith("http")
              ? frontmatter.heroImage
              : `https://brandivibe.com${frontmatter.heroImage}`,
          },
        }),
        keywords: meta.secondaryKeywords?.join(", "),
        wordCount: meta.wordCount,
        articleSection: "Website conversion & design",
        about: {
          "@type": "Thing",
          name: meta.primaryKeyword,
        },
      }
    : null;

  return (
    <main className="min-h-screen bg-[#08080a] text-white">
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
      <article className="journal-article mx-auto max-w-3xl px-6 md:px-10 py-24">
        <header className="mb-12">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[#84e1ff] mb-4">
            — Brandivibe Journal
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-balance mb-6">
            {frontmatter.title}
          </h1>
          <p className="text-white/60 text-lg">{frontmatter.excerpt}</p>
          <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
            {new Date(frontmatter.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </header>

        {frontmatter.heroImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={frontmatter.heroImage}
            alt={frontmatter.title}
            className="w-full rounded-2xl mb-16 border border-white/10"
          />
        )}

        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <footer className="mt-24 pt-8 border-t border-white/10 text-white/40 text-sm flex items-center justify-between">
          <Link href="/journal" className="hover:text-white">← All journal posts</Link>
          <Link href="/contact" className="hover:text-white">Work with Brandivibe →</Link>
        </footer>
      </article>
    </main>
  );
}
