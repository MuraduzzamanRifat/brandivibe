"use client";

import { motion } from "framer-motion";
import { RevealLine } from "./SplitText";
import { LazyVideo } from "./LazyVideo";

const steps = [
  {
    num: "01",
    title: "Discovery",
    desc: "30-min call to understand your brand, goals, and audience. You leave with a crystal-clear brief and a fixed-price proposal within 48h.",
    duration: "Week 0",
  },
  {
    num: "02",
    title: "Design",
    desc: "High-fidelity Figma mockups in 7-10 days. Two rounds of revisions included. No wireframes — we jump straight to pixel-perfect.",
    duration: "Week 1-2",
  },
  {
    num: "03",
    title: "Build",
    desc: "Next.js + TypeScript + WebGL. Weekly Loom updates, staging environment from day one.",
    duration: "Week 3-5",
  },
  {
    num: "04",
    title: "Launch",
    desc: "Performance-tuned (95+ Lighthouse), SEO-audited, CMS-ready. 30 days of post-launch support included.",
    duration: "Week 6",
  },
];

export function Process() {
  return (
    <section id="process" className="relative py-40 px-6 md:px-12 border-t border-white/5 overflow-hidden">
      {/* atmospheric stock video — Chandresh Uike / Pexels */}
      <LazyVideo
        src="/stock/process-bg.mp4"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.25] pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#08080a] via-[#08080a]/70 to-[#08080a] pointer-events-none" />
      <div className="relative mx-auto max-w-[1600px]">
        <div className="grid grid-cols-12 gap-6 mb-20">
          <div className="col-span-12 md:col-span-3">
            <div className="font-mono text-xs text-white/40 uppercase tracking-widest">
              — Process
            </div>
            <div className="mt-2 font-mono text-xs text-white/40">005</div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <RevealLine>
              <h2 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[0.95] text-balance">
                From kickoff to launch,
                <br />
                <span className="italic text-white/60">in six weeks</span>.
              </h2>
            </RevealLine>
          </div>
        </div>

        <div className="space-y-0 border-t border-white/5">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group border-b border-white/5 py-10 md:py-12 hover:bg-white/[0.015] transition-colors"
            >
              <div className="grid grid-cols-12 gap-6 items-baseline">
                <div className="col-span-2 md:col-span-1 font-mono text-xs text-white/40 uppercase tracking-widest">
                  {s.num}
                </div>
                <div className="col-span-10 md:col-span-4">
                  <h3 className="text-3xl md:text-4xl font-semibold tracking-tight group-hover:translate-x-2 transition-transform duration-500">
                    {s.title}
                  </h3>
                </div>
                <div className="col-span-12 md:col-span-5 text-white/60 leading-relaxed md:col-start-7">
                  {s.desc}
                </div>
                <div className="col-span-12 md:col-span-2 font-mono text-xs text-white/40 uppercase tracking-widest md:text-right">
                  {s.duration}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
