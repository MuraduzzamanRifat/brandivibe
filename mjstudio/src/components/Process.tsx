"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { LazyVideo } from "./LazyVideo";

type Step = {
  num: string;
  title: string;
  desc: string;
  duration: string;
  accent: string;
  detail: string[];
};

const steps: Step[] = [
  {
    num: "01",
    title: "Discovery",
    desc: "30-min call to understand your brand, goals, and audience. You leave with a crystal-clear brief and a fixed-price proposal within 48h.",
    duration: "Week 0",
    accent: "#84e1ff",
    detail: ["Brand audit", "Audience interviews", "Fixed-price proposal", "Project timeline"],
  },
  {
    num: "02",
    title: "Design",
    desc: "High-fidelity Figma mockups in 7-10 days. Two rounds of revisions included. No wireframes — we jump straight to pixel-perfect.",
    duration: "Week 1-2",
    accent: "#a78bfa",
    detail: ["Figma mockups", "Design system", "2 revision rounds", "Motion storyboards"],
  },
  {
    num: "03",
    title: "Build",
    desc: "Next.js + TypeScript + WebGL. Weekly Loom updates, staging environment from day one.",
    duration: "Week 3-5",
    accent: "#f0abfc",
    detail: ["Next.js + TS", "Weekly Loom updates", "Staging env", "CMS setup"],
  },
  {
    num: "04",
    title: "Launch",
    desc: "Performance-tuned (95+ Lighthouse), SEO-audited, CMS-ready. 30 days of post-launch support included.",
    duration: "Week 6",
    accent: "#fcd34d",
    detail: ["95+ Lighthouse", "SEO audit", "30d support", "Analytics setup"],
  },
];

export function Process() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // horizontal scroll — slide the filmstrip based on vertical scroll
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);
  const barScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="process"
      ref={ref}
      className="relative border-t border-white/5"
      style={{ height: `${steps.length * 40}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
        {/* atmospheric bg */}
        <LazyVideo
          src="/stock/process-bg.mp4"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.15] pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#08080a] via-[#0a0a0f] to-[#08080a] pointer-events-none" />

        {/* section header */}
        <div className="relative z-10 pt-16 pb-4 px-6 md:px-12">
          <div className="mx-auto max-w-[1600px] flex items-end justify-between">
            <div>
              <div className="font-mono text-[10px] text-white/40 uppercase tracking-[0.3em]">
                — Process · 006
              </div>
              <h2 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight leading-[0.95] text-balance max-w-3xl">
                From kickoff to launch,
                <br />
                <span className="italic text-white/60">in six weeks</span>.
              </h2>
            </div>
            <div className="hidden md:block font-mono text-[10px] text-white/40 uppercase tracking-[0.3em] text-right">
              <div>Scroll ↓</div>
              <div className="mt-1">To advance</div>
            </div>
          </div>
        </div>

        {/* horizontal filmstrip */}
        <div className="relative flex-1 flex items-center">
          <motion.div
            style={{ x }}
            className="flex items-center gap-8 px-6 md:px-12 pl-[8vw] md:pl-[12vw]"
          >
            {steps.map((step, i) => (
              <StepCard key={step.num} step={step} index={i} />
            ))}
            {/* spacer so last card can breathe */}
            <div className="shrink-0 w-[40vw]" />
          </motion.div>
        </div>

        {/* bottom progress bar */}
        <div className="relative z-10 pb-6 px-6 md:px-12">
          <div className="mx-auto max-w-[1600px]">
            <div className="relative h-[2px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                style={{ scaleX: barScaleX }}
                className="absolute inset-0 origin-left bg-gradient-to-r from-[#84e1ff] via-[#a78bfa] via-[#f0abfc] to-[#fcd34d]"
              />
            </div>
            <div className="mt-4 grid grid-cols-4 font-mono text-[10px] text-white/40 uppercase tracking-[0.3em]">
              {steps.map((s) => (
                <div key={s.num} className="flex items-center gap-2">
                  <span>{s.num}</span>
                  <span>{s.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({ step, index }: { step: Step; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0.4 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="shrink-0 w-[80vw] md:w-[60vw] lg:w-[48vw] h-[62vh] rounded-3xl relative overflow-hidden border border-white/10 glass flex"
      style={{
        background: `linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.0)), radial-gradient(ellipse 60% 40% at 20% 0%, ${step.accent}18, transparent 60%)`,
      }}
    >
      {/* Left: massive number */}
      <div className="flex-1 p-10 md:p-14 flex flex-col justify-between">
        <div>
          <div
            className="font-mono text-xs uppercase tracking-[0.3em] mb-4"
            style={{ color: step.accent }}
          >
            Phase · {step.num}
          </div>
          <div
            className="font-semibold leading-[0.85] tracking-[-0.04em] mb-6"
            style={{
              fontSize: "clamp(6rem, 11vw, 16rem)",
              background: `linear-gradient(180deg, ${step.accent} 0%, rgba(255,255,255,0.15) 100%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {step.num}
          </div>
        </div>
        <div>
          <h3 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[0.95] mb-3">
            {step.title}
          </h3>
          <div
            className="font-mono text-[10px] uppercase tracking-[0.3em]"
            style={{ color: step.accent }}
          >
            {step.duration}
          </div>
        </div>
      </div>

      {/* Right: description + details */}
      <div className="w-[40%] p-10 md:p-14 border-l border-white/5 flex flex-col justify-center">
        <p className="text-base md:text-lg text-white/60 leading-relaxed mb-8 text-balance">
          {step.desc}
        </p>
        <ul className="space-y-3">
          {step.detail.map((d) => (
            <li
              key={d}
              className="font-mono text-[11px] text-white/50 uppercase tracking-widest flex items-center gap-3"
            >
              <span
                className="w-1 h-1 rounded-full"
                style={{ background: step.accent }}
              />
              {d}
            </li>
          ))}
        </ul>
      </div>

      {/* accent line */}
      <div
        className="absolute top-0 left-0 h-full w-[3px]"
        style={{ background: `linear-gradient(180deg, ${step.accent}, transparent)` }}
      />

      {/* card index — top right */}
      <div className="absolute top-6 right-6 font-mono text-[9px] text-white/30 uppercase tracking-[0.3em]">
        {index + 1} / {4}
      </div>
    </motion.article>
  );
}
