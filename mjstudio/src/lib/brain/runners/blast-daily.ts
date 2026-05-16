import { runBlastTick, type BlastTickSummary } from "@/lib/brain/blast";

/**
 * Runner for the daily blast (cold-email drip) tick — extracted from
 * `src/app/api/blast/tick/route.ts` (POST) so it can run under `tsx` inside
 * GitHub Actions without any `next/*` imports.
 *
 * Returns the same `BlastTickSummary` the route returned in `summary`.
 */
export async function runBlastDaily(): Promise<BlastTickSummary> {
  return runBlastTick();
}
