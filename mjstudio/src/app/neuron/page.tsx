import { Navbar } from "./_components/Navbar";
import { Hero } from "./_components/Hero";
import { Loader } from "./_components/Loader";
import { LogoBar } from "./_components/LogoBar";
import { Features } from "./_components/Features";
import { CodeDemo } from "./_components/CodeDemo";
import { Pricing } from "./_components/Pricing";
import { CTA } from "./_components/CTA";
import { Footer } from "./_components/Footer";
import { LenisProvider } from "./_components/LenisProvider";

export default function NeuronPage() {
  return (
    <LenisProvider>
      <Loader />
      <Navbar />
      <main className="relative neuron-main">
        <Hero />
        <LogoBar />
        <Features />
        <CodeDemo />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </LenisProvider>
  );
}
