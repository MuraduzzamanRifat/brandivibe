import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio — 12 Premium Sites & Shopify Storefronts · Brandivibe",
  description:
    "Browse 12 premium WebGL websites and Shopify storefronts hand-coded by Brandivibe — landing pages, full websites, and ecommerce stores built for high-ticket and growth-stage brands.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "Portfolio — Brandivibe",
    description:
      "12 premium WebGL websites and Shopify storefronts. Landing pages, full sites, ecommerce — all hand-coded for conversion.",
    url: "/portfolio",
    type: "website",
  },
};

export default function PortfolioLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
