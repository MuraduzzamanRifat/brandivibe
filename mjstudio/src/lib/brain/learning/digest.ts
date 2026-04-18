import { aggregate, type LearningSnapshot, type Rates } from "./aggregator";
import { loadBrain, addLearning, logActivity } from "../../brain-storage";
import { proposeExperiments, scoreExperiments } from "../autonomy";

/**
 * Weekly learning digest. Aggregates the last 7 days of outbound email
 * performance, extracts the winning + losing patterns, and writes them as
 * LearningEntry records the planner will see on the next run.
 *
 * Run weekly via a cron workflow — idempotent (writes ≤1 entry per signal
 * per call, keyed by date).
 */

const WINDOW_DAYS = 7;
const MIN_SENDS_FOR_SIGNAL = 5;

function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

function formatWinner(p: { dimension: string; bucket: string; rates: Rates }): string {
  return `${p.dimension}=${p.bucket} → ${pct(p.rates.replyRate)} reply rate, ${pct(p.rates.openRate)} open rate (n=${p.rates.sent})`;
}

export type DigestSummary = {
  ran: boolean;
  reason?: string;
  windowStart?: string;
  windowEnd?: string;
  totalSends?: number;
  insightsWritten?: number;
  snapshot?: LearningSnapshot;
};

export async function runLearningDigest(): Promise<DigestSummary> {
  const brain = await loadBrain();
  const now = new Date();
  const windowEnd = now.toISOString();
  const windowStart = new Date(now.getTime() - WINDOW_DAYS * 86_400_000).toISOString();

  const outbound = brain.outboundQueue ?? [];
  const snapshot = aggregate(outbound, windowStart, windowEnd);

  if (snapshot.overall.sent < MIN_SENDS_FOR_SIGNAL) {
    return {
      ran: false,
      reason: `only ${snapshot.overall.sent} sends in window — need ${MIN_SENDS_FOR_SIGNAL}`,
      windowStart,
      windowEnd,
      totalSends: snapshot.overall.sent,
    };
  }

  const dateKey = now.toISOString().slice(0, 10);
  let insightsWritten = 0;

  // Baseline insight — always write the overall rates
  await addLearning({
    id: `learn_digest_overall_${dateKey}`,
    date: dateKey,
    signal: "reply",
    insight: `Last 7 days: ${snapshot.overall.sent} sends → ${pct(snapshot.overall.openRate)} opens, ${pct(snapshot.overall.replyRate)} replies, ${pct(snapshot.overall.bounceRate)} bounces`,
    evidence: { window: { start: windowStart, end: windowEnd }, overall: snapshot.overall },
  });
  insightsWritten++;

  // Winners — top performers that beat the overall baseline
  for (const p of snapshot.topPerformers) {
    if (p.rates.replyRate <= snapshot.overall.replyRate) continue;
    await addLearning({
      id: `learn_digest_win_${dateKey}_${p.dimension}_${p.bucket}`,
      date: dateKey,
      signal: "reply",
      insight: `WINNER: ${formatWinner(p)} — beats baseline of ${pct(snapshot.overall.replyRate)}. Plan more of this.`,
      evidence: { winner: p, baseline: snapshot.overall.replyRate },
    });
    insightsWritten++;
  }

  // Losers — patterns underperforming the baseline
  for (const p of snapshot.underPerformers) {
    await addLearning({
      id: `learn_digest_loss_${dateKey}_${p.dimension}_${p.bucket}`,
      date: dateKey,
      signal: "reply",
      insight: `LOSER: ${formatWinner(p)} — below baseline of ${pct(snapshot.overall.replyRate)}. Reduce or change approach.`,
      evidence: { loser: p, baseline: snapshot.overall.replyRate },
    });
    insightsWritten++;
  }

  await logActivity({
    type: "insight-learned",
    description: `Weekly digest: ${snapshot.overall.sent} sends analyzed, ${insightsWritten} insights written (${snapshot.topPerformers.length} winners, ${snapshot.underPerformers.length} losers)`,
  });

  // Autonomy: score any closed experiments, then propose new ones. Runs
  // AFTER the digest so scoring can use the same data we just summarized.
  try {
    const scored = await scoreExperiments();
    if (scored.decided + scored.inconclusive > 0) {
      await logActivity({
        type: "insight-learned",
        description: `Autonomy scored ${scored.decided} decided, ${scored.inconclusive} inconclusive (${scored.overridesApplied} overrides applied)`,
      });
    }
    await proposeExperiments();
  } catch (err) {
    console.error("[digest] autonomy step failed:", err);
  }

  return {
    ran: true,
    windowStart,
    windowEnd,
    totalSends: snapshot.overall.sent,
    insightsWritten,
    snapshot,
  };
}
