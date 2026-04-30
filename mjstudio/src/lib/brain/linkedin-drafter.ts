import { getOpenAI, MODELS } from "../openai";
import {
  loadBrain,
  saveBrain,
  logActivity,
  type Prospect,
  type LinkedInDraft,
} from "../brain-storage";

/**
 * LinkedIn DM drafter. Mirrors the cold-email drafter (email-drafter-v2.ts)
 * but for LinkedIn's tighter format and tone:
 *
 *   - 300-400 chars max (LinkedIn DMs are aggressive about length)
 *   - No external links (LinkedIn deprioritizes DMs with URLs)
 *   - No "I'm reaching out" / "saw your profile" filler
 *   - One specific observation, one micro-ask (15-min call)
 *   - Sent manually by the user — never auto-pushed (avoids account ban)
 *
 * Drafts land in brain.linkedinDrafts queue. The dashboard surfaces them
 * for review + copy-paste manual send.
 */

const MAX_DRAFTS_PER_RUN = 3;
const MAX_LINKEDIN_DM_CHARS = 700;
const MIN_LINKEDIN_DM_CHARS = 180;

function validateDm(body: string): string | null {
  const trimmed = body.trim();
  if (trimmed.length < MIN_LINKEDIN_DM_CHARS) return `too short (${trimmed.length} chars)`;
  if (trimmed.length > MAX_LINKEDIN_DM_CHARS) return `too long (${trimmed.length} chars), max ${MAX_LINKEDIN_DM_CHARS}`;
  if (/\{[a-zA-Z_]+\}/.test(trimmed)) return "unfilled merge slot";
  if (/hope this finds you well|hope you'?re well|hope you are well/i.test(trimmed)) return "banned 'hope this finds you well' opener";
  if (/just reaching out|wanted to reach out|saw your profile/i.test(trimmed)) return "banned generic LinkedIn opener";
  if (/https?:\/\//i.test(trimmed)) return "contains URL — LinkedIn deprioritizes DMs with links";
  if (/[🚀🔥✨💡👉🎯💎⚡]/.test(trimmed)) return "emoji use — too salesy";
  return null;
}

async function draftDmForProspect(prospect: Prospect): Promise<{ body: string; model: string; tokens: number } | null> {
  const dr = prospect.deepResearch;
  if (!dr) return null;

  const openai = getOpenAI();

  const system = `You write LinkedIn DMs on behalf of Muraduzzaman, founder of Brandivibe (premium 3D web design studio, $5K-$25K projects, seed → Series A clients).

ABSOLUTE RULES:
- Plain text only. No JSON, no headers, no markdown.
- 220-400 characters ideal, 700 max. LinkedIn DMs that exceed this get archived.
- First-person, founder-to-founder voice. Never "I'm a designer who…"
- ONE specific observation about THEIR site. Never generic praise.
- ONE clear micro-ask: "worth a 15-min call?" or "open to a quick teardown?"
- NEVER use external URLs. LinkedIn deprioritizes DMs containing links.
- Banned openers: "Hope this finds you well", "I noticed", "I came across", "Saw your profile", "Wanted to reach out", "Just reaching out"
- No emoji. No "quick question". No em-dash openers.
- End signature: a blank line then "— Muraduzzaman (Brandivibe)"

WRITE LIKE THIS:
- Open with the specific observation as the first sentence (no preamble)
- One sentence connecting the observation to a missed business outcome
- One sentence offering the value (audit / teardown / 15 min)
- Sign off

NEVER WRITE:
- "I'd love to learn more about your business"
- "I think we could be a great fit"
- "We've helped similar companies"
- Any sentence mentioning Brandivibe more than once`;

  const user = `Draft a LinkedIn DM for this prospect.

Company: ${prospect.company}
Domain: ${prospect.domain}
Industry: ${prospect.industry}
Stage: ${prospect.stage}
First name: ${dr.decisionMaker.firstName || "there"}

Specific observation we noted: ${dr.specificObservation}
Top priority issue: ${dr.topPriorityObservation}
Current pain area: ${dr.currentPainArea}
Their current design score: ${dr.currentDesignScore}/10

Write the DM now. Plain text only — no JSON, no quotes wrapping it.`;

  let lastError = "";
  for (let attempt = 0; attempt < 3; attempt++) {
    const completion = await openai.chat.completions.create({
      model: MODELS.QUALITY,
      temperature: 0.85,
      max_tokens: 600,
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: lastError
            ? `${user}\n\nPREVIOUS DRAFT FAILED VALIDATION: ${lastError}. Fix the specific issue and return again.`
            : user,
        },
      ],
    });
    const body = (completion.choices[0]?.message?.content ?? "").trim();
    const err = validateDm(body);
    if (err) {
      lastError = err;
      continue;
    }
    return {
      body,
      model: completion.model,
      tokens: completion.usage?.total_tokens ?? 0,
    };
  }

  return null;
}

export type LinkedInDrafterSummary = {
  attempted: number;
  drafted: number;
  skipped: number;
  errors: string[];
  tokens: number;
};

export async function runLinkedInDraftTick(): Promise<LinkedInDrafterSummary> {
  const summary: LinkedInDrafterSummary = {
    attempted: 0,
    drafted: 0,
    skipped: 0,
    errors: [],
    tokens: 0,
  };

  const brain = await loadBrain();
  const existingDraftIds = new Set(
    (brain.linkedinDrafts ?? []).map((d) => d.prospectId)
  );

  // Eligible: A/B tier, has deepResearch + linkedin handle, not already drafted, not lost
  const candidates = brain.prospects.filter((p) => {
    if (existingDraftIds.has(p.id)) return false;
    if (p.icpTier !== "A" && p.icpTier !== "B") return false;
    if (!p.deepResearch) return false;
    if (!p.linkedin) return false; // no LinkedIn handle = can't DM
    if (p.unsubscribed) return false;
    if (p.status === "lost" || p.status === "closed") return false;
    return true;
  });

  if (candidates.length === 0) {
    return summary;
  }

  // Take top N — sort by ICP score so we draft for the best matches first
  const ranked = [...candidates].sort((a, b) => (b.icpScore ?? 0) - (a.icpScore ?? 0));
  const batch = ranked.slice(0, MAX_DRAFTS_PER_RUN);

  brain.linkedinDrafts = brain.linkedinDrafts ?? [];

  for (const prospect of batch) {
    summary.attempted++;
    try {
      const result = await draftDmForProspect(prospect);
      if (!result) {
        summary.skipped++;
        continue;
      }
      const draft: LinkedInDraft = {
        id: `lid_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        prospectId: prospect.id,
        prospectCompany: prospect.company,
        prospectFirstName: prospect.deepResearch?.decisionMaker?.firstName || prospect.founder.split(" ")[0] || "there",
        body: result.body,
        status: "queued",
        createdAt: new Date().toISOString(),
        model: result.model,
        tokens: result.tokens,
      };
      brain.linkedinDrafts.push(draft);
      summary.drafted++;
      summary.tokens += result.tokens;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      summary.errors.push(`${prospect.company}: ${msg}`);
    }
  }

  if (summary.drafted > 0) {
    await saveBrain(brain);
    await logActivity({
      type: "draft-generated",
      description: `LinkedIn drafter: ${summary.drafted} new DMs queued for review (tokens ${summary.tokens})`,
      tokens: summary.tokens,
    });
  }

  return summary;
}
