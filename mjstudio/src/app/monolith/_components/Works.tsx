"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  useScroll,
} from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

type Project = {
  num: string;
  name: string;
  location: string;
  year: string;
  category: string;
  desc: string;
  swatch: string;
};

const works: Project[] = [
  {
    num: "I",
    name: "Casa Amarela",
    location: "Comporta, Portugal",
    year: "2026",
    category: "Private residence",
    desc: "A 380m² concrete house set into a pine forest, organized around a 14m-long reflecting pool. Built for a family that hosts music retreats.",
    swatch:
      "linear-gradient(140deg, #d8d3c7 0%, #b5afa0 45%, #837b6a 100%)",
  },
  {
    num: "II",
    name: "The Reading Room",
    location: "Naoshima, Japan",
    year: "2024",
    category: "Cultural",
    desc: "A single-room library at the base of a hill, buried three metres below ground. Top-lit through a slit that follows the sun.",
    swatch:
      "linear-gradient(170deg, #2a2a2a 0%, #444444 55%, #6b6b6b 100%)",
  },
  {
    num: "III",
    name: "Estação Vila Nova",
    location: "Porto, Portugal",
    year: "2023",
    category: "Transit · Civic",
    desc: "Conversion of an 1870s rail depot into a city library. 900m² of preserved structure with a new insertion of blackened steel and oak.",
    swatch:
      "linear-gradient(155deg, #8a6f4f 0%, #624a30 50%, #3a2815 100%)",
  },
  {
    num: "IV",
    name: "Tent / Prototype",
    location: "Hokkaido, Japan",
    year: "2022",
    category: "Prototype",
    desc: "A 42m² snow-country hut of charred cedar, triple-glazed glass and wool batts. Off-grid for six months of the year.",
    swatch:
      "linear-gradient(150deg, #1c1c1c 0%, #2e2a25 50%, #4a3f33 100%)",
  },
];

function ProjectCard({
  project,
  index,
  dragX,
  dragRange,
}: {
  project: Project;
  index: number;
  dragX: ReturnType<typeof useMotionValue<number>>;
  dragRange: number;
}) {
  // Content trails the card edge slightly as the strip drags — subtle parallax
  // that reads as depth without being decorative.
  const parallaxRange = Math.max(1, dragRange);
  const contentX = useTransform(
    dragX,
    [-parallaxRange, 0],
    [30, 0]
  );
  const swatchX = useTransform(
    dragX,
    [-parallaxRange, 0],
    [-20 + index * 4, 0]
  );

  return (
    <motion.article
      className="shrink-0 w-[min(82vw,640px)] flex flex-col"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[#2a2a2a]">
        <motion.div
          className="absolute inset-0"
          style={{ x: swatchX, background: project.swatch }}
        />
        {/* grain + vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_30%,rgba(0,0,0,0.35)_100%)] pointer-events-none" />

        <motion.div
          style={{ x: contentX }}
          className="absolute inset-0 flex flex-col justify-between p-8 text-[var(--mono-bg)] pointer-events-none"
        >
          <div className="flex items-start justify-between">
            <div className="font-mono text-[9px] uppercase tracking-[0.3em] opacity-70">
              {project.category}
            </div>
            <div className="font-mono text-[9px] uppercase tracking-[0.3em] opacity-70">
              {project.year}
            </div>
          </div>
          <div className="flex items-end justify-between gap-4">
            <div className="font-serif italic text-6xl md:text-7xl leading-[0.85] opacity-60">
              {project.num}
            </div>
            <div className="text-right">
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] opacity-60">
                {project.location}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-6 flex items-start justify-between gap-6">
        <div>
          <h3 className="font-serif text-3xl md:text-4xl leading-[1.05] text-[var(--mono-fg)]">
            {project.name}
          </h3>
        </div>
        <div className="shrink-0 font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--mono-muted)] text-right pt-2">
          {project.year}
          <br />
          {project.category}
        </div>
      </div>
      <p className="mt-4 text-sm md:text-base text-[var(--mono-muted)] leading-relaxed max-w-md">
        {project.desc}
      </p>
    </motion.article>
  );
}

export function Works() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [dragRange, setDragRange] = useState(0);
  const [hovering, setHovering] = useState(false);
  const dragX = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headerParallax = useTransform(scrollYProgress, [0, 1], [40, -40]);
  // Re-computed on every render as dragRange state updates — the transform
  // subscribes to dragX with the latest input range, so the progress bar
  // stays accurate without violating the rules of hooks.
  const progressWidth = useTransform(
    dragX,
    [-Math.max(1, dragRange), 0],
    ["100%", "0%"]
  );

  useLayoutEffect(() => {
    function measure() {
      const container = containerRef.current;
      const strip = stripRef.current;
      if (!container || !strip) return;
      const overflow = strip.scrollWidth - container.clientWidth;
      setDragRange(overflow > 0 ? overflow : 0);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Let wheel events nudge the strip horizontally when the cursor is over it —
  // a classic Locomotive detail. Uses a ref-level delta store so it feels physical.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onWheel = (e: WheelEvent) => {
      if (!hovering) return;
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      const next = Math.max(-dragRange, Math.min(0, dragX.get() - e.deltaY));
      dragX.set(next);
    };
    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, [hovering, dragRange, dragX]);

  return (
    <section
      id="works"
      ref={sectionRef}
      className="relative py-32 md:py-40 border-t border-[var(--mono-faint)] bg-[var(--mono-bg)] overflow-hidden"
    >
      <div className="relative mx-auto max-w-[1600px] px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 flex items-end justify-between flex-wrap gap-10"
          style={{ y: headerParallax }}
        >
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--mono-muted)] mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-[var(--mono-red)]" />
              Selected works · 2022 — 2026
            </div>
            <h2
              className="font-serif font-light tracking-[-0.015em] leading-[0.92] text-[var(--mono-fg)] max-w-4xl"
              style={{ fontSize: "clamp(2.75rem, 7vw, 8rem)" }}
            >
              Four projects.
              <br />
              <span className="italic text-[var(--mono-muted)]">Fifteen years.</span>
            </h2>
          </div>

          <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--mono-muted)] text-right">
            <div>Drag · wheel · or</div>
            <div className="mt-1 text-[var(--mono-fg)]">explore the archive →</div>
          </div>
        </motion.div>
      </div>

      <div
        ref={containerRef}
        className="relative w-full overflow-hidden"
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => setHovering(false)}
      >
        <motion.div
          ref={stripRef}
          drag={dragRange > 0 ? "x" : false}
          dragConstraints={{ left: -dragRange, right: 0 }}
          dragElastic={0.08}
          dragMomentum={true}
          style={{ x: dragX }}
          className="flex gap-8 md:gap-14 px-6 md:px-12 cursor-grab active:cursor-grabbing"
        >
          {works.map((project, i) => (
            <ProjectCard
              key={project.num}
              project={project}
              index={i}
              dragX={dragX}
              dragRange={dragRange}
            />
          ))}
          <div className="shrink-0 w-8 md:w-12" />
        </motion.div>
      </div>

      <div className="mx-auto max-w-[1600px] px-6 md:px-12 mt-16">
        <div className="h-px bg-[var(--mono-faint)] relative overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 h-full bg-[var(--mono-fg)]"
            style={{ width: progressWidth }}
          />
        </div>
      </div>
    </section>
  );
}
