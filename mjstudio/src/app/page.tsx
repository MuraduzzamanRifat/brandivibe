import { Navbar } from "@/components/Navbar";
import { Loader } from "@/components/Loader";
import { KineticHero } from "@/components/KineticHero";
import { TrustStrip } from "@/components/TrustStrip";
import { Manifesto } from "@/components/Manifesto";
import { FeaturedWork } from "@/components/FeaturedWork";
import { Services } from "@/components/Services";
import { Intelligence } from "@/components/Intelligence";
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
        <TrustStrip />
        <Manifesto />
        <FeaturedWork />
        <Services />
        <Intelligence />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
