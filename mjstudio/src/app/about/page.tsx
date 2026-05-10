import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "About — Muraduzzaman, Founder of Brandivibe",
  description:
    "Muraduzzaman is the founder and lead engineer of Brandivibe — a premium WebGL website and AI automation studio building for seed-to-Series-B founders. Background, expertise, and what Brandivibe ships.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Muraduzzaman · Brandivibe",
    description:
      "Founder and lead engineer of Brandivibe. WebGL, AI automation, conversion-focused web design.",
    url: "/about",
    type: "profile",
  },
};

export default function AboutPage() {
  const SITE = "https://brandivibe.com";

  // Person schema: high-impact E-E-A-T signal for AI search. ChatGPT,
  // Perplexity, and Google AI Overviews weight named authorship heavily,
  // especially for expert-domain content (WebGL, AI automation).
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE}/about#person`,
    name: "Muraduzzaman",
    alternateName: "MJ Rifat",
    url: `${SITE}/about`,
    image: `${SITE}/avatar.png`,
    jobTitle: "Founder & Lead Engineer",
    description:
      "Founder of Brandivibe, building premium WebGL websites and AI automation systems for seed-to-Series-B founders.",
    worksFor: {
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: "Brandivibe",
      url: SITE,
    },
    knowsAbout: [
      "WebGL website development",
      "Three.js and React Three Fiber",
      "Next.js and React",
      "AI automation systems",
      "Custom AI agent development with GPT-4o and Claude",
      "Conversion-focused web design",
      "Generative engine optimization (GEO)",
      "Digital marketing strategy",
      "SEO and AI search optimization",
      "Autonomous content marketing",
    ],
    knowsLanguage: ["English", "Bengali"],
    nationality: { "@type": "Country", name: "Bangladesh" },
    workLocation: { "@type": "Place", name: "Dhaka, Bangladesh — remote worldwide" },
  };

  // FAQPage schema: helps AI search answer "who is behind Brandivibe"
  // and "what does Muraduzzaman do" queries.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Who runs Brandivibe?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Brandivibe is founded and led by Muraduzzaman, a full-stack engineer based in Dhaka, Bangladesh, working remotely with seed-to-Series-B founders worldwide. He handles strategy, design direction, and engineering for every engagement personally.",
        },
      },
      {
        "@type": "Question",
        name: "What does Brandivibe specialize in?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Brandivibe builds premium WebGL websites, AI automation systems, custom AI agents, SEO and AI search optimization, and digital marketing strategy — five services delivered in fixed 6-week engagements for founders who want a system, not a deck.",
        },
      },
      {
        "@type": "Question",
        name: "Where is Brandivibe based?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Brandivibe is operated from Dhaka, Bangladesh, working remotely with clients across the US, Canada, UK, EU, and Australia. Engagements run on Zoom, Loom, Slack, and email — no in-person travel required.",
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#08080a] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
            href="/#contact"
            className="font-mono text-xs uppercase tracking-[0.3em] text-white/40 hover:text-white"
          >
            Contact →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative px-6 md:px-10 py-16 md:py-24 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[1200px] h-[500px] rounded-full blur-3xl pointer-events-none opacity-25 bg-[radial-gradient(circle,#84e1ff,transparent_70%)]" />
        <div className="relative mx-auto max-w-4xl">
          <div className="font-mono text-xs uppercase tracking-[0.4em] mb-6 text-[#84e1ff]">
            — About
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[0.95] text-balance mb-8">
            Muraduzzaman.<br className="hidden md:block" /> Founder, Brandivibe.
          </h1>
          <p className="text-2xl md:text-3xl tracking-tight italic text-white/65 leading-tight max-w-3xl text-balance mb-10">
            I build premium WebGL websites and AI automation systems for founders who want a business that runs 24/7, not another deck.
          </p>
        </div>
      </section>

      {/* Bio */}
      <article className="mx-auto max-w-3xl px-6 md:px-10 py-12 md:py-16 space-y-12">
        <section>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-5">
            What I do
          </h2>
          <p className="text-white/75 leading-relaxed text-lg mb-4">
            I founded Brandivibe to ship the kind of website + AI system most founders can&apos;t find from a single vendor: cinematic WebGL on the front, a self-running AI sales brain on the back, and the conversion architecture in between that turns the whole stack into pipeline.
          </p>
          <p className="text-white/75 leading-relaxed text-lg">
            Every engagement is six weeks, fixed. I handle strategy, design direction, and engineering personally — no project manager layer, no outsourced agency pool. The codebase is yours when we&apos;re done.
          </p>
        </section>

        <section>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-5">
            What Brandivibe ships
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-[#84e1ff] font-mono text-xs uppercase tracking-[0.25em] mt-1.5 shrink-0">01</span>
              <span className="text-white/75 leading-relaxed">
                <strong className="text-white/90">WebGL websites</strong> — hand-coded Next.js with custom 3D, motion, and conversion architecture. Sub-second load on mobile. Lighthouse 95+.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#84e1ff] font-mono text-xs uppercase tracking-[0.25em] mt-1.5 shrink-0">02</span>
              <span className="text-white/75 leading-relaxed">
                <strong className="text-white/90">AI automation systems</strong> — GPT-4o workflows for lead sourcing, cold outreach, content publishing. Self-learning. Self-healing.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#84e1ff] font-mono text-xs uppercase tracking-[0.25em] mt-1.5 shrink-0">03</span>
              <span className="text-white/75 leading-relaxed">
                <strong className="text-white/90">Custom AI agents</strong> — LLM-powered employees that handle support, sales qualification, operations. 24/7. No salary.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#84e1ff] font-mono text-xs uppercase tracking-[0.25em] mt-1.5 shrink-0">04</span>
              <span className="text-white/75 leading-relaxed">
                <strong className="text-white/90">SEO + AI search optimization</strong> — technical SEO, schema markup, content engines, and generative engine optimization for ChatGPT and Perplexity citation.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#84e1ff] font-mono text-xs uppercase tracking-[0.25em] mt-1.5 shrink-0">05</span>
              <span className="text-white/75 leading-relaxed">
                <strong className="text-white/90">Digital marketing strategy</strong> — full-funnel campaign architecture where every dollar is attributable to revenue, not vanity metrics.
              </span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-5">
            Where I work
          </h2>
          <p className="text-white/75 leading-relaxed text-lg">
            Based in Dhaka, Bangladesh. Working remotely with founders in the US, Canada, UK, EU, and Australia. Engagements run on Zoom, Loom, Slack, and email — no in-person travel required. Most clients book a free strategy call before committing to a build.
          </p>
        </section>

        <section>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-5">
            What I&apos;m known for
          </h2>
          <p className="text-white/75 leading-relaxed text-lg mb-4">
            Two things, mostly. First: shipping in six weeks, fixed. No retainers, no scope creep, no monthly invoices that drift forever. Second: the production codebase is yours — TypeScript, App Router, ESLint-clean — so any developer can extend it later without needing me.
          </p>
          <p className="text-white/75 leading-relaxed text-lg">
            Founders find me through referrals, the Brandivibe portfolio, or the journal. I take 4 new client slots per month and the calendar usually books 2-3 weeks ahead.
          </p>
        </section>

        {/* CTA */}
        <section className="pt-8 border-t border-white/5">
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] mb-5 text-[#84e1ff]">
            — Want to work together?
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight leading-[1.05] mb-6 text-balance">
            Book a free strategy call.
          </h2>
          <p className="text-white/55 leading-relaxed mb-8">
            We&apos;ll spend 30 minutes on your business, your bottleneck, and what would actually move the needle. No pitch deck, no upsell.
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-colors"
            >
              Get free strategy call <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/audit"
              className="inline-flex items-center px-5 py-4 font-mono text-xs uppercase tracking-[0.3em] text-white/50 hover:text-white"
            >
              Or audit my business →
            </Link>
          </div>
        </section>
      </article>
    </main>
  );
}
