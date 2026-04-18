import { NextResponse } from "next/server";
import { loadBrain, saveBrain, logActivity } from "@/lib/brain-storage";

/**
 * POST /api/brain/webhook/resend-inbound?key=<BLAST_WEBHOOK_SECRET>
 *
 * Receives Resend inbound email events (replies to our cold outbound).
 * Matches the reply back to its OutboundEmail record, marks the prospect
 * as replied, and pauses their sequence.
 *
 * Matching strategy (in priority order):
 *   1. in_reply_to / references headers contain our resendId
 *   2. The inbound `from` address matches a prior OutboundEmail.to
 *      address sent within the last 30 days (most recent wins)
 *
 * When matched:
 *   - OutboundEmail.metrics.replied = true
 *   - Prospect.status = "replied"
 *   - Prospect.sequence.lastOutcome = "replied" (stops sequence-machine)
 *   - Activity log records a preview of the reply body
 *
 * Resend setup:
 *   1. Add an inbound address (e.g. replies@send.brandivibe.site) in Resend
 *   2. Point the inbound webhook at this URL
 *   3. Set RESEND_REPLY_TO env var to match the inbound address
 */

export const dynamic = "force-dynamic";

type ResendInboundData = {
  email_id?: string;
  from?: { email?: string; name?: string } | string;
  to?: string[] | string;
  subject?: string;
  text?: string;
  html?: string;
  in_reply_to?: string;
  references?: string | string[];
  headers?: Record<string, string>;
  created_at?: string;
};

type ResendInboundEnvelope = {
  type?: string;
  created_at?: string;
  data?: ResendInboundData;
};

function authorized(req: Request): boolean {
  const secret = process.env.BLAST_WEBHOOK_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  const url = new URL(req.url);
  const provided = url.searchParams.get("key") ?? req.headers.get("x-webhook-key");
  return provided === secret;
}

function extractFromEmail(from: ResendInboundData["from"]): string {
  if (!from) return "";
  if (typeof from === "string") {
    const m = from.match(/<([^>]+)>/);
    return (m?.[1] ?? from).toLowerCase().trim();
  }
  return (from.email ?? "").toLowerCase().trim();
}

const THIRTY_DAYS_MS = 30 * 86_400_000;

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: ResendInboundEnvelope;
  try {
    body = (await req.json()) as ResendInboundEnvelope;
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const kind = body.type ?? "";
  // Resend uses "email.received" for inbound; accept variations defensively
  if (kind !== "email.received" && kind !== "inbound.received" && kind !== "email.inbound") {
    return NextResponse.json({ ok: true, ignored: kind });
  }

  const fromEmail = extractFromEmail(body.data?.from);
  if (!fromEmail) {
    return NextResponse.json({ ok: true, ignored: "no from address" });
  }

  const brain = await loadBrain();
  const queue = brain.outboundQueue ?? [];

  // Strategy 1: match by threading headers
  const inReplyTo = body.data?.in_reply_to ?? "";
  const refsRaw = body.data?.references;
  const refs = Array.isArray(refsRaw) ? refsRaw.join(" ") : refsRaw ?? "";
  const threadHaystack = `${inReplyTo} ${refs}`;

  let matched = queue.find(
    (e) => e.resendId && threadHaystack.includes(e.resendId)
  );

  // Strategy 2: match by recipient address + time window
  if (!matched) {
    const cutoff = Date.now() - THIRTY_DAYS_MS;
    const candidates = queue
      .filter((e) => e.status === "sent" || e.status === "bounced")
      .filter((e) => e.to.toLowerCase() === fromEmail)
      .filter((e) => {
        const t = e.sentAt ? new Date(e.sentAt).getTime() : 0;
        return t >= cutoff;
      })
      .sort((a, b) => {
        const ta = a.sentAt ? new Date(a.sentAt).getTime() : 0;
        const tb = b.sentAt ? new Date(b.sentAt).getTime() : 0;
        return tb - ta;
      });
    matched = candidates[0];
  }

  if (!matched) {
    await logActivity({
      type: "error",
      description: `Inbound reply from ${fromEmail} — no matching OutboundEmail found`,
    });
    return NextResponse.json({ ok: true, matched: false });
  }

  matched.metrics = matched.metrics ?? { opens: 0, clicks: 0 };
  matched.metrics.replied = true;
  matched.metrics.repliedAt = body.created_at ?? new Date().toISOString();

  const prospect = brain.prospects.find((p) => p.id === matched!.prospectId);
  if (prospect) {
    prospect.status = "replied";
    prospect.sequence = prospect.sequence ?? { stage: 0 };
    prospect.sequence.lastOutcome = "replied";
    prospect.updatedAt = new Date().toISOString();

    // Suppress any still-queued follow-ups for this prospect
    for (const e of queue) {
      if (e.prospectId === prospect.id && e.status === "queued") {
        e.status = "suppressed";
        e.failReason = "prospect replied";
      }
    }
  }

  await saveBrain(brain);

  const preview = (body.data?.text ?? "").replace(/\s+/g, " ").slice(0, 180);
  await logActivity({
    type: "email-sent",
    description: `REPLY from ${prospect?.company ?? fromEmail} to touch ${matched.sequenceTouch}: "${preview}"`,
    prospectId: matched.prospectId,
    emailId: matched.id,
  });

  return NextResponse.json({
    ok: true,
    matched: true,
    prospectId: matched.prospectId,
    touch: matched.sequenceTouch,
  });
}

export async function GET() {
  return NextResponse.json({ ok: true, usage: "POST Resend inbound events here" });
}
