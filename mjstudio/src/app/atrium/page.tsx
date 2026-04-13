import { Navbar } from "./_components/Navbar";
import { Hero } from "./_components/Hero";
import { Portfolio } from "./_components/Portfolio";
import { Thesis } from "./_components/Thesis";
import { CTA } from "./_components/CTA";
import { Footer } from "./_components/Footer";

export default function AtriumPage() {
  return (
    <>
      <Navbar />
      <main className="relative">
        <Hero />
        <Portfolio />
        <Thesis />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
