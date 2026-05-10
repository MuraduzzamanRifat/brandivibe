"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "./MagneticButton";
import { services } from "@/data/services";

export function Navbar() {
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-6 flex items-center justify-between mix-blend-difference">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-2 h-2 rounded-full bg-white" />
          <span className="font-mono text-sm uppercase tracking-widest text-white">Brandivibe</span>
        </Link>

        <nav className="hidden md:flex items-center gap-10 font-mono text-xs uppercase tracking-widest text-white/70">
          <Link href="/portfolio" className="hover:text-white transition-colors">
            Portfolio
          </Link>

          {/* Services dropdown trigger — hover-open on desktop. The dropdown
              itself escapes mix-blend-difference via the sibling renderer
              below so the panel reads as a normal dark menu, not inverted. */}
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <Link
              href="/services"
              className="hover:text-white transition-colors flex items-center gap-1.5"
              aria-haspopup="true"
              aria-expanded={servicesOpen}
            >
              Services
              <span
                className={`inline-block w-1.5 h-1.5 border-r border-b border-current rotate-45 transition-transform duration-200 ${
                  servicesOpen ? "rotate-[225deg] -translate-y-0.5" : ""
                }`}
                aria-hidden="true"
              />
            </Link>
          </div>

          <a href="#intelligence" className="hover:text-white transition-colors">Growth Engine</a>
          <a href="#process" className="hover:text-white transition-colors">Process</a>
          <Link href="/journal" className="hover:text-white transition-colors">Journal</Link>
        </nav>

        <MagneticButton
          href="#contact"
          className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/60 text-white font-mono text-xs uppercase tracking-widest"
        >
          Book a call
        </MagneticButton>
      </div>

      {/* Services dropdown panel — rendered OUTSIDE the mix-blend-difference
          row so the panel keeps its real colors instead of inverting. The
          inner div uses isolate to create its own stacking context. */}
      <div
        className="hidden md:block absolute top-full left-0 right-0 pointer-events-none"
        onMouseEnter={() => setServicesOpen(true)}
        onMouseLeave={() => setServicesOpen(false)}
      >
        <AnimatePresence>
          {servicesOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-[1600px] px-6 md:px-12"
              style={{ isolation: "isolate" }}
            >
              {/* Position the panel under the "Services" item — roughly the
                  3rd item in the nav. Using a flex spacer that mirrors the
                  nav layout to align under that item without measuring DOM. */}
              <div className="flex justify-center">
                <div className="pointer-events-auto bg-[#0d0d10] border border-white/10 rounded-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] p-3 min-w-[420px] backdrop-blur-xl">
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 px-4 py-2 mb-1">
                    — 5 services that compound
                  </div>
                  {services.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      className="group flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/[0.04] transition-colors"
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: s.accent }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/85 group-hover:text-white transition-colors">
                          {s.title}
                        </div>
                        <div className="text-[11px] text-white/45 mt-1 truncate normal-case font-sans tracking-normal">
                          {s.tagline}
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                  <div className="border-t border-white/5 mt-2 pt-2">
                    <Link
                      href="/services"
                      className="group flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors"
                    >
                      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50 group-hover:text-white">
                        View all services
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
