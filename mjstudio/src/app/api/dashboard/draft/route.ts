import { NextResponse } from "next/server";
import { getOpenAI, MODELS } from "@/lib/openai";
import { loadMarketingKnowledge } from "@/lib/marketing-knowledge";
import { loadBrain, addDraft, logActivity, type Draft } from "@/lib/brain-storage";

// Simple in-memory rate limit: MAX_PER_HOUR draft generations per process.
// Since /dashboard has no auth (per user request), this caps credit burn.
const MAX_PER_HOUR = 20;
const draftTimestamps: number[] = [];
function checkRateLimit(): { ok: boolean; remaining: number; resetInSec: number } {
  const now = Date.now();
  const cutoff = now - 60 * 60 * 1000;
  while (draftTimestamps.length && draftTimestamps[0] < cutoff) draftTimestamps.shift();
  const remaining = Math.max(0, MAX_PER_HOUR - draftTimestamps.length);
  if (draftTimestamps.length >= MAX_PER_HOUR) {
    const resetInSec = Math.ceil((draftTimestamps[0] + 60 * 60 * 1000 - now) / 1000);
    return { ok: false, remaining: 0, resetInSec };
  }
  draftTimestamps.push(now);
  return { ok: true, remaining: remaining - 1, resetInSec: 0 };
}

/**
 * POST /api/ai-brain/draft
 * Body: { prospectId: string, variant?: "funding" | "launch" | "hire" | "brand-weakness" }
 *
 * Uses OpenAI GPT-4o with the Brandivibe marketing knowledge base as system
 * prompt to draft a personalized cold email for one prospect. Saves the draft
 * to brain.json and returns it.
 */

type DraftRequest = {
  prospectId: string;
  variant?: "funding" | "launch" | "hire" | "brand-weakness";
};

type DraftedEmail = {
  subject: string;
  body: string;
  persona: "economic" | "technical" | "champion";
};

export async function POST(req: Request) {
  let payload: DraftRequest;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!payload.prospectId) {
    return NextResponse.json(
      { error: "prospectId is required" },
      { status: 400 }
    );
  }

  const limit = checkRateLimit();
  if (!limit.ok) {
    return NextResponse.json(
      {
        error: `Rate limit: ${MAX_PER_HOUR} drafts/hour. Retry in ${limit.resetInSec}s.`,
      },
      { status: 429 }
    );
  }

  const brain = await loadBrain();
  const prospect = brain.prospects.find((p) => p.id === payload.prospectId);
  if (!prospect) {
    return NextResponse.json({ error: "Prospect not found" }, { status: 404 });
  }

  const knowledge = await loadMarketingKnowledge();
  const variant = payload.variant ?? "funding";

  const systemPrompt = `You are the Brandivibe AI sales assistant. Brandivibe is a one-person independent web design studio run by Muraduzzaman. You draft cold outreach emails to founders on behalf of the studio.

Your voice is direct, no fluff, confident but not salesy. Every email is personalized to the specific prospect — never generic. You never open with "I hope this email finds you well" or any template opener. You always reference something specific about the prospect's company.

You have access to the Brandivibe marketing knowledge base below. Use it as the canonical source of truth for positioning, messaging, pricing, and objection handling. Pricing is $35-90K per project, 6-week fixed scope, production Next.js + R3F codebase delivered.

BRANDIVIBE MARKETING KNOWLEDGE BASE
==================================

${knowledge}

==================================
END KNOWLEDGE BASE

DRAFTING RULES

1. Subject line: 30-55 characters, direct, reference a specific trigger or observation.
2. Email body: 90-160 words, three short paragraphs max. Ends with ONE clear CTA (15-min call or reply with yes/no).
3. Reference the closest Brandivibe demo by name and URL (https://brandivibe.com/{demo}).
4. Call out ONE specific brand weakness the prospect would agree with.
5. Never claim to have worked with anyone you haven't — everything is first-outreach honesty.
6. No em-dashes in opening sentences (they read as AI-generated).
7. Sign off as "Muraduzzaman" with one-line "Brandivibe — brandivibe.com".
8. Pick ONE persona based on the role (CEO = economic, CTO = technical, design/marketing lead = champion).
9. Output MUST be strict JSON with keys: subject, body, persona. No markdown fences, no prose outside JSON.`;

  const userPrompt = `Draft a cold email for this prospect using the "${variant}" trigger variant.

PROSPECT:
- Company: ${prospect.company}
- Domain: ${prospect.domain}
- Founder: ${prospect.founder}
- Role: ${prospect.role}
- Industry: ${prospect.industry}
- Stage: ${prospect.stage}
- Recent funding: ${
    prospect.recentFunding
      ? `${prospect.recentFunding.amount} ${prospect.recentFunding.round} on ${prospect.recentFunding.date}`
      : "none on file"
  }
- Trigger observed: ${prospect.trigger}
- Brand weakness: ${prospect.brandWeakness}
- Estimated budget: ${prospect.estimatedBudget}
- Closest-fit Brandivibe demo: /${prospect.bestFitDemo}

Return strict JSON only.`;

  const openai = getOpenAI();

  let completion;
  try {
    completion = await openai.chat.completions.create({
      model: MODELS.QUALITY,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "OpenAI call failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const raw = completion.choices[0]?.message?.content ?? "";
  let parsed: DraftedEmail;
  try {
    parsed = JSON.parse(raw) as DraftedEmail;
  } catch {
    return NextResponse.json(
      { error: "Model returned non-JSON", raw },
      { status: 500 }
    );
  }

  if (!parsed.subject || !parsed.body) {
    return NextResponse.json(
      { error: "Model response missing subject or body", raw },
      { status: 500 }
    );
  }

  const draft: Draft = {
    id: `draft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    prospectId: prospect.id,
    subject: parsed.subject.trim(),
    body: parsed.body.trim(),
    variant,
    persona: parsed.persona ?? "economic",
    model: completion.model,
    tokensUsed: completion.usage?.total_tokens,
    createdAt: new Date().toISOString(),
    approved: false,
  };

  await addDraft(draft);
  await logActivity({
    type: "draft-generated",
    description: `Drafted ${variant} email for ${prospect.company}: "${draft.subject}"`,
    prospectId: prospect.id,
    draftId: draft.id,
    model: draft.model,
    tokens: draft.tokensUsed,
  });

  return NextResponse.json({ draft });
}
