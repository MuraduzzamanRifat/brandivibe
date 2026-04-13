import { Feed } from "feed";
import { loadBrain } from "@/lib/brain-storage";

export const dynamic = "force-dynamic";

export async function GET() {
  const brain = await loadBrain();
  const articles = (brain.articles ?? []).slice(0, 50);

  const feed = new Feed({
    title: "Brandivibe Journal",
    description: "Elite website conversion notes for ambitious founders.",
    id: "https://brandivibe.com/journal",
    link: "https://brandivibe.com/journal",
    language: "en",
    favicon: "https://brandivibe.com/favicon.ico",
    copyright: `© ${new Date().getFullYear()} Brandivibe`,
    author: { name: "Brandivibe", link: "https://brandivibe.com" },
    feedLinks: { rss2: "https://brandivibe.com/feed.xml" },
  });

  for (const a of articles) {
    feed.addItem({
      title: a.title,
      id: `https://brandivibe.com/journal/${a.slug}`,
      link: `https://brandivibe.com/journal/${a.slug}`,
      description: a.excerpt,
      date: new Date(a.publishedAt),
      image: a.heroImage ? `https://brandivibe.com${a.heroImage}` : undefined,
    });
  }

  return new Response(feed.rss2(), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
