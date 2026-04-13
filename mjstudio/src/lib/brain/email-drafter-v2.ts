import { getOpenAI, MODELS } from "../openai";
import { loadMarketingKnowledge } from "../marketing-knowledge";
import type { Prospect } from "../brain-storage";
import { createHmac } from "crypto";

/**
 * Cold outbound drafter — the Phase 4 email generator. Given a prospect
 * with DeepResearch + EmailFinder populated, drafts one email for the
 * given sequence touch (1-4) grounded on marketing/sequences.md.
 *
 * The drafter is re-prompted up to 2 times if its output violates any of
 * the hard rules in sequences.md (subject length, missing unsubscribe,
 * generic observation, etc).
 */

export type DraftedEmail = {
  subject: string;
  body: string;
  model: string;
  tokens: number;
};

function nextQuarter(): string {
  const d = new Date();
  const q = Math.floor(d.getMonth() / 3) + 2;
  const year = d.getFullYear() + (q > 4 ? 1 : 0);
  return `Q${((q - 1) % 4) + 1} ${year}`;
}

function unsubscribeUrl(prospectId: string): string {
  const secret = process.env.BRAIN_CRON_SECRET || "fallback-secret";
  const sig = createHmac("sha256", secret).update(prospectId).digest("hex").slice(0, 16);
  return `https://brandivibe.com/api/brain/unsubscribe?p=${encodeURIComponent(prospectId)}&s=${sig}`;
}

function validateDraft(
  draft: { subject?: string; body?: string },
  touch: number
): string | null {
  if (!draft.subject || !draft.body) return "missing subject or body";
  const s = draft.subject.trim();
  const b = draft.body.trim();
  if (s.length > 65) return `subject too long (${s.length}), max 65`;
  if (s.length < 10) return `subject too short (${s.length}), min 10`;

  const words = b.split(/\s+/).filter(Boolean).length;
  if (touch === 1 && (words < 50 || words > 110)) return `email 1 word count ${words}, need 60-100`;
  if (touch === 2 && (words < 130 || words > 240)) return `email 2 word count ${words}, need 150-220`;
  if (touch === 3 && (words < 100 || words > 210)) return `email 3 word count ${words}, need 120-190`;
  if (touch === 4 && (words < 35 || words > 110)) return `email 4 word count ${words}, need 50-90`;

  const firstLine = b.split("\n")[0] || "";
  if (/(hope this finds you well|hope you are well|hope you're well|hope all is well)/i.test(firstLine))
    return "opener contains banned 'hope this finds you well' variant";
  if (firstLine.includes("—") || firstLine.includes("–"))
    return "opening line contains em-dash or en-dash (feels AI-generated)";

  if (!/unsubscribe|opt-out/i.test(b)) return "missing unsubscribe line";
  if (!/brandivibe/i.test(b)) return "missing Brandivibe signature";

  // Leaked merge slot detection
  if (/\{[a-zA-Z_]+\}/.test(b)) return "unfilled merge slot in body";

  return null;
}

export async function draftTouch(
  prospect: Prospect,
  touch: 1 | 2 | 3 | 4
): Promise<DraftedEmail | null> {
  const dr = prospect.deepResearch;
  if (!dr) return null;

  const mailingAddress = process.env.BRANDIVIBE_MAILING_ADDRESS || "";
  const calendly = process.env.BRANDIVIBE_CALENDLY_URL || "[Calendly link coming soon — reply 'send loom' for now]";
  const unsubLink = unsubscribeUrl(prospect.id);

  const openai = getOpenAI();
  const knowledge = await loadMarketingKnowledge();

  const system = `You are the Brandivibe cold outbound drafter. You write one email at a time against the sequence definition in marketing/sequences.md below. You are forbidden from deviating from the structure, length, voice, or sign-off defined there.

${knowledge}

You will be given a prospect + their DeepResearch. Your job is to produce ONE email for the specified touch number using the template in sequences.md, replacing every {merge_slot} with a concrete value from the DeepResearch.

NON-NEGOTIABLE:
- Return STRICT JSON: {"subject": string, "body": string}. No markdown fences, no prose.
- Subject line 40-65 characters.
- Body must contain the literal unsubscribe URL and mailing address provided.
- Body must end with the exact signature:
    Muraduzzaman
    Brandivibe — brandivibe.com
- Never start the first sentence with an em-dash or "Hope this finds you well".
- Never leave a {placeholder} unfilled. If a merge slot has no data, rewrite the sentence rather than shipping a bracket.
- Voice: direct, founder-to-founder, no emoji, no exclamation marks, no "quick question" filler.`;

  const user = `TOUCH NUMBER: ${touch}

PROSPECT
Company: ${prospect.company}
Domain: ${prospect.domain}
Industry: ${prospect.industry}

DEEP RESEARCH (use these as merge slot values)
- firstName: ${dr.decisionMaker.firstName || "there"}
- specificObservation: ${dr.specificObservation}
- oneSentenceImpact: ${dr.oneSentenceImpact}
- currentPainArea: ${dr.currentPainArea}
- observation1: ${dr.observation1}
- observation2: ${dr.observation2}
- observation3: ${dr.observation3}
- fix1OneLine: ${dr.fix1OneLine}
- fix2OneLine: ${dr.fix2OneLine}
- fix3OneLine: ${dr.fix3OneLine}
- topPriorityObservation: ${dr.topPriorityObservation}
- fixTimeEstimate: ${dr.fixTimeEstimate}
- conversionMetric: ${dr.conversionMetric}
- industryName: ${dr.industryName}
- techStackSummary: ${dr.techStackSummary}
- currentDesignScore: ${dr.currentDesignScore}
- budget: ${dr.budget}
- closestDemo: ${prospect.bestFitDemo}
- nextQuarter: ${nextQuarter()}

LITERAL VALUES TO INCLUDE IN FOOTER (paste exact text):
- unsubscribeLink: ${unsubLink}
- physicalAddress: ${mailingAddress}
- calendlyLink: ${calendly}

Now generate touch ${touch} following the template in sequences.md exactly. Return strict JSON.`;

  // Try up to 3 times, returning the first draft that passes validation
  let lastError = "";
  for (let attempt = 0; attempt < 3; attempt++) {
    const completion = await openai.chat.completions.create({
      model: MODELS.QUALITY,
      response_format: { type: "json_object" },
      temperature: 0.75,
      messages: [
        { role: "system", content: system },
        { role: "user", content: lastError ? `${user}\n\nPREVIOUS ATTEMPT FAILED VALIDATION: ${lastError}. Fix and return the whole JSON again.` : user },
      ],
    });

    const content = completion.choices[0]?.message?.content ?? "{}";
    let parsed: { subject?: string; body?: string };
    try {
      parsed = JSON.parse(content);
    } catch {
      lastError = "invalid JSON";
      continue;
    }

    const err = validateDraft(parsed, touch);
    if (err) {
      lastError = err;
      continue;
    }

    return {
      subject: parsed.subject!.trim(),
      body: parsed.body!.trim(),
      model: completion.model,
      tokens: completion.usage?.total_tokens ?? 0,
    };
  }

  return null;
}
