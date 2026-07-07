"use client";

import { motion } from "framer-motion";

const CHAPTERS = [
  {
    no: "I",
    title: "The observatory",
    body:
      "Octane was built in a cabin on a mountain with no road to it — three weeks, one mic, a generator. The campaign rebuilds that place as a digital observatory: a destination you visit, not a page you load.",
  },
  {
    no: "II",
    title: "The terrain",
    body:
      "Every track is an altitude. The mountain pulses — a sonar wave runs over the mesh every few seconds, the way the record's production keeps revealing new ground the higher the climb goes.",
  },
  {
    no: "III",
    title: "The channel",
    body:
      "The mountain has a live channel. Livestream drops, evolving updates, locked altitudes unlocking on a clock. The campaign isn't a snapshot — it changes while you're on it.",
  },
];

export function World() {
  return (
    <section id="world" className="relative border-t divider-line py-24 md:py-40 px-6 md:px-10 overflow-hidden grain">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <span className="pulse-ring" style={{ animationDelay: "0s" }} />
        <span className="pulse-ring" style={{ animationDelay: "2.5s" }} />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_30%_40%,rgba(196,180,154,0.07),transparent_70%)] pointer-events-none" />

      <div className="relative mx-auto max-w-[1800px]">
        <div className="grid grid-cols-12 gap-6 mb-20 md:mb-32">
          <div className="col-span-12 md:col-span-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#c4b49a]/70 mb-5">
              SCENE 02 — THE WORLD
            </div>
            <h2 className="font-display leading-[0.82] text-balance" style={{ fontSize: "clamp(2.8rem, 8vw, 7.5rem)" }}>
              YOU DON&apos;T<br />
              VISIT IT.<br />
              <span className="tan-text">YOU CLIMB IT.</span>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-6 md:col-start-7 flex items-end">
            <p className="text-lg md:text-2xl text-[#ece6da]/65 leading-snug text-balance">
              VYCE built a campaign you have to ascend — a mountain rendered in
              the browser, a live channel running on it, a record that opens
              one altitude at a time. No skip button to the singles. No
              tracklist dropped flat. World-building, not a website.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#c4b49a]/15 border divider-line">
          {CHAPTERS.map((c, i) => (
            <motion.article
              key={c.no}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-[#0e0c0a] p-8 md:p-12 relative"
            >
              <div className="font-display text-7xl md:text-8xl text-[#c4b49a]/8 leading-none mb-6">
                {c.no}
              </div>
              <h3 className="font-display text-2xl md:text-3xl mb-4">{c.title}</h3>
              <p className="text-[#ece6da]/55 leading-relaxed text-[15px]">{c.body}</p>
            </motion.article>
          ))}
        </div>

        {/* big pull quote */}
        <motion.blockquote
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-24 md:mt-40 max-w-5xl"
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#c4b49a]/35 mb-8">
            — VYCE, on the campaign
          </div>
          <p className="font-display leading-[0.95] text-balance" style={{ fontSize: "clamp(2rem, 6vw, 5rem)" }}>
            &ldquo;I didn&apos;t want a website. I wanted a <span className="tan-text">place</span> —
            somewhere the record actually lives, that you have to climb to,
            that keeps changing after you leave.&rdquo;
          </p>
        </motion.blockquote>
      </div>
    </section>
  );
}
