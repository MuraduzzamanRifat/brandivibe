import { NextResponse } from "next/server";
import { getBlastConfig, todayKey } from "@/lib/brain-storage";
import {
  aggregateBlastEvents,
  recentBlastEvents,
  computeEffectiveCap,
  computeWarmupDay,
} from "@/lib/brain/blast";

/**
 * GET /api/blast/status — returns the BlastConfig pointer + freshly-aggregated
 * metrics + recent event feed. Aggregation runs inline (cheap) so the
 * dashboard always shows up-to-date open/click/bounce counts.
 *
 * The 500K-row list itself is never sent over the wire.
 */

export const dynamic = "force-dynamic";

export async function GET() {
  // Roll any new webhook events into BlastConfig.metrics first
  try {
    await aggregateBlastEvents();
  } catch (err) {
    console.error("[blast] aggregate failed:", err);
  }

  const cfg = await getBlastConfig();
  const today = todayKey();
  const sentToday = cfg?.sentByDay?.[today] ?? 0;
  const effectiveCap = cfg ? computeEffectiveCap(cfg) : 0;
  const warmupDay = cfg ? computeWarmupDay(cfg) : 0;

  const recent = await recentBlastEvents(20);

  // Compute rates (% of sent) for the UI
  const sent = cfg?.sentCount ?? 0;
  const m = cfg?.metrics;
  const rates = m && sent > 0
    ? {
        deliveryRate: round(m.delivered / sent),
        bounceRate: round(m.bounced / sent),
        openRate: round(m.uniqueOpened / sent),
        clickRate: round(m.uniqueClicked / sent),
        complaintRate: round(m.complained / sent),
        unsubscribeRate: round(m.unsubscribed / sent),
      }
    : null;

  return NextResponse.json({
    config: cfg ?? null,
    today,
    sentToday,
    effectiveCap,
    warmupDay,
    remainingToday: cfg ? Math.max(0, effectiveCap - sentToday) : 0,
    remainingTotal: cfg ? Math.max(0, cfg.totalRows - cfg.sentCount) : 0,
    rates,
    recent,
  });
}

function round(n: number): number {
  return Math.round(n * 1000) / 10; // → percent with 1 decimal
}
