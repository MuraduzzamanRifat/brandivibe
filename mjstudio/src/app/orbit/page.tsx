import { Navbar } from "./_components/Navbar";
import { Hero } from "./_components/Hero";
import { Specs } from "./_components/Specs";
import { CTA } from "./_components/CTA";
import { Footer } from "./_components/Footer";

export default function OrbitPage() {
  return (
    <>
      <Navbar />
      <main className="relative">
        <Hero />
        <Specs />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
