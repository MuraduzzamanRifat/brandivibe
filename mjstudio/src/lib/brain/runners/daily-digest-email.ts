import { sendDailyDigest } from "@/lib/brain/daily-digest-email";

/**
 * Runner for the daily activity-digest email — extracted from
 * `src/app/api/brain/daily-digest-email/route.ts` (POST) so it can run under
 * `tsx` inside GitHub Actions without any `next/*` imports.
 *
 * Returns the same object `sendDailyDigest()` returns — i.e. exactly what the
 * route serialized: `{ ok, error?, stats, recipient }`.
 */
export async function runDailyDigestEmail(): ReturnType<typeof sendDailyDigest> {
  return sendDailyDigest();
}
