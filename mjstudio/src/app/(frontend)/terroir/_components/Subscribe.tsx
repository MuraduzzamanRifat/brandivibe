"use client";

import { motion } from "framer-motion";

const plans = [
  {
    name: "The Sampler",
    frequency: "One-time",
    price: "$42",
    sub: "One 250g bag · chef's choice",
    features: ["One single origin", "Brewing guide included", "Free shipping"],
  },
  {
    name: "The Regular",
    frequency: "Monthly",
    price: "$38 / mo",
    sub: "One 250g bag · rotating",
    features: ["Save $4 vs one-time", "Skip or pause any time", "Farmer profile with each bag"],
    featured: true,
  },
  {
    name: "The Explorer",
    frequency: "Monthly",
    price: "$68 / mo",
    sub: "Two 250g bags · different origins",
    features: ["Save $12 vs one-time", "Includes full tasting card", "Priority on rare lots"],
  },
];

export function Subscribe() {
  return (
    <section id="subscribe" className="relative px-6 md:px-10 py-24 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-12 gap-6 mb-14 md:mb-20">
          <div className="col-span-12 md:col-span-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--clay)] mb-4">
              — Subscribe to the box
            </div>
            <h2 className="terroir-serif text-4xl md:text-6xl leading-[0.95] text-[var(--forest)] text-balance">
              Fresh coffee,
              <br />
              <span className="italic">on your schedule.</span>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-6 self-end">
            <p className="text-[var(--ink)]/70 leading-relaxed max-w-md">
              Subscribers get first access to the rarest lots — often sold out before
              the public listing. Change cadence, skip, or cancel from the dashboard.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`relative rounded-3xl p-8 md:p-10 flex flex-col ${
                p.featured
                  ? "bg-[var(--forest)] text-[var(--cream)] border border-[var(--forest)]"
                  : "bg-[var(--cream)] text-[var(--ink)] border border-[var(--ink)]/10"
              }`}
            >
              {p.featured && (
                <div className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-[var(--clay)] text-[var(--cream)] font-mono text-[9px] uppercase tracking-[0.3em]">
                  Most loved
                </div>
              )}
              <div className={`font-mono text-[10px] uppercase tracking-[0.4em] mb-3 ${p.featured ? "text-[var(--cream)]/60" : "text-[var(--clay)]"}`}>
                {p.frequency}
              </div>
              <div className="terroir-serif italic text-3xl md:text-4xl mb-2">{p.name}</div>
              <div className="terroir-serif text-5xl md:text-6xl mb-2">{p.price}</div>
              <div className={`text-sm mb-8 ${p.featured ? "text-[var(--cream)]/70" : "text-[var(--mute)]"}`}>
                {p.sub}
              </div>
              <ul className={`space-y-3 mb-10 text-sm ${p.featured ? "text-[var(--cream)]/85" : "text-[var(--ink)]/75"}`}>
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-[9px] w-1 h-1 rounded-full bg-current shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`mt-auto py-4 rounded-full font-medium text-sm transition-colors ${
                  p.featured
                    ? "bg-[var(--cream)] text-[var(--forest)] hover:bg-[var(--cream)]/90"
                    : "bg-[var(--forest)] text-[var(--cream)] hover:bg-[var(--forest)]/90"
                }`}
              >
                Start {p.name.toLowerCase()} →
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
