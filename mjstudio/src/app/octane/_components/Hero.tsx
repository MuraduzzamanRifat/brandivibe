"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { HeroScene } from "./HeroScene";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-between overflow-hidden pt-28 pb-10">
      <HeroScene />

      {/* atmospheric overlays */}
      <div className="absolute inset-0 ember-grid opacity-60 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-30 pointer-events-none mix-blend-overlay" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_30%,transparent,rgba(7,6,10,0.7))] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-b from-transparent to-[#07060a] pointer-events-none" />

      {/* corner meta */}
      <div className="relative mx-auto max-w-[1700px] px-6 md:px-10 w-full flex items-start justify-between font-mono text-[9px] uppercase tracking-[0.35em] text-white/45">
        <div>
          <div>VYCE — OCTANE</div>
          <div className="mt-1">DEBUT FULL-LENGTH</div>
        </div>
        <div className="text-right">
          <div className="flicker">● ESTABLISHING CONNECTION</div>
          <div className="mt-1">MMXXVI</div>
        </div>
      </div>

      {/* center stack */}
      <div className="relative mx-auto max-w-[1700px] px-6 md:px-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="inline-flex items-center gap-3 px-4 py-1.5 border border-[#ff5a1f]/40 mb-8"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full bg-[#ff5a1f] opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 bg-[#ff5a1f]" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/80">
            The mountain is open · Climb to unlock
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-display leading-[0.78] tracking-[-0.02em]"
          style={{ fontSize: "clamp(5.5rem, 20vw, 22rem)" }}
        >
          <span className="block flame-text">OCTANE</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1 }}
          className="mt-8 grid grid-cols-12 gap-6 items-end"
        >
          <div className="col-span-12 md:col-span-6">
            <p className="text-base md:text-lg text-white/60 leading-relaxed max-w-md text-balance">
              An interactive campaign destination for <span className="text-white">VYCE</span>&apos;s
              debut album. Eleven tracks, sculpted as altitudes. The higher you
              climb, the more of the record opens up. Full release 06.21.26.
            </p>
          </div>
          <div className="col-span-12 md:col-span-6 flex flex-wrap gap-8 md:justify-end">
            {[
              { k: "TRACKS", v: "11" },
              { k: "ALTITUDE", v: "4,810m" },
              { k: "FEATURES", v: "06" },
              { k: "DROP", v: "06.21" },
            ].map((s) => (
              <div key={s.k} className="text-right">
                <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/40">
                  {s.k}
                </div>
                <div className="font-display text-3xl md:text-5xl flame-text mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.2 }}
          className="mt-12 flex flex-col sm:flex-row gap-4"
        >
          <a
            href="#ascent"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 flame-bg font-mono text-[11px] font-bold tracking-[0.3em] uppercase hover:brightness-110 transition"
          >
            Begin the ascent
            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </a>
          <a
            href="#drop"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-white/25 text-white font-mono text-[11px] tracking-[0.3em] uppercase hover:bg-white/5 transition-colors"
          >
            Pre-save the record
          </a>
        </motion.div>
      </div>

      {/* scroll hint */}
      <div className="relative mx-auto max-w-[1700px] px-6 md:px-10 w-full">
        <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/30 flex items-center gap-3">
          <span className="w-12 h-px bg-white/20" />
          Scroll to climb
        </div>
      </div>
    </section>
  );
}
