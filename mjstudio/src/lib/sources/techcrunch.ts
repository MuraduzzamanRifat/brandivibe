/**
 * TechCrunch RSS source. Fetches the public feed, parses item blocks with
 * regex (the shape is stable), and filters for funding / launch triggers —
 * the signals that matter for our ICP.
 */

export type RawArticle = {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  creator: string;
  source: "techcrunch" | "producthunt" | "hackernews" | "betalist";
};

const FEED_URL = "https://techcrunch.com/feed/";

const TRIGGER_KEYWORDS = [
  "raises",
  "raised",
  "series a",
  "series b",
  "series c",
  "seed round",
  "seed funding",
  "pre-seed",
  "funding",
  "million",
  "launches",
  "launched",
  "unveils",
  "debuts",
  "emerges from stealth",
];

function decode(html: string): string {
  return html
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&nbsp;/g, " ")
    .trim();
}

function pick(xml: string, tag: string): string {
  const m = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`).exec(xml);
  return m ? decode(m[1]) : "";
}

export async function fetchTechCrunchArticles(): Promise<RawArticle[]> {
  const res = await fetch(FEED_URL, {
    headers: { "User-Agent": "Brandivibe/1.0 (+https://brandivibe.com)" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`TechCrunch RSS ${res.status}`);
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
    const creator = pick(block, "dc:creator");
    if (!title || !link) continue;
    items.push({ title, description, link, pubDate, creator, source: "techcrunch" });
  }

  const lowered = (s: string) => s.toLowerCase();
  return items.filter((a) => {
    const hay = lowered(`${a.title} ${a.description}`);
    return TRIGGER_KEYWORDS.some((k) => hay.includes(k));
  });
}
