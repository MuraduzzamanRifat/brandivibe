"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section id="book" className="relative py-40 px-8 md:px-12 border-t border-[#d4a017]/10 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80rem] h-[80rem] rounded-full bg-[#d4a017]/6 blur-[160px] pointer-events-none" />

      <div className="relative mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
        >
          <div className="flex items-center gap-4 justify-center mb-10">
            <div className="w-12 h-px bg-[#d4a017]/60" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#fde68a]">
              — An invitation · Finale
            </span>
            <div className="w-12 h-px bg-[#d4a017]/60" />
          </div>
          <h2 className="font-serif text-5xl md:text-8xl lg:text-9xl font-normal tracking-tight leading-[0.95] text-balance">
            By private
            <br />
            <span className="serif-italic gold-ink">viewing only.</span>
          </h2>
          <p className="mt-10 text-base md:text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
            87 pieces. 87 invitations. If you receive one, you&apos;ll be hosted
            by our atelier director at a city of your choosing — Geneva, London,
            Tokyo, or New York — for an unhurried afternoon with the movement.
          </p>
          <div className="mt-14 flex flex-col sm:flex-row gap-5 justify-center">
            <a
              href="#"
              className="group inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-br from-[#fde68a] via-[#f5c542] to-[#d4a017] text-black font-medium tracking-wider text-sm hover:shadow-[0_0_60px_rgba(212,160,23,0.35)] transition-all"
            >
              REQUEST AN INVITATION
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full border border-[#d4a017]/50 text-[#fde68a] font-medium tracking-wider text-sm hover:bg-[#d4a017]/5 transition-colors"
            >
              READ THE CATALOGUE
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
