"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { NeuralField } from "./NeuralField";
import { LOADER_EXIT_AT_SEC } from "./Loader";

const HANDOFF_OVERLAP = 0.25;
const CINEMATIC_EASE = [0.22, 1, 0.36, 1] as const;
const POP_EASE = [0.34, 1.56, 0.64, 1] as const;

export function Hero() {
  const reduced = useReducedMotion();
  const HERO_START = reduced ? 0 : Math.max(0, LOADER_EXIT_AT_SEC - HANDOFF_OVERLAP);

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#fff9e6] pt-28 pb-16 px-6 lg:px-10">
      <div className="absolute inset-0 grid-pattern opacity-35 pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none">
        <NeuralField intensity={0.85} />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,transparent_0%,rgba(255,249,230,0.65)_85%)] pointer-events-none" />

      <div className="relative mx-auto max-w-[1600px]">
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: HERO_START, ease: POP_EASE }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            <span className="w-2 h-2 rounded-full bg-[#06d6a0] animate-pulse" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]">
              Live · point, scroll, feel
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            <h1
              className="font-black tracking-[-0.03em] leading-[0.84] text-black"
              style={{ fontSize: "clamp(3.5rem, 10vw, 11rem)" }}
            >
              <span className="block overflow-hidden">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 1.3,
                    delay: HERO_START + 0.15,
                    ease: CINEMATIC_EASE,
                  }}
                  className="inline-block"
                >
                  Agents with
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 1.3,
                    delay: HERO_START + 0.3,
                    ease: CINEMATIC_EASE,
                  }}
                  className="inline-block"
                >
                  a{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10 italic text-white mix-blend-difference px-1">
                      pulse
                    </span>
                  </span>
                  .
                </motion.span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                delay: HERO_START + 0.85,
                ease: CINEMATIC_EASE,
              }}
              className="mt-10 text-lg md:text-2xl max-w-xl text-black/70 leading-snug font-medium"
            >
              Move the cursor. Scroll. Watch the network react. This isn&apos;t
              decoration — it&apos;s the product learning what attention feels like.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: HERO_START + 1.05,
                ease: POP_EASE,
              }}
              className="mt-12 flex flex-wrap gap-4 items-center"
            >
              <a
                href="#start"
                className="group inline-flex items-center gap-3 px-7 py-4 bg-black text-white border-2 border-black rounded-full font-bold uppercase text-sm tracking-wide shadow-[6px_6px_0_0_rgba(239,71,111,1)] hover:shadow-[10px_10px_0_0_rgba(239,71,111,1)] hover:-translate-x-1 hover:-translate-y-1 transition-[transform,box-shadow] duration-300"
              >
                Start building — free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#playground"
                className="font-mono text-xs uppercase tracking-[0.2em] font-bold text-black/70 border-b-2 border-black/30 pb-1 hover:text-black hover:border-black transition-colors"
              >
                Open playground →
              </a>
            </motion.div>
          </div>

          <div className="col-span-12 lg:col-span-4 flex flex-col justify-end gap-4 mt-12 lg:mt-0">
            {[
              { k: "p95 latency", v: "47ms", bg: "#06d6a0", rot: "-rotate-2" },
              { k: "eval pass", v: "99.2%", bg: "#ffd166", rot: "rotate-1" },
              { k: "agents shipped", v: "12.4k", bg: "#ef476f", rot: "-rotate-1", fg: "text-white" },
            ].map((s, i) => (
              <motion.div
                key={s.k}
                initial={{ opacity: 0, x: 40, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{
                  duration: 0.65,
                  delay: HERO_START + 0.35 + i * 0.09,
                  ease: POP_EASE,
                }}
                className={`${s.rot} p-5 border-4 border-black rounded-2xl shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:rotate-0 hover:-translate-y-1 transition-[transform,box-shadow] duration-300 ${s.fg ?? "text-black"}`}
                style={{ background: s.bg }}
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold opacity-80">
                  {s.k}
                </div>
                <div className="mt-1 text-4xl font-black tabular-nums tracking-tight">
                  {s.v}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: HERO_START + 1.8 }}
          className="mt-20 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-black/50"
        >
          <span className="w-8 h-px bg-black/40" />
          Scroll to change the network&apos;s mind
        </motion.div>
      </div>
    </section>
  );
}
