import { NextResponse } from "next/server";
import { scrapeWebsite } from "@/lib/brain/scraper/website";
import { researchProspect } from "@/lib/brain/deep-research";
import { sendTransactional } from "@/lib/brain/transactional";
import { renderAuditReportHtml } from "@/lib/brain/email-templates/audit-report";
import { checkIcpFilter } from "@/lib/brain/icp-filter";
import {
  upsertProspect,
  logActivity,
  type Prospect,
  type Industry,
} from "@/lib/brain-storage";

/**
 * POST /api/audit/run
 * Body: { url: string, email: string }
 *
 * The Founder Homepage Audit — Brandivibe's primary inbound lead magnet.
 *
 * 1. Rate-limit per IP (10/hour) to cap credit burn from bad actors
 * 2. Scrape the URL with the same pipeline the outbound brain uses
 * 3. Run GPT-4o deep research grounded on marketing knowledge base
 * 4. Save a Prospect record with source: "audit"
 * 5. Send the report via Resend transactional email
 * 6. Return the report inline for on-page rendering
 */

export const maxDuration = 90;
export const dynamic = "force-dynamic";

// Per-IP rate limit: 10 audits / hour. In-memory, resets on container restart.
const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT = 10;
const ipBuckets = new Map<string, number[]>();

function rateLimit(ip: string): { ok: boolean; retryInSec: number } {
  const now = Date.now();
  const cutoff = now - RATE_WINDOW_MS;
  const bucket = (ipBuckets.get(ip) ?? []).filter((t) => t > cutoff);
  if (bucket.length >= RATE_LIMIT) {
    const retryInSec = Math.ceil((bucket[0] + RATE_WINDOW_MS - now) / 1000);
    return { ok: false, retryInSec };
  }
  bucket.push(now);
  ipBuckets.set(ip, bucket);
  return { ok: true, retryInSec: 0 };
}

