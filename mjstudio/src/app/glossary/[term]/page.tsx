import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { glossary, getGlossaryTerm } from "@/data/glossary";

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
    <main className="min-h-screen bg-[#08080a] text-white">
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

      <header className="border-b border-white/5 px-6 md:px-10 py-6">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors"
          >
            Brandivibe
          </Link>
          <Link
            href="/glossary"
            className="font-mono text-xs uppercase tracking-[0.3em] text-white/40 hover:text-white"
          >
            ← All terms
          </Link>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="px-6 md:px-10 pt-8 mx-auto max-w-4xl"
      >
        <ol className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 flex-wrap">
          <li>
            <Link href="/" className="hover:text-white">Home</Link>
          </li>
          <li className="text-white/20">/</li>
          <li>
            <Link href="/glossary" className="hover:text-white">Glossary</Link>
          </li>
          <li className="text-white/20">/</li>
          <li className="text-white/60">{entry.term}</li>
        </ol>
      </nav>

      <article className="mx-auto max-w-4xl px-6 md:px-10 py-12 md:py-16">
        {/* H1 phrased as the question — high AI-extraction signal */}
        <div className="font-mono text-xs uppercase tracking-[0.4em] mb-5 text-[#84e1ff]">
          — Glossary · Definition
        </div>
        <h1 className="text-4xl md:text-7xl font-semibold tracking-tight leading-[0.95] text-balance mb-8">
          What is {entry.term.toLowerCase()}?
        </h1>

        {/* Lead definition block — THE line AI lifts. Self-contained,
            no preamble, no hedging. Mirrors the schema.org description. */}
        <div className="rounded-2xl border-l-2 border-[#84e1ff] pl-6 py-4 mb-12 bg-white/[0.02]">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] mb-3 text-[#84e1ff]">
            Definition
          </div>
          <p className="text-xl md:text-2xl text-white/90 leading-snug text-balance">
            <span className="font-semibold">{entry.term}</span> is {entry.definition.replace(new RegExp(`^${entry.term}\\s+is\\s+`, "i"), "")}
          </p>
          {entry.alsoKnownAs.length > 0 && (
            <p className="mt-5 text-white/45 text-sm">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">
                Also known as:
              </span>{" "}
              {entry.alsoKnownAs.join(", ")}
            </p>
          )}
        </div>

        {/* Why it matters */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-5">
            Why it matters
          </h2>
          <p className="text-white/70 leading-relaxed text-lg">
            {entry.whyItMatters}
          </p>
        </section>

        {/* Components / What it includes */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-5">
            What {entry.term.toLowerCase()} includes
          </h2>
          <ul className="space-y-3">
            {entry.components.map((c, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#84e1ff] shrink-0 mt-1" />
                <span className="text-white/75 leading-relaxed">{c}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* When it applies */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-5">
            When a business needs {entry.term.toLowerCase()}
          </h2>
          <p className="text-white/70 leading-relaxed text-lg">
            {entry.whenItApplies}
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">
            Common questions
          </h2>
          <div className="space-y-3">
            {entry.faqs.map((pair, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-white/8 bg-white/[0.015] overflow-hidden"
              >
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer hover:bg-white/[0.02] transition-colors">
                  <span className="text-lg font-medium tracking-tight pr-4">
                    {pair.q}
                  </span>
                  <span
                    className="shrink-0 w-2.5 h-2.5 border-r-2 border-b-2 border-white/40 rotate-45 group-open:-rotate-135 group-open:translate-y-1 transition-transform duration-200"
                    aria-hidden="true"
                  />
                </summary>
                <div className="px-6 pb-6 text-white/65 leading-relaxed">
                  {pair.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Related terms */}
        {related.length > 0 && (
          <section className="mb-16 pt-12 border-t border-white/5">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] mb-5 text-[#84e1ff]">
              — Related terms
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">
              Read next
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/glossary/${r.slug}`}
                  className="group rounded-2xl border border-white/8 bg-white/[0.015] p-5 hover:border-white/25 hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="text-base md:text-lg font-semibold tracking-tight group-hover:translate-x-0.5 transition-transform">
                      {r.term}
                    </div>
                    <ArrowRight className="w-4 h-4 shrink-0 mt-1 text-white/30 group-hover:text-[#84e1ff] group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-white/55 text-sm leading-relaxed line-clamp-2">
                    {r.definition}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="mt-16 pt-12 border-t border-white/5 text-center">
          <p className="text-white/40 text-sm mb-6">
            Want {entry.term.toLowerCase()} built into your business?
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-colors"
          >
            Get free strategy call <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </article>
    </main>
  );
}
