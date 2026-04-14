import { getOpenAI, MODELS } from "../openai";
import { loadMarketingKnowledge } from "../marketing-knowledge";
import type { DeepResearch, ScrapedSite, Prospect } from "../brain-storage";

/**
 * Deep research analyzer v2 — evidence-enforced.
 *
 * Failure mode of v1 (the "Vercel audit incident"): the scraper only saw
 * body text, the model hallucinated negative claims like "homepage lacks
 * contact info" when in fact the contact button was just inside <button>
 * tags the scraper deleted. Embarrassing.
 *
 * v2 fixes:
 *   1. Scraper now extracts structural data (nav, buttons, headings, title)
 *      and explicit boolean flags (hasContact, hasPricing, hasTeam, etc).
 *      We pass those facts into the prompt so the model knows what's
 *      actually there.
 *   2. The prompt FORBIDS negative claims about features that the scraper
 *      already confirmed exist via the boolean flags.
 *   3. Every observation must include an `evidence` field quoting an exact
 *      substring (case-insensitive) from the scraped content.
 *   4. After parsing, we fact-check every quote against the raw HTML +
 *      structured data. If any quote can't be found, the entire response
 *      is rejected and the model is re-prompted with the failures.
 */

type EvidencedObservation = {
  observation: string;
  fix: string;
  evidence: string;
};

type RawDeepResearch = {
  sharpest: { observation: string; impact: string; evidence: string };
  fixes: EvidencedObservation[];
  topPriority: string;
  designScore: number;
  designScoreReasoning: string;
  industryName: string;
  techStackSummary: string;
  budget: string;
  decisionMaker: { name: string; role: string; firstName: string };
  confidence: number;
  quantifiedBleed: string;
  personalClose: string;
};

const MAX_ATTEMPTS = 3;

/**
 * Filler phrases that signal lazy, generic GPT output. If any appear in
 * an observation or fix, the response is rejected and re-prompted. Tighten
 * this list whenever you see another generic phrase slip through.
 */
const FILLER_PHRASES = [
  "could benefit from",
  "modern tech stack",
  "scalable solutions",
  "scalable web application",
  "user experience",
  "user-friendly",
  "more comprehensive",
  "more detailed",
  "more case studies",
  "engaging content",
  "robust",
  "leverage",
  "seamless",
  "cutting-edge",
  "industry-leading",
  "state-of-the-art",
  "next-generation",
  "best-in-class",
  "world-class",
  "innovative solutions",
];

/**
 * Words that indicate a CRITICAL observation — significantly expanded after
 * the val.town test where GPT-4o produced legitimate critical observations
 * the original narrow list rejected. The list is intentionally permissive:
 * if there's any signal of negativity, comparison, or measurable problem,
 * we consider the observation critical enough.
 */
const CRITICAL_KEYWORDS = [
  // Direct negative
  "lack", "lacks", "lacking", "missing", "absent", "without", "hidden",
  "weak", "weakly", "poor", "poorly", "slow", "broken", "flat", "dull",
  "stale", "stale", "dated", "outdated", "old", "tired", "cliché",
  // Cognitive load
  "confusing", "unclear", "cluttered", "dense", "overloaded", "overloads",
  "buried", "drowned", "obscured", "vague", "generic", "thin", "shallow",
  "competing", "fights", "scattered", "fragmented", "mismatch", "inconsistent",
  // Performance / measurable
  "drops", "blocks", "stalls", "loses", "kills", "hurts", "fails", "fail",
  "ignores", "skips", "misses", "wastes", "delays",
  // Quantitative red-flag words
  "too", "below", "under", "instead of", "rather than", "doesn't",
  "won't", "can't", "isn't", "no clear", "no obvious", "no real",
  // Negations
  "doesn't have", "doesn't show", "doesn't tell", "doesn't include",
  "no ", "not ", "never", "barely",
  // Visual / design specific
  "static", "boring", "templated", "default", "stock", "off-the-shelf",
  "off the shelf", "looks like", "feels like",
];

function containsFiller(text: string): string | null {
  const t = text.toLowerCase();
  for (const phrase of FILLER_PHRASES) {
    if (t.includes(phrase)) return phrase;
  }
  return null;
}

