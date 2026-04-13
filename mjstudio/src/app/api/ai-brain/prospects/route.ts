import { NextResponse } from "next/server";
import { loadBrain, seedIfEmpty } from "@/lib/brain-storage";
import { SEED_PROSPECTS } from "@/data/seed-prospects";

/**
 * GET /api/ai-brain/prospects — returns all prospects + drafts.
 * Auto-seeds the storage on first run (if empty) with 10 fictional Tier A leads.
 */
export async function GET() {
  const seeded = await seedIfEmpty(SEED_PROSPECTS);
  const data = await loadBrain();
  return NextResponse.json({
    ...data,
    seeded: seeded > 0 ? seeded : undefined,
  });
}
