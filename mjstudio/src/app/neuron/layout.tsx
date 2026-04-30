import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./neuron.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jbm = JetBrains_Mono({
  variable: "--font-mono-neuron",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Neuron — Ship AI agents in minutes · Brandivibe",
  description:
    "The developer-first platform for production-grade AI agents — a brand study by Brandivibe.",
  alternates: { canonical: "/neuron" },
};

export default function NeuronLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${jakarta.variable} ${jbm.variable} neuron-root`}
      data-theme="neuron"
    >
      {children}
    </div>
  );
}
