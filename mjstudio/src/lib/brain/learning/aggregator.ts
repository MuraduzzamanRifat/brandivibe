import type { OutboundEmail } from "../../brain-storage";

/**
 * Pure aggregation functions over the outbound queue. Computes engagement
 * rates (open / click / reply / bounce) broken down by dimension so the
 * weekly digest can surface what's working and what isn't.
 *
 * Bucket dimensions:
 *   - angle       (which CONTENT_ANGLES index the email came from)
 *   - industry    (prospect.industry at time of send)
 *   - icpTier     ("A" | "B" | "C" | "D")
 *   - subjectStyle (heuristic classification of the subject line)
 *   - sequenceTouch (1 | 2 | 3 | 4 — which touch in the sequence)
 */

export type Rates = {
  sent: number;
  opens: number;
  clicks: number;
  replies: number;
  bounces: number;
  openRate: number;
  clickRate: number;
  replyRate: number;
  bounceRate: number;
};

export type DimensionStats = {
  dimension: string;
  buckets: Record<string, Rates>;
};

export type LearningSnapshot = {
  windowStart: string;
  windowEnd: string;
  overall: Rates;
  byAngle: DimensionStats;
  byIndustry: DimensionStats;
  byTier: DimensionStats;
  bySubjectStyle: DimensionStats;
  byTouch: DimensionStats;
  topPerformers: Array<{ dimension: string; bucket: string; rates: Rates }>;
  underPerformers: Array<{ dimension: string; bucket: string; rates: Rates }>;
};

function emptyRates(): Rates {
  return {
    sent: 0,
    opens: 0,
    clicks: 0,
    replies: 0,
    bounces: 0,
    openRate: 0,
    clickRate: 0,
    replyRate: 0,
    bounceRate: 0,
  };
}

function accumulate(rates: Rates, email: OutboundEmail): void {
  // Only count emails that actually went out — queued/suppressed don't count.
  if (email.status !== "sent" && email.status !== "bounced") return;
  rates.sent++;
  if (email.metrics?.opens) rates.opens++;
  if (email.metrics?.clicks) rates.clicks++;
  if (email.metrics?.replied) rates.replies++;
  if (email.metrics?.bounced || email.status === "bounced") rates.bounces++;
}

function finalizeRates(r: Rates): void {
  if (r.sent === 0) return;
  r.openRate = r.opens / r.sent;
  r.clickRate = r.clicks / r.sent;
  r.replyRate = r.replies / r.sent;
  r.bounceRate = r.bounces / r.sent;
}

function bucketBy(
  emails: OutboundEmail[],
  keyFn: (e: OutboundEmail) => string | undefined
): Record<string, Rates> {
  const buckets: Record<string, Rates> = {};
  for (const e of emails) {
    const key = keyFn(e);
    if (!key) continue;
    if (!buckets[key]) buckets[key] = emptyRates();
    accumulate(buckets[key], e);
  }
  for (const k of Object.keys(buckets)) finalizeRates(buckets[k]);
  return buckets;
}

/** Pick winners (top N by reply rate, min 5 sends) and losers (bottom N). */
function topAndBottom(
  dimension: string,
  buckets: Record<string, Rates>,
  minSends: number
): {
  top: Array<{ dimension: string; bucket: string; rates: Rates }>;
  bottom: Array<{ dimension: string; bucket: string; rates: Rates }>;
} {
  const entries = Object.entries(buckets)
    .filter(([, r]) => r.sent >= minSends)
    .map(([bucket, rates]) => ({ dimension, bucket, rates }));
  const ranked = [...entries].sort((a, b) => b.rates.replyRate - a.rates.replyRate);
  return {
    top: ranked.slice(0, 3),
    bottom: [...ranked].reverse().slice(0, 3),
  };
}

export function aggregate(
  emails: OutboundEmail[],
  windowStart: string,
  windowEnd: string
): LearningSnapshot {
  // Filter to window
  const inWindow = emails.filter((e) => {
    const t = e.sentAt || e.createdAt;
    return t >= windowStart && t <= windowEnd;
  });

  const overall = emptyRates();
  for (const e of inWindow) accumulate(overall, e);
  finalizeRates(overall);

  const byAngle: DimensionStats = {
    dimension: "angle",
    buckets: bucketBy(inWindow, (e) =>
      e.meta?.plannerAngle != null ? `angle-${e.meta.plannerAngle}` : undefined
    ),
  };
  const byIndustry: DimensionStats = {
    dimension: "industry",
    buckets: bucketBy(inWindow, (e) => e.meta?.industry),
  };
  const byTier: DimensionStats = {
    dimension: "icpTier",
    buckets: bucketBy(inWindow, (e) => e.meta?.icpTier),
  };
  const bySubjectStyle: DimensionStats = {
    dimension: "subjectStyle",
    buckets: bucketBy(inWindow, (e) => e.meta?.subjectStyle),
  };
  const byTouch: DimensionStats = {
    dimension: "sequenceTouch",
    buckets: bucketBy(inWindow, (e) => `touch-${e.sequenceTouch}`),
  };

  // Top / bottom performers across all dimensions (min 5 sends to be meaningful)
  const MIN_SENDS = 5;
  const all = [byAngle, byIndustry, byTier, bySubjectStyle, byTouch].flatMap((d) =>
    topAndBottom(d.dimension, d.buckets, MIN_SENDS).top
  );
  const allBottom = [byAngle, byIndustry, byTier, bySubjectStyle, byTouch].flatMap((d) =>
    topAndBottom(d.dimension, d.buckets, MIN_SENDS).bottom
  );
  const topPerformers = [...all].sort((a, b) => b.rates.replyRate - a.rates.replyRate).slice(0, 5);
  const underPerformers = [...allBottom]
    .filter((p) => p.rates.replyRate < overall.replyRate)
    .slice(0, 5);

  return {
    windowStart,
    windowEnd,
    overall,
    byAngle,
    byIndustry,
    byTier,
    bySubjectStyle,
    byTouch,
    topPerformers,
    underPerformers,
  };
}

/** Heuristic classification of a subject line — used at queue time so the
 *  aggregator can bucket replies by style. Cheap string matching, not ML. */
export function classifySubjectStyle(subject: string): NonNullable<OutboundEmail["meta"]>["subjectStyle"] {
  const s = subject.toLowerCase().trim();
  if (/^\s*[\w-\s]+\?\s*$/.test(s) || s.endsWith("?")) return "question";
  if (/\d+%|\d+x|\$\d+|\d+,\d{3}/.test(s)) return "stat";
  if (/^(quick|fast|short|one)\s/.test(s) || /\bre:?\b/i.test(s)) return "direct";
  if (/^(noticed|saw|curious|wondering|why)\s/.test(s)) return "curiosity";
  return "other";
}
