import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getArticles } from "@/lib/articles";
import { WarmNav } from "@/components/warm/WarmNav";
import { WarmFooter } from "@/components/warm/WarmFooter";
import { CtaBand } from "@/components/warm/Cta";

// ISR: articles published in the admin appear live within 5 minutes.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Journal — Conversion-focused web design + AI automation · Brandivibe",
  description:
    "Long-form essays on high-conversion websites, AI automation systems, SEO that compounds, and digital marketing strategy from Brandivibe.",
  alternates: { canonical: "/journal" },
  openGraph: {
    title: "Brandivibe Journal — Conversion + AI automation essays",
    description:
      "Long-form essays on conversion-focused websites, AI automation, SEO, and digital marketing from Brandivibe.",
    url: "/journal",
    type: "website",
  },
};

export default async function JournalIndex() {
  const articles = (await getArticles())
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

  const [featured, ...rest] = articles;

  // Blog + ItemList schema: machine-readable enumeration of every essay for
  // search engines and AI assistants (mirrors the pattern on /services and
  // /case-studies).
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": "https://brandivibe.com/journal#blog",
    name: "The Brandivibe Journal",
    url: "https://brandivibe.com/journal",
    description:
      "Long-form essays on high-conversion websites, AI automation systems, SEO that compounds, and digital marketing strategy.",
    publisher: { "@id": "https://brandivibe.com/#organization" },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articles.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: a.title,
        url: `https://brandivibe.com/journal/${a.slug}`,
      })),
    },
  };

  return (
    <>
      <WarmNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <main>
        {/* ---- header ---- */}
        <section className="px-5 sm:px-8 pt-36 md:pt-40 pb-4">
          <div className="mx-auto max-w-[1200px]">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-strong">
              — The Brandivibe Journal
            </p>
            <h1 className="mt-4 font-display text-4xl md:text-6xl font-semibold tracking-tight text-balance max-w-[16ch]">
              Honest notes on building sites that convert.
            </h1>
            <p className="mt-6 text-lg text-foreground/70 max-w-[52ch] leading-relaxed text-pretty">
              {articles.length > 0
                ? `${articles.length} plain-spoken essay${articles.length === 1 ? "" : "s"} on websites, AI, SEO, and marketing that actually earns its keep — no fluff, no jargon.`
                : "We're writing something good. New essays land here soon."}
            </p>
          </div>
        </section>

        <section className="px-5 sm:px-8 py-12 md:py-16">
          <div className="mx-auto max-w-[1200px]">
            {articles.length === 0 ? (
              <div className="card-soft p-12 text-center">
                <div className="text-5xl mb-4" aria-hidden>
                  ✍️
                </div>
                <p className="text-lg text-foreground/70">
                  Nothing here just yet — pop back soon and there&apos;ll be a good read waiting.
                </p>
              </div>
            ) : (
              <>
                {/* ---- featured article ---- */}
                {featured && (
                  <Link
                    href={`/journal/${featured.slug}`}
                    className="group card-soft lift block overflow-hidden mb-8"
                  >
                    <div className="relative">
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
                        <div className="w-full h-64 md:h-96 bg-gradient-to-br from-primary-soft via-[var(--teal-soft)] to-surface" />
                      )}
                    </div>

                    <div className="p-8 md:p-10">
                      <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary-strong mb-3">
                        Latest ·{" "}
                        {new Date(featured.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        {" · "}
                        {featured.wordCount} words
                      </div>
                      <h2 className="font-display text-2xl md:text-4xl font-semibold tracking-tight mb-3 text-balance">
                        {featured.title}
                      </h2>
                      <p className="text-foreground/70 text-base md:text-lg max-w-2xl leading-relaxed line-clamp-2">
                        {featured.excerpt}
                      </p>
                      <div className="mt-5 inline-flex items-center gap-2 text-primary-strong font-medium group-hover:gap-3 transition-all">
                        Read the essay <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                )}

                {/* ---- article grid ---- */}
                {rest.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rest.map((article) => (
                      <Link
                        key={article.id}
                        href={`/journal/${article.slug}`}
                        className="group card-soft lift block overflow-hidden"
                      >
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
                          <div className="w-full h-44 bg-gradient-to-br from-primary-soft via-[var(--teal-soft)] to-surface" />
                        )}

                        <div className="p-6">
                          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted mb-3">
                            {new Date(article.publishedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                            {" · "}
                            {article.wordCount} words
                          </div>
                          <h2 className="font-display text-lg font-semibold tracking-tight mb-2 line-clamp-2 leading-snug">
                            {article.title}
                          </h2>
                          <p className="text-foreground/65 text-sm line-clamp-3 leading-relaxed">
                            {article.excerpt}
                          </p>
                          <div className="mt-4 inline-flex items-center gap-1.5 text-primary-strong font-medium text-sm group-hover:gap-2.5 transition-all">
                            Read <ArrowRight className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* ---- CTA ---- */}
        <CtaBand
          title="Want a friendly pair of eyes on your homepage?"
          subtitle="We'll take a proper look and tell you, honestly, what's working and what's costing you customers. No sales pitch."
        />
      </main>
      <WarmFooter />
    </>
  );
}
