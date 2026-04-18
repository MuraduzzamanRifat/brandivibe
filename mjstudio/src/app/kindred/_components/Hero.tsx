"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen px-6 md:px-10 pt-10 pb-16 overflow-hidden">
      <nav className="relative flex items-center justify-between mb-24 md:mb-32 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--ink)]/70">
        <Link href="/demos" className="hover:text-[var(--ink)]">← All demos</Link>
        <div className="text-xl tracking-[0.4em] kindred-serif not-italic font-normal text-[var(--ink)]">
          Kindred
        </div>
        <Link href="#products" className="hover:text-[var(--ink)]">Shop ritual</Link>
      </nav>

      <div className="relative mx-auto max-w-[1400px] grid grid-cols-12 gap-8 items-end">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="col-span-12 md:col-span-7"
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--rose)] mb-6">
            — Seasonal ritual · No.04
          </div>
          <h1 className="text-5xl md:text-8xl kindred-serif leading-[0.95] tracking-tight text-balance">
            Skin,
            <br />
            rested.
          </h1>
          <p className="mt-10 text-lg md:text-xl text-[var(--ink)]/70 max-w-md leading-relaxed">
            A four-step evening ritual formulated around
            skin recovery during sleep. Botanicals at peak
            potency, nothing filler.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <Link
              href="#products"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[var(--ink)] text-[var(--cream)] font-medium text-sm hover:bg-[var(--ink)]/85 transition-colors"
            >
              Begin ritual
            </Link>
            <Link
              href="#story"
              className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--ink)]/60 hover:text-[var(--ink)]"
            >
              Our formulation →
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="col-span-12 md:col-span-5 relative aspect-[3/4]"
        >
          <div className="absolute inset-0 rounded-[2rem] overflow-hidden bg-gradient-to-br from-[var(--rose)]/40 via-[var(--sand)] to-[var(--cream)]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-[18vw] md:text-[12vw] kindred-serif text-[var(--ink)]/25 leading-none">
                K
              </div>
            </div>
            <div className="absolute bottom-8 left-8 font-mono text-[9px] uppercase tracking-[0.4em] text-[var(--ink)]/50">
              Kindred Elixir · 30ml
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative mt-20 md:mt-28 pt-10 border-t border-[var(--ink)]/10 grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--ink)]/60">
        <div><span className="text-[var(--ink)]">01</span> — Clean</div>
        <div><span className="text-[var(--ink)]">02</span> — Restore</div>
        <div><span className="text-[var(--ink)]">03</span> — Seal</div>
        <div><span className="text-[var(--ink)]">04</span> — Mask</div>
      </div>
    </section>
  );
}
