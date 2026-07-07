"use client";

import { motion } from "framer-motion";

export function Quote() {
  return (
    <section className="relative py-32 px-6 bg-[#fafaf7]">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-[10px] font-medium text-pulse-sage uppercase tracking-[0.3em] mb-8">
            — Patient voices · 03
          </div>
          <blockquote className="font-serif text-3xl md:text-5xl lg:text-6xl font-normal leading-[1.2] text-pulse-fg tracking-[-0.01em] text-balance">
            &ldquo;My whole life I&rsquo;ve left doctor visits feeling rushed. With Pulse,
            <span className="serif-italic text-pulse-sage"> I actually felt heard</span>.
            It&rsquo;s the first time healthcare has felt like it was built for me.&rdquo;
          </blockquote>
          <div className="mt-12 flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#a7f3d0] to-[#0d9488]" />
            <div className="font-medium text-pulse-fg">Maya T., 34</div>
            <div className="text-sm text-pulse-soft">Atlanta · Pulse patient since March 2025</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
