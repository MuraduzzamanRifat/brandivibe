"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  X,
  Search,
  Bot,
  Rocket,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  MousePointerClick,
  SearchX,
  Unlink,
  Timer,
  Repeat,
  Shuffle,
  type LucideIcon,
} from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import { industries } from "@/data/industries";
import { accentInk } from "@/lib/accent";

/**
 * The conversion sections of the homepage.
 *
 * Hard rule throughout: every claim here is one Brandivibe could defend on a
 * sales call. No invented statistics, no borrowed client logos, no awards we
 * haven't won. Where a competitor's practice is described it is hedged
 * ("often", "usually") because we cannot know every agency.
 *
 * Proof-by-numbers is deliberately absent until there are real numbers to
 * show. Honesty is doing the persuading instead — see WhyNotUs, which is the
 * most disarming section on the page precisely because nobody else writes it.
 */

/* ------------------------------------------------------------------ */
/* 1. The problems a visitor actually arrives with                      */
/* ------------------------------------------------------------------ */

const PROBLEMS: { text: string; icon: LucideIcon; alt: string }[] = [
  {
    text: "Your website looks fine, but almost nobody enquires through it.",
    icon: MousePointerClick,
    alt: "A beautiful website that nobody enquires through",
  },
  {
    text: "You've been paying for SEO for months and can't point to what it bought.",
    icon: SearchX,
    alt: "Months of SEO spend with nothing to show for it",
  },
  {
    text: "The work is split across five freelancers who don't talk to each other.",
    icon: Unlink,
    alt: "Work scattered across freelancers who never speak to each other",
  },
  {
    text: "Your site is slow, and you've quietly stopped believing it can be fixed.",
    icon: Timer,
    alt: "A slow website you've given up on fixing",
  },
  {
    text: "The same manual job eats your team's week — every single week.",
    icon: Repeat,
    alt: "The same manual task repeating every week",
  },
  {
    text: "Your brand looks like a different company everywhere someone meets it.",
    icon: Shuffle,
    alt: "A brand that looks like a different company everywhere",
  },
];

/**
 * `images` comes from availableProblemImages() — one slot per problem, null
 * where no file exists. A card shows its photo when there is one and its icon
 * when there isn't, so the section is complete either way and half-finished
 * artwork never ships a broken image.
 */
