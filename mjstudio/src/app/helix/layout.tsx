import type { Metadata } from "next";
import { Orbitron, Exo_2 } from "next/font/google";
import "./helix.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const exo2 = Exo_2({
  variable: "--font-exo2",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Helix — Institutional-grade liquid staking for Ethereum · Brandivibe",
  description:
    "Stake ETH. Earn real yield. Stay liquid. Non-custodial liquid staking protocol — a brand study by Brandivibe.",
};

export default function HelixLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${orbitron.variable} ${exo2.variable} helix-root`}
      data-theme="helix"
    >
      {children}
    </div>
  );
}
