"use client";

import { motion } from "framer-motion";

/**
 * Thin trust strip between Hero and Manifesto. Provides scannable proof
 * (real portfolio count, real build window, real founder name) so a $25K
 * prospect doesn't bounce on the hero's claim alone.
 *
 * Pulled out into its own section because it reads as a stat row, not part
 * of the kinetic hero or the manifesto narrative.
 */
const STATS: Array<{ value: string; label: string }> = [
  { value: "12", label: "Portfolio projects shipped" },
  { value: "6", label: "Week delivery window" },
  { value: "$5–25K", label: "Build range" },
  { value: "1", label: "Founder, end-to-end" },
];

export function TrustStrip() {
  return (
    <section className="relative border-y border-white/5 bg-[#08080a] px-6 md:px-12 py-10 md:py-14">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col"
            >
              <div className="text-3xl md:text-5xl font-semibold tracking-tight tabular-nums">
                {s.value}
              </div>
              <div className="mt-2 font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/40">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-white/5 font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/35">
          Independent studio · Built and shipped by Muraduzzaman · Remote, worldwide
        </div>
      </div>
    </section>
  );
}