export function Problems({ images = [] }: { images?: (string | null)[] }) {
  return (
    <section className="px-5 sm:px-8 py-24 md:py-28">
      <div className="mx-auto max-w-[1200px]">
        <Reveal className="max-w-[46ch]">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-strong">
            — Sound familiar?
          </p>
          <h2 className="mt-4 font-display text-4xl md:text-[3.2rem] font-semibold tracking-tight text-balance">
            Growing online shouldn&apos;t feel this hard.
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROBLEMS.map(({ text, icon: Icon, alt }, i) => {
            const img = images[i] ?? null;
            return (
              <RevealItem key={text} className="card-soft flex flex-col overflow-hidden">
                {img ? (
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={img}
                      alt={alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="px-6 pt-6">
                    <span
                      aria-hidden="true"
                      className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary-strong"
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                  </div>
                )}
                <p className="p-6 leading-relaxed text-foreground/80 text-pretty">{text}</p>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <Reveal>
          <p className="mt-10 text-lg text-foreground/70">
            If you nodded at any of those,{" "}
            <Link
              href="/contact"
              className="font-medium text-primary-strong underline underline-offset-4 hover:text-primary-deep"
            >
              tell us which one
            </Link>{" "}
            — that&apos;s the whole first conversation.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Outcomes, not deliverables — people buy the change, not the noun  */
/* ------------------------------------------------------------------ */

const OUTCOMES = [
  {
    icon: Search,
    title: "Get found — and get chosen",
    body: "Rank for what your buyers actually type, and show up when they ask an AI instead of Google.",
    href: "/services/seo-services",
    cta: "SEO that compounds",
  },
  {
    icon: TrendingUp,
    title: "Turn visitors into enquiries",
    body: "A site engineered around the decision your buyer is making, not around what looks nice in a mockup.",
    href: "/services/website-development",
    cta: "Website development",
  },
  {
    icon: Bot,
    title: "Stop doing the same job twice",
    body: "Automations and AI agents that quietly handle the repetitive work your team shouldn't be doing.",
    href: "/services/ai-automation-systems",
    cta: "AI automation",
  },
  {
    icon: ShoppingCart,
    title: "Sell more, with less friction",
    body: "Stores where browsing is a pleasure and checkout is effortless — because that's where the money leaks.",
    href: "/services/ecommerce-website",
    cta: "E-commerce",
  },
  {
    icon: Rocket,
    title: "Launch something new, properly",
    body: "From idea to live in about six weeks, built to grow into — not to be rebuilt in a year.",
    href: "/services/website-development",
    cta: "Start a build",
  },
  {
    icon: Sparkles,
    title: "Look as good as you actually are",
    body: "Design that finally matches the quality of the work you do — consistent everywhere people meet you.",
    href: "/services/ui-ux-design",
    cta: "Design & UX",
  },
];

export function Outcomes() {
  return (
    <section className="px-5 sm:px-8 py-24 md:py-28 bg-surface-2 border-y border-border">
      <div className="mx-auto max-w-[1200px]">
        <Reveal className="max-w-[48ch]">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-strong">
            — Start with the outcome
          </p>
          <h2 className="mt-4 font-display text-4xl md:text-[3.2rem] font-semibold tracking-tight text-balance">
            What do you actually want to change?
          </h2>
          <p className="mt-5 text-lg text-foreground/70 leading-relaxed">
            Nobody wakes up wanting &ldquo;a website&rdquo;. Pick the change you&apos;re
            after and we&apos;ll show you what gets you there.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {OUTCOMES.map(({ icon: Icon, title, body, href, cta }) => (
            <RevealItem key={title}>
              <Link href={href} className="card-soft lift group flex h-full flex-col p-7">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary-strong">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">{title}</h3>
                <p className="mt-2.5 flex-1 leading-relaxed text-foreground/70">{body}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary-strong transition-all group-hover:gap-2.5">
                  {cta} <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Industry navigator — surfaces the service×industry pages          */
/* ------------------------------------------------------------------ */

export function IndustryNavigator() {
  return (
    <section className="px-5 sm:px-8 py-24 md:py-28">
      <div className="mx-auto max-w-[1200px]">
        <Reveal className="max-w-[48ch]">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-strong">
            — Built for how you sell
          </p>
          <h2 className="mt-4 font-display text-4xl md:text-[3.2rem] font-semibold tracking-tight text-balance">
            Pick your industry. We&apos;ll show you the version built for it.
          </h2>
          <p className="mt-5 text-lg text-foreground/70 leading-relaxed">
            A SaaS trial and a property enquiry are not the same decision. Every service
            we offer is shaped around how buyers in your world actually choose.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((ind) => (
            <RevealItem key={ind.slug}>
              <Link
                href={`/services/website-development/${ind.slug}`}
                className="card-soft lift group flex h-full flex-col p-6"
              >
                <h3 className="font-display text-lg font-semibold tracking-tight">{ind.name}</h3>
                <p className="mt-2 flex-1 text-[0.9rem] leading-relaxed text-foreground/65">
                  {ind.shortLabel}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary-strong transition-all group-hover:gap-2.5">
                  See the fit <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Honest comparison — competitor column is hedged, never absolute   */
/* ------------------------------------------------------------------ */

const COMPARISON: { feature: string; us: string; them: string }[] = [
  { feature: "Who actually does the work", us: "The senior person you spoke to", them: "Often juniors, behind an account manager" },
  { feature: "What it costs", us: "One fixed price, agreed before we start", them: "Hourly, or a scope that quietly grows" },
  { feature: "Who owns the code and files", us: "You do — all of it, outright", them: "Sometimes licensed, not transferred" },
  { feature: "Who you talk to", us: "The person building it", them: "Usually an account manager in between" },
  { feature: "Search visibility", us: "Built in from the first page we design", them: "Frequently a paid add-on afterwards" },
  { feature: "Getting out", us: "No lock-in — care plans cancel any time", them: "Often a long retainer contract" },
];

export function Comparison() {
  return (
    <section className="px-5 sm:px-8 py-24 md:py-28 bg-surface-2 border-y border-border">
      <div className="mx-auto max-w-[1000px]">
        <Reveal className="max-w-[48ch]">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-strong">
            — An honest comparison
          </p>
          <h2 className="mt-4 font-display text-4xl md:text-[3.2rem] font-semibold tracking-tight text-balance">
            How we differ from a typical agency.
          </h2>
          <p className="mt-5 text-lg text-foreground/70 leading-relaxed">
            We can only speak for how we work. The right-hand column is what we hear
            most often from people who come to us after a bad experience — not a claim
            about every agency.
          </p>
        </Reveal>

        <Reveal className="mt-12">
          {/* Wide table scrolls in its own container so the page never does. */}
          <div className="overflow-x-auto rounded-[28px] border border-border bg-surface">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <caption className="sr-only">
                How Brandivibe compares with a typical agency
              </caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="p-5 font-mono text-xs uppercase tracking-[0.14em] text-muted">
                    &nbsp;
                  </th>
                  <th scope="col" className="p-5 font-display text-lg font-semibold text-foreground">
                    Brandivibe
                  </th>
                  <th scope="col" className="p-5 font-display text-lg font-semibold text-foreground/70">
                    A typical agency
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.feature} className="border-b border-border last:border-0">
                    <th
                      scope="row"
                      className="p-5 align-top text-[0.95rem] font-medium text-foreground/80"
                    >
                      {row.feature}
                    </th>
                    <td className="p-5 align-top">
                      <span className="flex gap-2.5">
                        <Check
                          aria-hidden="true"
                          className="mt-0.5 h-5 w-5 shrink-0 text-primary-strong"
                        />
                        <span className="text-foreground/85">{row.us}</span>
                      </span>
                    </td>
                    <td className="p-5 align-top">
                      <span className="flex gap-2.5">
                        <X aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-muted" />
                        <span className="text-foreground/70">{row.them}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Tech stack — ONLY what we genuinely build with                    */
/* ------------------------------------------------------------------ */

// Every one of these is defensible: this very site is built on the first group,
// and the WordPress/AI tooling is confirmed working practice. Nothing aspirational.
const STACK: { group: string; items: string[] }[] = [
  {
    group: "Websites & apps",
    items: ["Next.js", "React", "TypeScript", "Node.js", "Tailwind CSS", "Three.js / WebGL"],
  },
  {
    group: "WordPress",
    items: ["WordPress", "Elementor", "WooCommerce"],
  },
  {
    group: "AI & content",
    items: ["OpenAI", "Claude", "AI automation workflows"],
  },
  {
    group: "Infrastructure",
    items: ["Vercel", "PostgreSQL", "Payload CMS", "Vercel Blob"],
  },
];

export function TechStack() {
  return (
    <section className="px-5 sm:px-8 py-24 md:py-28">
      <div className="mx-auto max-w-[1200px]">
        <Reveal className="max-w-[48ch]">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-strong">
            — What we build with
          </p>
          <h2 className="mt-4 font-display text-4xl md:text-[3.2rem] font-semibold tracking-tight text-balance">
            The tools, named — not &ldquo;modern technology&rdquo;.
          </h2>
          <p className="mt-5 text-lg text-foreground/70 leading-relaxed">
            This site is built on the same stack: Next.js, TypeScript, Payload, Postgres,
            and WebGL. You can inspect it right now.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STACK.map((g) => (
            <RevealItem key={g.group} className="card-soft p-6">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary-strong">
                {g.group}
              </p>
              <ul className="mt-4 space-y-2">
                {g.items.map((item) => (
                  <li key={item} className="text-foreground/75">
                    {item}
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Why NOT us — the most disarming section on the page               */
/* ------------------------------------------------------------------ */

const NOT_FOR_YOU = [
  "You want the cheapest quote. We won't be it, and we'd rather say so now.",
  "You need it live next week. Good work takes about six weeks.",
  "You want to approve every pixel yourself. You're hiring judgement, not hands.",
  "You only care how it looks, not whether it earns.",
  "You want a guaranteed ranking or a promised revenue number. Nobody honest can give you that.",
];

export function WhyNotUs() {
  return (
    <section className="px-5 sm:px-8 py-24 md:py-28 bg-surface-2 border-y border-border">
      <div className="mx-auto max-w-[860px]">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-strong">
            — Let&apos;s save you some time
          </p>
          <h2 className="mt-4 font-display text-4xl md:text-[3.2rem] font-semibold tracking-tight text-balance">
            We&apos;re probably not your studio if…
          </h2>
        </Reveal>

        <RevealGroup className="mt-10 space-y-3.5">
          {NOT_FOR_YOU.map((line) => (
            <RevealItem key={line} className="flex gap-3.5">
              <X aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-muted" />
              <p className="text-lg leading-relaxed text-foreground/80 text-pretty">{line}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal>
          <p className="mt-10 text-lg leading-relaxed text-foreground/80">
            Still reading? Then we&apos;ll probably get on rather well.{" "}
            <Link
              href="/contact"
              className="font-medium text-primary-strong underline underline-offset-4 hover:text-primary-deep"
            >
              Tell us what you&apos;re trying to do
            </Link>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 7. After launch — the question everyone has and nobody answers       */
/* ------------------------------------------------------------------ */

const AFTER_LAUNCH = [
  { title: "30 days of support", body: "Anything that isn't behaving, we fix. No ticket queue, no meter running." },
  { title: "A proper walkthrough", body: "We show your team how to run it, and record it so the next hire can watch too." },
  { title: "Analytics set up properly", body: "Analytics and Search Console configured and verified — not left as a to-do." },
  { title: "Everything handed over", body: "Code, files, accounts, domains. All yours, in your name, from day one." },
  { title: "Care, only if you want it", body: "Updates, backups and small tweaks on a plan you can cancel any time." },
];

export function AfterLaunch() {
  return (
    <section className="px-5 sm:px-8 py-24 md:py-28">
      <div className="mx-auto max-w-[1200px]">
        <Reveal className="max-w-[48ch]">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-strong">
            — The bit most agencies skip
          </p>
          <h2 className="mt-4 font-display text-4xl md:text-[3.2rem] font-semibold tracking-tight text-balance">
            What happens after launch.
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {AFTER_LAUNCH.map((s) => (
            <RevealItem key={s.title} className="card-soft p-6">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary-strong">
                <Check className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-foreground/70 text-[0.96rem]">{s.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 8. Honest trust bar — signals, never invented statistics             */
/* ------------------------------------------------------------------ */

const TRUST = [
  "Senior people, no outsourcing",
  "One fixed price, agreed up front",
  "You own everything we build",
  "A friendly reply within a day",
];

export function TrustBar() {
  return (
    <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
      {TRUST.map((t) => (
        <li key={t} className="flex items-center gap-2 text-[0.95rem] text-foreground/70">
          <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-primary-strong" />
          {t}
        </li>
      ))}
    </ul>
  );
}

/** Accent-tinted pillar dots used by the industry hub. Kept for reuse. */
export const pillarInk = accentInk;
