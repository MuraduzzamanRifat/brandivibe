"use client";

import { motion } from "framer-motion";

const stats = [
  { label: "Total Value Locked", value: "$4.8B", sub: "+12.4% 30d" },
  { label: "APY", value: "4.82%", sub: "Real yield" },
  { label: "Active stakers", value: "184K", sub: "+2,109 this week" },
  { label: "ETH staked", value: "1.42M", sub: "~3% of total supply" },
];

export function StatsBar() {
  return (
    <section className="relative py-20 px-6 md:px-8 border-y border-[#fbbf24]/10">
      <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="md:border-r md:last:border-r-0 border-[#fbbf24]/10 md:px-6"
          >
            <div className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3">
              {s.label}
            </div>
            <div className="font-heading text-4xl md:text-5xl font-bold gold-text">
              {s.value}
            </div>
            <div className="mt-2 text-xs text-white/50 font-mono">{s.sub}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