/**
 * An observation is critical if any of:
 *  - contains a CRITICAL_KEYWORDS phrase
 *  - contains a number followed by a unit (e.g. "4.2s", "14MB", "30%")
 *  - contains a comparison phrase ("more than", "less than", "behind")
 */
function isCritical(text: string): boolean {
  const t = text.toLowerCase();
  if (CRITICAL_KEYWORDS.some((kw) => t.includes(kw))) return true;
  if (/\b\d+(\.\d+)?(s|ms|kb|mb|gb|%)\b/.test(t)) return true;
  if (/\b(more than|less than|behind|compared to|vs\.?|versus)\b/.test(t)) return true;
  return false;
}

function lowerHaystack(scraped: ScrapedSite): string {
  return (
    (scraped.rawHomepage || "") +
    "\n" +
    scraped.homepage +
    "\n" +
    (scraped.about ?? "") +
    "\n" +
    (scraped.team ?? "") +
    "\n" +
    (scraped.pricing ?? "") +
    "\n" +
    (scraped.contact ?? "") +
    "\n" +
    scraped.structure.title +
    "\n" +
    scraped.structure.metaDescription +
    "\n" +
    scraped.structure.h1.join("\n") +
    "\n" +
    scraped.structure.h2.join("\n") +
    "\n" +
    scraped.structure.h3.join("\n") +
    "\n" +
    scraped.structure.navLinks.map((n) => `${n.text} ${n.href}`).join("\n") +
    "\n" +
    scraped.structure.buttons.join("\n") +
    "\n" +
    scraped.structure.footerLinks.join("\n")
  ).toLowerCase();
}

