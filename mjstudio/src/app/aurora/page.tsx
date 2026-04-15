import { Navbar } from "./_components/Navbar";
import { Hero } from "./_components/Hero";
import { Loader } from "./_components/Loader";
import { Story } from "./_components/Story";
import { CTA } from "./_components/CTA";
import { Footer } from "./_components/Footer";

export default function AuroraPage() {
  return (
    <>
      <Loader />
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
