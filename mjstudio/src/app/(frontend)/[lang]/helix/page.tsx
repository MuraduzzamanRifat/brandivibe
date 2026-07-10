import { Navbar } from "./_components/Navbar";
import { Hero } from "./_components/Hero";
import { StatsBar } from "./_components/StatsBar";
import { HowItWorks } from "./_components/HowItWorks";
import { Security } from "./_components/Security";
import { CTA } from "./_components/CTA";
import { Footer } from "./_components/Footer";
import { LenisProvider } from "./_components/LenisProvider";

export default function HelixPage() {
  return (
    <LenisProvider>
      <Navbar />
      <main className="relative helix-main">
        <Hero />
        <StatsBar />
        <HowItWorks />
        <Security />
        <CTA />
      </main>
      <Footer />
    </LenisProvider>
  );
}
