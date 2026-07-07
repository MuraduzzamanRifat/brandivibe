import type { Metadata } from "next";
import { Hero } from "./_components/Hero";
import { Products } from "./_components/Products";
import { Story } from "./_components/Story";
import { Footer } from "./_components/Footer";
import "./kindred.css";

export const metadata: Metadata = {
  title: "Kindred — Ingredient-first skincare",
  description:
    "A ritual-based luxury skincare Shopify store — ingredient-forward storytelling, subscription-first funnel.",
};

export default function KindredPage() {
  return (
    <main className="kindred min-h-screen">
      <Hero />
      <Products />
      <Story />
      <Footer />
    </main>
  );
}
