import { NextResponse } from "next/server";
import { loadBrain, updateFbPost, logActivity } from "@/lib/brain-storage";
import { approveQueuedFbPost } from "@/lib/brain/fb";

export const dynamic = "force-dynamic";

/**
 * GET /api/brain/queue — returns fbQueue + plans
 * POST /api/brain/queue { id, action: "approve" | "reject" }
 */

export async function GET() {
  const brain = await loadBrain();
  return NextResponse.json({
    fbQueue: brain.fbQueue ?? [],
    plans: brain.plans ?? [],
    learning: brain.learning ?? [],
  });
}

export async function POST(req: Request) {
  let body: { id?: string; action?: "approve" | "reject" };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }
  if (!body.id || !body.action) {
    return NextResponse.json({ error: "id and action required" }, { status: 400 });
  }
  if (body.action === "approve") {
    await approveQueuedFbPost(body.id);
    await logActivity({
      type: "fb-published",
      description: `Approved queued FB post ${body.id}`,
      fbPostId: body.id,
    });
    return NextResponse.json({ ok: true });
  }
  if (body.action === "reject") {
    await updateFbPost(body.id, { status: "rejected" });
    await logActivity({
      type: "fb-rejected",
      description: `Rejected FB post ${body.id}`,
      fbPostId: body.id,
    });
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
