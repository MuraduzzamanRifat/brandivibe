import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

const serif = Cormorant_Garamond({
  variable: "--font-kindred-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const sans = Inter({
  variable: "--font-kindred-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Kindred — Ingredient-first skincare · Brandivibe",
  description:
    "A ritual-based luxury skincare Shopify store — ingredient-forward storytelling, subscription-first funnel. An ecommerce concept study by Brandivibe.",
  alternates: { canonical: "/kindred" },
  openGraph: {
    title: "Kindred — Ingredient-first skincare",
    description: "Luxury skincare Shopify storefront concept by Brandivibe.",
    url: "/kindred",
    type: "website",
  },
};

export default function KindredLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${serif.variable} ${sans.variable}`} data-theme="kindred">
      {children}
    </div>
  );
}