function ipOf(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

function normalizeUrl(input: string): string | null {
  let u = input.trim();
  if (!u) return null;
  if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
  try {
    const parsed = new URL(u);
    if (!/\./.test(parsed.hostname)) return null;
    return `${parsed.protocol}//${parsed.hostname}`;
  } catch {
    return null;
  }
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function isValidEmail(e: string): boolean {
  return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(e.trim());
}

function guessIndustry(techStack: string[], homepage: string): Industry {
  const t = homepage.toLowerCase();
  if (techStack.includes("shopify") || /\bproduct|cart|checkout\b/.test(t)) return "saas";
  if (/\bcrypto|defi|web3|token|wallet|nft\b/.test(t)) return "crypto";
  if (/\bfintech|bank|finance|payment|lending\b/.test(t)) return "fintech";
  if (/\bai|model|llm|gpt|agent|ml\b/.test(t)) return "ai";
  if (/\bhealth|medical|patient|clinic|pharma\b/.test(t)) return "healthcare";
  if (/\bluxury|premium|couture|jewelry|watch\b/.test(t)) return "luxury";
  if (/\bev|electric vehicle|charging|tesla\b/.test(t)) return "ev";
  if (/\barchitect|build|construction|design studio\b/.test(t)) return "architecture";
  if (/\bvc|venture|fund|investor|lp\b/.test(t)) return "vc";
  return "saas";
}

function tierFromScore(score: number): "A" | "B" | "C" | "D" {
  if (score <= 4) return "A";
  if (score <= 6) return "B";
  if (score <= 8) return "C";
  return "D";
}

function formatReport(company: string, domain: string, research: {
  specificObservation: string;
  realWeaknesses: string[];
  observation1: string;
  observation2: string;
  observation3: string;
  fix1OneLine: string;
  fix2OneLine: string;
  fix3OneLine: string;
  topPriorityObservation: string;
  techStackSummary: string;
  currentDesignScore: number;
  industryName: string;
  quantifiedBleed?: string;
  personalClose?: string;
}): string {
  return `
"${research.specificObservation}"

${research.quantifiedBleed ?? ""}

— Homepage audit for ${company} (${domain})
Score: ${research.currentDesignScore}/10  ·  ${research.industryName}  ·  ${research.techStackSummary}

===============================================

THREE THINGS WORTH FIXING

1. ${research.observation1}
   Fix: ${research.fix1OneLine}

2. ${research.observation2}
   Fix: ${research.fix2OneLine}

3. ${research.observation3}
   Fix: ${research.fix3OneLine}

TOP PRIORITY: ${research.topPriorityObservation}

===============================================

REPLY "LOOM" AND I'LL RECORD A 5-MIN WALKTHROUGH
I'll show you exactly how I'd fix the top issue on ${domain} — specific
changes, before/after, no pitch. Free, async, in your inbox within 48h.

${research.personalClose ?? `I think the top issue above is the single biggest thing — happy to record a loom walking through how I'd fix it. Just reply "loom".`}

Muraduzzaman
Brandivibe — brandivibe.com
`.trim();
}

export async function POST(req: Request) {
  const ip = ipOf(req);
  const limit = rateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      { error: `Rate limit: ${RATE_LIMIT} audits/hour. Retry in ${limit.retryInSec}s.` },
      { status: 429 }
    );
  }

  let body: { url?: string; email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const url = normalizeUrl(body.url ?? "");
  const email = (body.email ?? "").trim().toLowerCase();

  if (!url) return NextResponse.json({ error: "Valid URL required" }, { status: 400 });
  if (!isValidEmail(email)) return NextResponse.json({ error: "Valid email required" }, { status: 400 });

  const domain = extractDomain(url);
  if (!domain) return NextResponse.json({ error: "Could not parse domain" }, { status: 400 });

  // 0. ICP pre-flight — refuse mega-brands BEFORE burning credits
  const icp = checkIcpFilter(domain);
  if (!icp.ok) {
    return NextResponse.json({ error: icp.message }, { status: 400 });
  }

  // 1. Scrape
  const scraped = await scrapeWebsite(url);
  if (!scraped) {
    return NextResponse.json(
      { error: "Could not reach that site. Check the URL and try again." },
      { status: 400 }
    );
  }

  // 2. Build a minimal prospect shim so deep-research can read it
  const prospectShim: Prospect = {
    id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    company: domain.split(".")[0].replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    domain,
    founder: "",
    role: "",
    email,
    industry: guessIndustry(scraped.techStack, scraped.homepage),
    stage: "Unknown",
    trigger: `Ran the Brandivibe homepage audit tool`,
    icpTier: "B", // placeholder, gets overwritten from designScore below
    icpScore: 5,
    bestFitDemo: "neuron",
    brandWeakness: "",
    estimatedBudget: "$35-50K",
    status: "new",
    source: "manual",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // 3. Deep research — with two-tier validation (hard rules + soft rules + best-effort fallback)
  const research = await researchProspect(prospectShim, scraped);
  if (!research) {
    return NextResponse.json(
      {
        error:
          "We could not produce a confident audit for this site after 3 attempts. The page may be too thin (mostly images / JS-rendered) for our scraper to analyze. Try the audit again in a moment, or pick a different page.",
      },
      { status: 422 }
    );
  }

  // 4. Save prospect with full research attached
  prospectShim.icpTier = tierFromScore(research.currentDesignScore);
  prospectShim.scraped = scraped;
  prospectShim.deepResearch = research;
  prospectShim.bestFitDemo = "neuron"; // drafter-v2 will pick the right one later via closestDemo
  prospectShim.brandWeakness = research.specificObservation;
  prospectShim.emailFinder = {
    winner: email,
    source: "scraped",
    confidence: 100,
    candidates: [{ email, score: 100, reason: "provided by user via audit form" }],
    createdAt: new Date().toISOString(),
  };
  await upsertProspect(prospectShim);

  await logActivity({
    type: "prospect-researched",
    description: `Audit lead: ${prospectShim.company} (${domain}) — score ${research.currentDesignScore}/10`,
    prospectId: prospectShim.id,
    model: research.model,
    tokens: research.tokens,
  });

  // 5. Send the report via Resend transactional — branded HTML + plaintext fallback
  const reportText = formatReport(prospectShim.company, domain, research);
  const reportHtml = renderAuditReportHtml({
    company: prospectShim.company,
    domain,
    designScore: research.currentDesignScore,
    industryName: research.industryName,
    techStackSummary: research.techStackSummary,
    specificObservation: research.specificObservation,
    observations: [
      { title: research.observation1, fix: research.fix1OneLine },
      { title: research.observation2, fix: research.fix2OneLine },
      { title: research.observation3, fix: research.fix3OneLine },
    ],
    topPriority: research.topPriorityObservation,
    weaknesses: research.realWeaknesses,
    recipientFirstName: research.decisionMaker?.firstName || "",
    closestDemoSlug: prospectShim.bestFitDemo,
    quantifiedBleed: research.quantifiedBleed,
    personalClose: research.personalClose,
  });
  // Curiosity-gap subject line — withholds the answer to force the open
  const subject = `two things I'd fix on ${domain}`;
  const emailResult = await sendTransactional({
    to: email,
    subject,
    text: reportText,
    html: reportHtml,
    fromName: "Muraduzzaman at Brandivibe",
  });

  if (!emailResult.ok) {
    // Not fatal — report still renders inline. Log the failure.
    await logActivity({
      type: "error",
      description: `Audit email send failed for ${email}: ${emailResult.error}`,
      prospectId: prospectShim.id,
    });
  }

  // 6. Return report for inline display
  return NextResponse.json({
    ok: true,
    company: prospectShim.company,
    domain,
    designScore: research.currentDesignScore,
    techStackSummary: research.techStackSummary,
    industryName: research.industryName,
    specificObservation: research.specificObservation,
    observations: [
      { title: research.observation1, fix: research.fix1OneLine },
      { title: research.observation2, fix: research.fix2OneLine },
      { title: research.observation3, fix: research.fix3OneLine },
    ],
    topPriority: research.topPriorityObservation,
    weaknesses: research.realWeaknesses,
    emailSent: emailResult.ok,
  });
}
