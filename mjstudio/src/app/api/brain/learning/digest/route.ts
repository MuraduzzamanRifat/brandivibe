import { NextResponse } from "next/server";
import { runLearningDigest } from "@/lib/brain/learning/digest";
import { authorizedCron } from "@/lib/brain/auth";
import { aggregate } from "@/lib/brain/learning/aggregator";
import { loadBrain } from "@/lib/brain-storage";

/**
 * POST /api/brain/learning/digest
 * Header: x-brain-secret: <BRAIN_CRON_SECRET>
 *
 * Runs the weekly learning digest — aggregates last 7 days of outbound
 * email performance, writes LearningEntry records with winners / losers.
 *
 * Safe to run multiple times — re-running updates the same date-keyed
 * entries (addLearning appends, so repeated runs create duplicates; the
 * hourly tick should only call this once per day via the daily-run gate).
 *
 * GET returns the current snapshot without writing anything (read-only probe).
 */

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!authorizedCron(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const summary = await runLearningDigest();
  return NextResponse.json({ ok: summary.ran, summary });
}

export async function GET() {
  const brain = await loadBrain();
  const now = new Date();
  const windowEnd = now.toISOString();
  const windowStart = new Date(now.getTime() - 7 * 86_400_000).toISOString();
  const snapshot = aggregate(brain.outboundQueue ?? [], windowStart, windowEnd);
  return NextResponse.json({ ok: true, snapshot });
}
