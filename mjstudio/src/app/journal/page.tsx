import type { Metadata } from "next";
import Link from "next/link";
import { loadBrain } from "@/lib/brain-storage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Journal — Elite website conversion notes · Brandivibe",
  description:
    "Fresh essays on high-conversion websites for Seed–Series B founders. New piece every day, written and shipped by the Brandivibe AI brain.",
  alternates: { canonical: "/journal" },
  openGraph: {
    title: "Brandivibe Journal",
    description: "Elite website conversion notes for ambitious founders.",
    url: "/journal",
    type: "website",
  },
};

export default async function JournalIndex() {
  const brain = await loadBrain();
  const articles = (brain.articles ?? []).slice().sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <main className="min-h-screen px-6 md:px-10 py-24 bg-[#08080a] text-white">
      <div className="mx-auto max-w-4xl">
        <header className="mb-16">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[#84e1ff] mb-4">
            — The Brandivibe Journal
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-4">
            Notes on elite website conversion
          </h1>
          <p className="text-white/60 max-w-2xl text-lg">
            A new essay every day. Written and published by the Brandivibe brain
            so the real studio stays focused on shipping.
          </p>
        </header>

        {articles.length === 0 ? (
          <div className="rounded-3xl border border-white/10 p-10 text-white/50">
            No articles published yet. The brain is warming up.
          </div>
        ) : (
          <ul className="space-y-6">
            {articles.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/journal/${a.slug}`}
                  className="block rounded-3xl border border-white/10 hover:border-white/30 transition-colors p-6 md:p-8"
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 mb-3">
                    {new Date(a.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    {" · "}
                    {a.wordCount} words · SEO {a.seoScore}/100
                  </div>
                  <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
                    {a.title}
                  </h2>
                  <p className="text-white/60 text-base">{a.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <footer className="mt-20 pt-8 border-t border-white/10 text-white/40 text-sm flex items-center justify-between">
          <Link href="/" className="hover:text-white">← Brandivibe home</Link>
          <a href="/feed.xml" className="hover:text-white">RSS</a>
        </footer>
      </div>
    </main>
  );
}
