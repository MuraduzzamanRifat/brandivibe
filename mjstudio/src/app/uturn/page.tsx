import { Loader } from "./_components/Loader";
import { Navbar } from "./_components/Navbar";
import { Hero } from "./_components/Hero";
import { Categories } from "./_components/Categories";
import { Collections } from "./_components/Collections";
import { Story } from "./_components/Story";
import { SocialProof } from "./_components/SocialProof";
import { Featured } from "./_components/Featured";
import { CTA } from "./_components/CTA";
import { Footer } from "./_components/Footer";

export default function UturnPage() {
  return (
    <>
      <Loader />
      <Navbar />
      <main className="relative">
        <Hero />
        <Categories />
        <Collections />
        <Story />
        <SocialProof />
        <Featured />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
