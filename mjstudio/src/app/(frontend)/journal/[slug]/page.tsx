import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { loadArticle, getArticle, getArticles } from "@/lib/articles";
import { WarmNav } from "@/components/warm/WarmNav";
import { WarmFooter } from "@/components/warm/WarmFooter";
import { CtaInline } from "@/components/warm/Cta";
import { ResponsiveMedia } from "@/components/ResponsiveMedia";
import { linksForArticle } from "@/lib/article-links";
import { services } from "@/data/services";
import { glossary } from "@/data/glossary";
import "./article.css";

// ISR: article edits/new posts from the admin appear live within 5 minutes,
// and brand-new slugs render on demand — no redeploy needed.
export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    return (await getArticles()).map((a) => ({ slug: a.slug }));
  } catch {
    return [];
  }
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
  const moreArticles = (await getArticles()).filter((a) => a.slug !== slug).slice(0, 3);

  // Contextual internal links out of this essay (see lib/article-links.ts).
  const { service: serviceSlug, glossary: glossarySlug } = linksForArticle(slug);
  const relatedService = services.find((s) => s.slug === serviceSlug) ?? null;
  const relatedTerm = glossary.find((g) => g.slug === glossarySlug) ?? null;

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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://brandivibe.com" },
      { "@type": "ListItem", position: 2, name: "Journal", item: "https://brandivibe.com/journal" },
      { "@type": "ListItem", position: 3, name: frontmatter.title, item: `https://brandivibe.com/journal/${slug}` },
    ],
  };

  return (
    <>
      <WarmNav />
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
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
            {/* Visible byline — matches the Person author declared in the Article schema. */}
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1">
              <Link href="/about" className="font-medium text-foreground hover:text-primary-strong transition-colors">
                Muraduzzaman
              </Link>
              <span className="text-muted text-sm">Founder &amp; Lead Engineer, Brandivibe</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                ·{" "}
                {new Date(frontmatter.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </header>

          {frontmatter.heroImage && (
            // MDX frontmatter carries no intrinsic size, so this renders as a
            // plain eager <img> — see ResponsiveMedia for why we don't guess.
            <ResponsiveMedia
              src={frontmatter.heroImage}
              alt={frontmatter.title}
              width={0}
              height={0}
              priority
              className="rounded-2xl mb-14 border border-border"
            />
          )}

          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {/* Contextual internal links: a descriptive anchor from this essay into
              the service it argues for, and into the term it defines. Keeps the
              glossary from being an island and gives the money pages topical
              support. */}
          {(relatedService || relatedTerm) && (
            <aside className="mt-14 rounded-[28px] border border-border bg-surface-2 p-7 md:p-8">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary-strong">
                — Where this shows up in our work
              </p>
              <div className="mt-4 space-y-3 text-lg text-foreground/80 leading-relaxed">
                {relatedService && (
                  <p>
                    If this is the standard you want, read how we approach{" "}
                    <Link
                      href={`/services/${relatedService.slug}`}
                      className="font-medium text-primary-strong underline underline-offset-4 hover:text-primary-deep"
                    >
                      {relatedService.title.toLowerCase()}
                    </Link>
                    .
                  </p>
                )}
                {relatedTerm && (
                  <p className="text-foreground/70 text-base">
                    New to the term?{" "}
                    <Link
                      href={`/glossary/${relatedTerm.slug}`}
                      className="font-medium text-primary-strong underline underline-offset-4 hover:text-primary-deep"
                    >
                      What is {relatedTerm.term.toLowerCase()}?
                    </Link>
                  </p>
                )}
              </div>
            </aside>
          )}

          <div className="mt-14">
            <CtaInline text="Enjoying the read? Let's turn these ideas into your next site." />
          </div>

          {moreArticles.length > 0 && (
            <section className="mt-16 pt-10 border-t border-border">
              <h2 className="font-display text-2xl font-semibold tracking-tight">More from the journal</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-3">
                {moreArticles.map((a) => (
                  <Link key={a.slug} href={`/journal/${a.slug}`} className="card-soft lift p-5 block">
                    <h3 className="font-display text-base font-semibold leading-snug line-clamp-2">{a.title}</h3>
                    <p className="mt-2 text-foreground/65 text-sm line-clamp-2 leading-relaxed">{a.excerpt}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <footer className="mt-20 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm">
            <Link
              href="/journal"
              className="inline-flex items-center gap-1.5 text-foreground/70 hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> All journal posts
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-primary-strong font-medium hover:text-primary-deep transition-colors"
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
