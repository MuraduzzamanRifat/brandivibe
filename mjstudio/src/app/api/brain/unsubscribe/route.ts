import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { markUnsubscribed, logActivity } from "@/lib/brain-storage";

/**
 * GET  /api/brain/unsubscribe?p=<prospectId>&s=<sig>
 * POST (List-Unsubscribe one-click RFC 8058)
 *
 * HMAC-signed unsubscribe link. Verifies signature before marking the
 * prospect as unsubscribed. Returns a plain-text confirmation page (no
 * JS) so the endpoint works inside every mail client.
 */

function verify(prospectId: string, sig: string): boolean {
  const secret = process.env.BRAIN_CRON_SECRET;
  if (!secret) {
    // Without a secret we cannot verify signatures — reject all unsubscribe attempts.
    // The prospect can reply "stop" to be removed manually.
    console.error("[unsubscribe] BRAIN_CRON_SECRET not set — cannot verify signature");
    return false;
  }
  const expected = createHmac("sha256", secret).update(prospectId).digest("hex").slice(0, 16);
  return expected === sig;
}

async function handle(prospectId: string | null, sig: string | null): Promise<Response> {
  if (!prospectId || !sig || !verify(prospectId, sig)) {
    return new Response(
      "Invalid unsubscribe link. If you meant to unsubscribe, reply 'stop' and I will remove you manually.",
      { status: 400, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }

  await markUnsubscribed(prospectId);
  await logActivity({
    type: "unsubscribed",
    description: `Prospect ${prospectId} unsubscribed via email link`,
    prospectId,
  });

  return new Response(
    "You've been unsubscribed from Brandivibe outreach. You won't receive any more emails from me. — Muraduzzaman",
    { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } }
  );
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  return handle(url.searchParams.get("p"), url.searchParams.get("s"));
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  return handle(url.searchParams.get("p"), url.searchParams.get("s"));
}
