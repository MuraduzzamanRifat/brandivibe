"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";
import { RevealLine } from "./SplitText";
import { LazyVideo } from "./LazyVideo";

type Service = {
  num: string;
  title: string;
  desc: string;
  accent: string;
  bullets: string[];
};

const services: Service[] = [
  {
    num: "01",
    title: "Marketing sites",
    desc: "Premium landing pages for SaaS, crypto, and luxury brands. Next.js, SEO, CMS, analytics — shipped in 4-6 weeks.",
    accent: "#84e1ff",
    bullets: ["Next.js 16 + App Router", "CMS integration", "SEO + OG metadata", "95+ Lighthouse"],
  },
  {
    num: "02",
    title: "3D & WebGL",
    desc: "Cinematic hero scenes, interactive product showcases, particle systems. Built with React Three Fiber and custom shaders.",
    accent: "#a78bfa",
    bullets: ["React Three Fiber", "Custom GLSL shaders", "Blender pipelines", "Mobile-optimized"],
  },
  {
    num: "03",
    title: "Motion design",
    desc: "Scroll-driven animations, micro-interactions, page transitions. The details that make a site feel alive.",
    accent: "#f0abfc",
    bullets: ["Framer Motion", "Lenis smooth scroll", "GSAP + ScrollTrigger", "Reduced-motion fallbacks"],
  },
  {
    num: "04",
    title: "Full-stack builds",
    desc: "Dashboards, auth flows, payments. TypeScript, Postgres, Stripe, Supabase. Clean code, documented, maintainable.",
    accent: "#fcd34d",
    bullets: ["TypeScript everywhere", "Postgres + Drizzle", "Stripe + webhooks", "Clerk / Supabase auth"],
  },
];

function StepperItem({
  service,
  index,
  total,
  progress,
}: {
  service: Service;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // All input values must be monotonically non-decreasing and clamped to [0, 1]
  // or Framer Motion's Web Animations API path throws at runtime.
  const localStart = index / total;
  const localEnd = (index + 1) / total;
  const a = Math.max(0, localStart - 0.02);
  const b = Math.max(a + 0.0001, Math.min(1, localStart + 0.02));
  const c = Math.max(b + 0.0001, Math.min(1, localEnd - 0.02));
  const d = Math.max(c + 0.0001, Math.min(1, localEnd));
  const opacity = useTransform(progress, [a, b, c, d], [0.3, 1, 1, 0.3]);
  const barScaleX = useTransform(progress, [a, b, c, d], [0, 1, 1, 1]);
  const labelOpacity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0.4]);

  return (
    <motion.div style={{ opacity }} className="flex-1 min-w-0">
      <div className="relative h-[2px] bg-white/10 overflow-hidden rounded-full">
        <motion.div
          style={{ scaleX: barScaleX, background: service.accent }}
          className="absolute inset-0 origin-left h-full"
        />
      </div>
      <motion.div
        style={{ opacity: labelOpacity }}
        className="mt-3 flex items-baseline gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/60"
      >
        <span style={{ color: service.accent }}>{service.num}</span>
        <span className="truncate">{service.title}</span>
      </motion.div>
    </motion.div>
  );
}

