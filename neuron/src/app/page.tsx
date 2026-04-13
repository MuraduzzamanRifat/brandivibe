import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { LogoBar } from "@/components/LogoBar";
import { Features } from "@/components/Features";
import { CodeDemo } from "@/components/CodeDemo";
import { Pricing } from "@/components/Pricing";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative">
        <Hero />
        <LogoBar />
        <Features />
        <CodeDemo />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
