"use client";

import { motion } from "framer-motion";

const chapters = [
  {
    year: "MCMLXXI",
    english: "1971",
    title: "Geneva atelier",
    desc: "Founded by master horologer Henri Aurelius Morin in a 14-square-meter workshop on the rue du Rhône. Four benches, two lathes, one assistant.",
  },
  {
    year: "MCMXCIV",
    english: "1994",
    title: "Calibre 1994",
    desc: "Introduction of the AU.1994 — the first tourbillon entirely produced in-house. Hand-engraved by a single master, inscribed with the case number.",
  },
  {
    year: "MMIX",
    english: "2009",
    title: "The Séminaire",
    desc: "Launch of the Aurora Séminaire — a four-month residency for apprentice watchmakers under age 30. To date, 47 apprentices trained. Ten own their ateliers.",
  },
  {
    year: "MMXXVI",
    english: "2026",
    title: "Chronograph Héritage",
    desc: "An 87-piece tribute to Morin, presented on the 55th anniversary of the first Aurora timepiece. Available only by private viewing.",
  },
];

export function Story() {
  return (
    <section id="story" className="relative py-40 px-8 md:px-12 border-t border-[#d4a017]/10">
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-px bg-[#d4a017]/60" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#fde68a]">
              — Our story · Chapter I
            </span>
          </div>
          <h2 className="font-serif text-5xl md:text-8xl font-normal tracking-tight leading-[0.95] text-balance max-w-4xl">
            Fifty-five years of
            <br />
            <span className="serif-italic gold-ink">quiet devotion.</span>
          </h2>
        </motion.div>

        <div className="space-y-24">
          {chapters.map((c, i) => (
            <motion.div
              key={c.year}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="grid grid-cols-12 gap-6 items-start border-t border-[#d4a017]/10 pt-16"
            >
              <div className="col-span-12 md:col-span-3">
                <div className="font-serif text-5xl gold-ink">{c.year}</div>
                <div className="mt-2 text-[10px] tracking-[0.3em] uppercase text-white/40">
                  {c.english}
                </div>
              </div>
              <div className="col-span-12 md:col-span-5 md:col-start-5">
                <h3 className="font-serif text-3xl md:text-4xl mb-5 leading-tight">{c.title}</h3>
                <p className="text-white/55 leading-relaxed text-balance max-w-md">{c.desc}</p>
              </div>
              <div className="col-span-12 md:col-span-2 md:col-start-11 text-right">
                <div className="text-[10px] tracking-[0.3em] uppercase text-white/30">
                  Chapter
                </div>
                <div className="mt-2 font-serif text-2xl gold-ink">0{i + 1}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
