import { NextResponse } from "next/server";
import { loadBrain, saveBrain, logActivity } from "@/lib/brain-storage";
import { authorizedCron } from "@/lib/brain/auth";
import { proposeExperiments, scoreExperiments } from "@/lib/brain/autonomy";

/**
 * GET  /api/brain/experiments
 *   Returns all experiments + active overrides. No auth — read-only visibility.
 *
 * POST /api/brain/experiments
 *   Header: x-brain-secret: <BRAIN_CRON_SECRET>
 *   Body: { action: "propose" | "score" | "cancel", experimentId?: string }
 *   Manual control for running the proposer/scorer outside the weekly digest,
 *   or cancelling an experiment mid-flight.
 */

export const dynamic = "force-dynamic";

export async function GET() {
  const brain = await loadBrain();
  const now = Date.now();
  const overrides = (brain.plannerOverrides ?? []).filter(
    (o) => !o.expiresAt || new Date(o.expiresAt).getTime() > now
  );
  return NextResponse.json({
    autonomyEnabled: process.env.BRAIN_AUTONOMY === "true",
    experiments: brain.experiments ?? [],
    activeOverrides: overrides,
  });
}

export async function POST(req: Request) {
  if (!authorizedCron(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as {
    action?: "propose" | "score" | "cancel";
    experimentId?: string;
  };

  switch (body.action) {
    case "propose": {
      const out = await proposeExperiments();
      return NextResponse.json({ ok: true, ...out });
    }
    case "score": {
      const out = await scoreExperiments();
      return NextResponse.json({ ok: true, ...out });
    }
    case "cancel": {
      if (!body.experimentId) {
        return NextResponse.json({ error: "experimentId required" }, { status: 400 });
      }
      const brain = await loadBrain();
      const exp = (brain.experiments ?? []).find((e) => e.id === body.experimentId);
      if (!exp) return NextResponse.json({ error: "not found" }, { status: 404 });
      exp.status = "cancelled";
      exp.decidedAt = new Date().toISOString();
      await saveBrain(brain);
      await logActivity({
        type: "insight-learned",
        description: `Autonomy: experiment ${exp.id} cancelled manually`,
      });
      return NextResponse.json({ ok: true, cancelled: exp.id });
    }
    default:
      return NextResponse.json({ error: "action required: propose | score | cancel" }, { status: 400 });
  }
}
