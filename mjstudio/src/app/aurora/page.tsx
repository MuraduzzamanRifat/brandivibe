import { Navbar } from "./_components/Navbar";
import { Hero } from "./_components/Hero";
import { Story } from "./_components/Story";
import { CTA } from "./_components/CTA";
import { Footer } from "./_components/Footer";

export default function AuroraPage() {
  return (
    <>
      <Navbar />
      <main className="relative">
        <Hero />
        <Story />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
