"use client";

import { motion } from "framer-motion";
import { Globe2, Zap, ShieldCheck, Landmark } from "lucide-react";

const rails = [
  {
    icon: Globe2,
    title: "147 countries",
    desc: "Domestic rails everywhere. Never route through SWIFT unless it makes sense.",
    stat: "147",
    statLabel: "Countries",
  },
  {
    icon: Zap,
    title: "Sub-300ms settlement",
    desc: "Card and ACH in milliseconds, cross-border in under 2 seconds.",
    stat: "287ms",
    statLabel: "Median",
  },
  {
    icon: Landmark,
    title: "Direct bank partnerships",
    desc: "28 banking partners. No middle layer taking a spread.",
    stat: "28",
    statLabel: "Banks",
  },
  {
    icon: ShieldCheck,
    title: "Regulated at source",
    desc: "Licensed in every jurisdiction we operate. Fully compliant by default.",
    stat: "147",
    statLabel: "Licenses",
  },
];

export function Rails() {
  return (
    <section id="rails" className="relative py-32 px-6 md:px-10 border-t border-white/5">
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-20"
        >
          <div className="font-mono text-[10px] text-[#14b8a6] uppercase tracking-[0.3em] mb-4">
            — Rails · 02
          </div>
          <h2 className="font-serif text-5xl md:text-7xl font-normal tracking-tight leading-[0.95] text-balance">
            One API.
            <br />
            <span className="serif-italic cream-text">Every rail on earth.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-px bg-white/5">
          {rails.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="relative bg-[#0a0e1a] p-10 group hover:bg-[#0f172a] transition-colors"
            >
              <div className="flex items-start justify-between mb-12">
                <div className="w-12 h-12 rounded-full border border-[#14b8a6]/30 grid place-items-center group-hover:border-[#14b8a6] group-hover:shadow-[0_0_30px_rgba(20,184,166,0.25)] transition-all">
                  <r.icon className="w-5 h-5 text-[#14b8a6]" />
                </div>
                <div className="text-right">
                  <div className="font-serif text-4xl md:text-5xl cream-text leading-none">{r.stat}</div>
                  <div className="mt-2 font-mono text-[9px] text-white/40 uppercase tracking-[0.25em]">{r.statLabel}</div>
                </div>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl mb-3">{r.title}</h3>
              <p className="text-white/60 leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
