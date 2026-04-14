/**
 * Lightweight website scraper. Plain fetch + regex — no Playwright, no
 * headless browser. Koyeb-friendly and fast enough for scale.
 *
 * v2 (after the Vercel false-claims incident): also extracts structural
 * signals (nav, buttons, headings, title, footer, page presence flags)
 * so the deep-research analyzer has real evidence to cite, not just
 * paragraph soup.
 */

import { detectTechStack } from "./tech-detect";
import { extractContacts } from "./contact-extract";
import type { ScrapedSite } from "../../brain-storage";

const USER_AGENT =
  "Mozilla/5.0 (compatible; BrandivibeBot/1.0; +https://brandivibe.com/bot)";
const MAX_BYTES = 1_200_000; // 1.2MB — bigger to capture nav + footer
const TIMEOUT_MS = 12_000;

async function fetchPage(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, Accept: "text/html,*/*" },
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const reader = res.body?.getReader();
    if (!reader) return await res.text();
    const chunks: Uint8Array[] = [];
    let total = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        total += value.byteLength;
        if (total >= MAX_BYTES) {
          reader.cancel().catch(() => {});
          break;
        }
      }
    }
    return new TextDecoder("utf-8").decode(Buffer.concat(chunks.map((c) => Buffer.from(c))));
  } catch {
    return null;
  }
}

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 7000);
}

/**
 * Extract structural data from raw HTML using non-greedy regex.
 * This is the new "evidence layer" — every field here is something the
 * deep-research model can quote from, and the fact-checker can verify
 * against.
 */
function extractStructure(html: string): ScrapedSite["structure"] {
  // Title
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? decodeEntities(stripHtml(titleMatch[1])).slice(0, 200) : "";

  // Meta description
  const metaMatch =
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i) ||
    html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i);
  const metaDescription = metaMatch ? decodeEntities(metaMatch[1]).slice(0, 400) : "";

  // Headings
  const h1 = collectInner(html, "h1");
  const h2 = collectInner(html, "h2").slice(0, 20);
  const h3 = collectInner(html, "h3").slice(0, 30);

  // Anchors — text + href
  const allLinks: Array<{ text: string; href: string }> = [];
  const linkRe = /<a\b([^>]*?)>([\s\S]*?)<\/a>/gi;
  let lm: RegExpExecArray | null;
  while ((lm = linkRe.exec(html)) !== null) {
    const attrs = lm[1];
    const inner = lm[2];
    const hrefMatch = attrs.match(/href=["']([^"']+)["']/i);
    if (!hrefMatch) continue;
    const text = decodeEntities(stripHtml(inner)).trim();
    if (!text || text.length > 80) continue;
    const href = hrefMatch[1];
    allLinks.push({ text, href });
    if (allLinks.length > 200) break;
  }

  // Nav links — anchors inside <nav> OR <header>
  const navLinks: Array<{ text: string; href: string }> = [];
  const navBlocks =
    html.match(/<nav[\s\S]*?<\/nav>/gi) ||
    html.match(/<header[\s\S]*?<\/header>/gi) ||
    [];
  for (const block of navBlocks) {
    const re = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(block)) !== null) {
      const text = decodeEntities(stripHtml(m[2])).trim();
      if (text && text.length < 60) navLinks.push({ text, href: m[1] });
    }
  }

  // Buttons
  const buttons: string[] = [];
  const buttonRe = /<button\b[^>]*>([\s\S]*?)<\/button>/gi;
  let bm: RegExpExecArray | null;
  while ((bm = buttonRe.exec(html)) !== null) {
    const text = decodeEntities(stripHtml(bm[1])).trim();
    if (text && text.length < 60 && text.length > 1) buttons.push(text);
    if (buttons.length > 60) break;
  }
  // role=button on divs/spans
  const roleButtonRe = /<(?:div|span|a)\b[^>]*role=["']button["'][^>]*>([\s\S]*?)<\/(?:div|span|a)>/gi;
  while ((bm = roleButtonRe.exec(html)) !== null) {
    const text = decodeEntities(stripHtml(bm[1])).trim();
    if (text && text.length < 60 && text.length > 1) buttons.push(text);
    if (buttons.length > 80) break;
  }

  // Footer links
  const footerLinks: string[] = [];
  const footerBlock = html.match(/<footer[\s\S]*?<\/footer>/i)?.[0];
  if (footerBlock) {
    const re = /<a\b[^>]*>([\s\S]*?)<\/a>/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(footerBlock)) !== null) {
      const text = decodeEntities(stripHtml(m[1])).trim();
      if (text && text.length < 60) footerLinks.push(text);
    }
  }

  // Boolean presence flags — searched against ALL link text + button text + page text
  const haystack = (
    allLinks.map((l) => `${l.text} ${l.href}`).join(" ") +
    " " +
    buttons.join(" ") +
    " " +
    h1.join(" ") +
    " " +
    h2.join(" ") +
    " " +
    footerLinks.join(" ")
  ).toLowerCase();

  const hasAny = (terms: string[]) => terms.some((t) => haystack.includes(t));

  return {
    title,
    metaDescription,
    h1,
    h2,
    h3,
    navLinks: dedupe(navLinks, (n) => `${n.text}|${n.href}`).slice(0, 25),
    buttons: dedupeSimple(buttons).slice(0, 30),
    footerLinks: dedupeSimple(footerLinks).slice(0, 50),
    hasContact: hasAny(["contact", "talk to sales", "get in touch", "/contact", "contact-sales"]),
    hasPricing: hasAny(["pricing", "/pricing", "plans", "billing"]),
    hasTeam: hasAny(["team", "/team", "about us", "/about", "/people", "leadership"]),
    hasBlog: hasAny(["blog", "/blog", "articles", "writing", "stories"]),
    hasCareers: hasAny(["careers", "jobs", "/careers", "we're hiring", "join us"]),
    hasLogin: hasAny(["log in", "login", "sign in", "/login", "dashboard"]),
  };
}

