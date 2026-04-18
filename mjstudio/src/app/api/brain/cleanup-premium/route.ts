import { NextResponse } from "next/server";
import { loadBrain, saveBrain, logActivity } from "@/lib/brain-storage";
import { authorizedCron } from "@/lib/brain/auth";
import { detectPremiumDesign } from "@/lib/brain/premium-detect";

/**
 * POST /api/brain/cleanup-premium
 * Header: x-brain-secret: <BRAIN_CRON_SECRET>
 *
 * One-shot migration: re-evaluates every prospect that has a scraped site
 * and marks those with premium-already designs as status=lost so they won't
 * be emailed going forward.
 *
 * Safe to re-run — already-lost prospects are skipped.
 */

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!authorizedCron(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const brain = await loadBrain();
  const flagged: Array<{ company: string; reasons: string[] }> = [];

  for (const p of brain.prospects) {
    if (!p.scraped) continue;
    if (p.status === "lost") continue;
    const result = detectPremiumDesign(p.scraped);
    if (!result.isPremium) continue;
    p.status = "lost";
    p.notes = `Auto-skipped (cleanup): ${result.reasons.join("; ")}`;
    p.updatedAt = new Date().toISOString();
    flagged.push({ company: p.company, reasons: result.reasons });
  }

  if (flagged.length > 0) {
    // Also suppress any queued outbound for these prospects
    const lostIds = new Set(
      brain.prospects.filter((p) => p.status === "lost").map((p) => p.id)
    );
    let suppressedCount = 0;
    for (const e of brain.outboundQueue ?? []) {
      if (e.status === "queued" && lostIds.has(e.prospectId)) {
        e.status = "suppressed";
        e.failReason = "prospect already has premium design — out of ICP";
        suppressedCount++;
      }
    }
    await saveBrain(brain);
    await logActivity({
      type: "source-run",
      description: `Premium-design cleanup: flagged ${flagged.length} existing prospects as lost, suppressed ${suppressedCount} queued emails`,
    });
    return NextResponse.json({
      ok: true,
      flagged: flagged.length,
      suppressedQueued: suppressedCount,
      details: flagged,
    });
  }

  return NextResponse.json({ ok: true, flagged: 0, message: "No premium-already prospects found" });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    usage: "POST with x-brain-secret header to re-evaluate all scraped prospects",
  });
}
