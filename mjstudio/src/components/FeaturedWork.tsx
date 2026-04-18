"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { RevealLine } from "./SplitText";
import { LazyVideo } from "./LazyVideo";
import { demos } from "@/data/demos";

// Only the first 6 projects appear on the homepage; the rest live behind /portfolio.
const HOMEPAGE_DEMO_COUNT = 6;
const projects = demos.filter((d) => !d.comingSoon).slice(0, HOMEPAGE_DEMO_COUNT);

export function FeaturedWork() {
  return (
    <section id="work" className="relative py-24 md:py-28 px-6 md:px-12 border-t border-white/5">
      <div className="mx-auto max-w-[1600px]">
        {/* section label */}
        <div className="grid grid-cols-12 gap-6 mb-12">
          <div className="col-span-12 md:col-span-3">
            <div className="font-mono text-xs text-white/40 uppercase tracking-widest">
              — Selected Work
            </div>
            <div className="mt-2 font-mono text-xs text-white/40">003</div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <RevealLine>
              <h2 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[0.95] text-balance">
                Recent work,
                <br />
                <span className="italic text-white/60">handpicked</span>.
              </h2>
            </RevealLine>
          </div>
        </div>

        <div className="space-y-20">
          {projects.map((p, i) => (
            <motion.a
              key={p.name}
              href={p.href}
              data-cursor="text"
              data-cursor-label="VIEW"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="group grid grid-cols-12 gap-6 items-start"
            >
              {/* left meta */}
              <div className="col-span-12 md:col-span-3 font-mono text-xs text-white/40 uppercase tracking-widest space-y-2">
                <div>— {p.num}</div>
                <div>{p.year}</div>
                <div>{p.role}</div>
              </div>

              {/* right visual + info */}
              <div className={`col-span-12 md:col-span-9 ${i % 2 === 1 ? "md:col-start-1 md:row-start-1" : ""}`}>
                <div
                  className={`relative aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br ${p.gradient}`}
                >
                  {p.video ? (
                    <>
                      <LazyVideo
                        src={p.video}
                        poster={p.poster ?? undefined}
                        className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-[18vw] md:text-[14vw] font-semibold tracking-tighter text-white/90 group-hover:scale-[1.03] transition-transform duration-1000 ease-out">
                        {p.name}
                      </div>
                    </div>
                  )}
                  <div className="absolute top-8 left-8 font-mono text-[10px] text-white/60 uppercase tracking-widest">
                    Live preview
                  </div>
                  <div className="absolute top-8 right-8">
                    <div className="w-12 h-12 rounded-full glass grid place-items-center group-hover:bg-white/20 transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-12 gap-6">
                  <div className="col-span-12 md:col-span-6">
                    <div className="font-mono text-xs text-white/40 uppercase tracking-widest mb-3">
                      {p.category}
                    </div>
                    <div className="text-3xl md:text-4xl font-semibold tracking-tight">
                      {p.name}
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <p className="text-white/60 leading-relaxed mb-6 text-balance">
                      {p.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-white/70 font-mono"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {demos.length > HOMEPAGE_DEMO_COUNT && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-10 border-t border-white/5"
          >
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">
                More in the index
              </div>
              <div className="text-2xl md:text-3xl font-semibold tracking-tight">
                {demos.length} projects in the portfolio — landing pages, websites, and Shopify stores.
              </div>
            </div>
            <Link
              href="/portfolio"
              className="shrink-0 inline-flex items-center gap-3 px-7 py-4 rounded-full border border-white/20 hover:border-white/50 hover:bg-white/5 transition-colors font-medium"
            >
              View full portfolio <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
