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
  title: "Octane — VYCE · An interactive campaign destination · Brandivibe",
  description:
    "A WebGL album-campaign experience by Brandivibe. VYCE — OCTANE. Climb the mountain. Unlock the record. Out 06.21.26.",
  alternates: { canonical: "/octane" },
  openGraph: {
    title: "Octane — VYCE · Campaign destination · Brandivibe",
    description:
      "WebGL mountain world-building for an album launch. Built by Brandivibe.",
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
