import {
  runLinkedInDraftTick as runLinkedInDraftTickCore,
  type LinkedInDrafterSummary,
} from "@/lib/brain/linkedin-drafter";

/**
 * Runner for the LinkedIn DM drafter tick — extracted from
 * `src/app/api/brain/linkedin-draft/route.ts` (POST) so it can run under
 * `tsx` inside GitHub Actions without any `next/*` imports.
 *
 * Returns the same `LinkedInDrafterSummary` the route returned in `summary`.
 */
export async function runLinkedInDraftTick(): Promise<LinkedInDrafterSummary> {
  return runLinkedInDraftTickCore();
}
