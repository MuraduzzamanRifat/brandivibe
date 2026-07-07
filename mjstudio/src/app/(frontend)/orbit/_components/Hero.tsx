"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { HeroScene } from "./HeroScene";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-end overflow-hidden pb-32 pt-24">
      <HeroScene />

      <div className="absolute inset-0 grid-tech opacity-50 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent,rgba(5,6,10,0.9))] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-60 bg-gradient-to-b from-transparent to-[#05060a] pointer-events-none" />

      <div className="relative mx-auto max-w-[1600px] px-6 md:px-10 w-full">
        {/* top meta row (positioned absolutely at top of hero) */}
        <div className="absolute top-24 left-6 md:left-10 font-mono text-[9px] uppercase tracking-[0.3em] text-white/40">
          <div>ORBIT / ZERO</div>
          <div className="mt-1">EDITION 087</div>
        </div>
        <div className="absolute top-24 right-6 md:right-10 font-mono text-[9px] uppercase tracking-[0.3em] text-white/40 text-right">
          <div>GENEVA · TOKYO · LA</div>
          <div className="mt-1">MMXXVI</div>
        </div>

        {/* status pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="inline-flex items-center gap-3 px-4 py-2 border border-[#84ff6b]/30 mb-10"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full bg-[#84ff6b] opacity-60" />
            <span className="relative inline-flex h-2 w-2 bg-[#84ff6b]" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/80">
            Now accepting reservations · 87 / 87 units
          </span>
        </motion.div>

        {/* massive headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="font-bold tracking-[-0.04em] leading-[0.82] text-balance"
          style={{ fontSize: "clamp(5rem, 14vw, 18rem)" }}
        >
          Zero
          <br />
          emissions.
          <br />
          <span className="acid-text">Maximum intent.</span>
        </motion.h1>

        {/* bottom row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.2 }}
          className="mt-16 grid grid-cols-12 gap-6 items-end"
        >
          <div className="col-span-12 md:col-span-5">
            <p className="text-base md:text-lg text-white/55 leading-relaxed max-w-md text-balance">
              The Orbit ZERO is a limited-edition electric hypercar. 1,920
              peak horsepower, four independent motors, 0-100 km/h in 1.94
              seconds. Hand-built in Geneva. 87 units worldwide.
            </p>
          </div>
          <div className="col-span-12 md:col-span-7 flex flex-wrap gap-8 md:justify-end items-end">
            {[
              { k: "HP", v: "1,920" },
              { k: "0-100", v: "1.94s" },
              { k: "RANGE", v: "612km" },
              { k: "UNITS", v: "087" },
            ].map((s) => (
              <div key={s.k} className="text-right">
                <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/40">
                  {s.k}
                </div>
                <div className="font-bold text-3xl md:text-4xl acid-text mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ctas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.4 }}
          className="mt-16 flex flex-col sm:flex-row gap-4"
        >
          <a
            href="#reserve"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 acid-bg font-bold text-sm tracking-[0.2em] uppercase hover:bg-[#a3ff8a] transition-colors"
          >
            Reserve a unit
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#performance"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-white/20 text-white font-mono text-[11px] tracking-[0.3em] uppercase hover:bg-white/5 transition-colors"
          >
            Performance telemetry
          </a>
        </motion.div>
      </div>
    </section>
  );
}
