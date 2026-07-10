import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./orbit.css";

const grotesk = Space_Grotesk({
  variable: "--font-orbit-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  variable: "--font-orbit-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Orbit — Zero emissions. Maximum intent. · Brandivibe",
  description:
    "An electric hypercar brand study by Brandivibe. 1,920 horsepower. 0-100 in 1.94 seconds. 87 units.",
  alternates: { canonical: "/orbit" },
};

export default function OrbitLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${grotesk.variable} ${mono.variable} orbit-root`}
      data-theme="orbit"
    >
      {children}
    </div>
  );
}
