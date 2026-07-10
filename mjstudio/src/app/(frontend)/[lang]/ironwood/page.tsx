import type { Metadata } from "next";
import { Hero } from "./_components/Hero";
import { Drop } from "./_components/Drop";
import { Lookbook } from "./_components/Lookbook";
import { Footer } from "./_components/Footer";
import "./ironwood.css";

export const metadata: Metadata = {
  title: "Ironwood — Drop 07 · Spring Chapter",
  description:
    "A drop-model streetwear Shopify store. Limited-run releases, waitlist mechanics, editorial lookbook.",
};

export default function IronwoodPage() {
  return (
    <main className="ironwood min-h-screen">
      <Hero />
      <Drop />
      <Lookbook />
      <Footer />
    </main>
  );
}
