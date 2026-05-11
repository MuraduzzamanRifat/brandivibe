"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Lock, Play } from "lucide-react";

type Track = {
  no: string;
  title: string;
  altitude: string;
  runtime: string;
  feature?: string;
  unlocked: boolean;
  note: string;
};

const TRACKS: Track[] = [
  { no: "01", title: "Basecamp", altitude: "1,200m", runtime: "3:14", unlocked: true, note: "The ground floor. Where the air still feels normal." },
  { no: "02", title: "Treeline", altitude: "1,900m", runtime: "2:58", unlocked: true, note: "The last place anything grows. After this it's just rock and intent." },
  { no: "03", title: "Switchbacks", altitude: "2,400m", runtime: "4:02", feature: "feat. KORA", unlocked: true, note: "You climb the same hill six times to get up it once." },
  { no: "04", title: "Whiteout", altitude: "2,950m", runtime: "3:41", unlocked: true, note: "Can't see your hands. Keep moving anyway." },
  { no: "05", title: "Crampons", altitude: "3,300m", runtime: "2:33", unlocked: true, note: "Spikes on your feet. Permission to dig in." },
  { no: "06", title: "Death Zone", altitude: "3,800m", runtime: "5:09", feature: "feat. ASH MERIDIAN", unlocked: false, note: "Above this line, your body is dying. You go anyway." },
  { no: "07", title: "Cornice", altitude: "4,100m", runtime: "3:27", unlocked: false, note: "A shelf of snow over nothing. Test it before you trust it." },
  { no: "08", title: "Rope Solo", altitude: "4,400m", runtime: "4:18", feature: "feat. THE CHOIR", unlocked: false, note: "No partner. You belay yourself or you don't come back." },
  { no: "09", title: "False Summit", altitude: "4,650m", runtime: "2:46", unlocked: false, note: "It looks like the top. It is not the top. Keep climbing." },
  { no: "10", title: "Octane", altitude: "4,790m", runtime: "6:02", feature: "title track", unlocked: false, note: "Whatever you've got left — burn all of it here." },
  { no: "11", title: "The Descent", altitude: "0m", runtime: "4:55", unlocked: false, note: "Getting down is when most people die. This song knows that." },
];

export function Ascent() {
  const [active, setActive] = useState<string | null>("01");

  return (
    <section id="ascent" className="relative border-t divider-line py-24 md:py-36 px-6 md:px-10 overflow-hidden">
      <div className="absolute inset-0 ember-grid opacity-30 pointer-events-none" />
      <div className="relative mx-auto max-w-[1700px]">
        <div className="grid grid-cols-12 gap-6 mb-16 md:mb-24">
          <div className="col-span-12 md:col-span-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#ff5a1f] mb-4">
              — Tracklist · sorted by altitude
            </div>
          </div>
          <div className="col-span-12 md:col-span-8">
            <h2 className="font-display leading-[0.85] text-balance" style={{ fontSize: "clamp(2.6rem, 7vw, 6.5rem)" }}>
              ELEVEN SONGS.<br />
              <span className="flame-text">ONE CLIMB.</span>
            </h2>
            <p className="text-white/55 leading-relaxed mt-6 max-w-xl">
              The record is sequenced as an ascent. Five tracks are open now —
              the rest unlock as the campaign climbs. Pre-save to get every
              altitude the moment it&apos;s reached.
            </p>
          </div>
        </div>

        <div className="border-t divider-line">
          {TRACKS.map((t, i) => {
            const open = active === t.no;
            return (
              <motion.div
                key={t.no}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: Math.min(i * 0.04, 0.4) }}
                className="border-b divider-line"
              >
                <button
                  onClick={() => setActive(open ? null : t.no)}
                  className="w-full text-left grid grid-cols-12 gap-3 md:gap-6 items-center py-5 md:py-7 group hover:bg-white/[0.02] transition-colors px-2"
                >
                  <div className="col-span-2 md:col-span-1 font-mono text-[11px] text-white/35 tabular-nums">
                    {t.no}
                  </div>
                  <div className="col-span-7 md:col-span-5 flex items-center gap-3">
                    {t.unlocked ? (
                      <Play className="w-3.5 h-3.5 text-[#ff5a1f] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-white/25 shrink-0" />
                    )}
                    <span
                      className={`font-display text-2xl md:text-4xl leading-none ${
                        t.unlocked ? "" : "text-white/35"
                      } group-hover:translate-x-1 transition-transform`}
                    >
                      {t.title}
                    </span>
                    {t.feature && (
                      <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/35 hidden md:inline">
                        {t.feature}
                      </span>
                    )}
                  </div>
                  <div className="col-span-2 md:col-span-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 text-right md:text-left">
                    {t.altitude}
                  </div>
                  <div className="hidden md:block md:col-span-2 font-mono text-[10px] text-white/30 tabular-nums">
                    {t.runtime}
                  </div>
                  <div className="col-span-1 text-right">
                    <span
                      className={`font-mono text-[9px] uppercase tracking-[0.25em] ${
                        t.unlocked ? "text-[#ff5a1f]" : "text-white/25"
                      }`}
                    >
                      {t.unlocked ? "OPEN" : "LOCKED"}
                    </span>
                  </div>
                </button>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pb-7 px-2 md:px-10 grid grid-cols-12 gap-4">
                      <div className="col-span-12 md:col-span-1" />
                      <p className="col-span-12 md:col-span-7 text-white/55 leading-relaxed text-sm md:text-base text-balance">
                        {t.note}
                      </p>
                      <div className="col-span-12 md:col-span-4 flex md:justify-end items-start gap-3 font-mono text-[9px] uppercase tracking-[0.25em] text-white/35">
                        <span>{t.feature ?? "no feature"}</span>
                        <span>·</span>
                        <span>{t.runtime}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
          <span>5 / 11 altitudes reached</span>
          <a href="#drop" className="text-[#ff5a1f] hover:text-[#ff7a3d] transition-colors">
            Pre-save for the rest →
          </a>
        </div>
      </div>
    </section>
  );
}
