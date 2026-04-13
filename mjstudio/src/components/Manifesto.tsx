"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { RevealLine } from "./SplitText";
import { LazyVideo } from "./LazyVideo";
import Link from "next/link";

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [200, -200]);
  const posterY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const posterRotate = useTransform(scrollYProgress, [0, 1], [-1.5, 1.5]);

  return (
    <section
      ref={ref}
      className="relative py-40 px-6 md:px-12 border-y border-white/5 overflow-hidden"
    >
      {/* atmospheric stock video — Engin Akyurt / Pexels */}
      <LazyVideo
        src="/stock/manifesto-bg.mp4"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.22] pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#08080a] via-[#08080a]/60 to-[#08080a] pointer-events-none" />
      <div className="relative mx-auto max-w-[1600px]">
        <div className="grid grid-cols-12 gap-8 items-start">
          <div className="col-span-12 md:col-span-2">
            <div className="font-mono text-xs text-white/40 uppercase tracking-widest">
              — Manifesto
            </div>
            <div className="mt-2 font-mono text-xs text-white/40">002</div>
          </div>

          <div className="col-span-12 md:col-span-6">
            <div className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] space-y-3">
              <RevealLine>
                <div>
                  Most websites are <span className="text-white/30">forgettable</span>.
                </div>
              </RevealLine>
              <RevealLine delay={0.15}>
                <div>We build the other kind —</div>
              </RevealLine>
              <RevealLine delay={0.3}>
                <div>
                  <span className="italic gradient-text">cinematic</span>, considered,
                </div>
              </RevealLine>
              <RevealLine delay={0.45}>
                <div>and engineered to convert.</div>
              </RevealLine>
            </div>

            <RevealLine delay={0.65}>
              <div className="mt-10 max-w-lg text-white/50 text-base leading-relaxed">
                A design philosophy called <em className="text-white/80">Silent Architecture</em> —
                the result of painstaking attention to space, craft, and restraint.
                View our limited-edition manifesto poster →
              </div>
            </RevealLine>
          </div>

          {/* poster as visible artifact */}
          <motion.div
            style={{ y: posterY, rotate: posterRotate }}
            className="col-span-12 md:col-span-4 md:col-start-9 relative"
          >
            <Link
              href="/poster"
              data-cursor="text"
              data-cursor-label="VIEW"
              className="group block relative"
            >
              <div className="absolute -inset-8 bg-gradient-to-br from-[#84e1ff]/10 via-transparent to-[#a78bfa]/10 blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-white/10 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)] group-hover:border-white/20 transition-all duration-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/posters/mjstudio-manifesto.png"
                  alt="MJ Studio — Silent Architecture manifesto poster"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="font-mono text-[9px] text-white/60 uppercase tracking-widest">
                    Plate 001 · 2026
                  </div>
                  <div className="font-mono text-[9px] text-white/60 uppercase tracking-widest">
                    Limited edition →
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* horizontal drifting keyword row */}
      <motion.div
        style={{ x }}
        className="mt-32 whitespace-nowrap font-semibold text-[18vw] leading-none tracking-[-0.05em] text-white/[0.04] select-none pointer-events-none"
      >
        TASTE · CRAFT · MOTION · RESTRAINT · DETAIL ·
      </motion.div>
    </section>
  );
}
