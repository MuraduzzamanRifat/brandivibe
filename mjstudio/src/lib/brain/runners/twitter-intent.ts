import { loadBrain, saveBrain, logActivity, type TwitterIntentLead } from "@/lib/brain-storage";

/**
 * Runner for the X/Twitter buy-intent scraper tick — extracted verbatim from
 * `src/app/api/brain/twitter-intent/route.ts` (POST handler + its module-level
 * helpers) so it can run under `tsx` inside GitHub Actions without any
 * `next/*` imports.
 *
 * Scrapes X/Twitter for high-intent buy signals via public Nitter mirrors
 * (no API key, no auth). If all Nitter instances fail the runner returns a
 * summary with `errors` populated but does NOT throw.
 *
 * Returns the same `summary` shape the route returned.
 */

const NITTER_INSTANCES = [
  "https://nitter.net",
  "https://nitter.privacydev.net",
  "https://nitter.poast.org",
  "https://nitter.tiekoetter.com",
];

// Buy-intent keywords — match founders ASKING for what we sell
const INTENT_KEYWORDS: Array<{ query: string; label: string }> = [
  { query: '"looking for a web designer"', label: "looking for designer" },
  { query: '"need a website redesign"', label: "need redesign" },
  { query: '"redesigning our website"', label: "redesigning website" },
  { query: '"hiring a brand designer"', label: "hiring brand designer" },
  { query: '"recommend a web designer"', label: "recommend designer" },
  { query: '"website looks dated"', label: "site looks dated" },
  { query: '"new website is live"', label: "new site live (rebrand signal)" },
  { query: '"rebranding"', label: "rebranding" },
];

const MAX_LEADS_PER_RUN = 30;

type NitterItem = {
  link: string;
  title: string;
  creator: string;
  pubDate: string;
};

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

async function searchNitter(query: string): Promise<NitterItem[]> {
  const encoded = encodeURIComponent(query);
  // Try each instance until one works
  for (const base of NITTER_INSTANCES) {
    const url = `${base}/search/rss?f=tweets&q=${encoded}&since=&until=&near=`;
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Brandivibe/1.0 (+https://brandivibe.com)" },
        signal: AbortSignal.timeout(8_000),
        cache: "no-store",
      });
      if (!res.ok) continue;
      const xml = await res.text();
      const items: NitterItem[] = [];
      const itemRe = /<item>([\s\S]*?)<\/item>/g;
      let m: RegExpExecArray | null;
      while ((m = itemRe.exec(xml)) !== null) {
        const block = m[1];
        const link = pick(block, "link");
        const title = pick(block, "title");
        const creator = pick(block, "dc:creator");
        const pubDate = pick(block, "pubDate");
        if (link && title) items.push({ link, title, creator, pubDate });
      }
      return items;
    } catch {
      continue;
    }
  }
  throw new Error("all Nitter instances failed");
}

function handleFromUrl(url: string): string | null {
  // Nitter URLs look like https://nitter.net/handle/status/12345
  const m = url.match(/nitter\.[^/]+\/([^/]+)\/status\//);
  if (m) return m[1];
  // Twitter URLs: https://twitter.com/handle/status/12345
  const m2 = url.match(/(?:twitter|x)\.com\/([^/]+)\/status\//);
  if (m2) return m2[1];
  return null;
}

export async function runTwitterIntentTick() {
  const summary = {
    queriesAttempted: 0,
    queriesSucceeded: 0,
    rawItems: 0,
    new: 0,
    errors: [] as string[],
  };

  const brain = await loadBrain();
  brain.twitterIntent = brain.twitterIntent ?? [];
  const seenUrls = new Set(brain.twitterIntent.map((l) => l.tweetUrl));

  const results = await Promise.allSettled(
    INTENT_KEYWORDS.map(async (kw) => ({ kw, items: await searchNitter(kw.query) }))
  );

  let added = 0;
  for (const r of results) {
    summary.queriesAttempted++;
    if (r.status === "rejected") {
      summary.errors.push(r.reason instanceof Error ? r.reason.message : String(r.reason));
      continue;
    }
    summary.queriesSucceeded++;
    for (const item of r.value.items) {
      summary.rawItems++;
      if (added >= MAX_LEADS_PER_RUN) break;
      // Normalize Nitter URL to the canonical twitter.com form so dedup is stable
      const handle = handleFromUrl(item.link);
      if (!handle) continue;
      const tweetIdMatch = item.link.match(/\/status\/(\d+)/);
      const tweetId = tweetIdMatch?.[1];
      if (!tweetId) continue;
      const canonical = `https://twitter.com/${handle}/status/${tweetId}`;
      if (seenUrls.has(canonical)) continue;
      seenUrls.add(canonical);

      const lead: TwitterIntentLead = {
        id: `tw_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        handle,
        displayName: item.creator || handle,
        tweetText: item.title.slice(0, 600),
        tweetUrl: canonical,
        matchedKeyword: r.value.kw.label,
        capturedAt: new Date().toISOString(),
        status: "new",
      };
      brain.twitterIntent.push(lead);
      added++;
      summary.new++;
    }
  }

  // Cap at 500 to keep brain.json size reasonable
  if (brain.twitterIntent.length > 500) {
    brain.twitterIntent = brain.twitterIntent.slice(-500);
  }

  if (summary.new > 0) {
    await saveBrain(brain);
    await logActivity({
      type: "source-run",
      description: `Twitter intent: ${summary.new} new high-signal leads captured (${summary.queriesSucceeded}/${summary.queriesAttempted} queries OK)`,
    });
  }

  return summary;
}
