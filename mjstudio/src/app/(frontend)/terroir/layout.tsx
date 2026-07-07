import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";

const serif = Playfair_Display({
  variable: "--font-terroir-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const sans = Inter({
  variable: "--font-terroir-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Terroir — Single-origin specialty coffee · Brandivibe",
  description:
    "A farmer-first specialty coffee Shopify store. Origin storytelling, seasonal rotation, subscribe-to-box. An ecommerce concept study by Brandivibe.",
  alternates: { canonical: "/terroir" },
  openGraph: {
    title: "Terroir — Single-origin specialty coffee",
    description: "Specialty coffee Shopify storefront concept by Brandivibe.",
    url: "/terroir",
    type: "website",
  },
};

export default function TerroirLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${serif.variable} ${sans.variable}`} data-theme="terroir">
      {children}
    </div>
  );
}
