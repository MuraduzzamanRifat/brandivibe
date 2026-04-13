/**
 * One-off transactional emails via Resend. Unlike the cold outbound sender,
 * these bypass the warmup gate + outbound queue — they're triggered by
 * user action (audit request, unsubscribe confirmation, etc) and must
 * send immediately.
 *
 * Still honors unsubscribe suppression and the RESEND_API_KEY graceful
 * fallback.
 */

type ResendResponse = { id?: string; error?: { message?: string; name?: string } };

export type TransactionalResult = { ok: boolean; id?: string; error?: string };

export async function sendTransactional(params: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}): Promise<TransactionalResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "RESEND_API_KEY not set" };

  const from = process.env.RESEND_FROM_EMAIL || "hello@send.brandivibe.site";
  const replyTo = params.replyTo || process.env.RESEND_REPLY_TO || from;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [params.to],
      subject: params.subject,
      text: params.text,
      html: params.html,
      reply_to: replyTo,
    }),
  });

  const json = (await res.json().catch(() => ({}))) as ResendResponse;
  if (!res.ok || json.error) {
    return { ok: false, error: json.error?.message ?? `HTTP ${res.status}` };
  }
  return { ok: true, id: json.id };
}
