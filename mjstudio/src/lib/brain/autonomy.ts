import {
  loadBrain,
  saveBrain,
  logActivity,
  type Experiment,
  type ExperimentDimension,
  type PlannerOverride,
  type OutboundEmail,
} from "../brain-storage";
import { aggregate } from "./learning/aggregator";

/**
 * Phase 5 — Autonomous experimentation.
 *
 * The brain runs A/B experiments on itself, picks winners, and auto-updates
 * its own planner prompt to bias toward proven patterns. Safe by default:
 * BRAIN_AUTONOMY=true env var must be set for winners to auto-apply.
 * Without it, experiments are still proposed and scored but the recommended
 * override is only recorded, not activated.
 *
 * Lifecycle:
 *   1. PROPOSER (weekly)       — reads digest, creates Experiment
 *   2. APPLICATOR (per email)  — tags outbound with experimentId+variant
 *   3. SCORER (weekly)         — reads outbound, decides winner, writes PlannerOverride
 *   4. PLANNER (every run)     — reads plannerOverrides, biases prompt
 *
 * Safety:
 *   - Min sample size gate (default 30 per variant)
 *   - Min confidence gap (winner > loser by 50%+ relative)
 *   - Single active experiment per dimension at a time
 *   - Kill switch via BRAIN_AUTONOMY env var
 *   - Every decision logged with evidence in the activity feed
 */

const DEFAULT_WINDOW_DAYS = 14;
const DEFAULT_MIN_SAMPLES_PER_VARIANT = 30;
const MIN_RELATIVE_GAP = 0.5; // winner's reply rate must be ≥ 1.5x loser's
const OVERRIDE_EXPIRY_DAYS = 60; // winners archive after 2 months so the brain
                                  // re-tests and doesn't lock into yesterday's truth

function isAutonomyEnabled(): boolean {
  return process.env.BRAIN_AUTONOMY === "true";
}

function isoDaysFromNow(days: number): string {
  return new Date(Date.now() + days * 86_400_000).toISOString();
}

function isRunning(e: Experiment, now = Date.now()): boolean {
  if (e.status !== "running") return false;
  return new Date(e.endsAt).getTime() > now;
}

function countVariant(
  emails: OutboundEmail[],
  experimentId: string,
  variant: "A" | "B"
): { sent: number; opens: number; clicks: number; replies: number; replyRate: number } {
  const sent = emails.filter(
    (e) =>
      e.meta?.experimentId === experimentId &&
      e.meta?.experimentVariant === variant &&
      (e.status === "sent" || e.status === "bounced")
  );
  const opens = sent.filter((e) => (e.metrics?.opens ?? 0) > 0).length;
  const clicks = sent.filter((e) => (e.metrics?.clicks ?? 0) > 0).length;
  const replies = sent.filter((e) => e.metrics?.replied).length;
  return {
    sent: sent.length,
    opens,
    clicks,
    replies,
    replyRate: sent.length > 0 ? replies / sent.length : 0,
  };
}

/**
 * APPLICATOR — lookup the active experiment for a given dimension and
 * return an A/B variant assignment for this email. Returns undefined if
 * no active experiment applies.
 *
 * Deterministic per prospect (not per call) so the same prospect always
 * lands in the same arm if they get multiple touches in the window.
 */
export async function pickExperimentVariant(
  dimension: ExperimentDimension,
  prospectId: string
): Promise<{ experimentId: string; variant: "A" | "B"; value: string } | undefined> {
  const brain = await loadBrain();
  const active = (brain.experiments ?? []).find(
    (e) => e.dimension === dimension && isRunning(e)
  );
  if (!active) return undefined;
  // Stable hash on prospectId+experimentId → A or B
  let h = 0;
  const key = `${active.id}:${prospectId}`;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0;
  const variant: "A" | "B" = h % 2 === 0 ? "A" : "B";
  return {
    experimentId: active.id,
    variant,
    value: variant === "A" ? active.variantA : active.variantB,
  };
}

/**
 * PROPOSER — called after the weekly digest. Looks at the past 14 days of
 * outbound performance. If a single dimension has one bucket substantially
 * outperforming another (both with enough sample), AND no experiment is
 * currently running on that dimension, propose a new one pitting the
 * top 2 buckets against each other.
 */
