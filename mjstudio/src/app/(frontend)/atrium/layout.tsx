import type { Metadata } from "next";
import { Libre_Caslon_Text, Inter } from "next/font/google";
import "./atrium.css";

const caslon = Libre_Caslon_Text({
  variable: "--font-caslon",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-atrium-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Atrium — Capital for founders who think in decades · Brandivibe",
  description:
    "A venture capital firm brand study by Brandivibe. Early-stage capital for long-horizon companies.",
  alternates: { canonical: "/atrium" },
};

export default function AtriumLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${caslon.variable} ${inter.variable} atrium-root`}
      data-theme="atrium"
    >
      {children}
    </div>
  );
}
