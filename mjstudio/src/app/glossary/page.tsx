import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { glossary, GLOSSARY_CATEGORIES, type GlossaryTerm } from "@/data/glossary";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Glossary — WebGL, AI Automation, SEO Definitions · Brandivibe",
  description:
    "Definitions for the terms Brandivibe works with — WebGL website, custom AI agent, AI sales brain, conversion-focused design, generative engine optimization, and more.",
  alternates: { canonical: "/glossary" },
  openGraph: {
    title: "Brandivibe Glossary",
    description:
      "Definitions for the categories Brandivibe builds in: premium websites, AI automation, AI agents, conversion design, generative engine optimization.",
    url: "/glossary",
    type: "website",
  },
};

export default function GlossaryHubPage() {
  // DefinedTermSet schema: signals to AI search this is a glossary
  // collection of definitional content. Each child page renders its own
  // DefinedTerm schema; this is the parent index.
  const definedTermSetSchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": "https://brandivibe.com/glossary",
    name: "Brandivibe Glossary",
    description:
      "Definitions for the categories Brandivibe works in: premium websites, AI automation, AI agents, conversion design, generative engine optimization.",
    hasDefinedTerm: glossary.map((term) => ({
      "@type": "DefinedTerm",
      "@id": `https://brandivibe.com/glossary/${term.slug}`,
      name: term.term,
      description: term.definition,
      url: `https://brandivibe.com/glossary/${term.slug}`,
    })),
  };

  // Group by category for the layout.
  const byCategory: Record<GlossaryTerm["category"], GlossaryTerm[]> = {
    websites: [],
    ai: [],
    marketing: [],
    growth: [],
  };
  for (const term of glossary) byCategory[term.category].push(term);

  return (
    <main className="min-h-screen bg-[#08080a] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSetSchema) }}
      />

      <header className="border-b border-white/5 px-6 md:px-10 py-6">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors"
          >
            Brandivibe
          </Link>
          <Link
            href="/journal"
            className="font-mono text-xs uppercase tracking-[0.3em] text-white/40 hover:text-white"
          >
            Journal →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative px-6 md:px-10 py-20 md:py-28 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[1200px] h-[500px] rounded-full blur-3xl pointer-events-none opacity-25 bg-[radial-gradient(circle,#84e1ff,transparent_70%)]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="font-mono text-xs uppercase tracking-[0.4em] mb-6 text-[#84e1ff]">
            — Glossary
          </div>
          <h1 className="text-5xl md:text-8xl font-semibold tracking-tight leading-[0.9] text-balance mb-6">
            Definitions for the categories we build in.
          </h1>
          <p className="text-2xl md:text-3xl tracking-tight italic text-white/65 leading-tight max-w-4xl text-balance mb-6">
            Short, plain-language answers to &quot;what is X&quot; for the terms Brandivibe uses every day.
          </p>
          <p className="text-white/55 leading-relaxed max-w-2xl">
            Each entry leads with a tight one-sentence definition, then explains why it matters, what it includes, and when a business needs it. Written for founders, growth leads, and AI search engines alike.
          </p>
        </div>
      </section>

      {/* Glossary by category */}
      <section className="border-t border-white/5 px-6 md:px-10 py-16 md:py-24 bg-white/[0.01]">
        <div className="mx-auto max-w-6xl space-y-16 md:space-y-20">
          {(Object.keys(byCategory) as Array<keyof typeof byCategory>).map((cat) => {
            const terms = byCategory[cat];
            if (terms.length === 0) return null;
            return (
              <section key={cat}>
                <div className="grid grid-cols-12 gap-6 mb-10">
                  <div className="col-span-12 md:col-span-4">
                    <div className="font-mono text-[10px] uppercase tracking-[0.4em] mb-3 text-[#84e1ff]">
                      — Category
                    </div>
                    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight leading-[0.95] text-balance">
                      {GLOSSARY_CATEGORIES[cat]}
                    </h2>
                  </div>
                  <div className="col-span-12 md:col-span-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {terms.map((term) => (
                        <Link
                          key={term.slug}
                          href={`/glossary/${term.slug}`}
                          className="group rounded-2xl border border-white/8 bg-white/[0.015] p-5 hover:border-white/25 hover:bg-white/[0.03] transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="text-base md:text-lg font-semibold tracking-tight group-hover:translate-x-0.5 transition-transform">
                              {term.term}
                            </div>
                            <ArrowRight className="w-4 h-4 shrink-0 mt-1 text-white/30 group-hover:text-[#84e1ff] group-hover:translate-x-1 transition-all" />
                          </div>
                          <p className="text-white/55 text-sm leading-relaxed line-clamp-3">
                            {term.definition}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 px-6 md:px-10 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] mb-6 text-[#84e1ff]">
            — Want a system, not a definition?
          </div>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[0.95] mb-8 text-balance">
            Knowing what something is isn&apos;t the same as having it built.
          </h2>
          <p className="text-white/55 max-w-xl mx-auto mb-10 leading-relaxed">
            Brandivibe builds the systems these terms describe — premium websites, AI automation, custom AI agents, conversion architecture — for founders shipping in 6 weeks, not 6 months.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-colors"
            >
              Get free strategy call <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/audit"
              className="font-mono text-xs uppercase tracking-[0.3em] text-white/50 hover:text-white"
            >
              Or audit my business →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
