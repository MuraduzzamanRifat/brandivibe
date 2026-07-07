import type { Metadata } from "next";
import { Instrument_Serif, Manrope, JetBrains_Mono } from "next/font/google";
import "./axiom.css";

const serif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jbm = JetBrains_Mono({
  variable: "--font-jbm-axiom",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Axiom — Fintech infrastructure for the next billion · Brandivibe",
  description:
    "Move money. Instantly. Globally. A fintech protocol brand study by Brandivibe.",
  alternates: { canonical: "/axiom" },
};

export default function AxiomLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${serif.variable} ${manrope.variable} ${jbm.variable} axiom-root`}
      data-theme="axiom"
    >
      {children}
    </div>
  );
}
