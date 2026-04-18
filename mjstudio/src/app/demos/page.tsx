"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { demos, type DemoKind } from "@/data/demos";
import { LazyVideo } from "@/components/LazyVideo";

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
    <main className="min-h-screen bg-[#08080a] text-white">
      <header className="border-b border-white/5 px-6 md:px-10 py-8">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors"
          >
            ← Brandivibe
          </Link>
          <Link
            href="/#contact"
            className="font-mono text-xs uppercase tracking-[0.3em] text-white/40 hover:text-[#84e1ff] transition-colors"
          >
            Book a call
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24">
        <div className="mb-12 md:mb-16">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[#84e1ff] mb-4">
            — Demos & Case Studies
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6 text-balance">
            Selected work.
          </h1>
          <p className="text-lg md:text-xl text-white/55 max-w-2xl text-balance">
            Every demo is a working, hand-built Next.js site — landing pages, content-heavy websites,
            and Shopify storefronts. Click through to experience them live.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-12 border-b border-white/5 pb-6">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-[0.25em] transition-colors border ${
                  active
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white/60 border-white/15 hover:border-white/40 hover:text-white"
                }`}
              >
                {t.label}
                <span className={`ml-2 ${active ? "text-black/50" : "text-white/30"}`}>
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {visible.map((d) => (
              <Link
                key={d.num}
                href={d.href}
                className="group block rounded-3xl border border-white/10 hover:border-white/25 transition-colors overflow-hidden bg-white/[0.015]"
              >
                <div
                  className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${d.gradient}`}
                >
                  {d.video ? (
                    <LazyVideo
                      src={d.video}
                      poster={d.poster ?? undefined}
                      className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center px-6">
                      <div className="text-[14vw] md:text-[7vw] font-semibold tracking-tighter text-white/90 text-center">
                        {d.name}
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                  {d.comingSoon && (
                    <div className="absolute top-5 left-5 font-mono text-[9px] uppercase tracking-[0.3em] px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20">
                      Coming soon
                    </div>
                  )}
                  <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm grid place-items-center border border-white/15 group-hover:bg-white/25 transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div className="absolute bottom-5 left-5 font-mono text-[10px] uppercase tracking-[0.3em] text-white/70">
                    {d.num} · {d.year}
                  </div>
                </div>

                <div className="p-7 md:p-8">
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3">
                    {d.category}
                  </div>
                  <div className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
                    {d.name}
                  </div>
                  <p className="text-white/50 leading-relaxed text-sm mb-5 line-clamp-3">
                    {d.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {d.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-full text-[10px] bg-white/5 border border-white/10 text-white/60 font-mono"
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
          <div className="rounded-3xl border border-white/10 p-16 text-center text-white/40">
            Nothing here yet.
          </div>
        )}

        <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#84e1ff] mb-2">
              Have a project?
            </div>
            <div className="text-2xl md:text-3xl font-semibold tracking-tight">
              Let&apos;s build something that closes deals on sight.
            </div>
          </div>
          <Link
            href="/#contact"
            className="shrink-0 inline-flex items-center gap-3 px-7 py-4 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-colors"
          >
            Claim a free site audit →
          </Link>
        </div>
      </div>
    </main>
  );
}
