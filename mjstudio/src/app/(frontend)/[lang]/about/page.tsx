import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WarmNav } from "@/components/warm/WarmNav";
import { WarmFooter } from "@/components/warm/WarmFooter";
import { CtaBand } from "@/components/warm/Cta";
import { PRIMARY_CTA } from "@/lib/cta";

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
    // image intentionally omitted until a real founder photo is uploaded —
    // a 404ing image URL is worse for entity trust than none at all.
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

  // FAQ content — rendered VISIBLY below and mirrored word-for-word in the
  // FAQPage schema (schema-only FAQs are a rich-results compliance risk).
  const ABOUT_FAQS = [
    {
      q: "Who runs Brandivibe?",
      a: "Brandivibe is founded and led by Muraduzzaman, a full-stack engineer based in Dhaka, Bangladesh, working remotely with founders worldwide. He handles strategy, design direction, and engineering for every engagement personally.",
    },
    {
      q: "What does Brandivibe specialize in?",
      a: "Brandivibe covers six areas — web development (including WebGL and 3D), custom software, digital marketing and SEO, creative content, design, and AI automation — delivered in fixed-scope engagements with one clear price agreed up front.",
    },
    {
      q: "Where is Brandivibe based?",
      a: "Brandivibe is operated from Dhaka, Bangladesh, working remotely with clients across the US, Canada, UK, EU, and Australia. Engagements run on Zoom, Loom, Slack, and email — no in-person travel required.",
    },
    {
      q: "What happens after the six weeks?",
      a: "You get a full handover: documentation, a walkthrough of how everything works, and code that any developer can extend. If you'd like ongoing help, care plans cover updates, backups, and small tweaks — and SEO or marketing engagements continue month to month, cancellable any time.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ABOUT_FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const SHIPS = [
    {
      n: "01",
      title: "WebGL websites",
      body: "Hand-coded Next.js with custom 3D, motion, and conversion architecture built in. Sub-second load on mobile, Lighthouse 95+, and a look that feels like nobody else's.",
    },
    {
      n: "02",
      title: "AI automation systems",
      body: "GPT-4o workflows that handle lead sourcing, cold outreach, and content publishing while you sleep. Self-learning, self-healing, and quietly getting better.",
    },
    {
      n: "03",
      title: "Custom AI agents",
      body: "LLM-powered helpers that take care of support, sales qualification, and day-to-day operations. Working round the clock, no salary, no burnout.",
    },
    {
      n: "04",
      title: "SEO + AI search",
      body: "Technical SEO, schema markup, content engines, and generative engine optimization — so you show up in Google and get cited by ChatGPT and Perplexity too.",
    },
    {
      n: "05",
      title: "Digital marketing",
      body: "Full-funnel campaign architecture where every dollar ties back to real revenue, not vanity metrics you can't spend.",
    },
  ];

  return (
    <>
      <WarmNav />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        {/* ---- hero ---- */}
        <section className="relative overflow-hidden pt-36 md:pt-40 pb-16 px-5 sm:px-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full opacity-60 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(255,106,61,0.28), rgba(255,106,61,0) 68%)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute top-40 left-[-12%] h-[420px] w-[420px] rounded-full opacity-50 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(15,165,152,0.22), rgba(15,165,152,0) 70%)" }}
          />
          <div className="relative mx-auto max-w-[1200px]">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-strong">— Say hello</p>
            <h1 className="mt-5 font-display font-semibold tracking-tight text-balance text-[2.7rem] leading-[1.03] sm:text-6xl md:text-[4.4rem] max-w-[15ch]">
              Hi, I&apos;m Muraduzzaman — the person behind Brandivibe.
            </h1>
            <p className="mt-7 text-xl md:text-2xl text-foreground/70 leading-relaxed max-w-[54ch] text-pretty">
              I build premium WebGL websites and AI automation systems for founders who want something that keeps working after launch — not another deck that sits in a drawer.
            </p>
            <div className="mt-9">
              <Link
                href={PRIMARY_CTA.href}
                className="inline-flex items-center gap-2 rounded-full bg-primary-strong text-white px-7 py-4 font-medium hover:bg-primary-deep transition-colors"
              >
                {PRIMARY_CTA.label} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ---- story / what I do ---- */}
        <section className="px-5 sm:px-8 py-10">
          <div className="mx-auto max-w-[760px]">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-strong">— What I do</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl font-semibold tracking-tight text-balance">
              One person, the whole stack, no hand-offs.
            </h2>
            <div className="mt-6 space-y-5 text-lg text-foreground/80 leading-relaxed">
              <p>
                I started Brandivibe to build the kind of website-and-AI system most founders can never get from a single vendor: cinematic WebGL up front, a self-running AI sales brain out back, and the conversion architecture in between that turns the whole thing into real pipeline.
              </p>
              <p>
                Every engagement is six weeks, fixed. I handle the strategy, design direction, and engineering myself — no project-manager layer, no outsourced agency pool, no mystery. And when we&apos;re done, the codebase is yours. Fully, no strings.
              </p>
            </div>
          </div>
        </section>

        {/* ---- what Brandivibe ships ---- */}
        <section className="px-5 sm:px-8 py-14">
          <div className="mx-auto max-w-[1200px]">
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-balance max-w-[20ch]">
              What we&apos;ll build together.
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SHIPS.map((s) => (
                <div key={s.n} className="card-soft p-6">
                  <span className="font-mono text-xs uppercase tracking-[0.16em] text-primary-strong">{s.n}</span>
                  <h3 className="mt-3 font-display text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-foreground/70 text-[0.95rem] leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- where I work ---- */}
        <section className="px-5 sm:px-8 py-16 bg-surface-2 border-y border-border">
          <div className="mx-auto max-w-[760px]">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-strong">— Where I work</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl font-semibold tracking-tight text-balance">
              Dhaka-based, working with founders worldwide.
            </h2>
            <p className="mt-6 text-lg text-foreground/80 leading-relaxed">
              I&apos;m based in Dhaka, Bangladesh, and I work remotely with founders across the US, Canada, UK, EU, and Australia. Everything runs on Zoom, Loom, Slack, and email — no travel required, just easy, regular contact. Most people start with a free strategy call before we ever talk about a build.
            </p>
          </div>
        </section>

        {/* ---- what I'm known for ---- */}
        <section className="px-5 sm:px-8 py-16">
          <div className="mx-auto max-w-[760px]">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-strong">— How I like to work</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl font-semibold tracking-tight text-balance">
              Two promises I actually keep.
            </h2>
            <div className="mt-6 space-y-5 text-lg text-foreground/80 leading-relaxed">
              <p>
                First: I ship in six weeks, fixed. No open-ended retainers, no scope creep, no monthly invoices that quietly drift on forever. You&apos;ll know exactly what you&apos;re getting and when.
              </p>
              <p>
                Second: the production code is genuinely yours — TypeScript, App Router, ESLint-clean — so any developer can pick it up and extend it later without needing me. You&apos;re never locked in.
              </p>
              <p>
                Most founders find me through a referral, the Brandivibe portfolio, or the journal. I take four new client slots a month, and the calendar usually books two to three weeks ahead — so if the timing feels right, it&apos;s worth saying hello early.
              </p>
              <p className="text-foreground/60 text-base">
                And if I ever miss the mark, the{" "}
                <Link href="/refund-policy" className="text-primary-strong hover:text-primary-deep underline underline-offset-2">
                  refund policy
                </Link>{" "}
                applies — promises should be accountable, not just words on a page.
              </p>
            </div>
          </div>
        </section>

        {/* ---- FAQ (visible twin of the FAQPage schema) ---- */}
        <section className="px-5 sm:px-8 py-16 bg-surface-2 border-y border-border">
          <div className="mx-auto max-w-[820px]">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-strong">— Questions founders ask</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl font-semibold tracking-tight text-balance">
              The short version, honestly answered.
            </h2>
            <div className="mt-8 space-y-3">
              {ABOUT_FAQS.map((f) => (
                <details key={f.q} className="card-soft group overflow-hidden p-0">
                  <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-4 p-5 font-medium text-foreground">
                    <span>{f.q}</span>
                    <span className="font-mono text-xl shrink-0 leading-none text-primary-strong transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="px-5 pb-5 -mt-1 text-foreground/75 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ---- cta ---- */}
        <CtaBand
          title="Let's book a free, no-pressure call."
          subtitle="Thirty friendly minutes on your business, your biggest bottleneck, and what would genuinely move the needle. No pitch deck, no upsell — just honest advice."
        />
      </main>
      <WarmFooter />
    </>
  );
}
