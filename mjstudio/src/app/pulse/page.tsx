import { Navbar } from "./_components/Navbar";
import { Hero } from "./_components/Hero";
import { Features } from "./_components/Features";
import { Quote } from "./_components/Quote";
import { CTA } from "./_components/CTA";
import { Footer } from "./_components/Footer";

export default function PulsePage() {
  return (
    <>
      <Navbar />
      <main className="relative">
        <Hero />
        <Features />
        <Quote />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
