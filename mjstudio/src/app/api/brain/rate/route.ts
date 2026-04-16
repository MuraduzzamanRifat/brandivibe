import { NextResponse } from "next/server";
import { rateItem, logActivity } from "@/lib/brain-storage";

export const dynamic = "force-dynamic";

/**
 * POST /api/brain/rate { kind: "article"|"fbPost"|"draft"|"plan", id, vote: "up"|"down" }
 * Manual human-in-the-loop signal for self-learning.
 */
export async function POST(req: Request) {
  let body: { kind?: "article" | "fbPost" | "draft" | "plan"; id?: string; vote?: "up" | "down" };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }
  if (!body.kind || !body.id || !body.vote) {
    return NextResponse.json({ error: "kind, id, vote required" }, { status: 400 });
  }
  const ok = await rateItem(body.kind, body.id, body.vote);
  if (!ok) return NextResponse.json({ error: "not found" }, { status: 404 });
  await logActivity({
    type: "rated",
    description: `${body.vote === "up" ? "👍" : "👎"} ${body.kind} ${body.id}`,
  });
  return NextResponse.json({ ok: true });
}
