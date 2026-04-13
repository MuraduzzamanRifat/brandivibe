/**
 * Lightweight website scraper. Plain fetch + regex — no Playwright, no
 * headless browser. Koyeb-friendly and fast enough for scale.
 *
 * For SPA sites where homepage content is client-rendered, we still get
 * the HTML shell, meta tags, and anything in initial payload. That's
 * enough signal for tech detection + personalization.
 *
 * Fetches in parallel: homepage + /about + /team + /pricing + /contact.
 * Any page that 404s is silently skipped.
 */

import { detectTechStack } from "./tech-detect";
import { extractContacts } from "./contact-extract";
import type { ScrapedSite } from "../../brain-storage";

const USER_AGENT =
  "Mozilla/5.0 (compatible; BrandivibeBot/1.0; +https://brandivibe.com/bot)";
const MAX_BYTES = 800_000; // 800KB per page; homepage shouldn't need more
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
    .slice(0, 6000);
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

/**
 * Lightweight "design score" — heuristic, not the DeepResearch score.
 * Just signals we can compute from raw HTML without an LLM call.
 */
function heuristicDesignScore(rawHtml: string, stack: string[]): number {
  let score = 5;
  if (stack.includes("next.js") || stack.includes("react")) score += 2;
  if (stack.includes("webflow")) score += 1;
  if (stack.includes("wordpress") && stack.includes("elementor")) score -= 1;
  if (stack.includes("squarespace") || stack.includes("wix")) score -= 1;
  if (/font-display:\s*swap/i.test(rawHtml)) score += 0.5;
  if (/<picture|srcset=/.test(rawHtml)) score += 0.5;
  if (/GTM-[A-Z0-9]+/.test(rawHtml)) score += 0.5;
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

  // Extract contacts from every fetched page
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
  };
}
