import type { Metadata } from "next";
import { Hero } from "./_components/Hero";
import { Origins } from "./_components/Origins";
import { Subscribe } from "./_components/Subscribe";
import { Footer } from "./_components/Footer";
import "./terroir.css";

export const metadata: Metadata = {
  title: "Terroir — Single-origin specialty coffee",
  description:
    "A farmer-first specialty coffee Shopify store. Origin storytelling, seasonal rotation, subscribe-to-box.",
};

export default function TerroirPage() {
  return (
    <main className="terroir min-h-screen">
      <Hero />
      <Origins />
      <Subscribe />
      <Footer />
    </main>
  );
}
