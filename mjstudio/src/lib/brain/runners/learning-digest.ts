import { runLearningDigest as runLearningDigestCore, type DigestSummary } from "@/lib/brain/learning/digest";

/**
 * Runner for the weekly learning digest — extracted from
 * `src/app/api/brain/learning/digest/route.ts` (POST) so it can run under
 * `tsx` inside GitHub Actions without any `next/*` imports.
 *
 * Returns the same `DigestSummary` the route returned in `summary`.
 */
export async function runLearningDigest(): Promise<DigestSummary> {
  return runLearningDigestCore();
}
