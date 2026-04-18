import { Navbar } from "@/components/Navbar";
import { Loader } from "@/components/Loader";
import { KineticHero } from "@/components/KineticHero";
import { Manifesto } from "@/components/Manifesto";
import { FeaturedWork } from "@/components/FeaturedWork";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Loader />
      <Navbar />
      <main className="relative">
        <KineticHero />
        <Manifesto />
        <FeaturedWork />
        <Services />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
