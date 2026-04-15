import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./uturn.css";
import { UiProviders } from "./_components/UiProviders";

const serif = Cormorant_Garamond({
  variable: "--font-uturn-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const sans = Inter({
  variable: "--font-uturn-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "UTurn Store — Small runs. Slow fashion. · Brandivibe",
  description:
    "A capsule-based atelier releasing limited runs four times a year. An ecommerce brand study by Brandivibe.",
};

export default function UturnLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${serif.variable} ${sans.variable} uturn-root`}
      data-theme="uturn"
    >
      <UiProviders>{children}</UiProviders>
    </div>
  );
}
