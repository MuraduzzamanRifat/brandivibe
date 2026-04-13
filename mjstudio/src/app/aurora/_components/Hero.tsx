"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { HeroScene } from "./HeroScene";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24 grain">
      <HeroScene />

      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,transparent,rgba(7,6,10,0.85))] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-[30vh] bg-gradient-to-b from-transparent to-[#07060a] pointer-events-none" />

      <div className="relative mx-auto max-w-[1600px] px-8 md:px-12 w-full">
        {/* small label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center gap-4 mb-16"
        >
          <div className="w-16 h-px bg-[#d4a017]/60" />
          <span className="text-[10px] tracking-[0.4em] uppercase text-[#fde68a]">
            Est. MCMLXXI · Geneva · Swiss made
          </span>
        </motion.div>

        {/* headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif font-normal tracking-[-0.025em] leading-[0.88] text-balance max-w-6xl"
          style={{ fontSize: "clamp(4.5rem, 13vw, 19rem)" }}
        >
          Forever,
          <br />
          <span className="serif-italic gold-ink">in gold.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.3 }}
          className="mt-16 grid grid-cols-12 gap-6"
        >
          <div className="col-span-12 md:col-span-5 md:col-start-2">
            <p className="text-base md:text-lg text-white/55 leading-relaxed text-balance font-light">
              The Aurora Chronograph Héritage — hand-finished in our Geneva atelier,
              limited to 87 pieces worldwide. Movement: AU.2026 calibre with
              108-hour power reserve. Case: 18k rose gold, 39mm.
            </p>
          </div>
          <div className="col-span-12 md:col-span-4 md:col-start-8 flex items-end justify-end gap-6">
            <a
              href="#book"
              className="group inline-flex items-center gap-3 pb-2 border-b border-[#d4a017]/60 text-[11px] tracking-[0.3em] uppercase text-[#fde68a] hover:text-[#f5c542] hover:border-[#f5c542] transition-colors"
            >
              Request a viewing
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 2 }}
          className="absolute bottom-10 left-8 md:left-12 text-[9px] tracking-[0.4em] uppercase text-white/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-px bg-white/20" />
            Scroll for the story
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 2.1 }}
          className="absolute bottom-10 right-8 md:right-12 text-[9px] tracking-[0.4em] uppercase text-right text-white/30"
        >
          <div>Ref. AU26 / 087</div>
          <div className="mt-1">Limited edition</div>
        </motion.div>
      </div>
    </section>
  );
}
