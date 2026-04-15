import { Navbar } from "./_components/Navbar";
import { Hero } from "./_components/Hero";
import { Loader } from "./_components/Loader";
import { Works } from "./_components/Works";
import { Philosophy } from "./_components/Philosophy";
import { CTA } from "./_components/CTA";
import { Footer } from "./_components/Footer";
import { LenisProvider } from "./_components/LenisProvider";

export default function MonolithPage() {
  return (
    <LenisProvider>
      <Loader />
      <Navbar />
      <main className="relative">
        <Hero />
        <Works />
        <Philosophy />
        <CTA />
      </main>
      <Footer />
    </LenisProvider>
  );
}
