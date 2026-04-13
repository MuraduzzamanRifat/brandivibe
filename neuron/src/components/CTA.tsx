"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-32 px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[2rem] bg-[#0a0a0f] p-16 md:p-24 overflow-hidden text-center"
        >
          {/* stock video bg — blue digital network (Nicola Narracci / Pexels) */}
          <video
            src="/stock/cta-bg.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
          />
          {/* dark overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/70 via-[#0a0a0f]/50 to-[#0a0a0f]/90 pointer-events-none" />
          {/* ambient gradient */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-gradient-to-br from-[#0369a1] via-[#0ea5e9] to-transparent blur-[120px] opacity-40 pointer-events-none" />

          <div className="relative">
            <h2 className="text-4xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1.05] text-white text-balance">
              Start shipping
              <br />
              <span className="italic text-white/60">production AI</span> today.
            </h2>
            <p className="mt-6 text-lg text-white/60 max-w-xl mx-auto">
              Join 12,000+ engineers building the future of software. Free forever plan,
              no credit card required.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-[#0a0a0f] font-medium hover:bg-white/90 transition-all"
              >
                Start building free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
              >
                Read the docs
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
