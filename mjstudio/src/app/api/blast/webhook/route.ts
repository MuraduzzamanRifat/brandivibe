import { NextResponse } from "next/server";
import { recordBlastEvent, type BlastEventKind } from "@/lib/brain/blast";

/**
 * POST /api/blast/webhook?key=<BLAST_WEBHOOK_SECRET>
 *
 * Receives Resend webhook events (https://resend.com/docs/dashboard/webhooks).
 * Appends each event to data/blast-events.jsonl. The aggregator rolls them
 * into BlastConfig.metrics on the next status fetch (or daily tick).
 *
 * Configure in Resend dashboard:
 *   URL:    https://brandivibe.com/api/blast/webhook?key=<secret>
 *   Events: email.delivered, email.bounced, email.complained,
 *           email.opened, email.clicked
 *
 * The shared-secret query param is the simplest auth that works without
 * pulling in the svix package for signature verification. Treat the secret
 * as a bearer token.
 */

export const dynamic = "force-dynamic";

type ResendWebhookData = {
  email_id?: string;
  to?: string[] | string;
  from?: string;
  subject?: string;
  created_at?: string;
};

type ResendWebhookEnvelope = {
  type?: string;
  created_at?: string;
  data?: ResendWebhookData;
};

const TYPE_MAP: Record<string, BlastEventKind> = {
  "email.delivered": "delivered",
  "email.bounced": "bounced",
  "email.complained": "complained",
  "email.opened": "opened",
  "email.clicked": "clicked",
};

function authorized(req: Request): boolean {
  const secret = process.env.BLAST_WEBHOOK_SECRET;
  if (!secret) return true; // dev mode — no key required
  const url = new URL(req.url);
  const provided = url.searchParams.get("key") ?? req.headers.get("x-webhook-key");
  return provided === secret;
}

function pickRecipient(data: ResendWebhookData | undefined): string {
  if (!data) return "";
  if (Array.isArray(data.to)) return data.to[0] ?? "";
  if (typeof data.to === "string") return data.to;
  return "";
}

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: ResendWebhookEnvelope;
  try {
    body = (await req.json()) as ResendWebhookEnvelope;
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const kind = TYPE_MAP[body.type ?? ""];
  if (!kind) {
    // Unknown type — ack without recording so Resend doesn't retry
    return NextResponse.json({ ok: true, ignored: body.type });
  }

  const email = pickRecipient(body.data).toLowerCase();
  if (!email) {
    return NextResponse.json({ ok: true, ignored: "no recipient" });
  }

  await recordBlastEvent({
    kind,
    email,
    at: body.created_at ?? new Date().toISOString(),
    messageId: body.data?.email_id,
  });

  return NextResponse.json({ ok: true });
}
