import { WarmNav } from "@/components/warm/WarmNav";
import { HomeWarm } from "@/components/warm/HomeWarm";
import { WarmFooter } from "@/components/warm/WarmFooter";
import {
  getHomepage,
  getPillarCounts,
  getFeaturedTestimonials,
  getHomeHeroImage,
} from "@/lib/content";

// ISR: testimonials and the hero image swapped in the admin appear within 5
// minutes, with no redeploy.
export const revalidate = 300;

export default async function Home() {
  const [content, pillarCounts, testimonials, heroImage] = await Promise.all([
    getHomepage(),
    getPillarCounts(),
    getFeaturedTestimonials(3),
    getHomeHeroImage(),
  ]);
  return (
    <>
      <WarmNav />
      <main>
        <HomeWarm
          content={content}
          pillarCounts={pillarCounts}
          testimonials={testimonials}
          heroImage={heroImage}
        />
      </main>
      <WarmFooter />
    </>
  );
}
