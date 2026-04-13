"use client";

import { motion } from "framer-motion";

const companies = [
  { name: "Helix Protocol", sector: "DeFi", stage: "Seed", year: "2023", round: "Led" },
  { name: "Neuron", sector: "Developer tools", stage: "Series A", year: "2024", round: "Led" },
  { name: "Pulse Health", sector: "Telehealth", stage: "Seed", year: "2022", round: "Led" },
  { name: "Axiom", sector: "Fintech infrastructure", stage: "Series A", year: "2025", round: "Led" },
  { name: "Solace", sector: "Climate hardware", stage: "Seed", year: "2023", round: "Participated" },
  { name: "Monolith Studio", sector: "Architecture tools", stage: "Seed", year: "2024", round: "Led" },
  { name: "Orbit Motors", sector: "EV + hypercar", stage: "Series A", year: "2025", round: "Led" },
  { name: "Aurora Maison", sector: "Luxury retail", stage: "Seed", year: "2022", round: "Led" },
];

export function Portfolio() {
  return (
    <section id="portfolio" className="relative py-32 px-8 md:px-12 border-t hairline-champagne overflow-hidden">
      <video
        src="/atrium/stock/section-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-[0.13] pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1020] via-[#0a1020]/70 to-[#0a1020] pointer-events-none" />
      <div className="relative mx-auto max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="flex items-center gap-5 mb-8">
            <div className="w-12 h-px bg-[#e8d49a]/60" />
            <span className="text-[10px] tracking-[0.35em] uppercase champagne-text">
              — Portfolio · II
            </span>
          </div>
          <h2 className="font-serif text-5xl md:text-7xl font-normal tracking-[-0.015em] leading-[0.95] text-balance max-w-4xl">
            Forty-seven companies.
            <br />
            <span className="serif-italic champagne-ink">Eight we led.</span>
          </h2>
        </motion.div>

        <div className="border-t hairline-champagne">
          {companies.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className="grid grid-cols-12 gap-4 py-7 border-b hairline-champagne hover:bg-white/[0.015] transition-colors group items-baseline"
            >
              <div className="col-span-1 font-mono text-[10px] text-white/40">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="col-span-11 md:col-span-4 font-serif text-2xl md:text-3xl group-hover:translate-x-2 transition-transform">
                {c.name}
              </div>
              <div className="col-span-6 md:col-span-3 text-xs text-white/60 uppercase tracking-[0.2em]">
                {c.sector}
              </div>
              <div className="col-span-4 md:col-span-2 text-xs text-white/60 uppercase tracking-[0.2em]">
                {c.stage}
              </div>
              <div className="col-span-1 text-xs text-white/40 uppercase tracking-[0.2em] text-right">
                {c.year}
              </div>
              <div className="col-span-12 md:col-span-1 text-[10px] uppercase tracking-[0.25em] text-right champagne-text">
                {c.round}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
