"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

function nextDrop(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  d.setHours(12, 0, 0, 0);
  return d;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function Hero() {
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const target = nextDrop();
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setCountdown({ d, h, m, s });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen px-6 md:px-10 pt-8 pb-16 overflow-hidden flex flex-col">
      <nav className="relative flex items-center justify-between mb-12 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--mute)]">
        <Link href="/demos" className="hover:text-[var(--ink)]">← All demos</Link>
        <div className="ironwood-display text-xl text-[var(--ink)]">IRONWOOD</div>
        <div className="flex gap-6">
          <span className="hidden md:inline">Drop 07</span>
          <span>Cart (0)</span>
        </div>
      </nav>

      <div className="relative flex-1 grid grid-cols-12 gap-6 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="col-span-12 md:col-span-5"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[var(--acid)] text-[var(--acid)] font-mono text-[10px] uppercase tracking-[0.4em] mb-10">
            <span className="w-1.5 h-1.5 bg-[var(--acid)] animate-pulse" />
            Drop 07 · Live in
          </div>
          <div className="ironwood-display text-[14vw] md:text-[9vw] leading-[0.85] mb-8">
            SPRING
            <br />
            CHAPTER.
          </div>
          <p className="text-[var(--ink)]/70 leading-relaxed max-w-md mb-8">
            Twelve pieces. Two hundred units each. No restocks. Once the drop sells through,
            the chapter closes — the next one arrives in July.
          </p>
          <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--mute)]">
            <span>Cotton · Recycled nylon</span>
            <span className="w-1 h-1 rounded-full bg-[var(--mute)]" />
            <span>Made in Portugal</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="col-span-12 md:col-span-7"
        >
          <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-[var(--ink)]/10 bg-[var(--steel)]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="ironwood-display text-[32vw] md:text-[24vw] text-[var(--ink)]/8 leading-none">
                07
              </div>
            </div>
            <div className="absolute top-6 left-6 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--mute)]">
              Frame 01 · Workwear jacket
            </div>
            <div className="absolute bottom-6 right-6 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--mute)]">
              $280
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative mt-16 pt-8 border-t border-[var(--ink)]/10 grid grid-cols-4 gap-4 md:gap-6">
        {(["d", "h", "m", "s"] as const).map((k, i) => (
          <div key={k} className="flex flex-col">
            <div className="ironwood-display text-5xl md:text-7xl tabular-nums leading-none">
              {pad(countdown[k])}
            </div>
            <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.4em] text-[var(--mute)]">
              {["Days", "Hours", "Min", "Sec"][i]}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
