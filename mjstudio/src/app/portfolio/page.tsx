"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { demos, type DemoKind } from "@/data/demos";
import { LazyVideo } from "@/components/LazyVideo";
import { WarmNav } from "@/components/warm/WarmNav";
import { WarmFooter } from "@/components/warm/WarmFooter";

type Tab = "all" | DemoKind;

const TABS: Array<{ id: Tab; label: string; count: number }> = [
  { id: "all", label: "All", count: demos.length },
  { id: "landing", label: "Landing pages", count: demos.filter((d) => d.kind === "landing").length },
  { id: "website", label: "Full websites", count: demos.filter((d) => d.kind === "website").length },
  { id: "shopify", label: "Shopify stores", count: demos.filter((d) => d.kind === "shopify").length },
];

export default function DemosPage() {
  const [tab, setTab] = useState<Tab>("all");
  const visible = tab === "all" ? demos : demos.filter((d) => d.kind === tab);

  return (
    <>
      <WarmNav />
      <main>
        {/* ---- hero ---- */}
        <section className="relative overflow-hidden pt-36 md:pt-40 pb-12 px-5 sm:px-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 right-[-8%] h-[460px] w-[460px] rounded-full opacity-50 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(255,106,61,0.26), transparent 68%)" }}
          />
          <div className="relative mx-auto max-w-[1200px]">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">— Our work</p>
            <h1 className="mt-5 font-display text-[2.7rem] leading-[1.03] sm:text-6xl md:text-[4.2rem] font-semibold tracking-tight text-balance max-w-[16ch]">
              A few things we&apos;ve loved building.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-foreground/70 max-w-[56ch] leading-relaxed text-pretty">
              Every one of these is a real, hand-built site — landing pages, full websites, and Shopify
              storefronts we made from scratch. Have a click around; they&apos;re all live, so you can feel
              exactly how they move.
            </p>
          </div>
        </section>

        {/* ---- filter tabs ---- */}
        <section className="px-5 sm:px-8">
          <div className="mx-auto max-w-[1200px] flex flex-wrap gap-2 border-b border-border pb-6">
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors border ${
                    active
                      ? "bg-foreground text-background border-foreground"
                      : "bg-surface text-foreground/70 border-border-strong hover:border-foreground/30 hover:text-foreground"
                  }`}
                >
                  {t.label}
                  <span className={active ? "text-background/55" : "text-muted"}>{t.count}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ---- gallery ---- */}
        <section className="px-5 sm:px-8 py-12 md:py-16">
          <div className="mx-auto max-w-[1200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
              >
                {visible.map((d) => (
                  <Link
                    key={d.num}
                    href={d.href}
                    className="card-soft lift group flex flex-col overflow-hidden"
                  >
                    <div className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${d.gradient}`}>
                      {d.video ? (
                        <LazyVideo
                          src={d.video}
                          poster={d.poster ?? undefined}
                          className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center px-6">
                          <div className="font-display text-5xl sm:text-6xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white/95 text-center break-words">
                            {d.name}
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/5" />

                      {d.comingSoon && (
                        <div className="absolute top-4 left-4 font-mono text-[9px] uppercase tracking-[0.24em] px-2.5 py-1 rounded-full bg-white/85 text-foreground backdrop-blur-sm border border-white/60">
                          In the works
                        </div>
                      )}
                      <div className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-foreground backdrop-blur-sm border border-white/60 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors">
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                      <div className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.24em] text-white/85">
                        {d.num} · {d.year}
                      </div>
                    </div>

                    <div className="p-6 md:p-7 flex flex-col">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary mb-3">
                        {d.category}
                      </p>
                      <h2 className="font-display text-2xl md:text-[1.7rem] font-semibold tracking-tight">
                        {d.name}
                      </h2>
                      <p className="mt-2.5 text-foreground/70 leading-relaxed text-[0.95rem] line-clamp-3">
                        {d.description}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {d.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] text-foreground/70 font-mono"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </motion.div>
            </AnimatePresence>

            {visible.length === 0 && (
              <div className="card-soft p-16 text-center text-muted">
                Nothing here just yet — check back soon.
              </div>
            )}
          </div>
        </section>

        {/* ---- cta ---- */}
        <section className="px-5 sm:px-8 py-16 md:py-24">
          <div className="mx-auto max-w-[1080px] rounded-[36px] bg-foreground text-background px-7 py-14 md:px-16 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary mb-3">— Got something in mind?</p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-balance max-w-[20ch]">
                Let&apos;s build one you&apos;re proud to share.
              </h2>
            </div>
            <Link
              href="/#contact"
              className="shrink-0 inline-flex items-center gap-2 rounded-full bg-primary text-white px-7 py-4 font-medium hover:bg-primary-deep transition-colors"
            >
              Start a project <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <WarmFooter />
    </>
  );
}
