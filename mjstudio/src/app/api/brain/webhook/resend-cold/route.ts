import { NextResponse } from "next/server";
import { loadBrain, saveBrain, logActivity } from "@/lib/brain-storage";

/**
 * POST /api/brain/webhook/resend-cold?key=<BLAST_WEBHOOK_SECRET>
 *
 * Receives Resend webhook events for cold-outbound emails and updates the
 * matching OutboundEmail.metrics. Shares the same BLAST_WEBHOOK_SECRET for
 * simplicity — Resend allows multiple webhook endpoints per project.
 *
 * Configure in Resend:
 *   URL: https://brandivibe.com/api/brain/webhook/resend-cold?key=<secret>
 *   Events: email.delivered, email.bounced, email.complained, email.opened,
 *           email.clicked
 *
 * Match strategy: we look up the OutboundEmail by its resendId (stored when
 * the sender dispatches). Blast emails have a different resendId space, so
 * they won't match here — if they do, we just ignore.
 */

export const dynamic = "force-dynamic";

type ResendEventData = {
  email_id?: string;
  to?: string[] | string;
  created_at?: string;
};

type ResendEnvelope = {
  type?: string;
  created_at?: string;
  data?: ResendEventData;
};

function authorized(req: Request): boolean {
  const secret = process.env.BLAST_WEBHOOK_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  const url = new URL(req.url);
  const provided = url.searchParams.get("key") ?? req.headers.get("x-webhook-key");
  return provided === secret;
}

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: ResendEnvelope;
  try {
    body = (await req.json()) as ResendEnvelope;
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const eventType = body.type ?? "";
  const emailId = body.data?.email_id;
  const at = body.created_at ?? body.data?.created_at ?? new Date().toISOString();

  if (!emailId) {
    return NextResponse.json({ ok: true, ignored: "no email_id" });
  }

  const brain = await loadBrain();
  const outbound = (brain.outboundQueue ?? []).find((e) => e.resendId === emailId);
  if (!outbound) {
    // Not a cold-email — probably a blast event hitting the wrong endpoint
    return NextResponse.json({ ok: true, ignored: "email_id not in outboundQueue" });
  }

  outbound.metrics = outbound.metrics ?? {
    opens: 0,
    clicks: 0,
  };

  let changed = false;
  switch (eventType) {
    case "email.opened":
      outbound.metrics.opens++;
      if (!outbound.metrics.firstOpenedAt) outbound.metrics.firstOpenedAt = at;
      changed = true;
      break;
    case "email.clicked":
      outbound.metrics.clicks++;
      if (!outbound.metrics.firstClickedAt) outbound.metrics.firstClickedAt = at;
      changed = true;
      break;
    case "email.bounced":
      outbound.metrics.bounced = true;
      outbound.metrics.bouncedAt = at;
      outbound.status = "bounced";
      changed = true;
      break;
    case "email.complained":
      outbound.metrics.complained = true;
      outbound.metrics.complainedAt = at;
      changed = true;
      break;
    case "email.delivered":
      // Delivery confirmed — nothing to record beyond existing status=sent
      break;
    default:
      return NextResponse.json({ ok: true, ignored: eventType });
  }

  if (changed) {
    await saveBrain(brain);
    if (eventType === "email.bounced" || eventType === "email.complained") {
      await logActivity({
        type: "email-bounced",
        description: `Resend ${eventType} for ${outbound.to}`,
        prospectId: outbound.prospectId,
        emailId: outbound.id,
      });
    }
  }

  return NextResponse.json({ ok: true, recorded: eventType });
}

export async function GET() {
  return NextResponse.json({ ok: true, usage: "POST Resend webhook events here" });
}
