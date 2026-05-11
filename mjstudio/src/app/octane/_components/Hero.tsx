"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { HeroScene } from "./HeroScene";

/** A live-ish telemetry readout — purely cosmetic HUD flavour. */
const TELEMETRY = [
  { k: "ELEV", v: "1,742m" },
  { k: "TEMP", v: "−6.4°C" },
  { k: "WIND", v: "34 km/h NW" },
  { k: "SIGNAL", v: "STRONG" },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-between overflow-hidden pt-6 pb-8">
      <HeroScene />

      {/* atmospheric overlays */}
      <div className="absolute inset-0 terrain-grid opacity-70 pointer-events-none" />
      <div className="scan-bar" style={{ animationDelay: "1s" }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_75%_at_50%_25%,transparent,rgba(10,9,8,0.65))] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-b from-transparent to-[#0a0908] pointer-events-none" />

      {/* ── top HUD row ───────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-[1800px] px-6 md:px-10 w-full pt-2 flex items-start justify-between font-mono text-[9px] uppercase tracking-[0.3em] text-[#c4b49a]/55">
        <div className="space-y-1">
          <div className="text-[#c4b49a]">OCTANE MOUNTAIN</div>
          <div>MOUNT WILSON · 34.2257° N · 118.0573° W</div>
          <div className="text-[#c4b49a]/35">CAMPAIGN DESTINATION · WORLD-BUILDING</div>
        </div>
        <div className="text-right space-y-1">
          <div className="flex items-center gap-2 justify-end">
            <span className="w-1.5 h-1.5 bg-[#c4b49a] blink rounded-full" />
            <span>LIVESTREAM · STANDBY</span>
          </div>
          <div>BUILD MMXXVI · v0.4</div>
          <div className="text-[#c4b49a]/35">EST. CONNECTION — STABLE</div>
        </div>
      </div>

      {/* ── center stack ──────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-[1800px] px-6 md:px-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="inline-flex items-center gap-3 px-4 py-1.5 border border-[#c4b49a]/25 mb-8"
        >
          <span className="w-1.5 h-1.5 bg-[#c4b49a]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#c4b49a]/80">
            Not a website · an experience you climb
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="font-display leading-[0.78] tracking-[-0.02em]"
          style={{ fontSize: "clamp(4.5rem, 19vw, 21rem)" }}
        >
          <span className="block tan-text">OCTANE</span>
          <span className="block font-mono text-base md:text-2xl uppercase tracking-[0.5em] text-[#c4b49a]/45 mt-4 md:mt-6">
            M&nbsp;O&nbsp;U&nbsp;N&nbsp;T&nbsp;A&nbsp;I&nbsp;N
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="mt-10 grid grid-cols-12 gap-6 items-end"
        >
          <div className="col-span-12 md:col-span-6">
            <p className="text-base md:text-lg text-[#ece6da]/60 leading-relaxed max-w-md text-balance">
              An interactive campaign destination for <span className="text-[#c4b49a]">VYCE</span>&apos;s
              debut record. Built on a digital mountain — an observatory, a
              live channel, a record that reveals itself the higher you go.
              World-building, not a landing page.
            </p>
          </div>
          <div className="col-span-12 md:col-span-6">
            <div className="grid grid-cols-4 gap-px bg-[#c4b49a]/15 border divider-line">
              {TELEMETRY.map((t) => (
                <div key={t.k} className="bg-[#0a0908] px-3 py-3 text-center">
                  <div className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#c4b49a]/40">
                    {t.k}
                  </div>
                  <div className="font-mono text-xs md:text-sm text-[#c4b49a] mt-1.5">{t.v}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <a
            href="#ascent"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 tan-bg font-mono text-[11px] font-bold tracking-[0.3em] uppercase hover:brightness-105 transition"
          >
            Begin the ascent
            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </a>
          <a
            href="#drop"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-[#c4b49a]/25 text-[#ece6da] font-mono text-[11px] tracking-[0.3em] uppercase hover:bg-[#c4b49a]/5 transition-colors"
          >
            Enter the channel
          </a>
        </motion.div>
      </div>

      {/* ── bottom HUD row ────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-[1800px] px-6 md:px-10 w-full flex items-end justify-between">
        <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#c4b49a]/30 flex items-center gap-3">
          <span className="w-12 h-px bg-[#c4b49a]/20" />
          Scroll to climb
        </div>
        <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#c4b49a]/30 hidden md:block">
          TERRAIN MESH · 110 × 110 · PULSE ACTIVE
        </div>
      </div>
    </section>
  );
}