function collectInner(html: string, tag: string): string[] {
  const out: string[] = [];
  const re = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi");
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const text = decodeEntities(stripHtml(m[1])).trim();
    if (text && text.length < 240) out.push(text);
    if (out.length > 50) break;
  }
  return out;
}

function dedupe<T>(arr: T[], keyFn: (x: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const x of arr) {
    const k = keyFn(x);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(x);
  }
  return out;
}

function dedupeSimple(arr: string[]): string[] {
  return Array.from(new Set(arr));
}

function normalizeDomain(input: string): string {
  return input
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "")
    .toLowerCase()
    .trim();
}

function withScheme(domain: string, path = "/"): string {
  return `https://${domain}${path.startsWith("/") ? path : `/${path}`}`;
}

function heuristicDesignScore(rawHtml: string, stack: string[]): number {
  let score = 5;
  if (stack.includes("next.js") || stack.includes("react")) score += 1;
  if (stack.includes("webflow")) score += 1;
  if (stack.includes("framer")) score += 1;
  if (stack.includes("wordpress") && stack.includes("elementor")) score -= 2;
  if (stack.includes("squarespace") || stack.includes("wix")) score -= 1;
  if (/font-display:\s*swap/i.test(rawHtml)) score += 0.5;
  if (/<picture|srcset=/.test(rawHtml)) score += 0.5;
  if (rawHtml.length < 15_000) score -= 1;
  if (/framer-motion|gsap|threejs|three\.js|@react-three/i.test(rawHtml)) score += 1;
  return Math.max(1, Math.min(10, Math.round(score)));
}

export async function scrapeWebsite(domainOrUrl: string): Promise<ScrapedSite | null> {
  const domain = normalizeDomain(domainOrUrl);
  if (!domain) return null;

  const paths = ["/", "/about", "/team", "/pricing", "/contact"];
  const urls = paths.map((p) => withScheme(domain, p));

  const results = await Promise.all(urls.map(fetchPage));
  const [homepageRaw, aboutRaw, teamRaw, pricingRaw, contactRaw] = results;

  if (!homepageRaw) return null;

  const techStack = detectTechStack(homepageRaw);
  const designScore = heuristicDesignScore(homepageRaw, techStack);
  const structure = extractStructure(homepageRaw);

  // Fact-check the boolean presence flags against actual scrape success
  if (aboutRaw || teamRaw) structure.hasTeam = true;
  if (pricingRaw) structure.hasPricing = true;
  if (contactRaw) structure.hasContact = true;

  const combined = [homepageRaw, aboutRaw, teamRaw, pricingRaw, contactRaw]
    .filter(Boolean)
    .join("\n");
  const { emails, socials } = extractContacts(combined, domain);

  return {
    fetchedAt: new Date().toISOString(),
    homepage: stripHtml(homepageRaw),
    about: aboutRaw ? stripHtml(aboutRaw) : undefined,
    team: teamRaw ? stripHtml(teamRaw) : undefined,
    pricing: pricingRaw ? stripHtml(pricingRaw) : undefined,
    contact: contactRaw ? stripHtml(contactRaw) : undefined,
    techStack,
    designScore,
    foundEmails: emails,
    foundSocials: socials,
    structure,
    rawHomepage: homepageRaw.slice(0, 80_000), // capped — used by fact-checker
  };
}
