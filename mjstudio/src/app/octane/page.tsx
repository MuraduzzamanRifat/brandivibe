import { Navbar } from "./_components/Navbar";
import { Hero } from "./_components/Hero";
import { Ascent } from "./_components/Ascent";
import { World } from "./_components/World";
import { Tour } from "./_components/Tour";
import { Drop } from "./_components/Drop";
import { Footer } from "./_components/Footer";

export default function OctanePage() {
  return (
    <>
      <Navbar />
      <main className="relative">
        <Hero />
        <Ascent />
        <World />
        <Tour />
        <Drop />
      </main>
      <Footer />
    </>
  );
}
