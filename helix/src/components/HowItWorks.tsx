"use client";

import { motion } from "framer-motion";
import { Wallet, TrendingUp, Repeat } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Wallet,
    title: "Deposit ETH",
    desc: "Deposit any amount of ETH into the Helix protocol. No minimum. Non-custodial — you retain ownership at every step.",
  },
  {
    num: "02",
    icon: TrendingUp,
    title: "Receive hxETH",
    desc: "Get hxETH 1:1 against your deposit. Yield accrues automatically. Use hxETH across DeFi while it earns.",
  },
  {
    num: "03",
    icon: Repeat,
    title: "Redeem anytime",
    desc: "Unstake in seconds via instant liquidity pools, or withdraw directly from the protocol in 1-7 days.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-32 px-6 md:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-20 max-w-3xl"
        >
          <div className="font-mono text-xs text-[#fbbf24] uppercase tracking-[0.3em] mb-4">
            — Protocol
          </div>
          <h2 className="font-heading text-5xl md:text-7xl font-bold tracking-tight leading-[1] text-balance">
            Three steps. <span className="gold-text">Real yield.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-px bg-[#fbbf24]/10">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="relative bg-[#0a0f1c] p-10 group hover:bg-[#0f172a] transition-colors"
            >
              <div className="flex items-start justify-between mb-12">
                <div className="font-mono text-sm text-[#fbbf24]">{s.num}</div>
                <div className="w-12 h-12 rounded-full border border-[#fbbf24]/30 grid place-items-center group-hover:border-[#fbbf24] group-hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all">
                  <s.icon className="w-5 h-5 text-[#fbbf24]" />
                </div>
              </div>
              <h3 className="font-heading text-2xl font-semibold mb-4">{s.title}</h3>
              <p className="text-white/60 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
