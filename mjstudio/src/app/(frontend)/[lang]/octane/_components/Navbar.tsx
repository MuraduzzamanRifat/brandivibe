"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * Non-traditional navigation — no top bar. A compact artist mark sits
 * top-left; a vertical "ascent index" pinned to the right edge tracks
 * which scene you're in. Closer to "exploring a space" than "browsing a
 * site".
 */
const SCENES = [
  { id: "top", label: "Basecamp", code: "00" },
  { id: "ascent", label: "The Ascent", code: "01" },
  { id: "world", label: "The World", code: "02" },
  { id: "tour", label: "The Channel", code: "03" },
  { id: "drop", label: "The Drop", code: "04" },
];

export function Navbar() {
  const [active, setActive] = useState("top");
  const [hintSeen, setHintSeen] = useState(false);

  useEffect(() => {
    const ids = SCENES.map((s) => s.id);
    const onScroll = () => {
      // pick the section whose top is nearest above the viewport middle
      let current = "top";
      for (const id of ids) {
        const el = id === "top" ? document.body : document.getElementById(id);
        if (!el) continue;
        const top = id === "top" ? 0 : el.getBoundingClientRect().top + window.scrollY;
        if (window.scrollY + window.innerHeight * 0.4 >= top) current = id;
      }
      setActive(current);
      if (window.scrollY > 200) setHintSeen(true);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* compact mark — top left */}
      <motion.a
        href="/octane"
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="fixed top-6 left-6 md:left-10 z-50 mix-blend-difference flex items-center gap-3"
      >
        <span className="font-display text-xl tracking-tight leading-none text-white">OCTANE</span>
        <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-white/60 hidden sm:inline">
          MOUNTAIN
        </span>
      </motion.a>

      {/* enter-channel pill — top right */}
      <motion.a
        href="#drop"
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="fixed top-6 right-6 md:right-10 z-50 inline-flex items-center gap-2.5 px-4 py-2 min-h-[40px] border border-[#c4b49a]/30 bg-[#0a0908]/70 backdrop-blur-sm font-mono text-[9px] tracking-[0.3em] uppercase text-[#c4b49a] hover:bg-[#c4b49a] hover:text-[#0a0908] transition-colors"
      >
        <span className="w-1.5 h-1.5 bg-current rounded-full blink" />
        Enter channel
      </motion.a>

      {/* vertical ascent index — right edge */}
      <motion.nav
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="fixed right-5 md:right-8 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col gap-4"
        aria-label="Ascent index"
      >
        {SCENES.map((s) => {
          const isActive = active === s.id;
          return (
            <a
              key={s.id}
              href={s.id === "top" ? "#top" : `#${s.id}`}
              className="group flex items-center gap-3 justify-end"
            >
              <span
                className={`font-mono text-[8px] uppercase tracking-[0.25em] transition-all ${
                  isActive
                    ? "text-[#c4b49a] opacity-100"
                    : "text-[#c4b49a]/40 opacity-0 group-hover:opacity-100"
                }`}
              >
                {s.code} · {s.label}
              </span>
              <span
                className={`block transition-all ${
                  isActive
                    ? "w-6 h-px bg-[#c4b49a]"
                    : "w-3 h-px bg-[#c4b49a]/30 group-hover:w-5 group-hover:bg-[#c4b49a]/60"
                }`}
              />
            </a>
          );
        })}
      </motion.nav>

      {/* navigation hint — bottom centre, fades after first scroll */}
      {!hintSeen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 font-mono text-[8px] uppercase tracking-[0.35em] text-[#c4b49a]/40 text-center pointer-events-none"
        >
          ↓ scroll to ascend · index pinned right
        </motion.div>
      )}

      <div id="top" />
    </>
  );
}
