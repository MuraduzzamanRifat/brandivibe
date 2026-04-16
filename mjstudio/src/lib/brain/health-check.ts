/**
 * Brain self-health checker.
 *
 * Runs every 6 hours via /api/brain/health (POST, cron-authenticated).
 * Detects data-integrity problems, stuck phases, stale runs, and pipeline
 * anomalies. Returns structured findings so the dashboard can display them
 * and so the notification mailer knows what to send.
 *
 * Auto-fixes are attempted for safe, idempotent issues. Anything that
 * requires human judgment is flagged as "critical" and triggers an email
 * to ALERT_EMAIL.
 */

import {
  loadBrain,
  saveBrain,
  bustBrainCache,
  todayKey,
  type DailyRun,
} from "../brain-storage";
import { resendSend } from "./sender";

const ALERT_EMAIL = process.env.ALERT_EMAIL || "mjrifat54@gmail.com";
const SITE = "https://brandivibe.com";

export type HealthFinding = {
  severity: "critical" | "warning" | "info";
  code: string;
  message: string;
  autoFixed: boolean;
};

export type HealthReport = {
  checkedAt: string;
  healthy: boolean;
  findings: HealthFinding[];
  autoFixed: number;
  emailSent: boolean;
};

/** Attempt a lightweight self-repair and return whether it succeeded. */
async function tryAutoFix(code: string): Promise<boolean> {
  switch (code) {
    case "BLAST_PHASE_MISSING": {
      // Backfill blast phase on today's run — getOrCreateRun already handles
      // this now, so just bust the cache and reload to trigger the backfill.
      bustBrainCache();
      const data = await loadBrain();
      const run = (data.runs ?? []).find((r) => r.date === todayKey());
      if (run && !run.phases.blast) {
        run.phases.blast = "pending";
        await saveBrain(data);
        return true;
      }
      return false;
    }
    case "OUTBOUND_QUEUE_OVERFLOW": {
      // Trim outbound queue to last 2000 entries
      const data = await loadBrain();
      if ((data.outboundQueue ?? []).length > 2000) {
        data.outboundQueue = data.outboundQueue!.slice(-2000);
        await saveBrain(data);
        return true;
      }
      return false;
    }
    case "ACTIVITIES_OVERFLOW": {
      const data = await loadBrain();
      if ((data.activities ?? []).length > 500) {
        data.activities = data.activities!.slice(0, 500);
        await saveBrain(data);
        return true;
      }
      return false;
    }
    default:
      return false;
  }
}

