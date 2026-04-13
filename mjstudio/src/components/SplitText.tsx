"use client";

import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

type Props = {
  children: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
};

export function SplitText({
  children,
  className = "",
  delay = 0,
  stagger = 0.025,
  as = "span",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const words = children.split(" ");

  const Container = motion[as] as typeof motion.span;

  return (
    <Container ref={ref as React.Ref<HTMLDivElement>} className={`inline-block ${className}`}>
      {words.map((word, wi) => (
        <span
          key={wi}
          className="inline-block overflow-hidden align-bottom"
          style={{ marginRight: "0.25em" }}
        >
          <span className="inline-block">
            {Array.from(word).map((char, ci) => (
              <motion.span
                key={ci}
                className="inline-block"
                initial={{ y: "110%" }}
                animate={inView ? { y: 0 } : { y: "110%" }}
                transition={{
                  duration: 0.7,
                  delay: delay + (wi * 6 + ci) * stagger,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        </span>
      ))}
    </Container>
  );
}

export function RevealLine({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "100%" }}
        animate={inView ? { y: 0 } : { y: "100%" }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
