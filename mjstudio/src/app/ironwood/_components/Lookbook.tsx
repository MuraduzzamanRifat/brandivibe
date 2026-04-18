"use client";

import { motion } from "framer-motion";

const frames = [
  { num: "01", label: "Warehouse · Porto", size: "md:col-span-7 md:row-span-2" },
  { num: "02", label: "Atelier · Lisbon", size: "md:col-span-5" },
  { num: "03", label: "Field · Douro Valley", size: "md:col-span-5" },
];

export function Lookbook() {
  return (
    <section className="relative px-6 md:px-10 py-24 md:py-32 bg-[var(--steel)]">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-12 gap-6 mb-14">
          <div className="col-span-12 md:col-span-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--acid)] mb-4">
              — Lookbook
            </div>
          </div>
          <div className="col-span-12 md:col-span-8">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="ironwood-display text-5xl md:text-7xl leading-[0.9] text-balance"
            >
              SHOT IN PLACES
              <br />
              THAT WORK.
            </motion.h2>
            <p className="mt-6 text-[var(--ink)]/65 leading-relaxed max-w-xl">
              We photograph every chapter in the places it was designed for —
              warehouses, workshops, the back rooms of the people who actually
              wear it.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-4 md:gap-6 h-auto md:h-[80vh]">
          {frames.map((f, i) => (
            <motion.div
              key={f.num}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`relative ${f.size} rounded-lg overflow-hidden bg-[var(--bg)] border border-[var(--ink)]/10 group cursor-pointer`}
              style={{ minHeight: "40vh" }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="ironwood-display text-[32vw] md:text-[14vw] text-[var(--ink)]/6 leading-none">
                  {f.num}
                </div>
              </div>
              <div className="absolute top-5 left-5 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--mute)]">
                Frame {f.num}
              </div>
              <div className="absolute bottom-5 left-5 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--ink)]/60 group-hover:text-[var(--acid)] transition-colors">
                {f.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
