import { Navbar } from "./_components/Navbar";
import { Hero } from "./_components/Hero";
import { Ticker } from "./_components/Ticker";
import { Rails } from "./_components/Rails";
import { CTA } from "./_components/CTA";
import { Footer } from "./_components/Footer";

export default function AxiomPage() {
  return (
    <>
      <Navbar />
      <main className="relative">
        <Hero />
        <Ticker />
        <Rails />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
