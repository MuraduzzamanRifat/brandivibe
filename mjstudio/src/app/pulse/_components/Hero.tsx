"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useState } from "react";
import { LOADER_EXIT_AT_SEC } from "./Loader";

const HANDOFF_OVERLAP = 0.3;

// Single concept: LAYERING. Two lines, one message, one link. Everything else
// earns its keep by reinforcing the typography as the primary signal.
const LINE_ONE = ["Layer", "on", "layer"];
const LINE_TWO = ["of", "quiet", "care."];

export function Hero() {
  const reduced = useReducedMotion();
  const HERO_START = reduced ? 0 : Math.max(0, LOADER_EXIT_AT_SEC - HANDOFF_OVERLAP);

  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);
  const cursorX = useSpring(mouseX, { stiffness: 350, damping: 32, mass: 0.5 });
  const cursorY = useSpring(mouseY, { stiffness: 350, damping: 32, mass: 0.5 });
  const blobX = useSpring(mouseX, { stiffness: 80, damping: 22, mass: 1.1 });
  const blobY = useSpring(mouseY, { stiffness: 80, damping: 22, mass: 1.1 });
  const [cursorLabel, setCursorLabel] = useState("move");

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [mouseX, mouseY, reduced]);

  return (
    <section className="relative min-h-[100svh] overflow-hidden pulse-obys-bg pulse-cursor-none">
      {/* Swiss 12-col grid underneath the chaos — barely visible, does the structural work */}
      <div className="absolute inset-0 pointer-events-none grid grid-cols-12 opacity-[0.05]">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="border-r border-[#1c1917] last:border-r-0 h-full" />
        ))}
      </div>

      {!reduced && (
        <>
          <motion.div
            style={{ x: blobX, y: blobY }}
            className="pointer-events-none fixed top-0 left-0 w-[320px] h-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4f0e0] opacity-60 blur-2xl"
          />
          <motion.div
            style={{ x: cursorX, y: cursorY }}
            className="pointer-events-none fixed top-0 left-0 z-50 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1c1917] text-[#fde8d4] font-mono text-[9px] uppercase tracking-[0.2em]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0d9488]" />
              {cursorLabel}
            </div>
          </motion.div>
        </>
      )}

      <div className="absolute -top-32 -left-32 w-[35vw] h-[35vw] rounded-full bg-[#fbcfc0] blur-2xl opacity-50 pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[28vw] h-[28vw] rounded-full bg-[#f0d8e8] blur-2xl opacity-45 pointer-events-none" />

      <div className="relative mx-auto max-w-[1600px] px-6 md:px-12 pt-[18vh] pb-24">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: HERO_START }}
          className="flex items-center justify-between mb-[8vh] font-mono text-[10px] uppercase tracking-[0.35em] text-[#57534e]"
          onPointerEnter={() => setCursorLabel("read")}
          onPointerLeave={() => setCursorLabel("move")}
        >
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#0d9488] animate-pulse" />
            Concept 01 · layering
          </div>
          <div className="text-right">Sheet one of four</div>
        </motion.div>

        <h1
          className="font-serif font-light italic leading-[0.82] tracking-[-0.02em] text-[#1c1917]"
          style={{ fontSize: "clamp(4rem, 17vw, 26rem)" }}
          onPointerEnter={() => setCursorLabel("look")}
          onPointerLeave={() => setCursorLabel("move")}
        >
          <div className="flex flex-wrap gap-x-[0.18em] gap-y-2 items-baseline">
            {LINE_ONE.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.05em]">
                <motion.span
                  initial={{ y: "110%", rotate: 6 }}
                  animate={{ y: "0%", rotate: 0 }}
                  transition={{
                    duration: 1.2,
                    delay: HERO_START + 0.2 + i * 0.1,
                    ease: [0.76, 0, 0.24, 1],
                  }}
                  className="inline-block"
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-[0.18em] gap-y-2 items-baseline mt-1">
            {LINE_TWO.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.05em]">
                <motion.span
                  initial={{ y: "110%", rotate: -4 }}
                  animate={{ y: "0%", rotate: 0 }}
                  transition={{
                    duration: 1.2,
                    delay: HERO_START + 0.55 + i * 0.1,
                    ease: [0.76, 0, 0.24, 1],
                  }}
                  className={`inline-block ${i === 2 ? "text-[#0d9488]" : ""}`}
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </div>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: HERO_START + 1.4 }}
          className="mt-[12vh] flex items-end justify-between flex-wrap gap-8"
        >
          <a
            href="#sheet-2"
            className="group font-serif italic text-2xl md:text-3xl text-[#1c1917] border-b border-[#1c1917]/30 pb-2 hover:border-[#0d9488] hover:text-[#0d9488] transition-colors"
            onPointerEnter={() => setCursorLabel("begin")}
            onPointerLeave={() => setCursorLabel("move")}
          >
            Turn the sheet →
          </a>
          <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#57534e] text-right max-w-[14rem]">
            Four layers in total.
            <br />
            Each one is one idea.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
