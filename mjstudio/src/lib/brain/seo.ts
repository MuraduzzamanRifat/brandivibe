/**
 * Pure-function SEO scorer. No I/O, no model calls — just heuristics the
 * planner can use to self-correct before shipping an article.
 *
 * Scoring rubric (weights in parens, total = 100):
 *   title has keyword       (10)
 *   title 40-65 chars        (5)
 *   H1 present + matches      (5)
 *   keyword in first 100 words(10)
 *   keyword density 0.8-2.5% (15)
 *   >= 3 H2 headings          (10)
 *   at least one H3           (5)
 *   word count 1200-2500     (15)
 *   >= 3 internal links       (10)
 *   >= 2 external links       (5)
 *   meta excerpt 120-160 ch   (10)
 */

export type SeoInput = {
  title: string;
  excerpt: string;
  body: string;
  primaryKeyword: string;
};

export type SeoReport = {
  score: number;
  breakdown: Record<string, { points: number; max: number; hint?: string }>;
  fixes: string[];
};

function countKeyword(text: string, keyword: string): number {
  if (!keyword) return 0;
  const re = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
  return (text.match(re) || []).length;
}

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export function scoreSEO(input: SeoInput): SeoReport {
  const { title, excerpt, body, primaryKeyword } = input;
  const kw = primaryKeyword.toLowerCase();
  const bodyLower = body.toLowerCase();
  const b: SeoReport["breakdown"] = {};
  const fixes: string[] = [];

  // 1. Title has keyword (10)
  const titleHasKw = title.toLowerCase().includes(kw);
  b.titleKeyword = { points: titleHasKw ? 10 : 0, max: 10 };
  if (!titleHasKw) fixes.push(`Put "${primaryKeyword}" in the title.`);

  // 2. Title 40-65 chars (5)
  const tl = title.length;
  b.titleLength = { points: tl >= 40 && tl <= 65 ? 5 : 0, max: 5 };
  if (tl < 40) fixes.push(`Title is ${tl} chars, aim for 40-65.`);
  if (tl > 65) fixes.push(`Title is ${tl} chars, trim to ≤65.`);

  // 3. H1 present (5) — MDX h1 is usually frontmatter-driven, check for # heading
  const hasH1 = /^#\s+/m.test(body);
  b.h1 = { points: hasH1 ? 5 : 0, max: 5 };
  if (!hasH1) fixes.push("Add a top-level `# Heading` in the body.");

  // 4. Keyword in first 100 words (10)
  const first100 = bodyLower.split(/\s+/).slice(0, 100).join(" ");
  const earlyKw = first100.includes(kw);
  b.earlyKeyword = { points: earlyKw ? 10 : 0, max: 10 };
  if (!earlyKw) fixes.push(`Mention "${primaryKeyword}" in the first 100 words.`);

  // 5. Keyword density 0.8-2.5% (15)
  const wc = wordCount(body);
  const kwCount = countKeyword(bodyLower, kw);
  const density = wc > 0 ? (kwCount / wc) * 100 : 0;
  let densityPts = 0;
  if (density >= 0.8 && density <= 2.5) densityPts = 15;
  else if (density >= 0.5 && density <= 3.5) densityPts = 8;
  b.density = {
    points: densityPts,
    max: 15,
    hint: `density=${density.toFixed(2)}% (${kwCount}/${wc})`,
  };
  if (density < 0.8) fixes.push(`Keyword density ${density.toFixed(1)}%, raise to 1-2%.`);
  if (density > 2.5) fixes.push(`Keyword density ${density.toFixed(1)}%, lower to 1-2%.`);

  // 6. >=3 H2 headings (10)
  const h2Count = (body.match(/^##\s+/gm) || []).length;
  b.h2 = { points: h2Count >= 3 ? 10 : Math.floor((h2Count / 3) * 10), max: 10 };
  if (h2Count < 3) fixes.push(`Only ${h2Count} H2 sections, add more for scanability.`);

  // 7. >=1 H3 (5)
  const h3Count = (body.match(/^###\s+/gm) || []).length;
  b.h3 = { points: h3Count >= 1 ? 5 : 0, max: 5 };

  // 8. Word count 1200-2500 (15)
  let wcPts = 0;
  if (wc >= 1200 && wc <= 2500) wcPts = 15;
  else if (wc >= 900 && wc <= 3000) wcPts = 8;
  b.wordCount = { points: wcPts, max: 15, hint: `${wc} words` };
  if (wc < 1200) fixes.push(`Body is ${wc} words, expand to 1500+.`);

  // 9. >=3 internal links (10) — anything starting with / or brandivibe.com
  const internalLinks = (body.match(/\]\((\/|https?:\/\/brandivibe\.com)/g) || []).length;
  b.internal = { points: internalLinks >= 3 ? 10 : Math.floor((internalLinks / 3) * 10), max: 10 };
  if (internalLinks < 3) fixes.push(`Only ${internalLinks} internal links, add more (link to demos).`);

  // 10. >=2 external links (5)
  const allLinks = (body.match(/\]\(https?:\/\/[^)]+\)/g) || []).length;
  const externalLinks = allLinks - (body.match(/\]\(https?:\/\/brandivibe\.com/g) || []).length;
  b.external = { points: externalLinks >= 2 ? 5 : 0, max: 5 };

  // 11. Excerpt 120-160 ch (10)
  const el = excerpt.length;
  let exPts = 0;
  if (el >= 120 && el <= 160) exPts = 10;
  else if (el >= 100 && el <= 180) exPts = 5;
  b.excerpt = { points: exPts, max: 10, hint: `${el} chars` };
  if (el < 120) fixes.push(`Excerpt is ${el} chars, expand to 120-160.`);
  if (el > 160) fixes.push(`Excerpt is ${el} chars, trim to ≤160.`);

  const score = Object.values(b).reduce((sum, v) => sum + v.points, 0);
  return { score, breakdown: b, fixes };
}
