import type { Metadata } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import "./pulse.css";

const serif = DM_Serif_Display({
  variable: "--font-pulse-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-pulse-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Pulse — The quiet revolution in telehealth · Brandivibe",
  description:
    "Better care. Delivered calmly. A telehealth brand study by Brandivibe.",
};

export default function PulseLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${serif.variable} ${inter.variable} pulse-root`}
      data-theme="pulse"
    >
      {children}
    </div>
  );
}
