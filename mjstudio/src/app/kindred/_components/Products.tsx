"use client";

import { motion } from "framer-motion";

const products = [
  {
    step: "01",
    name: "Rose Clay Cleanser",
    price: "$48",
    note: "Evening — daily",
    desc: "Pink kaolin + prickly pear. Dissolves SPF + pollution without stripping.",
    tint: "from-[#f5d4c3] to-[#e6b89d]",
    size: "120 ml",
  },
  {
    step: "02",
    name: "Overnight Restore Serum",
    price: "$88",
    note: "Evening — 3 drops",
    desc: "Bakuchiol 2% + squalane. The retinol alternative dermatologists quietly recommend.",
    tint: "from-[#ead5c1] to-[#c89d7f]",
    size: "30 ml",
  },
  {
    step: "03",
    name: "Botanical Seal Balm",
    price: "$64",
    note: "Evening — pea size",
    desc: "Cold-pressed jojoba + prickly pear seed. Locks hydration, repairs barrier overnight.",
    tint: "from-[#f0e3d1] to-[#d4b895]",
    size: "50 ml",
  },
  {
    step: "04",
    name: "Weekly Floral Mask",
    price: "$72",
    note: "Sunday ritual",
    desc: "Rose, chamomile, centella. A 20-minute reset for post-travel or low-sleep weeks.",
    tint: "from-[#f5e3dc] to-[#d9a890]",
    size: "100 ml",
  },
  {
    step: "—",
    name: "The Full Ritual",
    price: "$228",
    note: "Save $44 vs à la carte",
    desc: "All four products in a cream linen box. Our most-gifted bundle.",
    tint: "from-[#e6d8c3] to-[#b59880]",
    size: "Complete set",
    highlight: true,
  },
  {
    step: "—",
    name: "Ritual Subscription",
    price: "$198 / 60 days",
    note: "10% off + ships before you run out",
    desc: "The full ritual delivered on your cadence. Skip or cancel any time from the dashboard.",
    tint: "from-[#d4a48f] to-[#8a6c58]",
    size: "Recurring",
    highlight: true,
  },
];

export function Products() {
  return (
    <section
      id="products"
      className="relative px-6 md:px-10 py-24 md:py-32 bg-[var(--cream)]"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-12 gap-6 mb-16 md:mb-20">
          <div className="col-span-12 md:col-span-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--rose)] mb-4">
              — Shop the ritual
            </div>
            <h2 className="text-4xl md:text-6xl kindred-serif leading-[0.95] text-balance">
              Four steps.
              <br />
              One morning you&apos;ll notice.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-8 md:pl-16 self-end">
            <p className="text-[var(--ink)]/65 leading-relaxed text-lg max-w-xl">
              Each product is formulated to work with the others. Buy the full ritual
              or subscribe — subscribers save 10% and never run out mid-routine.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, i) => (
            <motion.article
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className={`rounded-2xl overflow-hidden border ${p.highlight ? "border-[var(--ink)]/20" : "border-[var(--ink)]/10"} bg-[var(--bg)] hover:shadow-[0_20px_60px_-30px_rgba(26,15,10,0.3)] transition-shadow group`}
            >
              <div className={`relative aspect-[4/5] bg-gradient-to-br ${p.tint}`}>
                <div className="absolute top-5 left-5 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--ink)]/60">
                  Step {p.step}
                </div>
                <div className="absolute bottom-5 right-5 font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--ink)]/50">
                  {p.size}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-[14vw] md:text-[6vw] kindred-serif text-[var(--ink)]/20 leading-none">
                    {p.name.charAt(0)}
                  </div>
                </div>
              </div>
              <div className="p-6 md:p-7">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-xl md:text-2xl kindred-serif not-italic text-[var(--ink)] leading-tight">
                    {p.name}
                  </h3>
                  <div className="text-base md:text-lg font-medium shrink-0">{p.price}</div>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--rose)] mb-3">
                  {p.note}
                </div>
                <p className="text-[var(--ink)]/65 text-sm leading-relaxed mb-5">
                  {p.desc}
                </p>
                <button
                  className={`w-full py-3 rounded-full text-sm font-medium transition-colors ${p.highlight ? "bg-[var(--ink)] text-[var(--cream)] hover:bg-[var(--ink)]/85" : "border border-[var(--ink)]/20 hover:bg-[var(--ink)] hover:text-[var(--cream)]"}`}
                >
                  Add to ritual
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
