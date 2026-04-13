"use client";

import { motion } from "framer-motion";

const works = [
  {
    num: "I",
    name: "Casa Amarela",
    location: "Comporta, Portugal",
    year: "2026",
    category: "Private residence",
    desc: "A 380m² concrete house set into a pine forest, organized around a 14m-long reflecting pool. Built for a family that hosts music retreats.",
  },
  {
    num: "II",
    name: "The Reading Room",
    location: "Naoshima, Japan",
    year: "2024",
    category: "Cultural",
    desc: "A single-room library at the base of a hill in Naoshima, buried three metres below ground. Top-lit through a slit that follows the sun.",
  },
  {
    num: "III",
    name: "Estação Vila Nova",
    location: "Porto, Portugal",
    year: "2023",
    category: "Transit · Civic",
    desc: "Conversion of a 1870s rail depot into a city library. 900m² of preserved structure with a new insertion of blackened steel and oak.",
  },
  {
    num: "IV",
    name: "Tent / Prototype",
    location: "Hokkaido, Japan",
    year: "2022",
    category: "Prototype",
    desc: "A 42m² snow-country hut made of charred cedar, triple-glazed glass and wool batts. Off-grid for six months of the year.",
  },
];

export function Works() {
  return (
    <section id="works" className="relative py-32 px-6 md:px-12 border-t border-[#1a1a1a]/10 bg-[#f1efea]">
      <div className="mx-auto max-w-[1600px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <div className="flex items-center gap-5 mb-8">
            <div className="w-16 h-px bg-[#1a1a1a]" />
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#5a5a5a]">
              — Selected works · II
            </span>
          </div>
          <h2 className="font-serif text-5xl md:text-7xl font-normal tracking-[-0.02em] leading-[0.98] text-balance max-w-4xl">
            Four projects.
            <br />
            <span className="serif-italic">Fifteen years.</span>
          </h2>
        </motion.div>

        <div className="space-y-0">
          {works.map((w, i) => (
            <motion.article
              key={w.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              className="grid grid-cols-12 gap-6 items-start py-12 border-t border-[#1a1a1a]/10 group"
            >
              <div className="col-span-12 md:col-span-1">
                <div className="font-serif text-3xl">{w.num}</div>
              </div>
              <div className="col-span-12 md:col-span-4">
                <h3 className="font-serif text-3xl md:text-4xl mb-1">{w.name}</h3>
                <div className="text-xs text-[#8a8a88] uppercase tracking-[0.2em]">
                  {w.location}
                </div>
              </div>
              <div className="col-span-12 md:col-span-5">
                <p className="text-[#5a5a5a] leading-relaxed text-balance max-w-lg">{w.desc}</p>
              </div>
              <div className="col-span-12 md:col-span-2 md:text-right">
                <div className="text-xs uppercase tracking-[0.2em] text-[#8a8a88]">{w.category}</div>
                <div className="mt-2 font-serif text-2xl">{w.year}</div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
