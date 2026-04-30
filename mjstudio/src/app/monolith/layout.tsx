import type { Metadata } from "next";
import { Cormorant_Garamond, Work_Sans } from "next/font/google";
import "./monolith.css";

const serif = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const sans = Work_Sans({
  variable: "--font-mono-workSans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Monolith — Architecture that stands · Brandivibe",
  description:
    "An architecture firm brand study by Brandivibe. Concrete, glass, light, and time.",
  alternates: { canonical: "/monolith" },
};

export default function MonolithLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${serif.variable} ${sans.variable} monolith-root`}
      data-theme="monolith"
    >
      {children}
    </div>
  );
}
