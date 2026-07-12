"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import { demos } from "@/data/demos";

/**
 * Work, on the homepage.
 *
 * The homepage never showed a single piece of work — the 13 interactive builds
 * at /portfolio were reachable only from the nav. That is the one thing a
 * prospect wants to see before anything else.
 *
 * These are labelled honestly as CONCEPT BUILDS, not client projects. Calling
 * them client work would be the same fabrication we've refused everywhere else,
 * and they're impressive enough without the lie — each one is a real, live,
 * interactive site you can open right now.
 *
 * Only demos with a real poster image on disk are shown; the rest would render
 * an empty box.
 */

const FEATURED = demos.filter((d) => d.poster && !d.comingSoon).slice(0, 6);

export function HomePortfolio() {
  if (FEATURED.length === 0) return null;

  return (
    <section className="px-5 sm:px-8 py-24 md:py-28">
      <div className="mx-auto max-w-[1200px]">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[52ch]">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-strong">
              — Things we&apos;ve built
            </p>
            <h2 className="mt-4 font-display text-4xl md:text-[3.2rem] font-semibold tracking-tight text-balance">
              Open any of them. They&apos;re real, and they&apos;re live.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-foreground/70">
              These are concept builds — our own, not client projects — made to show what
              we can actually do. Every one is a working site you can click into right now,
              which is more than a screenshot can promise.
            </p>
          </div>
          <Link
            href="/portfolio"
            className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border border-border-strong bg-surface px-6 py-3 font-medium text-foreground transition-colors hover:border-foreground/30"
          >
            See all work <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map((d) => (
            <RevealItem key={d.href}>
              <Link href={d.href} className="card-soft lift group block h-full overflow-hidden">
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={d.poster as string}
                    alt={`${d.name} — ${d.category}`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-xl font-semibold tracking-tight">{d.name}</h3>
                    <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
                      {d.year}
                    </span>
                  </div>
                  <p className="mt-2 text-[0.9rem] leading-relaxed text-foreground/65">
                    {d.category}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary-strong transition-all group-hover:gap-2.5">
                    Open it <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
