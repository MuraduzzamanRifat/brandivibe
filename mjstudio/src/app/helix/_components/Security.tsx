"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, FileCheck, Users } from "lucide-react";

const audits = [
  {
    firm: "Trail of Bits",
    date: "Jan 2026",
    report: "No critical findings",
    scope: "Core staking contracts",
  },
  {
    firm: "OpenZeppelin",
    date: "Mar 2026",
    report: "All findings resolved",
    scope: "Liquidity & withdrawal",
  },
  {
    firm: "Certora",
    date: "Feb 2026",
    report: "Formal verification passed",
    scope: "Invariants & state transitions",
  },
];

const features = [
  {
    icon: Lock,
    title: "Non-custodial",
    desc: "Your keys, your ETH. Helix never takes custody.",
  },
  {
    icon: ShieldCheck,
    title: "Battle-tested",
    desc: "$4.8B TVL, 24 months live, zero exploits.",
  },
  {
    icon: FileCheck,
    title: "Open source",
    desc: "All contracts verified on Etherscan. Immutable where it matters.",
  },
  {
    icon: Users,
    title: "Decentralized validators",
    desc: "1,200+ permissionless node operators across 32 jurisdictions.",
  },
];

export function Security() {
  return (
    <section id="security" className="relative py-32 px-6 md:px-8 border-t border-[#fbbf24]/10 overflow-hidden">
      <video
        src="/helix/stock/section-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-[0.12] pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1c] via-[#0a0f1c]/70 to-[#0a0f1c] pointer-events-none" />
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-20 max-w-3xl"
        >
          <div className="font-mono text-xs text-[#fbbf24] uppercase tracking-[0.3em] mb-4">
            — Security
          </div>
          <h2 className="font-heading text-5xl md:text-7xl font-bold tracking-tight leading-[1] text-balance">
            Trust is <span className="gold-text">earned</span>, not claimed.
          </h2>
        </motion.div>

        {/* features grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-20">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass-dark rounded-2xl p-6"
            >
              <f.icon className="w-6 h-6 text-[#fbbf24] mb-4" />
              <h3 className="font-heading font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* audits table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="glass-dark rounded-2xl overflow-hidden"
        >
          <div className="grid grid-cols-12 gap-4 px-8 py-4 border-b border-[#fbbf24]/10 font-mono text-[10px] text-white/40 uppercase tracking-widest">
            <div className="col-span-4">Audit Firm</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-3">Scope</div>
            <div className="col-span-3">Result</div>
          </div>
          {audits.map((a, i) => (
            <motion.div
              key={a.firm}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="grid grid-cols-12 gap-4 px-8 py-6 border-b border-[#fbbf24]/5 last:border-b-0 hover:bg-white/[0.02] transition-colors items-center"
            >
              <div className="col-span-4 font-heading font-semibold">{a.firm}</div>
              <div className="col-span-2 text-white/60 text-sm">{a.date}</div>
              <div className="col-span-3 text-white/60 text-sm">{a.scope}</div>
              <div className="col-span-3 flex items-center gap-2 text-[#fbbf24] text-sm">
                <ShieldCheck className="w-4 h-4" />
                {a.report}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
