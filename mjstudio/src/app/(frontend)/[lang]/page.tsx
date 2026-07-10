import { WarmNav } from "@/components/warm/WarmNav";
import { HomeWarm } from "@/components/warm/HomeWarm";
import { WarmFooter } from "@/components/warm/WarmFooter";
import { getHomepage, getPillarCounts, getFeaturedTestimonials } from "@/lib/content";

// ISR so new testimonials added in the admin appear without a redeploy.
export const revalidate = 300;

export default async function Home() {
  const [content, pillarCounts, testimonials] = await Promise.all([
    getHomepage(),
    getPillarCounts(),
    getFeaturedTestimonials(3),
  ]);
  return (
    <>
      <WarmNav />
      <main>
        <HomeWarm content={content} pillarCounts={pillarCounts} testimonials={testimonials} />
      </main>
      <WarmFooter />
    </>
  );
}
