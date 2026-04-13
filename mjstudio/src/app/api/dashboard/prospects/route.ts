import { NextResponse } from "next/server";
import { loadBrain } from "@/lib/brain-storage";

/**
 * GET /api/dashboard/prospects — returns all prospects + drafts from brain.json.
 * No auto-seed: real prospects come from POST /api/dashboard/source.
 */
export async function GET() {
  const data = await loadBrain();
  return NextResponse.json(data);
}
