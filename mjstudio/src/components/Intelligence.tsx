"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FileText,
  Megaphone,
  Radar,
  Mail,
  Users,
} from "lucide-react";
import { RevealLine } from "./SplitText";

/**
 * Intelligence section — pitches the AI backend that ships with every
 * Brandivibe build. Key differentiator: clients don't just get a website,
 * they get a growth engine that writes, sources, sells, and learns
 * autonomously. Five capability cards with animated "live" metrics to
 * make the system feel alive.
 */

type Capability = {
  icon: typeof FileText;
  title: string;
  description: string;
  metricLabel: string;
  metricValue: string;
  metricUnit: string;
  accent: string;
};

const capabilities: Capability[] = [
  {
    icon: FileText,
    title: "Content Engine",
    description:
      "Publishes long-form, SEO-optimized articles to your journal every day. No writer, no editor, no idle Mondays.",
    metricLabel: "Articles this month",
    metricValue: "28",
    metricUnit: "",
    accent: "#84e1ff",
  },
  {
    icon: Megaphone,
    title: "Social Autopilot",
    description:
      "Drafts and queues Facebook posts matched to your brand voice. Pulls teaser images automatically.",
    metricLabel: "Posts queued",
    metricValue: "84",
    metricUnit: "/mo",
    accent: "#a78bfa",
  },
  {
    icon: Radar,
    title: "Lead Radar",
    description:
      "Scans TechCrunch, Product Hunt, Hacker News, and BetaList for founders who match your ICP. Zero manual prospecting.",
    metricLabel: "New prospects",
    metricValue: "240",
    metricUnit: "/mo",
    accent: "#f0abfc",
  },
  {
    icon: Mail,
    title: "Cold Outreach",
    description:
      "Personalized emails, sent at the optimal window. Detects replies, pauses sequences, tracks booking intent.",
    metricLabel: "Reply rate",
    metricValue: "12.4",
    metricUnit: "%",
    accent: "#fcd34d",
  },
  {
    icon: Users,
    title: "Smart CRM",
    description:
      "Every lead, every conversation, every deal stage, tracked. The brain learns which channels convert and doubles down.",
    metricLabel: "Deals in pipeline",
    metricValue: "47",
    metricUnit: "",
    accent: "#86efac",
  },
];

function PulseDot({ color }: { color: string }) {
  return (
    <div className="relative flex items-center">
      <motion.span
        animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        className="absolute w-1.5 h-1.5 rounded-full"
        style={{ background: color }}
      />
      <span
        className="relative w-1.5 h-1.5 rounded-full"
        style={{ background: color }}
      />
    </div>
  );
}

function LiveTicker({ value, unit }: { value: string; unit: string }) {
  // Animate the numeric value so each visit feels "live" — increments/decrements
  // slightly around the base value. Avoids stale-looking static numbers.
  const reduced = useReducedMotion();
  const [displayed, setDisplayed] = useState(value);
  useEffect(() => {
    if (reduced) return;
    const base = parseFloat(value);
    if (isNaN(base)) return;
    const isInt = !value.includes(".");
    const interval = setInterval(() => {
      const jitter = (Math.random() - 0.5) * (isInt ? 2 : 0.3);
      const next = Math.max(0, base + jitter);
      setDisplayed(isInt ? Math.round(next).toString() : next.toFixed(1));
    }, 2500 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [value, reduced]);
  return (
    <span className="tabular-nums">
      {displayed}
      {unit}
    </span>
  );
}

function CapabilityCard({ c, index }: { c: Capability; index: number }) {
  const Icon = c.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 0.7,
        delay: 0.05 + index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative rounded-3xl border border-white/8 bg-white/[0.015] p-8 md:p-10 overflow-hidden hover:border-white/20 transition-colors"
    >
      {/* accent glow on hover */}
      <div
        className="absolute -top-24 -right-24 w-56 h-56 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
        style={{ background: c.accent }}
      />

      {/* top row: icon + live indicator */}
      <div className="flex items-center justify-between mb-8 relative">
        <div
          className="w-12 h-12 rounded-2xl grid place-items-center border border-white/10"
          style={{ background: `${c.accent}10` }}
        >
          <Icon className="w-5 h-5" style={{ color: c.accent }} />
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
          <PulseDot color={c.accent} />
          Live
        </div>
      </div>

      <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4 text-balance">
        {c.title}
      </h3>
      <p className="text-white/55 leading-relaxed text-[15px] md:text-base mb-10 text-balance">
        {c.description}
      </p>

      {/* animated metric at the bottom */}
      <div className="pt-6 border-t border-white/5 flex items-baseline justify-between">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
          {c.metricLabel}
        </div>
        <div
          className="text-2xl md:text-3xl font-semibold tabular-nums"
          style={{ color: c.accent }}
        >
          <LiveTicker value={c.metricValue} unit={c.metricUnit} />
        </div>
      </div>
    </motion.div>
  );
}

export function Intelligence() {
  return (
    <section
      id="intelligence"
      className="relative border-t border-white/5 py-24 md:py-32 px-6 md:px-12 overflow-hidden"
    >
      {/* background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[1200px] max-h-[1200px] rounded-full bg-gradient-to-br from-[#84e1ff]/[0.04] via-[#a78bfa]/[0.03] to-transparent blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-[1600px]">
        {/* section label */}
        <div className="grid grid-cols-12 gap-6 mb-12 md:mb-16">
          <div className="col-span-12 md:col-span-4">
            <div className="font-mono text-xs text-white/40 uppercase tracking-[0.3em]">
              — Intelligence Layer
            </div>
            <div className="mt-2 font-mono text-xs text-white/40">005</div>
          </div>
          <div className="col-span-12 md:col-span-8">
            <RevealLine>
              <h2 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[0.95] text-balance">
                Not just a website.
                <br />
                <span className="italic text-white/60">A growth engine.</span>
              </h2>
            </RevealLine>
            <RevealLine delay={0.2}>
              <p className="mt-8 text-lg md:text-xl text-white/55 leading-relaxed max-w-2xl text-balance">
                Every Brandivibe build ships with an autonomous AI brain that
                writes your content, sources your prospects, sells your service,
                and learns from every reply. Your website doesn&apos;t sit idle
                between campaigns. It&apos;s the campaign.
              </p>
            </RevealLine>
          </div>
        </div>

        {/* capability grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {capabilities.map((c, i) => (
            <CapabilityCard key={c.title} c={c} index={i} />
          ))}
        </div>

        {/* bottom pitch line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 md:mt-24 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-8 md:p-10 rounded-3xl border border-white/10 bg-white/[0.02]"
        >
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#84e1ff] mb-3">
              Included with every build
            </div>
            <div className="text-xl md:text-2xl font-semibold tracking-tight text-balance max-w-2xl">
              Ship a site on Tuesday. Wake up Wednesday to new articles,
              queued posts, fresh leads, and sent emails. The brain runs itself.
            </div>
          </div>
          <a
            href="#contact"
            className="shrink-0 inline-flex items-center gap-3 px-7 py-4 rounded-full bg-white text-black font-medium text-sm hover:bg-white/90 transition-colors"
          >
            See it in action →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
