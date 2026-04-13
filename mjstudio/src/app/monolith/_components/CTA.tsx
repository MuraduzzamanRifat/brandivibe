"use client";

import { motion } from "framer-motion";

export function CTA() {
  return (
    <section id="contact" className="relative py-40 px-6 md:px-12 border-t border-[#1a1a1a]/10 bg-[#f1efea]">
      <div className="mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-5 mb-10">
            <div className="w-12 h-px bg-[#1a1a1a]" />
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#5a5a5a]">
              — Begin a project · IV
            </span>
            <div className="w-12 h-px bg-[#1a1a1a]" />
          </div>
          <h2 className="font-serif text-5xl md:text-8xl font-normal tracking-[-0.02em] leading-[0.95] text-balance">
            A conversation
            <br />
            <span className="serif-italic">about a site.</span>
          </h2>
          <p className="mt-10 text-base md:text-lg text-[#5a5a5a] max-w-xl mx-auto leading-relaxed">
            We begin every commission with a visit to the site — unhurried,
            at different times of day. Tell us about yours.
          </p>
          <div className="mt-14 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:studio@monolith.arc"
              className="inline-flex items-center gap-3 px-10 py-5 bg-[#1a1a1a] text-[#f1efea] text-xs tracking-[0.3em] uppercase hover:bg-[#5a5a5a] transition-colors"
            >
              studio@monolith.arc
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-3 px-10 py-5 border border-[#1a1a1a]/30 text-[#1a1a1a] text-xs tracking-[0.3em] uppercase hover:bg-[#1a1a1a]/5 transition-colors"
            >
              Download the monograph
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
