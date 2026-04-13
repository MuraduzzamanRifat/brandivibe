"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { useState } from "react";
import { LazyVideo } from "./LazyVideo";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" className="relative py-32 px-6 border-t border-white/5 overflow-hidden">
      {/* atmospheric stock video — Alex Dos Santos / Pexels */}
      <LazyVideo
        src="/stock/studio-bg.mp4"
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#08080a] via-[#08080a]/70 to-[#08080a] pointer-events-none" />
      <div className="relative mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-mono text-sm text-[#84e1ff]">— Let&apos;s talk</span>
          <h2 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight text-balance">
            Have a project in mind?
          </h2>
          <p className="mt-6 text-lg text-white/60 max-w-xl mx-auto">
            We take on 2 projects per quarter. Tell us what you&apos;re building
            and we&apos;ll reply within 24 hours.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="glass rounded-3xl p-8 md:p-12 space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-mono text-xs text-white/50 mb-2">NAME</label>
              <input
                required
                type="text"
                placeholder="Jane Doe"
                className="w-full bg-transparent border-b border-white/20 pb-3 outline-none focus:border-[#84e1ff] transition-colors placeholder:text-white/30"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-white/50 mb-2">EMAIL</label>
              <input
                required
                type="email"
                placeholder="jane@company.com"
                className="w-full bg-transparent border-b border-white/20 pb-3 outline-none focus:border-[#84e1ff] transition-colors placeholder:text-white/30"
              />
            </div>
          </div>
          <div>
            <label className="block font-mono text-xs text-white/50 mb-2">COMPANY</label>
            <input
              type="text"
              placeholder="Acme Inc."
              className="w-full bg-transparent border-b border-white/20 pb-3 outline-none focus:border-[#84e1ff] transition-colors placeholder:text-white/30"
            />
          </div>
          <div>
            <label className="block font-mono text-xs text-white/50 mb-2">BUDGET</label>
            <div className="flex flex-wrap gap-3">
              {["$15-30k", "$30-60k", "$60-100k", "$100k+"].map((b) => (
                <label key={b} className="cursor-pointer">
                  <input type="radio" name="budget" className="peer sr-only" />
                  <span className="block px-4 py-2 rounded-full border border-white/20 text-sm hover:border-white/40 peer-checked:bg-white peer-checked:text-black peer-checked:border-white transition-colors">
                    {b}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block font-mono text-xs text-white/50 mb-2">
              TELL US ABOUT YOUR PROJECT
            </label>
            <textarea
              required
              rows={4}
              placeholder="We're building…"
              className="w-full bg-transparent border-b border-white/20 pb-3 outline-none focus:border-[#84e1ff] transition-colors placeholder:text-white/30 resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={submitted}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-all hover:scale-[1.02] disabled:opacity-60"
          >
            {submitted ? "Message sent ✓" : "Send message"}
            {!submitted && <ArrowRight className="w-4 h-4" />}
          </button>
        </motion.form>

        <div className="mt-12 text-center">
          <p className="text-white/40 text-sm mb-2">or reach us directly</p>
          <a
            href="mailto:hello@mjstudio.com"
            className="inline-flex items-center gap-2 text-white hover:text-[#84e1ff] transition-colors"
          >
            <Mail className="w-4 h-4" />
            hello@mjstudio.com
          </a>
        </div>
      </div>
    </section>
  );
}
