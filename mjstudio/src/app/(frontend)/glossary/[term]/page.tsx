import type { Metadata } from "next";
import { OG_IMAGE } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { glossary, getGlossaryTerm } from "@/data/glossary";
import { WarmNav } from "@/components/warm/WarmNav";
import { WarmFooter } from "@/components/warm/WarmFooter";
import { CtaBand, CtaInline } from "@/components/warm/Cta";

// Fully prerendered at build time — required for `output: "export"`
// (GitHub Pages). One static HTML page per glossary term.
export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return glossary.map((g) => ({ term: g.slug }));
}

type Props = { params: Promise<{ term: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { term } = await params;
  const entry = getGlossaryTerm(term);
  if (!entry) return { title: "Term not found" };
  return {
    title: entry.metaTitle,
    description: entry.metaDescription,
    alternates: { canonical: `/glossary/${entry.slug}` },
    openGraph: {
      title: entry.metaTitle,
      description: entry.metaDescription,
      url: `/glossary/${entry.slug}`,
      type: "article",
      images: OG_IMAGE,
    },
  };
}

export default async function GlossaryTermPage({ params }: Props) {
  const { term } = await params;
  const entry = getGlossaryTerm(term);
  if (!entry) notFound();

  const related = entry.relatedSlugs
    .map((slug) => getGlossaryTerm(slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const SITE = "https://brandivibe.com";
  const canonical = `${SITE}/glossary/${entry.slug}`;

  // DefinedTerm schema: tells AI search this page defines a specific term.
  // High-impact for "what is X" extraction — AI lifts the description
  // field directly.
  const definedTermSchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "@id": canonical,
    name: entry.term,
    alternateName: entry.alsoKnownAs,
    description: entry.definition,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      "@id": `${SITE}/glossary`,
      name: "Brandivibe Glossary",
      url: `${SITE}/glossary`,
    },
    url: canonical,
  };

  // Article schema: gives this page the editorial weight AI search needs
  // to treat it as a primary source. Includes the actual term definition
  // as the article's abstract.
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${canonical}#article`,
    headline: `What is ${entry.term}?`,
    abstract: entry.definition,
    description: entry.metaDescription,
    author: {
      "@type": "Person",
      name: "Muraduzzaman",
      url: `${SITE}/about`,
      jobTitle: "Founder & Lead Engineer",
      worksFor: {
        "@type": "Organization",
        "@id": `${SITE}/#organization`,
        name: "Brandivibe",
      },
      knowsAbout: [
        "WebGL development",
        "AI automation systems",
        "Conversion-focused web design",
        "Generative engine optimization",
        "Custom AI agent development",
      ],
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: "Brandivibe",
      url: SITE,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    about: {
      "@type": "DefinedTerm",
      "@id": canonical,
      name: entry.term,
    },
    articleSection: "Glossary",
  };

  // FAQPage schema: every FAQ pair is AI-extractable.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entry.faqs.map((pair) => ({
      "@type": "Question",
      name: pair.q,
      acceptedAnswer: { "@type": "Answer", text: pair.a },
    })),
  };

  // Breadcrumb schema: signals the canonical hierarchy.
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Brandivibe", item: SITE },
      { "@type": "ListItem", position: 2, name: "Glossary", item: `${SITE}/glossary` },
      { "@type": "ListItem", position: 3, name: entry.term, item: canonical },
    ],
  };

  return (
    <>
      <WarmNav />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />

        <article className="mx-auto max-w-[760px] px-5 sm:px-8 pt-36 md:pt-40 pb-12">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted flex-wrap">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              </li>
              <li className="text-foreground/25">/</li>
              <li>
                <Link href="/glossary" className="hover:text-foreground transition-colors">Glossary</Link>
              </li>
              <li className="text-foreground/25">/</li>
              <li className="text-foreground/70">{entry.term}</li>
            </ol>
          </nav>

          {/* H1 phrased as the question — high AI-extraction signal */}
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-strong">— Glossary · Definition</p>
          <h1 className="mt-5 font-display text-4xl md:text-5xl font-semibold tracking-tight text-balance leading-[1.05]">
            What is {entry.term.toLowerCase()}?
          </h1>

          {/* Lead definition block — THE line AI lifts. Self-contained,
              no preamble, no hedging. Mirrors the schema.org description. */}
          <div className="mt-8 card-soft border-l-[3px] border-l-primary p-6 md:p-7">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] mb-3 text-primary-strong">
              Definition
            </div>
            <p className="text-xl md:text-2xl text-foreground leading-snug text-balance">
              <span className="font-semibold">{entry.term}</span> is {entry.definition.replace(new RegExp(`^${entry.term}\\s+is\\s+`, "i"), "")}
            </p>
            {entry.alsoKnownAs.length > 0 && (
              <p className="mt-5 text-muted text-sm">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  Also known as:
                </span>{" "}
                {entry.alsoKnownAs.join(", ")}
              </p>
            )}
          </div>

          {/* Why it matters */}
          <section className="mt-12">
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">
              Why it matters
            </h2>
            <p className="mt-5 text-foreground/80 leading-relaxed text-lg">
              {entry.whyItMatters}
            </p>
          </section>

          {/* Components / What it includes */}
          <section className="mt-12">
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">
              What {entry.term.toLowerCase()} includes
            </h2>
            <ul className="mt-5 space-y-3.5">
              {entry.components.map((c, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary-strong shrink-0 mt-0.5" />
                  <span className="text-foreground/80 leading-relaxed">{c}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Mid-page nudge */}
          <div className="mt-12 -mx-5 sm:-mx-8">
            <CtaInline text={`Want ${entry.term.toLowerCase()} done properly? Let's talk it through.`} />
          </div>

          {/* When it applies */}
          <section className="mt-12">
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">
              When a business needs {entry.term.toLowerCase()}
            </h2>
            <p className="mt-5 text-foreground/80 leading-relaxed text-lg">
              {entry.whenItApplies}
            </p>
          </section>

          {/* FAQ */}
          <section className="mt-14">
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-6">
              Common questions
            </h2>
            <div className="space-y-3">
              {entry.faqs.map((pair, i) => (
                <details
                  key={i}
                  className="group card-soft overflow-hidden"
                >
                  <summary className="flex items-center justify-between px-6 py-5 cursor-pointer hover:bg-surface-2 transition-colors">
                    <span className="font-display text-lg font-medium tracking-tight pr-4">
                      {pair.q}
                    </span>
                    <span
                      className="shrink-0 w-2.5 h-2.5 border-r-2 border-b-2 border-foreground/40 rotate-45 group-open:-rotate-135 group-open:translate-y-1 transition-transform duration-200"
                      aria-hidden="true"
                    />
                  </summary>
                  <div className="px-6 pb-6 text-foreground/70 leading-relaxed">
                    {pair.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Related terms */}
          {related.length > 0 && (
            <section className="mt-16 pt-12 border-t border-border">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-strong">— Related terms</p>
              <h2 className="mt-3 font-display text-2xl md:text-3xl font-semibold tracking-tight mb-6">
                Read next
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/glossary/${r.slug}`}
                    className="card-soft lift group p-5"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="font-display text-base md:text-lg font-semibold tracking-tight">
                        {r.term}
                      </div>
                      <ArrowRight className="w-4 h-4 shrink-0 mt-1 text-muted group-hover:text-primary-strong group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-foreground/65 text-sm leading-relaxed line-clamp-2">
                      {r.definition}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </article>

        {/* CTA */}
        <CtaBand
          title={`Want ${entry.term.toLowerCase()} built into your business?`}
          subtitle="Have a friendly chat with a small, senior team — honest advice and a clear plan, no pressure."
        />
      </main>
      <WarmFooter />
    </>
  );
}