function quoteFound(quote: string, haystack: string): boolean {
  if (!quote || quote.length < 4) return false;
  const q = quote.toLowerCase().replace(/\s+/g, " ").trim();
  // Try the full quote first
  if (haystack.includes(q)) return true;
  // Then try removing punctuation + retry (handles smart quotes, ellipses, etc)
  const stripped = q.replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
  if (stripped.length >= 6 && haystack.replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").includes(stripped))
    return true;
  // Last resort: every word over 4 chars must appear (handles paraphrases)
  const words = stripped.split(" ").filter((w) => w.length >= 4);
  if (words.length >= 3 && words.every((w) => haystack.includes(w))) return true;
  return false;
}

function violatesNegativeClaim(observation: string, scraped: ScrapedSite): string | null {
  const o = observation.toLowerCase();
  const s = scraped.structure;
  // The model said "lacks contact" but we know the page has contact.
  if ((/\b(no|lack|missing|without|don'?t have|absent)\b/.test(o)) && /contact|reach\s*out|talk\s*to\s*sales|get in touch/.test(o) && s.hasContact)
    return "claimed missing contact info but scraper detected contact link/button on the page";
  if ((/\b(no|lack|missing|without|don'?t have|absent)\b/.test(o)) && /pricing|plans|pricing\s*page/.test(o) && s.hasPricing)
    return "claimed missing pricing but scraper detected pricing link/page";
  if ((/\b(no|lack|missing|without|don'?t have|absent)\b/.test(o)) && /team|about\s*us|about\s*page|leadership/.test(o) && s.hasTeam)
    return "claimed missing team/about page but scraper detected one";
  if ((/\b(no|lack|missing|without|don'?t have|absent)\b/.test(o)) && /blog|articles|writing/.test(o) && s.hasBlog)
    return "claimed missing blog but scraper detected one";
  if ((/\b(no|lack|missing|without|don'?t have|absent)\b/.test(o)) && /careers|jobs/.test(o) && s.hasCareers)
    return "claimed missing careers but scraper detected one";
  // Forbid telling the prospect what tech stack they use back to them — useless and embarrassing
  if (/\bthey use\b|\byou use\b|\byour stack\b|\btech stack is\b/.test(o) && /\bnext\.?js|react|tailwind|webflow|wordpress\b/.test(o))
    return "do not tell the prospect what stack they use back to them — they already know";
  return null;
}

export async function researchProspect(
  prospect: Prospect,
  scraped: ScrapedSite
): Promise<DeepResearch | null> {
  const combinedCopy =
    (scraped.homepage ?? "") +
    "\n" +
    (scraped.about ?? "") +
    "\n" +
    (scraped.pricing ?? "") +
    "\n" +
    (scraped.team ?? "");

  if (combinedCopy.trim().length < 200) return null;

  const openai = getOpenAI();
  const knowledge = await loadMarketingKnowledge();
  const haystack = lowerHaystack(scraped);
  const s = scraped.structure;

  // Build the "known facts" section the model is forbidden from contradicting
  const knownFacts: string[] = [];
  if (s.hasContact) knownFacts.push("This site HAS a contact link or button (do not claim it is missing).");
  if (s.hasPricing) knownFacts.push("This site HAS a pricing page (do not claim it is missing).");
  if (s.hasTeam) knownFacts.push("This site HAS a team or about page (do not claim it is missing).");
  if (s.hasBlog) knownFacts.push("This site HAS a blog (do not claim it is missing).");
  if (s.hasCareers) knownFacts.push("This site HAS a careers page (do not claim it is missing).");
  if (s.hasLogin) knownFacts.push("This site HAS a login / dashboard area (suggests an existing product).");
  if (knownFacts.length === 0) knownFacts.push("(no facts pre-confirmed)");

  const system = `You are the Brandivibe research analyst. Your job is to identify SHARP WEAKNESSES on a prospect's live homepage that justify a $35-90K rebuild. You are NOT a friendly UX consultant. You are NOT here to praise. Your output funds a sales call.

ABSOLUTE RULES (violation = your response is rejected and you are re-prompted):

1. designScore is an INTEGER between 1 and 10. Not 0-100. Not a percentage. Just 1 to 10.
   1 = unprofessional / WordPress template
   3 = generic SaaS, dated
   5 = decent founder-built homepage, no design system
   7 = polished, professional, room to sharpen
   9 = best-in-class, almost nothing to fix
   10 = museum piece

2. Every observation must be CRITICAL — identify a weakness using words like:
   "lacks", "missing", "buried", "weak", "slow", "confusing", "generic", "stale", "outdated", "thin", "broken", "fails", "hidden", "vague", "cluttered", "flat", "static".
   Praise is rejected. "Effectively communicates" / "Strong messaging" / "Clear value prop" — all REJECTED.

3. EVERY observation must include an "evidence" field — a 6-30 word VERBATIM substring from the scraped content. Not paraphrased. Not invented. Quoted from real text on the page.

4. FORBIDDEN FILLER PHRASES — using any of these gets you rejected:
   "could benefit from", "modern tech stack", "scalable", "user experience", "user-friendly",
   "more comprehensive", "more case studies", "more detailed", "engaging", "robust",
   "leverage", "seamless", "cutting-edge", "innovative", "best-in-class", "world-class".
   Be SPECIFIC. Quote the actual element. Name the actual problem.

5. NEVER claim something is missing if the KNOWN FACTS below confirm it exists.

6. NEVER tell the prospect what tech stack they use back to them. They built the site. Use stack info to calibrate your tone, never quote it.

7. techStackSummary in your response is IGNORED — the scraper provides the real value. Output a placeholder; we override it.

8. If the page is from a mega-brand (Stripe, Vercel, Linear, Figma, Notion, Apple, Google, etc), set confidence to 20 or below.

9. If you cannot find sharp, specific, critical, evidenced observations, set confidence to 30 or below — better to skip than ship generic sludge.

KNOWN FACTS ABOUT THIS SITE (the scraper already verified these — do not contradict):
${knownFacts.map((f) => `- ${f}`).join("\n")}

BRANDIVIBE MARKETING KNOWLEDGE BASE
${knowledge}

Return STRICT JSON with this exact shape (no markdown fences, no prose):
{
  "sharpest": {
    "observation": string,
    "impact": string,
    "evidence": string
  },
  "fixes": [
    { "observation": string, "fix": string, "evidence": string },
    { "observation": string, "fix": string, "evidence": string },
    { "observation": string, "fix": string, "evidence": string }
  ],
  "topPriority": string,
  "designScore": number,
  "designScoreReasoning": string,
  "industryName": string,
  "techStackSummary": string,
  "budget": string,
  "decisionMaker": { "name": string, "role": string, "firstName": string },
  "confidence": number,
  "quantifiedBleed": string,
  "personalClose": string
}

quantifiedBleed RULES (this is the loss-aversion line in the email):
- Must be ONE sentence.
- Must be framed CONDITIONALLY — start with "At even" or "Even at" or "If you're getting" because we don't know their actual traffic.
- Must reference a specific number AND tie it to the topPriority weakness.
- Format: "At even {realistic-low-traffic-estimate}, {topPriority-issue} is dropping ~{plausible-loss-percent}% of {audience-type} before they {goal}."
- Examples (do NOT copy verbatim — adapt to the actual issue):
   "At even 500 monthly visitors, the buried pricing CTA is dropping ~30% of warm leads before they see what it costs."
   "Even at 1,000 visitors a month, the 14MB hero video is bouncing ~40% of mobile traffic before LCP fires."
   "If you're getting 800 founders a month, the dense above-the-fold copy is losing ~25% before they ever scroll."
- Forbidden: "could lose", "may impact", "potentially affects" — be direct.

personalClose RULES (the 1-sentence sign-off line in the email):
- Must be ONE sentence.
- Must reference the topPriority weakness specifically by name or detail.
- Must offer a free, asynchronous, low-friction value action.
- Format: "I think {specific-topPriority-thing} is your single biggest issue — happy to record a 5-min loom walking through how I'd fix it if you reply 'loom'."
- Voice: founder-to-founder, direct, no hedging.
- Forbidden: "feel free", "let me know", "if you have time", "I would love to" — generic friendly bullshit. Direct only.`;

  const user = `PROSPECT
Company: ${prospect.company}
Domain: ${prospect.domain}
Industry hint: ${prospect.industry}

DETECTED TECH STACK (do NOT repeat back to them)
${scraped.techStack.join(", ") || "(none detected)"}

PAGE TITLE: ${s.title}
META DESCRIPTION: ${s.metaDescription}

H1 HEADINGS:
${s.h1.map((h) => `- "${h}"`).join("\n") || "(none)"}

H2 HEADINGS (first 10):
${s.h2.slice(0, 10).map((h) => `- "${h}"`).join("\n") || "(none)"}

NAV LINKS:
${s.navLinks.map((l) => `- ${l.text} → ${l.href}`).join("\n") || "(none)"}

BUTTONS / CTAs:
${s.buttons.map((b) => `- "${b}"`).join("\n") || "(none)"}

FOOTER LINKS:
${s.footerLinks.slice(0, 20).join(", ") || "(none)"}

CONTACT EMAILS FOUND ON SITE: ${scraped.foundEmails.slice(0, 5).join(", ") || "(none)"}

PAGE BODY TEXT (homepage, trimmed)
${(scraped.homepage ?? "").slice(0, 4500)}

PRICING PAGE TEXT (if available)
${(scraped.pricing ?? "").slice(0, 1500) || "(not available)"}

ABOUT/TEAM TEXT (if available)
${(scraped.about ?? scraped.team ?? "").slice(0, 1500) || "(not available)"}

Now produce the strict JSON. Every observation MUST include a quoted evidence substring from the content above. If you cannot ground an observation in a real quote, omit it and lower confidence accordingly.`;

  let lastFailure = "";
  let lastBestEffort: { parsed: RawDeepResearch; model: string; tokens: number } | null = null;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const completion = await openai.chat.completions.create({
      model: MODELS.QUALITY,
      response_format: { type: "json_object" },
      temperature: 0.35,
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: lastFailure
            ? `${user}\n\nPREVIOUS ATTEMPT FAILED VALIDATION: ${lastFailure}\nFix and return the entire JSON again.`
            : user,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content ?? "{}";
    let parsed: RawDeepResearch;
    try {
      parsed = JSON.parse(content);
    } catch {
      lastFailure = "invalid JSON";
      continue;
    }

    // ─────────── HARD validation (must pass — no graceful degradation) ───────────
    const hardFailures: string[] = [];
    const softFailures: string[] = [];

    // Score must be integer 1-10
    if (typeof parsed.designScore !== "number" || !Number.isFinite(parsed.designScore)) {
      hardFailures.push("designScore must be a number");
    } else if (parsed.designScore < 1 || parsed.designScore > 10) {
      hardFailures.push(`designScore must be 1-10, got ${parsed.designScore} (NOT 0-100)`);
    }

    // Sharpest observation must exist + have evidence
    if (!parsed.sharpest?.observation) {
      hardFailures.push("missing sharpest.observation");
    } else {
      // HARD: no false negative claims
      const neg = violatesNegativeClaim(parsed.sharpest.observation, scraped);
      if (neg) hardFailures.push(`sharpest.observation ${neg}`);
      // HARD: evidence quote must verify
      if (!parsed.sharpest.evidence) {
        hardFailures.push("sharpest.evidence missing");
      } else if (!quoteFound(parsed.sharpest.evidence, haystack)) {
        hardFailures.push(`sharpest.evidence quote not found: "${parsed.sharpest.evidence.slice(0, 80)}"`);
      }
      // SOFT: critical tone
      if (!isCritical(parsed.sharpest.observation)) {
        softFailures.push(`sharpest.observation isn't critical enough — use weakness language`);
      }
      // SOFT: no filler
      const filler = containsFiller(parsed.sharpest.observation);
      if (filler) softFailures.push(`sharpest.observation contains filler "${filler}"`);
    }

    // Three fix observations
    if (!Array.isArray(parsed.fixes) || parsed.fixes.length < 3) {
      hardFailures.push("must have at least 3 fixes");
    } else {
      parsed.fixes.slice(0, 3).forEach((f, i) => {
        // HARD: no false negative claims
        const neg = violatesNegativeClaim(f.observation, scraped);
        if (neg) hardFailures.push(`fixes[${i}].observation ${neg}`);
        // HARD: evidence quote must verify
        if (!f.evidence) {
          hardFailures.push(`fixes[${i}] missing evidence`);
        } else if (!quoteFound(f.evidence, haystack)) {
          hardFailures.push(`fixes[${i}].evidence quote not found: "${f.evidence.slice(0, 80)}"`);
        }
        // SOFT: filler + critical
        const fillerObs = containsFiller(f.observation);
        if (fillerObs) softFailures.push(`fixes[${i}].observation contains filler "${fillerObs}"`);
        const fillerFix = containsFiller(f.fix);
        if (fillerFix) softFailures.push(`fixes[${i}].fix contains filler "${fillerFix}"`);
        if (!isCritical(f.observation)) {
          softFailures.push(`fixes[${i}].observation isn't critical enough`);
        }
      });
    }

    // quantifiedBleed — soft only (we'll fall back to a generic if needed)
    if (parsed.quantifiedBleed) {
      const qb = parsed.quantifiedBleed;
      if (qb.length < 20 || qb.length > 320) {
        softFailures.push(`quantifiedBleed length ${qb.length}, want 20-320`);
      }
      if (!/(at even|even at|if you'?re getting|if you have|if even|assuming)/i.test(qb)) {
        softFailures.push(`quantifiedBleed should be conditional (start with "At even"/"Even at"/"If you're getting"/"Assuming")`);
      }
      if (!/\d/.test(qb)) {
        softFailures.push("quantifiedBleed missing a number");
      }
      const fillerBleed = containsFiller(qb);
      if (fillerBleed) softFailures.push(`quantifiedBleed contains filler "${fillerBleed}"`);
    } else {
      softFailures.push("quantifiedBleed missing");
    }

    // personalClose — soft only
    if (parsed.personalClose) {
      const pc = parsed.personalClose;
      if (pc.length < 30 || pc.length > 320) {
        softFailures.push(`personalClose length ${pc.length}, want 30-320`);
      }
      if (!/loom/i.test(pc)) {
        softFailures.push(`personalClose should mention "loom"`);
      }
      if (/feel free|let me know|if you have time|i would love to|happy to chat|hop on a call/i.test(pc)) {
        softFailures.push("personalClose has generic friendly hedging");
      }
    } else {
      softFailures.push("personalClose missing");
    }

    // Always remember the latest parsed result so we can return best-effort if all attempts fail
    lastBestEffort = { parsed, model: completion.model, tokens: completion.usage?.total_tokens ?? 0 };

    if (hardFailures.length > 0) {
      // Hard failures = unrecoverable. Try again.
      lastFailure = `HARD: ${hardFailures.join("; ")}` + (softFailures.length ? ` | SOFT: ${softFailures.join("; ")}` : "");
      continue;
    }

    if (softFailures.length > 0 && attempt < MAX_ATTEMPTS - 1) {
      // Hard passed but soft didn't — try one more time hoping for cleaner output
      lastFailure = `SOFT (retry to improve quality): ${softFailures.join("; ")}`;
      continue;
    }

    // Either hard+soft passed, or it's the last attempt and hard passed — ship it.
    // ─────────── Build DeepResearch shape ───────────
    // Override techStackSummary with the real scraped stack — never trust
    // the model's generic phrasing here.
    const realStackSummary =
      scraped.techStack.length > 0
        ? scraped.techStack.slice(0, 4).join(" + ")
        : "stack unknown";

    return {
      realWeaknesses: [
        parsed.sharpest.observation,
        ...parsed.fixes.slice(0, 3).map((f) => f.observation),
      ],
      specificObservation: parsed.sharpest.observation,
      oneSentenceImpact: parsed.sharpest.impact,
      currentPainArea: parsed.sharpest.observation.split(".")[0].slice(0, 80),
      observation1: parsed.fixes[0]?.observation ?? "",
      observation2: parsed.fixes[1]?.observation ?? "",
      observation3: parsed.fixes[2]?.observation ?? "",
      fix1OneLine: parsed.fixes[0]?.fix ?? "",
      fix2OneLine: parsed.fixes[1]?.fix ?? "",
      fix3OneLine: parsed.fixes[2]?.fix ?? "",
      topPriorityObservation: parsed.topPriority,
      fixTimeEstimate: "1-2 weeks",
      conversionMetric: "homepage conversion rate",
      industryName: parsed.industryName,
      techStackSummary: realStackSummary,
      currentDesignScore: Math.max(1, Math.min(10, Math.round(parsed.designScore))),
      budget: parsed.budget,
      decisionMaker: parsed.decisionMaker ?? { name: "", role: "", firstName: "" },
      confidence: parsed.confidence,
      quantifiedBleed: parsed.quantifiedBleed,
      personalClose: parsed.personalClose,
      createdAt: new Date().toISOString(),
      model: completion.model,
      tokens: completion.usage?.total_tokens ?? 0,
    };
  }

  // All attempts failed HARD validation. Return the last best-effort if we have
  // one, with confidence dropped to reflect the validation failures. Better to
  // ship a slightly weaker audit than a 400 error to the user.
  if (lastBestEffort) {
    console.warn("[deep-research] all attempts failed hard validation, returning best-effort. Last failure:", lastFailure);
    const { parsed, model, tokens } = lastBestEffort;
    const realStackSummary =
      scraped.techStack.length > 0
        ? scraped.techStack.slice(0, 4).join(" + ")
        : "stack unknown";
    return {
      realWeaknesses: [
        parsed.sharpest?.observation ?? "",
        ...((parsed.fixes ?? []).slice(0, 3).map((f) => f.observation)),
      ].filter(Boolean),
      specificObservation: parsed.sharpest?.observation ?? "",
      oneSentenceImpact: parsed.sharpest?.impact ?? "",
      currentPainArea: (parsed.sharpest?.observation ?? "").split(".")[0].slice(0, 80),
      observation1: parsed.fixes?.[0]?.observation ?? "",
      observation2: parsed.fixes?.[1]?.observation ?? "",
      observation3: parsed.fixes?.[2]?.observation ?? "",
      fix1OneLine: parsed.fixes?.[0]?.fix ?? "",
      fix2OneLine: parsed.fixes?.[1]?.fix ?? "",
      fix3OneLine: parsed.fixes?.[2]?.fix ?? "",
      topPriorityObservation: parsed.topPriority ?? "",
      fixTimeEstimate: "1-2 weeks",
      conversionMetric: "homepage conversion rate",
      industryName: parsed.industryName ?? "saas",
      techStackSummary: realStackSummary,
      currentDesignScore: Math.max(1, Math.min(10, Math.round(parsed.designScore || 5))),
      budget: parsed.budget ?? "$35-50K",
      decisionMaker: parsed.decisionMaker ?? { name: "", role: "", firstName: "" },
      confidence: Math.min(parsed.confidence ?? 30, 40), // hard cap on best-effort
      quantifiedBleed: parsed.quantifiedBleed,
      personalClose: parsed.personalClose,
      createdAt: new Date().toISOString(),
      model,
      tokens,
    };
  }
  return null;
}