export async function proposeExperiments(): Promise<{
  proposed: Experiment[];
  reason: string;
}> {
  const brain = await loadBrain();
  const now = new Date();
  const windowEnd = now.toISOString();
  const windowStart = new Date(now.getTime() - DEFAULT_WINDOW_DAYS * 86_400_000).toISOString();

  const outbound = brain.outboundQueue ?? [];
  const snapshot = aggregate(outbound, windowStart, windowEnd);

  const existing = brain.experiments ?? [];
  const runningDims = new Set(existing.filter((e) => isRunning(e)).map((e) => e.dimension));
  const proposed: Experiment[] = [];

  const dimensionMap: Array<{ dim: ExperimentDimension; buckets: Record<string, { sent: number; replyRate: number }> }> = [
    { dim: "angleIndex", buckets: mapBuckets(snapshot.byAngle.buckets, (k) => k.replace(/^angle-/, "")) },
    { dim: "subjectStyle", buckets: snapshot.bySubjectStyle.buckets as Record<string, { sent: number; replyRate: number }> },
  ];

  for (const { dim, buckets } of dimensionMap) {
    if (runningDims.has(dim)) continue;
    const ranked = Object.entries(buckets)
      .filter(([, r]) => r.sent >= 10) // need at least 10 in the past window
      .sort((a, b) => b[1].replyRate - a[1].replyRate);
    if (ranked.length < 2) continue;

    const [top, second] = ranked;
    // Only propose when there's a visible gap to test
    if (top[1].replyRate <= second[1].replyRate) continue;

    const exp: Experiment = {
      id: `exp_${dim}_${Date.now()}`,
      dimension: dim,
      variantA: top[0],
      variantB: second[0],
      startedAt: now.toISOString(),
      endsAt: isoDaysFromNow(DEFAULT_WINDOW_DAYS),
      status: "running",
      minSamples: DEFAULT_MIN_SAMPLES_PER_VARIANT,
      createdBy: "proposer",
    };
    proposed.push(exp);
    await logActivity({
      type: "insight-learned",
      description: `Autonomy proposed: ${dim} A/B (${top[0]} vs ${second[0]}) for ${DEFAULT_WINDOW_DAYS}d`,
    });
  }

  if (proposed.length > 0) {
    brain.experiments = [...existing, ...proposed];
    await saveBrain(brain);
  }

  return {
    proposed,
    reason: proposed.length > 0
      ? `Proposed ${proposed.length} experiment(s)`
      : "No new experiments — either all dimensions have running tests or no dimension has two buckets with ≥10 sends",
  };
}

function mapBuckets(
  src: Record<string, { sent: number; replyRate: number }>,
  keyMap: (k: string) => string
): Record<string, { sent: number; replyRate: number }> {
  const out: Record<string, { sent: number; replyRate: number }> = {};
  for (const [k, v] of Object.entries(src)) out[keyMap(k)] = v;
  return out;
}

/**
 * SCORER — iterates active experiments whose window has closed, counts
 * per-variant engagement, and declares a winner (or marks inconclusive).
 * When a winner is declared AND BRAIN_AUTONOMY=true, a PlannerOverride is
 * added so the planner biases toward the winning variant on next run.
 */
