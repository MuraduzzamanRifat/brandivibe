import { NextResponse } from "next/server";
import { runBlastTick } from "@/lib/brain/blast";
import { authorizedCron } from "@/lib/brain/auth";

/**
 * POST /api/blast/tick
 * Header: x-brain-secret: <BRAIN_CRON_SECRET> (optional in dev)
 *
 * Runs one blast tick: reads the next dailyCap rows from the list, sends
 * them through Resend with bounded parallelism, advances the cursor,
 * persists. Idempotent — won't exceed today's cap if called multiple times.
 *
 * Manually triggerable from the Blast tab "Run tick now" button.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(req: Request) {
  if (!authorizedCron(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const summary = await runBlastTick();
    return NextResponse.json({ ok: true, summary });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
