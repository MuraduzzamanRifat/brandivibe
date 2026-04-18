"use client";

import { motion } from "framer-motion";

const origins = [
  {
    region: "Huila, Colombia",
    farm: "Finca El Paraíso",
    farmer: "Diego Samuel Bermúdez",
    notes: "Black cherry · cocoa · red wine",
    process: "Double anaerobic",
    altitude: "1,900m",
    price: "$28",
    size: "250g",
    score: "92",
  },
  {
    region: "Yirgacheffe, Ethiopia",
    farm: "Chelbesa Washing Station",
    farmer: "Temesgen Kassa",
    notes: "Bergamot · jasmine · stone fruit",
    process: "Natural",
    altitude: "2,100m",
    price: "$32",
    size: "250g",
    score: "91",
  },
  {
    region: "Cajamarca, Peru",
    farm: "Rodolfo Chávez",
    farmer: "Rodolfo Chávez",
    notes: "Milk chocolate · almond · caramel",
    process: "Washed",
    altitude: "1,750m",
    price: "$24",
    size: "250g",
    score: "88",
  },
  {
    region: "Kagera, Rwanda",
    farm: "Rubagabaga Cooperative",
    farmer: "Jeanne Uwimana",
    notes: "Black tea · blackcurrant · toffee",
    process: "Natural",
    altitude: "1,850m",
    price: "$26",
    size: "250g",
    score: "89",
  },
  {
    region: "Chiapas, Mexico",
    farm: "Finca San Jerónimo",
    farmer: "Familia Campos",
    notes: "Brown sugar · hazelnut · orange peel",
    process: "Honey",
    altitude: "1,550m",
    price: "$22",
    size: "250g",
    score: "87",
  },
];

export function Origins() {
  return (
    <section id="origins" className="relative px-6 md:px-10 py-24 md:py-32 bg-[var(--cream)]">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-12 gap-6 mb-14 md:mb-20">
          <div className="col-span-12 md:col-span-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--clay)] mb-4">
              — Origins this season
            </div>
          </div>
          <div className="col-span-12 md:col-span-8">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="terroir-serif text-4xl md:text-7xl leading-[0.95] text-balance text-[var(--forest)]"
            >
              Five lots.
              <br />
              <span className="italic">Five stories.</span>
            </motion.h2>
          </div>
        </div>

        <div className="space-y-5 md:space-y-6">
          {origins.map((o, i) => (
            <motion.article
              key={o.region}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="group grid grid-cols-12 gap-4 md:gap-6 py-8 md:py-10 border-t border-[var(--ink)]/10 items-start md:items-center"
            >
              <div className="col-span-12 md:col-span-1 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--clay)]">
                0{i + 1}
              </div>
              <div className="col-span-12 md:col-span-3">
                <div className="terroir-serif italic text-2xl md:text-3xl leading-tight text-[var(--forest)] mb-1 group-hover:text-[var(--clay)] transition-colors">
                  {o.region}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--mute)]">
                  {o.farm}
                </div>
              </div>
              <div className="col-span-12 md:col-span-4 text-[var(--ink)]/75 leading-relaxed text-sm">
                {o.notes}
              </div>
              <div className="col-span-6 md:col-span-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--mute)] space-y-1">
                <div>{o.process}</div>
                <div>{o.altitude}</div>
                <div>SCA {o.score}</div>
              </div>
              <div className="col-span-6 md:col-span-2 text-right md:text-left">
                <div className="terroir-serif text-2xl italic text-[var(--ink)] mb-1">
                  {o.price}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--mute)]">
                  {o.size} · whole bean
                </div>
                <button className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--forest)] hover:text-[var(--clay)] transition-colors">
                  Add to order →
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
