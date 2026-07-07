import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import "./aurora.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-aurora-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Aurora — Swiss haute horlogerie · Brandivibe",
  description:
    "A luxury watch brand study by Brandivibe. Cinematic, editorial, obsessively detailed.",
  alternates: { canonical: "/aurora" },
};

export default function AuroraLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${playfair.variable} ${manrope.variable} aurora-root`}
      data-theme="aurora"
    >
      {children}
    </div>
  );
}
