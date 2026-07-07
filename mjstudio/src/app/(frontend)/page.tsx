import { WarmNav } from "@/components/warm/WarmNav";
import { HomeWarm } from "@/components/warm/HomeWarm";
import { WarmFooter } from "@/components/warm/WarmFooter";

export default function Home() {
  return (
    <>
      <WarmNav />
      <main>
        <HomeWarm />
      </main>
      <WarmFooter />
    </>
  );
}
