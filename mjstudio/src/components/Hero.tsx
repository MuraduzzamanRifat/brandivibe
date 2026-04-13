"use client";

import { motion } from "framer-motion";
import { HeroBackground } from "./HeroBackground";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <HeroBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#08080a]" />

      <div className="relative mx-auto max-w-7xl px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center gap-2 mb-8"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-[#84e1ff] animate-pulse" />
          <span className="text-sm text-white/60 font-mono">Available for 2 projects — Q2 2026</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[0.95] text-balance max-w-5xl"
        >
          Premium web experiences for{" "}
          <span className="gradient-text">ambitious brands</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
          className="mt-8 text-lg md:text-xl text-white/60 max-w-2xl text-balance"
        >
          We design and build cinematic websites for crypto, SaaS, and luxury
          brands. Built on Next.js, WebGL, and obsessive attention to detail.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-12 flex flex-col sm:flex-row gap-4"
        >
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-all hover:scale-[1.02]"
          >
            Start a project <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#work"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
          >
            See our work
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl"
        >
          {[
            { n: "50+", l: "Projects shipped" },
            { n: "$12M", l: "Client revenue driven" },
            { n: "4.9", l: "Average client rating" },
            { n: "6 wk", l: "Average delivery" },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-3xl font-semibold">{s.n}</div>
              <div className="text-sm text-white/50 mt-1">{s.l}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
