import { WarmNav } from "@/components/warm/WarmNav";
import { HomeWarm } from "@/components/warm/HomeWarm";
import { WarmFooter } from "@/components/warm/WarmFooter";
import {
  getHomepage,
  getPillarCounts,
  getFeaturedTestimonials,
  getHomeHeroImage,
} from "@/lib/content";
import { availableProblemImages } from "@/lib/problem-images";

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
  // Checked on disk at build time, so a card falls back to its icon rather than
  // shipping a broken <img> for artwork that hasn't landed yet.
  const problemImages = availableProblemImages();

  return (
    <>
      <WarmNav />
      <main id="main-content" tabIndex={-1}>
        <HomeWarm
          content={content}
          pillarCounts={pillarCounts}
          testimonials={testimonials}
          heroImage={heroImage}
          problemImages={problemImages}
        />
      </main>
      <WarmFooter />
    </>
  );
}
