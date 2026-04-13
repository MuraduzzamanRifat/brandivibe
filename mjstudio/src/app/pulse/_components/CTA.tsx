"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section id="book" className="relative py-32 px-6 bg-white border-t border-pulse-faint">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[2rem] bg-gradient-to-br from-[#0d9488] via-[#14b8a6] to-[#0d9488] p-14 md:p-20 overflow-hidden text-center"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-[#a7f3d0]/30 blur-[140px] pointer-events-none" />
          <div className="relative">
            <h2 className="font-serif text-4xl md:text-6xl font-normal tracking-[-0.015em] leading-[1.05] text-white text-balance">
              Care that feels
              <br />
              <span className="italic">calmer, from day one.</span>
            </h2>
            <p className="mt-6 text-lg text-white/80 max-w-xl mx-auto">
              30-day free pilot for any clinic of 10+ providers. No EHR
              migration. We&apos;ll sit with you during onboarding.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-pulse-fg font-medium hover:bg-white/90 transition-all"
              >
                Book a demo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/30 text-white font-medium hover:bg-white/10 transition-colors"
              >
                Talk to a clinician
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