function ServicePanel({
  service,
  index,
  progress,
}: {
  service: Service;
  index: number;
  progress: MotionValue<number>;
}) {
  const n = services.length;
  const localStart = index / n;
  const localEnd = (index + 1) / n;

  // Ensure all useTransform inputs are strictly ascending and within [0, 1].
  // Framer Motion's Web Animations API path rejects negatives or duplicates.
  //
  // Overlap tuning: fadeIn starts 0.03 BEFORE the panel's own window so the
  // next panel appears just as the previous one is leaving. Any larger
  // (e.g. 0.08) at compressed scroll heights caused 2+ panels to render at
  // ~50% opacity simultaneously, which visually blended their text.
  const fadeIn = Math.max(0, localStart - 0.03);
  const holdStart = Math.min(1, Math.max(fadeIn + 0.0001, localStart + 0.01));
  const holdEnd = Math.min(1, Math.max(holdStart + 0.0001, localEnd - 0.03));
  const fadeOut = Math.min(1, Math.max(holdEnd + 0.0001, localEnd));

  // All panels fade out at the end of their slot (including the last one).
  // We used to hold the last panel visible to avoid ~20vh of empty background,
  // but that caused a ~500px "dead scroll" gap before the next section
  // started. Fading it out lets the next section come into view immediately.
  const opacity = useTransform(
    progress,
    [fadeIn, holdStart, holdEnd, fadeOut],
    [0, 1, 1, 0]
  );
  // Vertical parallax — both columns slide up together through the viewport
  // so the section feels ACTIVELY moving on scroll, not a cross-fade in place.
  // Kept small enough (80px range) that panels stay inside their grid cells
  // — larger offsets dislocated content at compressed scroll heights.
  const y = useTransform(
    progress,
    [fadeIn, holdStart, holdEnd, fadeOut],
    ["80px", "0px", "0px", "-80px"]
  );
  const numberScale = useTransform(
    progress,
    [fadeIn, holdStart, holdEnd, fadeOut],
    [0.85, 1, 1, 1.08]
  );

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 flex items-center justify-center px-6 md:px-16 pointer-events-none"
    >
      <div className="mx-auto max-w-[1600px] w-full grid grid-cols-12 gap-8 items-center">
        {/* massive number */}
        <motion.div
          style={{ scale: numberScale, y }}
          className="col-span-12 md:col-span-5 origin-left"
        >
          <div
            className="font-mono text-xs uppercase tracking-[0.4em] mb-4"
            style={{ color: service.accent }}
          >
            — Service · {service.num}
          </div>
          <div
            className="font-semibold leading-[0.82] tracking-[-0.05em]"
            style={{
              fontSize: "clamp(8rem, 22vw, 28rem)",
              background: `linear-gradient(180deg, ${service.accent} 0%, rgba(255,255,255,0.4) 100%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {service.num}
          </div>
        </motion.div>

        {/* title + description */}
        <motion.div style={{ y }} className="col-span-12 md:col-span-7 md:pl-10">
          <h3 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[0.95] text-balance mb-8">
            {service.title}
          </h3>
          <p className="text-lg md:text-xl text-white/65 leading-relaxed max-w-xl mb-10 text-balance">
            {service.desc}
          </p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 max-w-lg">
            {service.bullets.map((b) => (
              <li
                key={b}
                className="font-mono text-xs text-white/50 uppercase tracking-widest flex items-center gap-2"
              >
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ background: service.accent }}
                />
                {b}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function Services() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section
      id="services"
      ref={ref}
      className="relative border-t border-white/5"
      style={{ height: `${services.length * 45}vh` }}
    >
      <div className="absolute top-8 left-6 md:left-12 z-20 flex items-baseline gap-4 font-mono text-[10px] text-white/40 uppercase tracking-[0.3em]">
        <span>— Services</span>
        <span>004</span>
        <span className="hidden md:inline">— what we build when the brief says world-class</span>
      </div>

      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <LazyVideo
          src="/stock/services-bg.mp4"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.12] pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#08080a] via-[#0a0a0f] to-[#08080a] pointer-events-none" />

        {services.map((s, i) => (
          <ServicePanel
            key={s.num}
            service={s}
            index={i}
            progress={scrollYProgress}
          />
        ))}

        {/* Progress stepper — full-width bar with numbered labels per service,
            replaces the previous 4-dot indicator. Highlights the active service
            so users always know where they are in the sequence. */}
        <div className="absolute bottom-10 left-6 md:left-12 right-6 md:right-12 z-10">
          <div className="mx-auto max-w-[1600px] flex gap-4 md:gap-6">
            {services.map((s, i) => (
              <StepperItem
                key={s.num}
                service={s}
                index={i}
                total={services.length}
                progress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