export async function scoreExperiments(): Promise<{
  decided: number;
  inconclusive: number;
  overridesApplied: number;
}> {
  const brain = await loadBrain();
  const now = Date.now();
  const outbound = brain.outboundQueue ?? [];
  let decided = 0;
  let inconclusive = 0;
  let overridesApplied = 0;
  const autonomy = isAutonomyEnabled();

  for (const exp of brain.experiments ?? []) {
    if (exp.status !== "running") continue;
    if (new Date(exp.endsAt).getTime() > now) continue;

    const a = countVariant(outbound, exp.id, "A");
    const b = countVariant(outbound, exp.id, "B");
    const totalSamples = a.sent + b.sent;
    const minPerVariant = exp.minSamples;

    // Not enough data to decide
    if (a.sent < minPerVariant || b.sent < minPerVariant) {
      exp.status = "inconclusive";
      exp.decidedAt = new Date().toISOString();
      exp.decision = {
        variantAStats: a,
        variantBStats: b,
        rationale: `Inconclusive: need ${minPerVariant}/variant, got A=${a.sent} B=${b.sent}`,
        applied: false,
      };
      inconclusive++;
      await logActivity({
        type: "insight-learned",
        description: `Autonomy: ${exp.dimension} experiment INCONCLUSIVE — ${a.sent}/${b.sent} samples, needed ${minPerVariant}/variant`,
      });
      continue;
    }

    // Both variants have zero replies → can't declare a winner
    if (a.replies === 0 && b.replies === 0) {
      exp.status = "inconclusive";
      exp.decidedAt = new Date().toISOString();
      exp.decision = {
        variantAStats: a,
        variantBStats: b,
        rationale: `Inconclusive: zero replies on both arms after ${totalSamples} sends`,
        applied: false,
      };
      inconclusive++;
      continue;
    }

    // Compare reply rates
    const winner: "A" | "B" = a.replyRate >= b.replyRate ? "A" : "B";
    const winnerStats = winner === "A" ? a : b;
    const loserStats = winner === "A" ? b : a;
    const gap = loserStats.replyRate > 0
      ? (winnerStats.replyRate - loserStats.replyRate) / loserStats.replyRate
      : Infinity;

    // Gap too small → inconclusive (prevents committing to noise)
    if (gap < MIN_RELATIVE_GAP) {
      exp.status = "inconclusive";
      exp.decidedAt = new Date().toISOString();
      exp.decision = {
        variantAStats: a,
        variantBStats: b,
        rationale: `Inconclusive: gap ${(gap * 100).toFixed(0)}% below threshold ${(MIN_RELATIVE_GAP * 100).toFixed(0)}%`,
        applied: false,
      };
      inconclusive++;
      await logActivity({
        type: "insight-learned",
        description: `Autonomy: ${exp.dimension} experiment INCONCLUSIVE — gap too small (${(gap * 100).toFixed(0)}%)`,
      });
      continue;
    }

    // Declare winner
    const winningValue = winner === "A" ? exp.variantA : exp.variantB;
    exp.status = "decided";
    exp.winner = winner;
    exp.decidedAt = new Date().toISOString();
    exp.decision = {
      variantAStats: a,
      variantBStats: b,
      rationale: `${winner} won: ${(winnerStats.replyRate * 100).toFixed(1)}% vs ${(loserStats.replyRate * 100).toFixed(1)}% (gap ${(gap * 100).toFixed(0)}%)`,
      applied: autonomy,
    };
    decided++;

    if (autonomy) {
      const override: PlannerOverride = {
        id: `ovr_${exp.id}`,
        experimentId: exp.id,
        dimension: exp.dimension,
        preferValue: winningValue,
        appliedAt: new Date().toISOString(),
        expiresAt: isoDaysFromNow(OVERRIDE_EXPIRY_DAYS),
      };
      brain.plannerOverrides = [...(brain.plannerOverrides ?? []), override];
      overridesApplied++;
      await logActivity({
        type: "insight-learned",
        description: `Autonomy APPLIED: ${exp.dimension}=${winningValue} (${exp.decision.rationale})`,
      });
    } else {
      await logActivity({
        type: "insight-learned",
        description: `Autonomy DECIDED (not applied — BRAIN_AUTONOMY off): ${exp.dimension}=${winningValue} would be preferred (${exp.decision.rationale})`,
      });
    }
  }

  if (decided + inconclusive > 0) {
    await saveBrain(brain);
  }

  return { decided, inconclusive, overridesApplied };
}

/**
 * PLANNER HELPER — returns the active override text the planner appends to
 * its system prompt. Excludes expired overrides automatically.
 */
export async function loadActivePlannerOverrides(): Promise<string> {
  const brain = await loadBrain();
  const now = Date.now();
  const active = (brain.plannerOverrides ?? []).filter(
    (o) => !o.expiresAt || new Date(o.expiresAt).getTime() > now
  );
  if (active.length === 0) return "";
  const lines = active.map(
    (o) => `- Prefer ${o.dimension} = "${o.preferValue}" (from experiment ${o.experimentId})`
  );
  return `\n\nACTIVE AUTONOMY OVERRIDES (learned from past experiments — bias your output toward these):\n${lines.join("\n")}\n`;
}
