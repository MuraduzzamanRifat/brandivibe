import { NextResponse } from "next/server";
import { authorizedCron } from "@/lib/brain/auth";
import { sendDailyDigest, buildDailyDigest } from "@/lib/brain/daily-digest-email";

/**
 * POST /api/brain/daily-digest-email — sends yesterday's activity digest
 * to NOTIFICATION_EMAIL via Resend. Header: x-brain-secret.
 *
 * GET — returns the rendered stats without sending. Useful for previewing.
 */

export const maxDuration = 30;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!authorizedCron(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const result = await sendDailyDigest();
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}

export async function GET() {
  const stats = await buildDailyDigest();
  return NextResponse.json({ ok: true, stats, note: "POST with x-brain-secret to actually send" });
}
