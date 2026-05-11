import type { Metadata } from "next";
import { Anton, Sora, Space_Mono } from "next/font/google";
import "./octane.css";

// Anton — heavy condensed display for the artist name + section headers.
const display = Anton({
  variable: "--font-oct-display",
  subsets: ["latin"],
  weight: ["400"],
});

const body = Sora({
  variable: "--font-oct-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const mono = Space_Mono({
  variable: "--font-oct-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Octane Mountain — an interactive campaign destination · Brandivibe",
  description:
    "A WebGL world-building campaign study by Brandivibe — opening sequence, terrain-grid pulse, HUD navigation, near-black + warm tan. An album launch you climb, not a landing page.",
  alternates: { canonical: "/octane" },
  openGraph: {
    title: "Octane Mountain — campaign destination study · Brandivibe",
    description:
      "WebGL terrain-pulse experience for an album launch. Opening sequence, immersive HUD, non-traditional navigation. Built by Brandivibe.",
    url: "/octane",
    type: "website",
  },
};

export default function OctaneLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${display.variable} ${body.variable} ${mono.variable} octane-root grain`}
      data-theme="octane"
    >
      {children}
    </div>
  );
}
