import { Navbar } from "./_components/Navbar";
import { Hero } from "./_components/Hero";
import { Works } from "./_components/Works";
import { Philosophy } from "./_components/Philosophy";
import { CTA } from "./_components/CTA";
import { Footer } from "./_components/Footer";

export default function MonolithPage() {
  return (
    <>
      <Navbar />
      <main className="relative">
        <Hero />
        <Works />
        <Philosophy />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
