"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { SplitText, RevealLine } from "./SplitText";
import { MagneticButton } from "./MagneticButton";
import { HeroBackground } from "./HeroBackground";
import { ArrowRight, ArrowDownRight } from "lucide-react";

export function KineticHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -350]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[120vh] overflow-hidden">
      <HeroBackground />
      {/* darken left half where text sits, let blob show on right */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(8,8,10,0.92)_0%,rgba(8,8,10,0.75)_40%,rgba(8,8,10,0.2)_100%)] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-60 bg-gradient-to-b from-transparent to-[#08080a] pointer-events-none" />
      {/* top meta row */}
      <div className="relative pt-32 px-6 md:px-12">
        <div className="mx-auto max-w-[1600px] flex justify-between items-start font-mono text-xs text-white/40 uppercase tracking-widest">
          <RevealLine>
            <div>
              <div>Brandivibe</div>
              <div className="mt-1">Independent · Remote · Worldwide</div>
            </div>
          </RevealLine>
          <RevealLine delay={0.1}>
            <div className="text-right">
              <div>Index — 001 / 003</div>
              <div className="mt-1">Q2 · 2026</div>
            </div>
          </RevealLine>
        </div>
      </div>

      {/* huge kinetic title */}
      <motion.div
        style={{ y: y1, opacity }}
        className="relative mt-16 md:mt-24 px-6 md:px-12"
      >
        <div className="mx-auto max-w-[1600px]">
          <h1 className="text-[14vw] md:text-[12vw] leading-[0.85] font-semibold tracking-[-0.04em]">
            <SplitText as="span">We design</SplitText>
            <br />
            <SplitText as="span" delay={0.15} className="italic text-white/70">
              websites
            </SplitText>{" "}
            <SplitText as="span" delay={0.35}>
              that
            </SplitText>
            <br />
            <span className="gradient-text">
              <SplitText as="span" delay={0.55}>
                clients remember.
              </SplitText>
            </span>
          </h1>
        </div>
      </motion.div>

      {/* asymmetric subrow */}
      <motion.div
        style={{ y: y2, opacity }}
        className="relative mt-24 md:mt-32 px-6 md:px-12"
      >
        <div className="mx-auto max-w-[1600px] grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 md:col-span-5 md:col-start-2">
            <RevealLine delay={0.6}>
              <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-md text-balance">
                Brandivibe is an independent premium web design studio
                crafting cinematic websites for ambitious crypto, SaaS, and luxury brands.
              </p>
            </RevealLine>
          </div>
          <div className="col-span-12 md:col-span-5 md:col-start-8 flex flex-col md:flex-row gap-4 md:justify-end">
            <RevealLine delay={0.8}>
              <MagneticButton
                href="#contact"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-medium"
              >
                Start a project <ArrowRight className="w-4 h-4" />
              </MagneticButton>
            </RevealLine>
            <RevealLine delay={0.9}>
              <MagneticButton
                href="#work"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/20 text-white"
              >
                See selected work <ArrowDownRight className="w-4 h-4" />
              </MagneticButton>
            </RevealLine>
          </div>
        </div>
      </motion.div>

      {/* scroll hint */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-10 left-6 md:left-12 font-mono text-xs text-white/40 uppercase tracking-widest"
      >
        <div className="flex items-center gap-3">
          <span className="inline-block w-2 h-2 rounded-full bg-white/60 animate-pulse" />
          Scroll to explore
        </div>
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="absolute bottom-10 right-6 md:right-12 font-mono text-xs text-white/40 uppercase tracking-widest text-right"
      >
        <div>Est. 2024</div>
        <div>50+ shipped</div>
      </motion.div>
    </section>
  );
}
