"use client";

import { motion } from "framer-motion";
import { RevealLine } from "./SplitText";
import { LazyVideo } from "./LazyVideo";

const services = [
  {
    num: "01",
    title: "Marketing sites",
    desc: "Premium landing pages for SaaS, crypto, and luxury brands. Next.js, SEO, CMS, analytics — shipped in 4-6 weeks.",
  },
  {
    num: "02",
    title: "3D & WebGL",
    desc: "Cinematic hero scenes, interactive product showcases, particle systems. Built with React Three Fiber and custom shaders.",
  },
  {
    num: "03",
    title: "Motion design",
    desc: "Scroll-driven animations, micro-interactions, page transitions. The details that make a site feel alive.",
  },
  {
    num: "04",
    title: "Full-stack builds",
    desc: "Dashboards, auth flows, payments. TypeScript, Postgres, Stripe, Supabase. Clean code, documented, maintainable.",
  },
];

export function Services() {
  return (
    <section id="services" className="relative py-40 px-6 md:px-12 border-t border-white/5 overflow-hidden">
      {/* atmospheric stock video — T Honkamies / Pexels */}
      <LazyVideo
        src="/stock/services-bg.mp4"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.22] pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#08080a] via-[#08080a]/70 to-[#08080a] pointer-events-none" />
      <div className="relative mx-auto max-w-[1600px]">
        <div className="grid grid-cols-12 gap-6 mb-20">
          <div className="col-span-12 md:col-span-3">
            <div className="font-mono text-xs text-white/40 uppercase tracking-widest">
              — Services
            </div>
            <div className="mt-2 font-mono text-xs text-white/40">004</div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <RevealLine>
              <h2 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[0.95] text-balance">
                What we build,
                <br />
                <span className="italic text-white/60">when the brief says world-class.</span>
              </h2>
            </RevealLine>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border-t border-white/5">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="md:col-span-6 border-b border-white/5 md:[&:nth-child(odd)]:border-r md:[&:nth-child(odd)]:border-white/5 py-12 px-2 md:px-8 group hover:bg-white/[0.02] transition-colors"
            >
              <div className="grid grid-cols-12 gap-4 items-start">
                <div className="col-span-2 font-mono text-xs text-white/40 uppercase tracking-widest pt-2">
                  {s.num}
                </div>
                <div className="col-span-10">
                  <h3 className="text-2xl md:text-3xl font-semibold mb-3 tracking-tight">
                    {s.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
