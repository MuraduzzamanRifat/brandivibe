import { Navbar } from "./_components/Navbar";
import { Hero } from "./_components/Hero";
import { Loader } from "./_components/Loader";
import { Features } from "./_components/Features";
import { Quote } from "./_components/Quote";
import { CTA } from "./_components/CTA";
import { Footer } from "./_components/Footer";

/**
 * Paper-stack layering: each section becomes a sticky sheet with its own
 * z-index, so scrolling slides the next sheet up OVER the previous one
 * instead of pushing it offscreen. Four layers in total to match the hero's
 * "four sheets" concept.
 */
export default function PulsePage() {
  return (
    <>
      <Loader />
      <Navbar />
      <main className="relative">
        <div className="pulse-sheet pulse-sheet-1">
          <Hero />
        </div>
        <div className="pulse-sheet pulse-sheet-2">
          <Features />
        </div>
        <div className="pulse-sheet pulse-sheet-3">
          <Quote />
        </div>
        <div className="pulse-sheet pulse-sheet-4">
          <CTA />
        </div>
      </main>
      <Footer />
    </>
  );
}
