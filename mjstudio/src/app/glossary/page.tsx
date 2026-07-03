import type { Metadata } from "next";
import { OG_IMAGE } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { glossary, GLOSSARY_CATEGORIES, type GlossaryTerm } from "@/data/glossary";
import { WarmNav } from "@/components/warm/WarmNav";
import { WarmFooter } from "@/components/warm/WarmFooter";

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
    images: OG_IMAGE,
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
    <>
      <WarmNav />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSetSchema) }}
        />

        {/* ---- hero ---- */}
        <section className="relative overflow-hidden pt-36 md:pt-40 pb-14 px-5 sm:px-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 right-[-8%] h-[460px] w-[460px] rounded-full opacity-50 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(255,106,61,0.28), rgba(255,106,61,0) 68%)" }}
          />
          <div className="relative mx-auto max-w-[1200px]">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">— Glossary</p>
            <h1 className="mt-5 font-display text-4xl md:text-5xl lg:text-[3.6rem] font-semibold tracking-tight text-balance leading-[1.03] max-w-[18ch]">
              Plain-English answers to the words we use.
            </h1>
            <p className="mt-6 text-xl text-foreground/70 max-w-[54ch] leading-relaxed text-pretty">
              Short, friendly definitions of the things we build — no jargon walls, no fluff. If you&apos;ve ever nodded along to a term and quietly wondered what it meant, start here.
            </p>
            <p className="mt-4 text-foreground/65 leading-relaxed max-w-[62ch]">
              Every entry opens with a one-sentence definition, then walks through why it matters, what it includes, and when a business actually needs it — written to be clear for founders and helpful for AI search engines alike.
            </p>
          </div>
        </section>

        {/* ---- glossary by category ---- */}
        <section className="px-5 sm:px-8 py-14 md:py-20 bg-surface-2 border-y border-border">
          <div className="mx-auto max-w-[1200px] space-y-16 md:space-y-20">
            {(Object.keys(byCategory) as Array<keyof typeof byCategory>).map((cat) => {
              const terms = byCategory[cat];
              if (terms.length === 0) return null;
              return (
                <section key={cat}>
                  <div className="grid grid-cols-12 gap-6 md:gap-10">
                    <div className="col-span-12 md:col-span-4">
                      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">— Category</p>
                      <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold tracking-tight text-balance">
                        {GLOSSARY_CATEGORIES[cat]}
                      </h2>
                    </div>
                    <div className="col-span-12 md:col-span-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {terms.map((term) => (
                          <Link
                            key={term.slug}
                            href={`/glossary/${term.slug}`}
                            className="card-soft lift group p-5"
                          >
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="font-display text-base md:text-lg font-semibold tracking-tight">
                                {term.term}
                              </div>
                              <ArrowRight className="w-4 h-4 shrink-0 mt-1 text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </div>
                            <p className="text-foreground/65 text-sm leading-relaxed line-clamp-3">
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

        {/* ---- cta ---- */}
        <section className="px-5 sm:px-8 py-20 md:py-24">
          <div className="mx-auto max-w-[1080px] rounded-[36px] bg-primary p-10 md:p-16 text-center text-white">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/80">— Want the thing, not just the word?</p>
            <h2 className="mt-5 font-display text-3xl md:text-[3rem] font-semibold tracking-tight text-balance max-w-[20ch] mx-auto">
              Knowing what it is and having it built are two different things.
            </h2>
            <p className="mt-5 text-white/85 max-w-[48ch] mx-auto leading-relaxed">
              We build the real thing behind these words — websites, AI, conversion-ready design — with a small, senior team you can actually talk to. Tell us what you&apos;re after and we&apos;ll help you get there.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-medium hover:bg-white/90 transition-colors"
                style={{ color: "#2a231f" }}
              >
                Start a project <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/audit"
                className="font-mono text-xs uppercase tracking-[0.16em] text-white/80 hover:text-white"
              >
                Or get a free audit →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <WarmFooter />
    </>
  );
}
