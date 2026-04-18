"use client";

import { motion } from "framer-motion";

const items = [
  { num: "01", name: "Workwear jacket", price: "$280", stock: "200 / 200" },
  { num: "02", name: "Canvas chore", price: "$240", stock: "200 / 200" },
  { num: "03", name: "Field pant", price: "$180", stock: "200 / 200" },
  { num: "04", name: "Heavy tee — black", price: "$78", stock: "200 / 200" },
  { num: "05", name: "Heavy tee — ecru", price: "$78", stock: "200 / 200" },
  { num: "06", name: "Boxy hoodie", price: "$160", stock: "200 / 200" },
  { num: "07", name: "Crew sweat", price: "$140", stock: "200 / 200" },
  { num: "08", name: "Work cap", price: "$52", stock: "200 / 200" },
  { num: "09", name: "Fisher beanie", price: "$48", stock: "200 / 200" },
  { num: "10", name: "Utility tote", price: "$110", stock: "200 / 200" },
  { num: "11", name: "Tube sock · 3pk", price: "$36", stock: "200 / 200" },
  { num: "12", name: "Keychain · brass", price: "$28", stock: "200 / 200" },
];

export function Drop() {
  return (
    <section id="drop" className="px-6 md:px-10 py-24 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-12 gap-6 mb-14 items-end">
          <div className="col-span-12 md:col-span-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--acid)] mb-4">
              — Drop 07 · The manifest
            </div>
            <h2 className="ironwood-display text-5xl md:text-7xl leading-[0.9] text-balance">
              TWELVE PIECES.
              <br />
              ONE CHAPTER.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-6 md:text-right">
            <p className="text-[var(--ink)]/70 leading-relaxed md:ml-auto max-w-md md:text-left">
              Every item is stamped with the drop number. Once it&apos;s sold through,
              we archive it. What makes it into the next chapter depends on what
              we learn from this one.
            </p>
          </div>
        </div>

        <div className="border-t border-[var(--ink)]/10">
          {items.map((item, i) => (
            <motion.a
              key={item.num}
              href="#"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.4) }}
              className="group grid grid-cols-12 gap-4 md:gap-6 py-5 md:py-6 border-b border-[var(--ink)]/10 items-center hover:bg-[var(--ink)]/[0.02] transition-colors px-2 md:px-4 -mx-2 md:-mx-4"
            >
              <div className="col-span-2 md:col-span-1 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--acid)]">
                {item.num}
              </div>
              <div className="col-span-6 md:col-span-5 ironwood-display text-xl md:text-2xl group-hover:text-[var(--acid)] transition-colors">
                {item.name}
              </div>
              <div className="col-span-4 md:col-span-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--mute)]">
                Stock · {item.stock}
              </div>
              <div className="hidden md:block col-span-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--mute)]">
                Ships May 3
              </div>
              <div className="col-span-12 md:col-span-1 text-right ironwood-display text-lg">
                {item.price}
              </div>
            </motion.a>
          ))}
        </div>

        <div className="mt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--mute)]">
          <div>Waitlist closes · 48h before drop</div>
          <button className="px-8 py-4 bg-[var(--acid)] text-[var(--bg)] font-semibold tracking-[0.2em] hover:bg-[var(--acid)]/90 transition-colors">
            Join the waitlist →
          </button>
        </div>
      </div>
    </section>
  );
}
