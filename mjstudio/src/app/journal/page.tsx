import type { Metadata } from "next";
import Link from "next/link";
import { loadBrain } from "@/lib/brain-storage";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Journal — Website conversion & design · Brandivibe",
  description:
    "Essays on high-conversion websites for Seed–Series B founders. Design scores, real teardowns, and the thinking behind elite web experiences.",
  alternates: { canonical: "/journal" },
  openGraph: {
    title: "Brandivibe Journal — Website conversion & design",
    description:
      "Real analysis on what makes founder websites convert. New piece every day.",
    url: "/journal",
    type: "website",
  },
};

export default async function JournalIndex() {
  const brain = await loadBrain();
  const articles = (brain.articles ?? [])
    .slice()
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

  const [featured, ...rest] = articles;

  return (
    <main className="min-h-screen bg-[#08080a] text-white">
      {/* Header */}
      <header className="border-b border-white/5 px-6 md:px-10 py-8">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors"
          >
            ← Brandivibe
          </Link>
          <a
            href="/feed.xml"
            className="font-mono text-xs uppercase tracking-[0.3em] text-white/40 hover:text-[#84e1ff] transition-colors"
          >
            RSS
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24">
        {/* Page title */}
        <div className="mb-16 md:mb-20">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[#84e1ff] mb-4">
            — The Brandivibe Journal
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6 text-balance">
            Notes on elite<br className="hidden md:block" /> website conversion
          </h1>
          <p className="text-white/50 text-lg max-w-2xl">
            {articles.length > 0
              ? `${articles.length} article${articles.length === 1 ? "" : "s"} — written and published by the Brandivibe brain every day.`
              : "New essays coming daily. The brain is warming up."}
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="rounded-3xl border border-white/10 p-12 text-center text-white/40">
            <div className="text-5xl mb-4">✍</div>
            <p className="text-lg">No articles yet. Check back soon.</p>
          </div>
        ) : (
          <>
            {/* Featured article — full width */}
            {featured && (
              <Link href={`/journal/${featured.slug}`} className="group block mb-12">
                <div className="relative rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-colors">
                  {/* Hero image or gradient placeholder */}
                  {featured.heroImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={
                        featured.heroImage.startsWith("http")
                          ? featured.heroImage
                          : `https://brandivibe.com${featured.heroImage}`
                      }
                      alt={featured.title}
                      className="w-full h-64 md:h-96 object-cover group-hover:scale-[1.02] transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-64 md:h-96 bg-gradient-to-br from-[#84e1ff]/10 via-[#a78bfa]/10 to-transparent" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/40 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#84e1ff] mb-3">
                      Latest · {new Date(featured.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      {" · "}{featured.wordCount} words
                    </div>
                    <h2 className="text-2xl md:text-4xl font-semibold tracking-tight mb-3 text-balance">
                      {featured.title}
                    </h2>
                    <p className="text-white/60 text-base md:text-lg max-w-2xl line-clamp-2">
                      {featured.excerpt}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 text-[#84e1ff] font-mono text-xs uppercase tracking-[0.25em] group-hover:gap-3 transition-all">
                      Read article <span>→</span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Rest of articles — card grid */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((article) => (
                  <Link
                    key={article.id}
                    href={`/journal/${article.slug}`}
                    className="group block rounded-2xl border border-white/10 hover:border-white/20 transition-colors overflow-hidden bg-white/[0.015]"
                  >
                    {/* Card image */}
                    {article.heroImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={
                          article.heroImage.startsWith("http")
                            ? article.heroImage
                            : `https://brandivibe.com${article.heroImage}`
                        }
                        alt={article.title}
                        className="w-full h-44 object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-44 bg-gradient-to-br from-[#84e1ff]/8 via-[#a78bfa]/8 to-transparent" />
                    )}

                    <div className="p-6">
                      <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/40 mb-3">
                        {new Date(article.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                        {" · "}{article.wordCount} words
                      </div>
                      <h2 className="text-lg font-semibold tracking-tight mb-2 line-clamp-2 leading-snug">
                        {article.title}
                      </h2>
                      <p className="text-white/50 text-sm line-clamp-3 leading-relaxed">
                        {article.excerpt}
                      </p>
                      <div className="mt-4 font-mono text-[9px] uppercase tracking-[0.25em] text-[#84e1ff] group-hover:tracking-[0.35em] transition-all">
                        Read →
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {/* CTA */}
        <div className="mt-20 pt-12 border-t border-white/5 text-center">
          <p className="text-white/40 text-sm mb-6">
            Want your homepage reviewed by the same brain?
          </p>
          <Link
            href="/audit"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-all hover:scale-[1.02] text-sm"
          >
            Get a free audit →
          </Link>
        </div>
      </div>
    </main>
  );
}
