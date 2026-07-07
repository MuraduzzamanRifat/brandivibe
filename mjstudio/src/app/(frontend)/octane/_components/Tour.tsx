"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Radio } from "lucide-react";

type Slot = {
  city: string;
  venue: string;
  date: string;
  status: "available" | "low" | "sold out" | "stream";
};

const DATES: Slot[] = [
  { city: "Octane Mountain", venue: "Live channel · opening broadcast", date: "Jun 21", status: "stream" },
  { city: "Los Angeles", venue: "The Greek Theatre", date: "Jul 09", status: "low" },
  { city: "Denver", venue: "Red Rocks Amphitheatre", date: "Jul 14", status: "sold out" },
  { city: "Chicago", venue: "Salt Shed", date: "Jul 18", status: "available" },
  { city: "New York", venue: "Forest Hills Stadium", date: "Jul 23", status: "low" },
  { city: "Toronto", venue: "History", date: "Jul 26", status: "available" },
  { city: "London", venue: "Alexandra Palace", date: "Aug 02", status: "available" },
  { city: "Paris", venue: "L'Olympia", date: "Aug 09", status: "low" },
];

const STATUS_LABEL: Record<Slot["status"], string> = {
  available: "TICKETS",
  low: "LOW STOCK",
  "sold out": "SOLD OUT",
  stream: "STREAM · FREE",
};

export function Tour() {
  return (
    <section id="tour" className="relative border-t divider-line py-24 md:py-36 px-6 md:px-10">
      <div className="scan-bar" style={{ animationDelay: "5s" }} />
      <div className="relative mx-auto max-w-[1800px]">
        <div className="grid grid-cols-12 gap-6 mb-16 md:mb-24">
          <div className="col-span-12 md:col-span-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#c4b49a]/70 mb-4">
              SCENE 03 — THE CHANNEL · broadcast + tour
            </div>
          </div>
          <div className="col-span-12 md:col-span-8">
            <h2 className="font-display leading-[0.85] text-balance" style={{ fontSize: "clamp(2.6rem, 7vw, 6.5rem)" }}>
              ONE BROADCAST.<br />
              <span className="tan-text">SEVEN NIGHTS.</span>
            </h2>
            <p className="text-[#ece6da]/55 leading-relaxed mt-6 max-w-xl">
              The mountain opens with a free livestream on drop day, then the
              tour. Entering the channel unlocks the presale code before the
              public one.
            </p>
          </div>
        </div>

        <div className="border-t divider-line">
          {DATES.map((d, i) => (
            <motion.a
              key={d.city + d.date}
              href="#"
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.4) }}
              className={`grid grid-cols-12 gap-3 md:gap-6 items-center py-5 md:py-7 border-b divider-line px-2 group transition-colors ${
                d.status === "sold out" ? "opacity-40" : "hover:bg-[#c4b49a]/[0.03]"
              } ${d.status === "stream" ? "bg-[#c4b49a]/[0.04]" : ""}`}
            >
              <div className="col-span-2 md:col-span-1 font-mono text-[11px] text-[#c4b49a]/35 tabular-nums">
                {d.date}
              </div>
              <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                {d.status === "stream" && <Radio className="w-4 h-4 text-[#c4b49a] shrink-0 blink" />}
                <span className="font-display text-2xl md:text-4xl leading-none group-hover:translate-x-1 transition-transform inline-block">
                  {d.city}
                </span>
              </div>
              <div className="col-span-4 md:col-span-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#c4b49a]/40">
                {d.venue}
              </div>
              <div className="col-span-12 md:col-span-2 flex items-center md:justify-end gap-2">
                <span
                  className={`font-mono text-[9px] uppercase tracking-[0.25em] ${
                    d.status === "sold out"
                      ? "text-[#ece6da]/30"
                      : d.status === "low"
                        ? "text-[#d98a4a]"
                        : "text-[#c4b49a]"
                  }`}
                >
                  {STATUS_LABEL[d.status]}
                </span>
                {d.status !== "sold out" && (
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#c4b49a]/40 group-hover:text-[#c4b49a] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                )}
              </div>
            </motion.a>
          ))}
        </div>

        <div className="mt-8 font-mono text-[10px] uppercase tracking-[0.3em] text-[#c4b49a]/35">
          More dates announced from the mountain · the channel unlocks the presale
        </div>
      </div>
    </section>
  );
}
