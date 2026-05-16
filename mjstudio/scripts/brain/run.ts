/**
 * Brain task dispatcher — the GitHub-Actions entrypoint that replaces the
 * old "curl Koyeb /api/brain/*" model. Koyeb is gone; the brain now runs
 * directly inside GitHub Actions.
 *
 *   npx tsx scripts/brain/run.ts <task>
 *
 * task ∈ daily | hourly | source-pulse | twitter-intent | linkedin-draft
 *      | daily-digest-email | health | learning-digest | blast-daily
 *
 * Each task calls the matching runner in src/lib/brain/runners/* (verbatim
 * extractions of the old route-handler orchestration, no next/* imports).
 * brain.json is read/written via the GitHub Contents API when GITHUB_REPO +
 * GITHUB_TOKEN are set (they are, in the workflows), so state persists by
 * committing mjstudio/data/brain.json back to the repo — which in turn
 * triggers deploy-static.yml so new articles/audit pages go live.
 *
 * Exit code: 0 on success, 1 if the task reported errors (so the workflow
 * run shows red and the operator gets notified).
 */

import { runDaily } from "@/lib/brain/runners/run-daily";
import { runHourlyTick } from "@/lib/brain/runners/hourly";
import { runSourcePulse } from "@/lib/brain/runners/source-pulse";
import { runTwitterIntentTick } from "@/lib/brain/runners/twitter-intent";
import { runLinkedInDraftTick } from "@/lib/brain/runners/linkedin-draft";
import { runDailyDigestEmail } from "@/lib/brain/runners/daily-digest-email";
import { runHealthCheck } from "@/lib/brain/runners/health";
import { runLearningDigest } from "@/lib/brain/runners/learning-digest";
import { runBlastDaily } from "@/lib/brain/runners/blast-daily";

type TaskResult = { errors?: unknown[]; ok?: boolean; healthy?: boolean };

const TASKS: Record<string, () => Promise<unknown>> = {
  daily: runDaily,
  hourly: runHourlyTick,
  "source-pulse": runSourcePulse,
  "twitter-intent": runTwitterIntentTick,
  "linkedin-draft": runLinkedInDraftTick,
  "daily-digest-email": runDailyDigestEmail,
  health: runHealthCheck,
  "learning-digest": runLearningDigest,
  "blast-daily": runBlastDaily,
};

/** A task "failed" if it returned an errors[] with entries, or ok/healthy:false. */
function taskFailed(result: unknown): boolean {
  if (!result || typeof result !== "object") return false;
  const r = result as TaskResult;
  if (Array.isArray(r.errors) && r.errors.length > 0) return true;
  if (r.ok === false) return true;
  if (r.healthy === false) return true;
  return false;
}

async function main() {
  const task = process.argv[2];
  if (!task || !(task in TASKS)) {
    console.error(
      `[brain] unknown task "${task ?? ""}". valid: ${Object.keys(TASKS).join(", ")}`
    );
    process.exit(2);
  }

  const started = Date.now();
  console.log(`[brain] task=${task} starting at ${new Date().toISOString()}`);

  try {
    const result = await TASKS[task]();
    const durationMs = Date.now() - started;
    console.log(`[brain] task=${task} done in ${durationMs}ms`);
    console.log(JSON.stringify(result, null, 2));

    if (taskFailed(result)) {
      console.error(`[brain] task=${task} reported errors — exiting 1`);
      process.exit(1);
    }
    process.exit(0);
  } catch (err) {
    const msg = err instanceof Error ? (err.stack ?? err.message) : String(err);
    console.error(`[brain] task=${task} threw:\n${msg}`);
    process.exit(1);
  }
}

void main();
