"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen px-6 md:px-10 pt-10 pb-16 overflow-hidden">
      <nav className="relative flex items-center justify-between mb-20 md:mb-28 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--mute)]">
        <Link href="/demos" className="hover:text-[var(--ink)]">← All demos</Link>
        <div className="terroir-serif text-xl tracking-wider text-[var(--forest)]">
          Terroir
        </div>
        <div className="flex gap-6">
          <span>Origins</span>
          <span>Subscribe</span>
          <span>Cart (0)</span>
        </div>
      </nav>

      <div className="relative mx-auto max-w-[1400px] grid grid-cols-12 gap-6 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="col-span-12 md:col-span-7"
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--clay)] mb-6">
            — Spring rotation · 2026
          </div>
          <h1 className="terroir-serif text-5xl md:text-8xl leading-[0.95] tracking-tight text-balance text-[var(--forest)]">
            Coffee,
            <br />
            <span className="italic">honestly sourced.</span>
          </h1>
          <p className="mt-10 text-lg md:text-xl text-[var(--ink)]/70 max-w-md leading-relaxed">
            Five single-origin lots per season. Direct trade with every farm.
            You&apos;ll know the grower&apos;s name before you taste the coffee.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <Link
              href="#origins"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[var(--forest)] text-[var(--cream)] font-medium text-sm hover:bg-[var(--forest)]/90 transition-colors"
            >
              Explore this season
            </Link>
            <Link
              href="#subscribe"
              className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--ink)]/60 hover:text-[var(--ink)]"
            >
              Subscribe to the box →
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="col-span-12 md:col-span-5 relative aspect-square"
        >
          <div className="absolute inset-0 rounded-full overflow-hidden bg-gradient-to-br from-[var(--clay)]/30 via-[var(--forest)]/20 to-[var(--cream)]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="terroir-serif text-[18vw] md:text-[12vw] italic text-[var(--forest)]/40 leading-none">
                T
              </div>
            </div>
            <div className="absolute bottom-10 left-10 font-mono text-[9px] uppercase tracking-[0.4em] text-[var(--ink)]/60">
              Huila · Colombia
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative mt-16 md:mt-24 pt-8 border-t border-[var(--ink)]/10 grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--mute)]">
        <div>
          <div className="text-[var(--forest)] terroir-serif text-3xl mb-1 italic">05</div>
          <div>Origins this season</div>
        </div>
        <div>
          <div className="text-[var(--forest)] terroir-serif text-3xl mb-1 italic">18</div>
          <div>Farmers paid direct</div>
        </div>
        <div>
          <div className="text-[var(--forest)] terroir-serif text-3xl mb-1 italic">72h</div>
          <div>Roast-to-door</div>
        </div>
        <div>
          <div className="text-[var(--forest)] terroir-serif text-3xl mb-1 italic">85+</div>
          <div>SCA score floor</div>
        </div>
      </div>
    </section>
  );
}
