"use client";

import { motion } from "framer-motion";

const specs = [
  { group: "POWERTRAIN", rows: [
    ["Peak power", "1,920 HP @ 14,000 RPM"],
    ["Peak torque", "2,340 Nm"],
    ["Configuration", "Quad-motor AWD"],
    ["Battery", "117 kWh solid-state"],
  ]},
  { group: "PERFORMANCE", rows: [
    ["0-100 km/h", "1.94 seconds"],
    ["0-200 km/h", "4.62 seconds"],
    ["Top speed", "412 km/h (limited)"],
    ["Range (WLTP)", "612 km"],
  ]},
  { group: "CHASSIS", rows: [
    ["Weight", "1,640 kg dry"],
    ["Monocoque", "Full carbon fibre"],
    ["Body", "Forged composite"],
    ["Aero", "Active DRS + F1 floor"],
  ]},
  { group: "EDITION", rows: [
    ["Units", "087 worldwide"],
    ["Delivery", "Q3 2026 onward"],
    ["Reservation", "€ 340,000 refundable"],
    ["List", "€ 2,840,000"],
  ]},
];

export function Specs() {
  return (
    <section id="performance" className="relative py-32 px-6 md:px-10 border-t divider-line">
      <div className="mx-auto max-w-[1600px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-20 max-w-3xl"
        >
          <div className="font-mono text-[10px] text-[#84ff6b] uppercase tracking-[0.3em] mb-4">
            — Telemetry / 02
          </div>
          <h2 className="font-bold text-5xl md:text-7xl tracking-tight leading-[0.95] text-balance">
            Engineered without
            <br />
            <span className="acid-text">compromise.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0 border divider-line">
          {specs.map((group, gi) => (
            <motion.div
              key={group.group}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: gi * 0.08 }}
              className={`p-8 ${gi > 0 ? "border-t md:border-t-0 md:border-l divider-line" : ""} ${gi > 0 && gi % 2 === 0 ? "md:border-t lg:border-t-0" : ""}`}
            >
              <div className="font-mono text-[9px] text-[#84ff6b] uppercase tracking-[0.3em] mb-6">
                {group.group}
              </div>
              <dl className="space-y-4">
                {group.rows.map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-1">
                    <dt className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/40">{k}</dt>
                    <dd className="font-bold text-xl">{v}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
