"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

type Date = {
  city: string;
  venue: string;
  date: string;
  status: "available" | "low" | "sold out";
};

const DATES: Date[] = [
  { city: "Los Angeles", venue: "The Greek Theatre", date: "Jul 09", status: "low" },
  { city: "Denver", venue: "Red Rocks Amphitheatre", date: "Jul 14", status: "sold out" },
  { city: "Chicago", venue: "Salt Shed", date: "Jul 18", status: "available" },
  { city: "New York", venue: "Forest Hills Stadium", date: "Jul 23", status: "low" },
  { city: "Toronto", venue: "History", date: "Jul 26", status: "available" },
  { city: "London", venue: "Alexandra Palace", date: "Aug 02", status: "available" },
  { city: "Berlin", venue: "Columbiahalle", date: "Aug 06", status: "available" },
  { city: "Paris", venue: "L'Olympia", date: "Aug 09", status: "low" },
];

const STATUS_LABEL: Record<Date["status"], string> = {
  available: "TICKETS",
  low: "LOW STOCK",
  "sold out": "SOLD OUT",
};

export function Tour() {
  return (
    <section id="tour" className="relative border-t divider-line py-24 md:py-36 px-6 md:px-10">
      <div className="relative mx-auto max-w-[1700px]">
        <div className="grid grid-cols-12 gap-6 mb-16 md:mb-24">
          <div className="col-span-12 md:col-span-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#ff5a1f] mb-4">
              — The Ascent Tour · 2026
            </div>
          </div>
          <div className="col-span-12 md:col-span-8">
            <h2 className="font-display leading-[0.85] text-balance" style={{ fontSize: "clamp(2.6rem, 7vw, 6.5rem)" }}>
              EIGHT NIGHTS.<br />
              <span className="flame-text">FULL BURN.</span>
            </h2>
          </div>
        </div>

        <div className="border-t divider-line">
          {DATES.map((d, i) => (
            <motion.a
              key={d.city}
              href="#"
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.4) }}
              className={`grid grid-cols-12 gap-3 md:gap-6 items-center py-5 md:py-7 border-b divider-line px-2 group transition-colors ${
                d.status === "sold out" ? "opacity-40" : "hover:bg-white/[0.02]"
              }`}
            >
              <div className="col-span-2 md:col-span-1 font-mono text-[11px] text-white/35 tabular-nums">
                {d.date}
              </div>
              <div className="col-span-6 md:col-span-5">
                <span className="font-display text-2xl md:text-4xl leading-none group-hover:translate-x-1 transition-transform inline-block">
                  {d.city}
                </span>
              </div>
              <div className="col-span-4 md:col-span-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                {d.venue}
              </div>
              <div className="col-span-12 md:col-span-2 flex items-center md:justify-end gap-2">
                <span
                  className={`font-mono text-[9px] uppercase tracking-[0.25em] ${
                    d.status === "sold out"
                      ? "text-white/30"
                      : d.status === "low"
                        ? "text-[#fbbf24]"
                        : "text-[#ff5a1f]"
                  }`}
                >
                  {STATUS_LABEL[d.status]}
                </span>
                {d.status !== "sold out" && (
                  <ArrowUpRight className="w-3.5 h-3.5 text-white/40 group-hover:text-[#ff5a1f] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                )}
              </div>
            </motion.a>
          ))}
        </div>

        <div className="mt-8 font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">
          More dates announced after the summit · Pre-save unlocks the presale code
        </div>
      </div>
    </section>
  );
}
