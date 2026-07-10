"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

const tiers = [
  {
    name: "Hobby",
    price: "$0",
    period: "forever",
    desc: "Perfect for prototyping and personal projects.",
    features: [
      "10,000 agent runs / month",
      "Community support",
      "Basic observability",
      "Single region",
    ],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "per month",
    desc: "For teams shipping AI to real users.",
    features: [
      "1M agent runs / month",
      "Evals & guardrails",
      "Priority support",
      "All regions",
      "Custom domains",
      "Advanced observability",
    ],
    cta: "Start 14-day trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "Dedicated infra, SLAs, and white-glove onboarding.",
    features: [
      "Unlimited agent runs",
      "SOC 2 + HIPAA",
      "On-prem deployment",
      "Dedicated CSM",
      "Custom evals",
      "99.99% SLA",
    ],
    cta: "Talk to sales",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-32 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="text-xs font-mono text-[#0369a1] uppercase tracking-widest mb-4">
            PRICING · 04
          </div>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1] text-balance">
            Simple, transparent <span className="italic text-foreground-muted">pricing</span>.
          </h2>
          <p className="mt-6 text-lg text-foreground-muted max-w-xl mx-auto">
            Start free, scale as you grow. No seats, no surprise bills.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`rounded-3xl p-8 ${
                t.featured
                  ? "bg-[#0a0a0f] text-white elevated relative overflow-hidden"
                  : "card"
              }`}
            >
              {t.featured && (
                <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-[#0369a1] text-xs font-medium">
                  Popular
                </div>
              )}
              <div className="text-sm font-medium mb-2 opacity-80">{t.name}</div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-semibold tracking-tight">{t.price}</span>
                {t.period && <span className="text-sm opacity-60">/ {t.period}</span>}
              </div>
              <p className={`text-sm mb-8 ${t.featured ? "text-white/70" : "text-foreground-muted"}`}>
                {t.desc}
              </p>
              <ul className="space-y-3 mb-10">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${t.featured ? "text-[#7dd3fc]" : "text-[#0369a1]"}`} />
                    <span className={t.featured ? "text-white/90" : "text-foreground"}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className={`inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-full font-medium transition-colors ${
                  t.featured
                    ? "bg-white text-[#0a0a0f] hover:bg-white/90"
                    : "bg-[#0a0a0f] text-white hover:bg-[#1a1a1f]"
                }`}
              >
                {t.cta}
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
