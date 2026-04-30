import { NextResponse } from "next/server";
import { authorizedCron } from "@/lib/brain/auth";
import { runLinkedInDraftTick } from "@/lib/brain/linkedin-drafter";
import { loadBrain, saveBrain } from "@/lib/brain-storage";

/**
 * POST /api/brain/linkedin-draft
 * Header: x-brain-secret: <BRAIN_CRON_SECRET>
 *
 * Generates LinkedIn DM drafts for top-tier prospects who have a linkedin
 * handle. Drafts queue up in brain.linkedinDrafts for manual review.
 *
 * GET returns the current draft queue for dashboard display.
 * PATCH updates a draft's status (sent/rejected) — body { id, status }.
 */

export const maxDuration = 120;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!authorizedCron(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const summary = await runLinkedInDraftTick();
  return NextResponse.json({ ok: summary.errors.length === 0, summary });
}

export async function GET() {
  const brain = await loadBrain();
  return NextResponse.json({
    drafts: (brain.linkedinDrafts ?? []).slice().reverse(),
    queued: (brain.linkedinDrafts ?? []).filter((d) => d.status === "queued").length,
  });
}

export async function PATCH(req: Request) {
  if (!authorizedCron(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as { id?: string; status?: "sent" | "rejected" };
  if (!body.id || !body.status) {
    return NextResponse.json({ error: "id and status required" }, { status: 400 });
  }
  const brain = await loadBrain();
  const draft = (brain.linkedinDrafts ?? []).find((d) => d.id === body.id);
  if (!draft) return NextResponse.json({ error: "not found" }, { status: 404 });
  draft.status = body.status;
  if (body.status === "sent") draft.sentAt = new Date().toISOString();
  await saveBrain(brain);
  return NextResponse.json({ ok: true, draft });
}
