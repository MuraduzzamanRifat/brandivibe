"use client";

import { motion } from "framer-motion";
import {
  Code2,
  GitBranch,
  LineChart,
  Shield,
  Layers,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "SDK-first design",
    desc: "TypeScript and Python SDKs with full type safety. Zero config to start, powerful enough for production.",
  },
  {
    icon: LineChart,
    title: "Built-in observability",
    desc: "Every agent run is traced, logged, and measurable. OpenTelemetry-compatible, zero setup.",
  },
  {
    icon: Shield,
    title: "Guardrails & evals",
    desc: "PII detection, toxicity filters, and LLM-as-judge evals on every run. Ship safely from day one.",
  },
  {
    icon: GitBranch,
    title: "Version everything",
    desc: "Prompts, tools, and agent graphs are versioned like code. Roll back, A/B test, and compare.",
  },
  {
    icon: Layers,
    title: "Multi-model",
    desc: "One API across Claude, GPT-4, Gemini, and open models. Swap providers without rewriting code.",
  },
  {
    icon: Zap,
    title: "Edge deployment",
    desc: "Deploy to 300+ edge locations. Sub-50ms latency globally, with zero cold starts.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-32 px-6 lg:px-8 relative overflow-hidden">
      <video
        src="/neuron/stock/section-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-[0.14] pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#fafafa] via-[#fafafa]/70 to-[#fafafa] pointer-events-none" />
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-20"
        >
          <div className="text-xs font-mono text-[#0369a1] uppercase tracking-widest mb-4">
            FEATURES · 02
          </div>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1] text-balance">
            Everything you need to <span className="italic text-foreground-muted">ship</span>.
            <br />
            Nothing you don&apos;t.
          </h2>
          <p className="mt-6 text-lg text-foreground-muted max-w-xl leading-relaxed">
            A focused toolkit for engineering teams who want production-grade AI
            without assembling seven different vendors.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="card rounded-2xl p-7 group hover:elevated transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-[#f0f9ff] border border-[#bae6fd] grid place-items-center mb-5">
                <f.icon className="w-5 h-5 text-[#0369a1]" />
              </div>
              <h3 className="font-semibold text-lg tracking-tight mb-2">{f.title}</h3>
              <p className="text-sm text-foreground-muted leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
