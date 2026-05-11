"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Opening sequence — a fullscreen intro that boots the "campaign
 * destination" before the page is revealed. Mirrors the OCTANE MOUNTAIN
 * "ESTABLISHING CONNECTION" → coordinates lock → enter flow. Auto-dismisses
 * after ~3.2s, or immediately on click / Enter.
 */
const LINES = [
  "ESTABLISHING CONNECTION",
  "LOCATING — MOUNT WILSON · 34.2257° N, 118.0573° W",
  "RENDERING TERRAIN MESH · 96 × 96",
  "SYNCING LIVESTREAM CHANNEL",
  "ACCESS GRANTED — WELCOME TO OCTANE MOUNTAIN",
];

export function OpeningSequence() {
  const [done, setDone] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (done) return;
    const tickers = LINES.map((_, i) =>
      window.setTimeout(() => setStep(i + 1), 380 + i * 520)
    );
    const closer = window.setTimeout(() => setDone(true), 3400);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") setDone(true);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      tickers.forEach(clearTimeout);
      clearTimeout(closer);
      window.removeEventListener("keydown", onKey);
    };
  }, [done]);

  // lock scroll while the sequence runs
  useEffect(() => {
    if (done) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="opening"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          onClick={() => setDone(true)}
          className="fixed inset-0 z-[100] bg-[#0a0908] flex flex-col items-center justify-center grain cursor-pointer"
        >
          {/* expanding pulse rings */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <span className="pulse-ring" />
            <span className="pulse-ring" style={{ animationDelay: "1.6s" }} />
            <span className="pulse-ring" style={{ animationDelay: "3.2s" }} />
          </div>

          {/* center mark */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative font-display leading-none mb-10 tan-text"
            style={{ fontSize: "clamp(2.4rem, 8vw, 6rem)" }}
          >
            OCTANE
            <span className="block font-mono text-[10px] md:text-xs tracking-[0.5em] text-[#c4b49a]/60 mt-3 text-center">
              MOUNTAIN
            </span>
          </motion.div>

          {/* boot log */}
          <div className="relative font-mono text-[9px] md:text-[11px] uppercase tracking-[0.25em] text-[#c4b49a]/70 space-y-2 text-center px-6 min-h-[110px]">
            {LINES.slice(0, step).map((line, i) => (
              <div key={i} className="hud-line flex items-center justify-center gap-3">
                <span className="text-[#c4b49a]/40">{String(i + 1).padStart(2, "0")}</span>
                <span>{line}</span>
                {i === step - 1 && step < LINES.length && (
                  <span className="inline-block w-1.5 h-3 bg-[#c4b49a] blink" />
                )}
              </div>
            ))}
          </div>

          {/* progress bar */}
          <div className="relative mt-10 w-56 md:w-72 h-px bg-[#c4b49a]/15 overflow-hidden">
            <span className="absolute inset-y-0 left-0 bg-[#c4b49a] open-progress" />
          </div>

          <div className="relative mt-6 font-mono text-[8px] uppercase tracking-[0.4em] text-[#c4b49a]/35">
            Press enter to skip
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
