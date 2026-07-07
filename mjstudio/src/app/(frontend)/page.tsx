import { WarmNav } from "@/components/warm/WarmNav";
import { HomeWarm } from "@/components/warm/HomeWarm";
import { WarmFooter } from "@/components/warm/WarmFooter";
import { getHomepage, getPillarCounts } from "@/lib/content";

export default async function Home() {
  const [content, pillarCounts] = await Promise.all([getHomepage(), getPillarCounts()]);
  return (
    <>
      <WarmNav />
      <main>
        <HomeWarm content={content} pillarCounts={pillarCounts} />
      </main>
      <WarmFooter />
    </>
  );
}
