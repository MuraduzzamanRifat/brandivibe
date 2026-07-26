import type { Metadata } from "next";
import { OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Portfolio — 13 Hand-Coded WebGL & Store Demos · Brandivibe",
  description:
    "Browse 13 premium WebGL websites and e-commerce demos hand-coded by Brandivibe — landing pages, full websites, and stores built for high-ticket and growth-stage brands.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "Portfolio — Brandivibe",
    description:
      "13 premium WebGL websites and e-commerce demos, hand-coded for conversion — landing pages, full sites, and stores.",
    url: "/portfolio",
    type: "website",
    images: OG_IMAGE,
  },
};

export default function PortfolioLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
