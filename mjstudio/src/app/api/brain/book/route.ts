import { NextResponse } from "next/server";
import { loadBrain, saveBrain, logActivity } from "@/lib/brain-storage";

/**
 * GET /api/brain/book?p=<prospectId>
 *
 * Click-tracking redirect for booking links embedded in cold outbound emails.
 * When a prospect clicks through, we:
 *   1. Mark the prospect's status = "booked" (if still "sent" or earlier)
 *   2. Log a booking-intent activity
 *   3. Suppress any still-queued follow-up touches
 *   4. Redirect to BRAIN_BOOKING_URL (Cal.com / Calendly link)
 *
 * The actual calendar booking happens on the external platform — this just
 * captures intent at click time. We don't block the redirect on brain.json
 * failures; the user's UX is the priority.
 */

export const dynamic = "force-dynamic";

const DEFAULT_FALLBACK = "https://brandivibe.com/contact";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const prospectId = url.searchParams.get("p") ?? "";
  const bookingUrl = process.env.BRAIN_BOOKING_URL || DEFAULT_FALLBACK;

  // Fire-and-forget the state update so the redirect is instant even if
  // brain.json is slow to save.
  (async () => {
    if (!prospectId) return;
    try {
      const brain = await loadBrain();
      const prospect = brain.prospects.find((p) => p.id === prospectId);
      if (!prospect) return;

      const wasAlreadyBooked = prospect.status === "booked" || prospect.status === "closed";
      if (!wasAlreadyBooked) {
        prospect.status = "booked";
        prospect.updatedAt = new Date().toISOString();
        // Suppress queued follow-ups — they've signaled intent to talk
        for (const e of brain.outboundQueue ?? []) {
          if (e.prospectId === prospectId && e.status === "queued") {
            e.status = "suppressed";
            e.failReason = "prospect clicked booking link";
          }
        }
        await saveBrain(brain);
      }

      await logActivity({
        type: wasAlreadyBooked ? "crm-email-sent" : "email-sent",
        description: wasAlreadyBooked
          ? `${prospect.company} re-clicked booking link`
          : `BOOKING INTENT: ${prospect.company} clicked booking link → redirected to ${bookingUrl}`,
        prospectId,
      });
    } catch (err) {
      console.error("[book redirect] state update failed:", err);
    }
  })();

  return NextResponse.redirect(bookingUrl, 302);
}
