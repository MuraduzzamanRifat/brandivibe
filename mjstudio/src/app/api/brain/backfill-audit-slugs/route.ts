import { NextResponse } from "next/server";
import { authorizedCron } from "@/lib/brain/auth";
import { loadBrain, saveBrain, makeAuditSlug, logActivity } from "@/lib/brain-storage";

/**
 * POST /api/brain/backfill-audit-slugs
 * Header: x-brain-secret: <BRAIN_CRON_SECRET>
 *
 * One-shot migration that assigns auditSlug to every existing prospect that
 * doesn't already have one. Stable URL gets baked in, future visits to
 * /audit/<slug> resolve to that prospect's personalized audit page.
 *
 * Safe to re-run — only fills missing slugs.
 */

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!authorizedCron(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const brain = await loadBrain();
  const usedSlugs = new Set(
    brain.prospects.map((p) => p.auditSlug).filter((s): s is string => Boolean(s))
  );

  const filled: Array<{ company: string; slug: string }> = [];
  for (const prospect of brain.prospects) {
    if (prospect.auditSlug) continue;
    const slug = makeAuditSlug(prospect.company, usedSlugs);
    prospect.auditSlug = slug;
    usedSlugs.add(slug);
    filled.push({ company: prospect.company, slug });
  }

  if (filled.length > 0) {
    await saveBrain(brain);
    await logActivity({
      type: "source-run",
      description: `Backfilled audit slugs for ${filled.length} existing prospects`,
    });
  }

  return NextResponse.json({
    ok: true,
    filled: filled.length,
    totalProspects: brain.prospects.length,
    samples: filled.slice(0, 10),
  });
}

export async function GET() {
  const brain = await loadBrain();
  const withSlug = brain.prospects.filter((p) => p.auditSlug).length;
  return NextResponse.json({
    total: brain.prospects.length,
    withSlug,
    withoutSlug: brain.prospects.length - withSlug,
  });
}
