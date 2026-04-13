import { NextResponse } from "next/server";
import { loadBrain } from "@/lib/brain-storage";

/**
 * GET /api/brain/outreach — returns the outbound queue + sequence state
 * + warmup status for the dashboard Outreach tab.
 */
export async function GET() {
  const brain = await loadBrain();
  const now = Date.now();
  const todayStr = new Date().toISOString().slice(0, 10);

  const queue = brain.outboundQueue ?? [];
  const byStatus = {
    queued: queue.filter((e) => e.status === "queued").length,
    sent: queue.filter((e) => e.status === "sent").length,
    failed: queue.filter((e) => e.status === "failed").length,
    suppressed: queue.filter((e) => e.status === "suppressed").length,
  };

  const inSequence = brain.prospects.filter((p) => p.sequence && p.sequence.stage > 0);
  const researched = brain.prospects.filter((p) => p.deepResearch);
  const unsubscribed = brain.prospects.filter((p) => p.unsubscribed);

  const sendingSince = brain.sendingSince;
  const dayIndex = sendingSince
    ? Math.floor((now - new Date(sendingSince).getTime()) / 86_400_000) + 1
    : 0;
  const alreadyToday = (brain.sendCounts ?? {})[todayStr] ?? 0;

  return NextResponse.json({
    queue: queue
      .slice(-50)
      .reverse()
      .map((e) => ({
        id: e.id,
        prospectId: e.prospectId,
        to: e.to,
        subject: e.subject,
        body: e.body,
        touch: e.sequenceTouch,
        status: e.status,
        sendAt: e.sendAt,
        sentAt: e.sentAt,
        failReason: e.failReason,
      })),
    stats: {
      byStatus,
      researched: researched.length,
      inSequence: inSequence.length,
      unsubscribed: unsubscribed.length,
      dayIndex,
      alreadyToday,
      sendingSince,
    },
    prospects: brain.prospects
      .filter((p) => p.sequence && p.sequence.stage > 0)
      .map((p) => ({
        id: p.id,
        company: p.company,
        domain: p.domain,
        icpTier: p.icpTier,
        email: p.emailFinder?.winner ?? p.email,
        emailConfidence: p.emailFinder?.confidence,
        stage: p.sequence?.stage,
        lastOutcome: p.sequence?.lastOutcome,
        nextSendAt: p.sequence?.nextSendAt,
        unsubscribed: p.unsubscribed,
        researchConfidence: p.deepResearch?.confidence,
      })),
  });
}
