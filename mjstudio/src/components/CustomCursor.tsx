"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState<"default" | "link" | "text">("default");
  const [label, setLabel] = useState("");
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { damping: 25, stiffness: 250, mass: 0.6 });
  const springY = useSpring(y, { damping: 25, stiffness: 250, mass: 0.6 });
  const raf = useRef<number | null>(null);
  const latest = useRef({ mx: -100, my: -100 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (reduced || isTouch) return;

    setVisible(true);

    const onMove = (e: MouseEvent) => {
      latest.current.mx = e.clientX;
      latest.current.my = e.clientY;
      if (raf.current == null) {
        raf.current = requestAnimationFrame(() => {
          x.set(latest.current.mx);
          y.set(latest.current.my);
          raf.current = null;
        });
      }
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      const link = el.closest("a, button, [data-cursor]");
      if (link) {
        const ds = (link as HTMLElement).dataset.cursor;
        if (ds === "text") {
          setVariant("text");
          setLabel((link as HTMLElement).dataset.cursorLabel || "VIEW");
        } else {
          setVariant("link");
          setLabel("");
        }
      } else {
        setVariant("default");
        setLabel("");
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [x, y]);

  if (!visible) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] mix-blend-difference"
        style={{ x: springX, y: springY }}
      >
        <motion.div
          className="rounded-full bg-white"
          animate={{
            width: variant === "text" ? 80 : variant === "link" ? 40 : 12,
            height: variant === "text" ? 80 : variant === "link" ? 40 : 12,
            x: variant === "text" ? -40 : variant === "link" ? -20 : -6,
            y: variant === "text" ? -40 : variant === "link" ? -20 : -6,
          }}
          transition={{ type: "spring", damping: 22, stiffness: 260 }}
        />
      </motion.div>
      {label && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed top-0 left-0 z-[101] font-mono text-[10px] font-semibold tracking-widest text-black"
          style={{ x: springX, y: springY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div style={{ transform: "translate(-50%, -50%)" }}>{label}</div>
        </motion.div>
      )}
    </>
  );
}