export async function runHealthCheck(): Promise<HealthReport> {
  bustBrainCache(); // always read fresh state from GitHub
  const data = await loadBrain();
  const now = new Date();
  const today = todayKey();
  const findings: HealthFinding[] = [];
  let autoFixedCount = 0;

  // ── 1. Today's DailyRun exists ───────────────────────────────────────────
  const todayRun = (data.runs ?? []).find((r) => r.date === today);
  if (!todayRun) {
    findings.push({
      severity: "warning",
      code: "NO_RUN_TODAY",
      message: `No DailyRun record for ${today}. Brain cron may not have fired yet.`,
      autoFixed: false,
    });
  } else {
    // ── 2. blast phase initialized ─────────────────────────────────────────
    if (!todayRun.phases.blast) {
      const fixed = await tryAutoFix("BLAST_PHASE_MISSING");
      findings.push({
        severity: "warning",
        code: "BLAST_PHASE_MISSING",
        message: "blast phase missing from today's DailyRun — backfilled to 'pending'",
        autoFixed: fixed,
      });
      if (fixed) autoFixedCount++;
    }

    // ── 3. Critical phases not stuck in 'failed' ──────────────────────────
    const criticalPhases = ["plan", "article", "score"] as const;
    for (const phase of criticalPhases) {
      if (todayRun.phases[phase] === "failed") {
        findings.push({
          severity: "critical",
          code: `PHASE_FAILED_${phase.toUpperCase()}`,
          message: `Phase '${phase}' failed today. Last error: ${todayRun.lastError ?? "unknown"}`,
          autoFixed: false,
        });
      }
    }

    // ── 4. Stale run (started > 6h ago, plan still pending) ───────────────
    const startedHoursAgo =
      (now.getTime() - new Date(todayRun.startedAt).getTime()) / 3_600_000;
    if (startedHoursAgo > 6 && todayRun.phases.plan === "pending") {
      findings.push({
        severity: "critical",
        code: "RUN_STALE_PLAN_PENDING",
        message: `DailyRun started ${Math.round(startedHoursAgo)}h ago but plan phase is still pending. Cron may be broken.`,
        autoFixed: false,
      });
    }
  }

  // ── 5. GitHub sync reachable ─────────────────────────────────────────────
  const { isGithubStorageEnabled, pullBrainJson } = await import("../github-storage");
  if (isGithubStorageEnabled()) {
    try {
      await pullBrainJson();
    } catch {
      findings.push({
        severity: "critical",
        code: "GITHUB_SYNC_UNREACHABLE",
        message: "GitHub Contents API call failed — GITHUB_TOKEN may be expired or GITHUB_REPO misconfigured.",
        autoFixed: false,
      });
    }
  } else {
    findings.push({
      severity: "warning",
      code: "GITHUB_SYNC_DISABLED",
      message: "GITHUB_REPO or GITHUB_TOKEN not set — brain data will be lost on redeploy.",
      autoFixed: false,
    });
  }

  // ── 6. Outbound queue overflow ────────────────────────────────────────────
  if ((data.outboundQueue ?? []).length > 2000) {
    const fixed = await tryAutoFix("OUTBOUND_QUEUE_OVERFLOW");
    findings.push({
      severity: "warning",
      code: "OUTBOUND_QUEUE_OVERFLOW",
      message: `outboundQueue has ${data.outboundQueue!.length} entries (>2000). Trimmed oldest.`,
      autoFixed: fixed,
    });
    if (fixed) autoFixedCount++;
  }

  // ── 7. Activities overflow ────────────────────────────────────────────────
  if ((data.activities ?? []).length > 500) {
    const fixed = await tryAutoFix("ACTIVITIES_OVERFLOW");
    findings.push({
      severity: "warning",
      code: "ACTIVITIES_OVERFLOW",
      message: `activities log has ${data.activities!.length} entries (>500). Trimmed.`,
      autoFixed: fixed,
    });
    if (fixed) autoFixedCount++;
  }

  // ── 8. Stuck queued emails (queued > 7 days ago) ─────────────────────────
  const stuckEmails = (data.outboundQueue ?? []).filter((e) => {
    if (e.status !== "queued") return false;
    const ageDays = (now.getTime() - new Date(e.sendAt).getTime()) / 86_400_000;
    return ageDays > 7;
  });
  if (stuckEmails.length > 0) {
    findings.push({
      severity: "warning",
      code: "STUCK_QUEUED_EMAILS",
      message: `${stuckEmails.length} emails have been queued for >7 days without sending. RESEND_API_KEY may be missing.`,
      autoFixed: false,
    });
  }

  // ── 9. No prospects (brain may be empty) ─────────────────────────────────
  if ((data.prospects ?? []).length === 0) {
    findings.push({
      severity: "warning",
      code: "NO_PROSPECTS",
      message: "No prospects in brain. Source tick may not have run yet, or GITHUB_TOKEN is missing.",
      autoFixed: false,
    });
  }

  // ── 10. No articles published yet ────────────────────────────────────────
  if ((data.articles ?? []).length === 0) {
    findings.push({
      severity: "info",
      code: "NO_ARTICLES",
      message: "No articles published yet. First daily tick will create one.",
      autoFixed: false,
    });
  }

  const criticals = findings.filter((f) => f.severity === "critical");
  const healthy = criticals.length === 0;

  // ── Send email alert for critical findings ────────────────────────────────
  let emailSent = false;
  if (criticals.length > 0) {
    const subject = `[Brandivibe Brain] ${criticals.length} critical issue${criticals.length > 1 ? "s" : ""} detected`;
    const body = [
      `Brain health check found ${criticals.length} critical issue(s) at ${now.toISOString()}:`,
      "",
      ...criticals.map((f, i) => `${i + 1}. [${f.code}] ${f.message}`),
      "",
      `All findings (${findings.length} total):`,
      ...findings.map((f) => `  ${f.severity.toUpperCase()} ${f.code}: ${f.message}${f.autoFixed ? " [AUTO-FIXED]" : ""}`),
      "",
      `Dashboard: ${SITE}/dashboard`,
      `Run daily endpoint: POST ${SITE}/api/brain/run-daily`,
    ].join("\n");

    const result = await resendSend({
      from: process.env.RESEND_FROM_EMAIL || "hello@send.brandivibe.site",
      to: [ALERT_EMAIL],
      subject,
      text: body,
    });
    emailSent = result.ok;
    if (!result.ok) {
      console.error("[health] Alert email failed:", result.error);
    }
  }

  return {
    checkedAt: now.toISOString(),
    healthy,
    findings,
    autoFixed: autoFixedCount,
    emailSent,
  };
}
