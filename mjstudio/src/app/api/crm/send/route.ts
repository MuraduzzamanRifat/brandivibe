import { NextResponse } from "next/server";
import { sendTransactional } from "@/lib/brain/transactional";
import {
  loadBrain,
  addCrmEmail,
  logActivity,
  type CrmEmail,
} from "@/lib/brain-storage";

/**
 * POST /api/crm/send
 * Body: { contactId, subject, body, templateId? }
 *
 * Manual email send. Bypasses the Phase 4 warmup gate + outbound queue —
 * the user is in the compose view and has reviewed every line. Still
 * goes through Resend so DKIM/SPF alignment stays intact, and every send
 * is logged to brain.crmEmails with a full copy of the body that was
 * actually sent.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 30;

type Body = {
  contactId?: string;
  templateId?: string;
  subject?: string;
  body?: string;
};

export async function POST(req: Request) {
  let payload: Body;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }
  if (!payload.contactId || !payload.subject?.trim() || !payload.body?.trim()) {
    return NextResponse.json(
      { error: "contactId, subject, body are required" },
      { status: 400 }
    );
  }

  const brain = await loadBrain();
  const contact = (brain.crmContacts ?? []).find((c) => c.id === payload.contactId);
  if (!contact) return NextResponse.json({ error: "contact not found" }, { status: 404 });

  if (contact.status === "unsubscribed") {
    return NextResponse.json(
      { error: "This contact is unsubscribed — send blocked" },
      { status: 400 }
    );
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || "hello@send.brandivibe.site";

  // Fire the send
  const result = await sendTransactional({
    to: contact.email,
    subject: payload.subject.trim(),
    text: payload.body,
    fromName: "Muraduzzaman at Brandivibe",
  });

  const sentEmail: CrmEmail = {
    id: `crme_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    contactId: contact.id,
    templateId: payload.templateId,
    from: fromEmail,
    to: contact.email,
    subject: payload.subject.trim(),
    body: payload.body,
    status: result.ok ? "sent" : "failed",
    resendId: result.id,
    failReason: result.ok ? undefined : result.error,
    sentAt: result.ok ? new Date().toISOString() : undefined,
    createdAt: new Date().toISOString(),
  };
  await addCrmEmail(sentEmail);

  await logActivity({
    type: "crm-email-sent",
    description: result.ok
      ? `Sent to ${contact.name} <${contact.email}>: "${payload.subject.trim().slice(0, 80)}"`
      : `Send FAILED to ${contact.email}: ${result.error}`,
    prospectId: contact.sourceRefId,
    emailId: sentEmail.id,
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error, email: sentEmail }, { status: 502 });
  }

  return NextResponse.json({ ok: true, email: sentEmail });
}
