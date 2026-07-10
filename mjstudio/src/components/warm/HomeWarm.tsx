"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight, Heart, Clock, KeyRound, Star } from "lucide-react";
import { pillars } from "@/data/services";
import type { HomepageContent, TestimonialItem } from "@/lib/content";
import { PRIMARY_CTA, SECONDARY_CTA } from "@/lib/cta";
import { WarmContact } from "./WarmContact";
import { CtaInline } from "./Cta";

const rise = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

// Icons stay in code (mapped by position); copy comes from the CMS.
const REASSURE_ICONS = [Heart, Clock, KeyRound];

// Honest answers to the questions founders actually ask before contacting an
// agency — every claim is backed by real site policy, nothing invented.
const FAQ_ITEMS = [
  {
    q: "How much does a project cost?",
    a: "Every project is quoted to what you actually need — one clear, fixed price agreed before we start. No bloated packages, no retainers you can't cancel, no surprises. A short free call is the quickest way to a real number.",
  },
  {
    q: "How long does a project take?",
    a: "Most website projects run about six weeks from first conversation to launch. Larger software and marketing engagements are phased — you'll see the timeline in the plan before anything starts.",
  },
  {
    q: "Who will I actually be working with?",
    a: "The people doing the work — a small, senior team. No juniors learning on your project, no hand-offs, no account-manager layer. You get direct answers from the person building your thing.",
  },
  {
    q: "Do I own what you build?",
    a: "Yes — completely. Your code, your accounts, your files. We build everything to be yours, so you're never locked in to us or anyone else.",
  },
  {
    q: "What happens after launch?",
    a: "We ship it properly, show you how everything works, and stick around. Care plans cover updates, backups, security, and small tweaks — and you can always just email a real person.",
  },
];

// Fallbacks — used only if the Homepage global returns empty (it ships with
// these as field defaults, so the page always renders correctly).
const FALLBACK: HomepageContent = {
  heroEyebrow: "— Your friendly digital studio",
  heroHeadline: "Everything your business needs to grow online, ",
  heroHeadlineAccent: "under one warm roof",
  heroHeadlineTail: ".",
  heroSubhead:
    "Websites, software, marketing, content, design, and AI — made by a small, senior team that actually enjoys the work. Premium quality, none of the corporate coldness.",
  reassurance: [
    { title: "A senior team who cares", body: "You work with people who do the actual work — no juniors, no hand-offs, no call centre." },
    { title: "Quick, and kept in the loop", body: "We move fast, share progress as we go, and reply within a day. No black boxes." },
    { title: "You own everything", body: "Your code, your accounts, your files. We build it to be yours — never locked in." },
  ],
  servicesEyebrow: "— What we do",
  servicesHeading: "Six ways we help, one team to call.",
  servicesSubhead:
    "Most businesses juggle a web person, an SEO person, a designer, a developer… We bring it together, so the whole thing pulls in the same direction.",
  processEyebrow: "— How it works",
  processHeading: "Working together feels easy.",
  process: [
    { number: "01", title: "Say hello", body: "Tell us what you're hoping to do. A friendly chat, no pressure, no jargon — just working out if we're a good fit." },
    { number: "02", title: "Make a plan", body: "We map the goal, the shape of the work, and a clear price. You'll know exactly what you're getting before we start." },
    { number: "03", title: "Build it together", body: "We do the work in close contact, sharing progress often so it always feels like yours, right up to launch." },
    { number: "04", title: "Launch & look after", body: "We ship it properly, show you how everything works, and stick around to help it grow." },
  ],
};

type Props = {
  content?: HomepageContent;
  pillarCounts?: Record<string, number>;
  testimonials?: TestimonialItem[];
};

