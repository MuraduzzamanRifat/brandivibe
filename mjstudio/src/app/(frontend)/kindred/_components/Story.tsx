"use client";

import { motion } from "framer-motion";

const pillars = [
  {
    label: "Botanicals",
    title: "Peak-potency, not peak-marketing.",
    body:
      "We source prickly pear seed and damask rose from two farms — one in the Atlas, one in Bulgaria. Cold-pressed in small batches, in season. The active compounds degrade after harvest, so we only bottle what we can ship within six weeks.",
  },
  {
    label: "Formulation",
    title: "Every ingredient earns its line.",
    body:
      "No fragrance cocktails. No filler ingredients stretching the formula. Bakuchiol is the retinol alternative without the irritation cycle. Hyaluronic is the low-molecular-weight kind that actually penetrates. You can read every ingredient aloud without looking it up.",
  },
  {
    label: "Ritual",
    title: "Four steps. Ten minutes. Every night.",
    body:
      "Skincare works on compliance, not hero products. We built the ritual around four steps most skincare skips or complicates. Ten minutes before bed. The payoff compounds — most subscribers see their skin tone even out by week six.",
  },
];

export function Story() {
  return (
    <section id="story" className="relative px-6 md:px-10 py-24 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-12 gap-6 mb-16 md:mb-24">
          <div className="col-span-12 md:col-span-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--rose)] mb-4">
              — The formulation
            </div>
          </div>
          <div className="col-span-12 md:col-span-8">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-7xl kindred-serif leading-[0.95] text-balance"
            >
              Skincare that
              <br />
              respects your attention.
            </motion.h2>
          </div>
        </div>

        <div className="space-y-20 md:space-y-28">
          {pillars.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-12 gap-6 md:gap-12 items-start"
            >
              <div className="col-span-12 md:col-span-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--ink)]/40 mb-2">
                  — 0{i + 1} · {p.label}
                </div>
              </div>
              <div className="col-span-12 md:col-span-8 md:pl-12">
                <h3 className="text-3xl md:text-5xl kindred-serif not-italic leading-[1.05] mb-5 text-balance">
                  {p.title}
                </h3>
                <p className="text-[var(--ink)]/65 leading-relaxed text-lg max-w-2xl">
                  {p.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
