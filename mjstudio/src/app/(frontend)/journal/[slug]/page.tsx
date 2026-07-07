import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { loadArticle, getArticle, getArticles } from "@/lib/articles";
import { WarmNav } from "@/components/warm/WarmNav";
import { WarmFooter } from "@/components/warm/WarmFooter";
import { CtaInline } from "@/components/warm/Cta";
import "./article.css";

// Pre-render every article at build time so the static-export build can
// generate one HTML file per article — enumerated from src/data/articles.json.
export const dynamic = "force-static";
// Required for `output: "export"` — no dynamicParams fallback in a static export.
export const dynamicParams = false;

export async function generateStaticParams() {
  let slugs: string[] = [];
  try {
    slugs = (await getArticles()).map((a) => a.slug);
  } catch {
    slugs = [];
  }
  // `output: "export"` rejects a dynamic route that yields zero params.
  // No articles yet (fresh CI build) → one placeholder the page 404s.
  if (slugs.length === 0) return [{ slug: "__none__" }];
  return slugs.map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = await getArticle(slug);
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
  const meta = await getArticle(slug);

  // Article schema with Person author — E-E-A-T upgrade for AI search.
  // ChatGPT, Perplexity, and Google AI Overviews weight named individual
  // authorship more than Organization authorship, especially for YMYL
  // and expert-domain topics.
  const articleSchema = meta
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: frontmatter.title,
        description: frontmatter.excerpt,
        datePublished: frontmatter.publishedAt,
        dateModified: frontmatter.publishedAt,
        author: {
          "@type": "Person",
          name: "Muraduzzaman",
          url: "https://brandivibe.com/about",
          jobTitle: "Founder & Lead Engineer at Brandivibe",
          worksFor: {
            "@type": "Organization",
            "@id": "https://brandivibe.com/#organization",
            name: "Brandivibe",
          },
          knowsAbout: [
            "WebGL website development",
            "AI automation systems",
            "Custom AI agent development",
            "Conversion-focused web design",
            "Generative engine optimization",
            "Digital marketing strategy",
          ],
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
    <>
      <WarmNav />
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
      <main>
        <article className="journal-article mx-auto max-w-[760px] px-5 sm:px-8 pt-36 md:pt-40 pb-16">
          <header className="mb-10">
            <Link
              href="/journal"
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.16em] text-muted hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> The Journal
            </Link>
            <h1 className="mt-5 font-display text-4xl md:text-6xl font-semibold tracking-tight text-balance mb-6">
              {frontmatter.title}
            </h1>
            <p className="text-foreground/70 text-lg leading-relaxed text-pretty">
              {frontmatter.excerpt}
            </p>
            <div className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
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
              className="w-full rounded-2xl mb-14 border border-border"
            />
          )}

          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          <div className="mt-14">
            <CtaInline text="Enjoying the read? Let's turn these ideas into your next site." />
          </div>

          <footer className="mt-20 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm">
            <Link
              href="/journal"
              className="inline-flex items-center gap-1.5 text-foreground/70 hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> All journal posts
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-primary font-medium hover:text-primary-deep transition-colors"
            >
              Work with Brandivibe <ArrowRight className="h-4 w-4" />
            </Link>
          </footer>
        </article>
      </main>
      <WarmFooter />
    </>
  );
}