export function HomeWarm({ content, pillarCounts = {}, testimonials = [] }: Props) {
  const c = content ?? FALLBACK;
  const reassurance = c.reassurance?.length ? c.reassurance : FALLBACK.reassurance;
  const steps = c.process?.length ? c.process : FALLBACK.process;

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 px-5 sm:px-8 overflow-hidden">
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
          {/* Above-the-fold: CSS entrance (see .hero-rise in globals.css), NOT
              framer-motion — the h1 is the LCP element and must paint before
              JS hydrates. Below-the-fold sections keep motion.* reveals. */}
          <p className="hero-rise font-mono text-xs uppercase tracking-[0.18em] text-primary-strong">
            {c.heroEyebrow || FALLBACK.heroEyebrow}
          </p>
          <h1 className="hero-rise hero-rise-1 mt-5 font-display font-semibold tracking-tight text-balance text-[2.7rem] leading-[1.02] sm:text-6xl md:text-[4.6rem] max-w-[16ch]">
            {c.heroHeadline || FALLBACK.heroHeadline}
            <span className="gradient-text">{c.heroHeadlineAccent || FALLBACK.heroHeadlineAccent}</span>
            {c.heroHeadlineTail ?? FALLBACK.heroHeadlineTail}
          </h1>
          <p className="hero-rise hero-rise-2 mt-7 text-lg md:text-xl text-foreground/70 leading-relaxed max-w-[52ch] text-pretty">
            {c.heroSubhead || FALLBACK.heroSubhead}
          </p>
          <div className="hero-rise hero-rise-3 mt-9 flex flex-wrap gap-3">
            <Link
              href={PRIMARY_CTA.href}
              className="inline-flex items-center gap-2 rounded-full bg-primary-strong text-white px-7 py-4 font-medium hover:bg-primary-deep transition-colors shadow-[0_14px_30px_-12px_rgba(255,106,61,0.6)]"
            >
              {PRIMARY_CTA.label} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={SECONDARY_CTA.href}
              className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-7 py-4 font-medium text-foreground hover:border-foreground/30 transition-colors"
            >
              {SECONDARY_CTA.label}
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- REASSURANCE ---------- */}
      <section className="px-5 sm:px-8">
        <div className="mx-auto max-w-[1200px] grid gap-5 sm:grid-cols-3">
          {reassurance.map((r, i) => {
            const Icon = REASSURE_ICONS[i % REASSURE_ICONS.length];
            return (
              <motion.div
                key={r.title || i}
                {...rise}
                transition={{ ...rise.transition, delay: i * 0.06 }}
                className="card-soft p-6"
              >
                <Icon className="h-6 w-6 text-primary-strong" strokeWidth={1.75} />
                <h2 className="mt-4 font-display text-lg font-semibold">{r.title}</h2>
                <p className="mt-2 text-foreground/70 leading-relaxed text-[0.97rem]">{r.body}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ---------- PILLARS ---------- */}
      <section id="services" className="px-5 sm:px-8 py-24 md:py-32">
        <div className="mx-auto max-w-[1200px]">
          <motion.div {...rise} className="max-w-[46ch]">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-strong">{c.servicesEyebrow || FALLBACK.servicesEyebrow}</p>
            <h2 className="mt-4 font-display text-4xl md:text-[3.2rem] font-semibold tracking-tight text-balance">
              {c.servicesHeading || FALLBACK.servicesHeading}
            </h2>
            <p className="mt-5 text-foreground/70 text-lg leading-relaxed">
              {c.servicesSubhead || FALLBACK.servicesSubhead}
            </p>
          </motion.div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p, i) => {
              const count = pillarCounts[p.title] ?? 0;
              return (
                <motion.div key={p.slug} {...rise} transition={{ ...rise.transition, delay: (i % 3) * 0.06 }}>
                  <Link
                    href={`/services#${p.slug}`}
                    className="card-soft lift group flex h-full flex-col p-7"
                    style={{ ["--pa" as string]: p.accent }}
                  >
                    <span
                      aria-hidden="true"
                      className="grid h-11 w-11 place-items-center rounded-2xl text-white font-display font-semibold"
                      style={{ background: p.accent }}
                    >
                      {p.title.charAt(0)}
                    </span>
                    <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight flex items-center gap-1.5">
                      {p.title}
                      <ArrowUpRight className="h-5 w-5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" style={{ color: p.accent }} />
                    </h3>
                    <p className="mt-2.5 text-foreground/70 leading-relaxed flex-1">{p.blurb}</p>
                    {count > 0 && (
                      <span className="mt-6 font-mono text-xs uppercase tracking-[0.14em]" style={{ color: p.accent }}>
                        {count} service{count === 1 ? "" : "s"} →
                      </span>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- PROOF / TESTIMONIALS (renders only when present) ---------- */}
      {testimonials.length > 0 && (
        <section className="px-5 sm:px-8 py-24 bg-surface-2 border-y border-border">
          <div className="mx-auto max-w-[1200px]">
            <motion.div {...rise} className="max-w-[46ch]">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-strong">— In their words</p>
              <h2 className="mt-4 font-display text-4xl md:text-[3.2rem] font-semibold tracking-tight text-balance">
                Work people are glad they paid for.
              </h2>
            </motion.div>
            <div className="mt-12 grid gap-5 md:grid-cols-3 items-start">
              {testimonials.map((t, i) => (
                <motion.figure
                  key={i}
                  {...rise}
                  transition={{ ...rise.transition, delay: (i % 3) * 0.06 }}
                  className="card-soft p-6 flex flex-col"
                >
                  <div className="flex gap-0.5 text-amber">
                    {Array.from({ length: Math.max(1, Math.min(5, Math.round(t.rating))) }).map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-current" strokeWidth={0} />
                    ))}
                  </div>
                  <blockquote className="mt-4 text-foreground/80 leading-relaxed text-[0.96rem] flex-1 text-pretty">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    {t.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.avatar} alt={t.authorName || t.company} width={36} height={36} loading="lazy" decoding="async" className="h-9 w-9 rounded-full object-cover" />
                    ) : (
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-primary-soft text-primary-strong font-display font-semibold">
                        {(t.authorName || t.company || "?").charAt(0).toUpperCase()}
                      </span>
                    )}
                    <span>
                      <span className="block font-medium text-foreground text-sm">{t.authorName || t.company}</span>
                      {(t.authorRole || (t.authorName && t.company)) && (
                        <span className="block text-xs text-muted">
                          {[t.authorRole, t.authorName ? t.company : ""].filter(Boolean).join(" · ")}
                        </span>
                      )}
                    </span>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaInline text="Not sure which service fits? Tell us the problem — we'll point you the right way." />

      {/* ---------- PROCESS ---------- */}
      <section className="px-5 sm:px-8 py-24 md:py-28 bg-surface-2 border-y border-border">
        <div className="mx-auto max-w-[1200px]">
          <motion.div {...rise} className="max-w-[46ch]">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-strong">{c.processEyebrow || FALLBACK.processEyebrow}</p>
            <h2 className="mt-4 font-display text-4xl md:text-[3.2rem] font-semibold tracking-tight text-balance">
              {c.processHeading || FALLBACK.processHeading}
            </h2>
          </motion.div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <motion.div key={s.number || i} {...rise} transition={{ ...rise.transition, delay: (i % 4) * 0.06 }} className="card-soft p-6">
                <span className="font-mono text-sm font-semibold text-primary-strong">{s.number}</span>
                <h3 className="mt-3 font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-foreground/70 leading-relaxed text-[0.95rem]">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FAQ (answer-engine ready) ---------- */}
      <section className="px-5 sm:px-8 py-24">
        <div className="mx-auto max-w-[820px]">
          <motion.div {...rise}>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-strong">— Good questions</p>
            <h2 className="mt-4 font-display text-4xl md:text-[3rem] font-semibold tracking-tight text-balance">
              Things people ask before saying hello.
            </h2>
          </motion.div>
          <div className="mt-10 space-y-3">
            {FAQ_ITEMS.map((f) => (
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FAQ_ITEMS.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }),
          }}
        />
      </section>

      {/* ---------- CONTACT (real form + booking) ---------- */}
      <WarmContact />
    </>
  );
}
