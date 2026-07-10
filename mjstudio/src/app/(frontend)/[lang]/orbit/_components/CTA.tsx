"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section id="reserve" className="relative py-40 px-6 md:px-10 border-t divider-line overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] rounded-full bg-[#84ff6b]/8 blur-[140px] pointer-events-none" />

      <div className="relative mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="font-mono text-[10px] text-[#84ff6b] uppercase tracking-[0.3em] mb-8">
            — Reserve · 04
          </div>
          <h2 className="font-bold text-5xl md:text-8xl tracking-[-0.04em] leading-[0.88] text-balance">
            087 units.
            <br />
            <span className="acid-text">Zero waiting lists.</span>
          </h2>
          <p className="mt-10 text-base md:text-lg text-white/60 max-w-xl mx-auto leading-relaxed">
            Reservations open now for a fully-refundable €340,000 deposit.
            Delivery begins Q3 2026. No queue — once 87 is reached, the book is closed.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              className="group inline-flex items-center justify-center gap-3 px-10 py-5 acid-bg font-bold text-sm tracking-[0.2em] uppercase hover:bg-[#a3ff8a] transition-colors"
            >
              Place a reservation
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 border border-white/20 text-white font-mono text-[11px] tracking-[0.3em] uppercase hover:bg-white/5 transition-colors"
            >
              Download the brochure
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
