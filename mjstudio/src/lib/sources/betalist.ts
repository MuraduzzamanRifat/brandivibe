import type { RawArticle } from "./techcrunch";

/**
 * BetaList RSS source. Curated early-stage startup directory — exactly the
 * founders whose sites are most likely to be a bare template crying out for
 * a rebuild. Free public RSS.
 */

const FEED_URL = "https://betalist.com/feed";

function decode(html: string): string {
  return html
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function pick(xml: string, tag: string): string {
  const m = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`).exec(xml);
  return m ? decode(m[1]) : "";
}

export async function fetchBetaListArticles(): Promise<RawArticle[]> {
  const res = await fetch(FEED_URL, {
    headers: { "User-Agent": "Brandivibe/1.0 (+https://brandivibe.com)" },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`BetaList RSS ${res.status}`);
  const xml = await res.text();

  const items: RawArticle[] = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let m: RegExpExecArray | null;
  while ((m = itemRe.exec(xml)) !== null) {
    const block = m[1];
    const title = pick(block, "title");
    const description = pick(block, "description");
    const link = pick(block, "link");
    const pubDate = pick(block, "pubDate");
    if (!title || !link) continue;
    items.push({ title, description, link, pubDate, creator: "", source: "betalist" });
  }
  return items;
}
