import { NextResponse } from "next/server";
import { authorizedCron } from "@/lib/brain/auth";
import { runHealthCheck } from "@/lib/brain/health-check";
import { loadBrain, todayKey } from "@/lib/brain-storage";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

/**
 * POST /api/brain/health
 * Header: x-brain-secret: <BRAIN_CRON_SECRET>
 *
 * Runs the self-healing health check. Detects data-integrity issues, stuck
 * phases, and pipeline anomalies. Auto-fixes safe issues. Sends an email to
 * ALERT_EMAIL (default mjrifat54@gmail.com) for critical problems that
 * cannot be auto-resolved.
 *
 * Called every 6 hours by the brain-health GitHub Actions workflow.
 */
export async function POST(req: Request) {
  if (!authorizedCron(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const report = await runHealthCheck();
    return NextResponse.json({
      ok: report.healthy,
      report,
    }, { status: report.healthy ? 200 : 207 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

/**
 * GET /api/brain/health — public status endpoint (no auth needed).
 * Returns a compact summary: healthy boolean + last check timestamp.
 */
export async function GET() {
  const date = todayKey();
  const { runs } = await loadBrain();
  const run = (runs ?? []).find((r) => r.date === date) ?? null;

  const phases = run?.phases ?? {};
  const failedPhases = Object.entries(phases)
    .filter(([k, v]) => {
      if (k === "fb") return (v as string[]).some((s) => s === "failed");
      return v === "failed";
    })
    .map(([k]) => k);

  return NextResponse.json({
    healthy: failedPhases.length === 0,
    date,
    phases: run?.phases ?? null,
    failedPhases,
    lastError: run?.lastError ?? null,
  });
}
