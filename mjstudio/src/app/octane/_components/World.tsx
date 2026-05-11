"use client";

import { motion } from "framer-motion";
import { EmberField } from "./EmberField";

const CHAPTERS = [
  {
    no: "I",
    title: "The fuel",
    body:
      "Octane is what's left when you've burned everything else. The album was written in a cabin with no road to it — three weeks, one mic, a generator running on the thing it's named after.",
  },
  {
    no: "II",
    title: "The mountain",
    body:
      "Every track is an altitude. The sequencing isn't an accident — you're meant to feel the air thin out, the production strip back, the choices get harder the higher it goes.",
  },
  {
    no: "III",
    title: "The descent",
    body:
      "The last song is about getting down, because that's the part nobody talks about. Summit photos lie. This record doesn't end at the top — it ends at the bottom, changed.",
  },
];

export function World() {
  return (
    <section id="world" className="relative border-t divider-line py-24 md:py-40 px-6 md:px-10 overflow-hidden grain">
      <EmberField count={22} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_30%_40%,rgba(255,90,31,0.1),transparent_70%)] pointer-events-none" />

      <div className="relative mx-auto max-w-[1700px]">
        <div className="grid grid-cols-12 gap-6 mb-20 md:mb-32">
          <div className="col-span-12 md:col-span-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#ff5a1f] mb-5">
              — The world of OCTANE
            </div>
            <h2 className="font-display leading-[0.82] text-balance" style={{ fontSize: "clamp(2.8rem, 8vw, 7.5rem)" }}>
              YOU DON&apos;T<br />
              LISTEN.<br />
              <span className="flame-text">YOU CLIMB.</span>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-6 md:col-start-7 flex items-end">
            <p className="text-lg md:text-2xl text-white/65 leading-snug text-balance">
              VYCE built a campaign you have to ascend. No skip button to the
              singles. No tracklist dropped flat. The record reveals itself the
              way a mountain does — one ridge at a time, and only if you keep going.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(255,90,31,0.18)] border divider-line">
          {CHAPTERS.map((c, i) => (
            <motion.article
              key={c.no}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-[#0d0a0e] p-8 md:p-12 relative"
            >
              <div className="font-display text-7xl md:text-8xl text-white/8 leading-none mb-6">
                {c.no}
              </div>
              <h3 className="font-display text-2xl md:text-3xl mb-4">{c.title}</h3>
              <p className="text-white/55 leading-relaxed text-[15px]">{c.body}</p>
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
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/35 mb-8">
            — VYCE, on the record
          </div>
          <p className="font-display leading-[0.95] text-balance" style={{ fontSize: "clamp(2rem, 6vw, 5rem)" }}>
            &ldquo;I wanted something you had to <span className="flame-text">earn</span> the
            end of. Most albums you can hear in the order you want. This one
            only makes sense if you take it the hard way.&rdquo;
          </p>
        </motion.blockquote>
      </div>
    </section>
  );
}
