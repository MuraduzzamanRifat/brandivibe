/**
 * Brandivibe API Worker
 * ─────────────────────
 * brandivibe.com is now a static GitHub Pages site — it has no server, so
 * the old Next.js /api routes are gone. This Cloudflare Worker restores the
 * two public form endpoints, mounted at brandivibe.com/api/* via a Worker
 * route (see wrangler.toml / README).
 *
 *   POST /api/contact     — contact form → emails the operator via Resend
 *   POST /api/audit/run   — audit form   → captures the lead + notifies
 *                           (the full GPT instant-audit port is the next
 *                           step; this never drops a lead in the meantime)
 *
 * Single file, zero build step — paste into the Cloudflare dashboard editor
 * or `wrangler deploy`. Uses only fetch + Web APIs (no Node).
 *
 * Secrets (wrangler secret put / dashboard → Settings → Variables):
 *   RESEND_API_KEY       required — Resend API key
 *   NOTIFICATION_EMAIL   optional — operator inbox (default below)
 *   RESEND_FROM_EMAIL    optional — verified Resend sender
 *                                   (default hello@send.brandivibe.site)
 *   RESEND_REPLY_TO      optional — reply-to fallback
 */

const DEFAULT_NOTIFY = "mjrifat54@gmail.com";
const DEFAULT_FROM = "hello@send.brandivibe.site";
const FROM_NAME = "Muraduzzaman at Brandivibe";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

function isValidEmail(e) {
  return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(String(e).trim());
}

function htmlEscape(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function sendEmail(env, { to, subject, text, html, replyTo }) {
  const key = env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "RESEND_API_KEY not set" };
  const fromEmail = env.RESEND_FROM_EMAIL || DEFAULT_FROM;
  const from = `${FROM_NAME} <${fromEmail}>`;
  const reply_to = replyTo || env.RESEND_REPLY_TO || fromEmail;

  let res;
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], subject, text, html, reply_to }),
      signal: AbortSignal.timeout(15000),
    });
  } catch (err) {
    return { ok: false, error: String(err) };
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return { ok: false, error: `Resend ${res.status}: ${body}` };
  }
  return { ok: true };
}

async function handleContact(req, env) {
  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const company = String(body.company ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name) return json({ error: "Name required" }, 400);
  if (!isValidEmail(email)) return json({ error: "Valid email required" }, 400);
  if (!message) return json({ error: "Message required" }, 400);

  const subject = `New inquiry from ${name}${company ? ` — ${company}` : ""}`;
  const text = [
    "New contact form submission — brandivibe.com",
    "",
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Company: ${company || "—"}`,
    "",
    "Message:",
    message,
    "",
    "---",
    `Reply directly to this email to respond to ${name}.`,
  ].join("\n");

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8" /></head>
<body style="font-family:sans-serif;background:#0d0d0f;color:#e5e5e5;margin:0;">
  <div style="max-width:600px;margin:0 auto;padding:40px 32px;">
    <div style="font-family:monospace;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#84e1ff;margin-bottom:24px;">— New Brandivibe inquiry</div>
    <h1 style="font-size:24px;font-weight:600;color:#fff;margin:0 0 24px;">${htmlEscape(name)} wants to talk</h1>
    <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
      <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;color:#84e1ff;width:90px;">Email</td>
      <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);"><a href="mailto:${htmlEscape(email)}" style="color:#84e1ff;text-decoration:none;">${htmlEscape(email)}</a></td></tr>
      ${company ? `<tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;color:#84e1ff;">Company</td><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);">${htmlEscape(company)}</td></tr>` : ""}
    </table>
    <div style="font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;color:#84e1ff;margin-bottom:12px;">Message</div>
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;line-height:1.7;white-space:pre-wrap;">${htmlEscape(message)}</div>
    <div style="margin-top:32px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.08);font-size:13px;color:rgba(255,255,255,0.4);">Reply directly to this email to respond to ${htmlEscape(name)}.</div>
  </div></body></html>`;

  const result = await sendEmail(env, {
    to: env.NOTIFICATION_EMAIL || DEFAULT_NOTIFY,
    subject,
    text,
    html,
    replyTo: email,
  });

  if (!result.ok) {
    // Don't expose delivery internals; log for the operator.
    console.error("[contact] send failed:", result.error);
    return json({ error: "Failed to send" }, 502);
  }
  return json({ ok: true });
}

async function handleAuditRun(req, env) {
  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }
  const url = String(body.url ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  if (!url) return json({ error: "URL required" }, 400);
  if (!isValidEmail(email)) return json({ error: "Valid email required" }, 400);

  // Interim: capture the lead so none are lost while the full GPT
  // instant-audit is being ported into the Worker.
  await sendEmail(env, {
    to: env.NOTIFICATION_EMAIL || DEFAULT_NOTIFY,
    subject: `Audit requested — ${url}`,
    text: `Audit request via brandivibe.com\n\nURL:   ${url}\nEmail: ${email}\n\nRun the audit and send the report to ${email}.`,
    html: `<div style="font-family:sans-serif;padding:24px;"><strong>Audit request</strong><br/>URL: ${htmlEscape(url)}<br/>Email: ${htmlEscape(email)}</div>`,
    replyTo: email,
  });

  return json(
    {
      error:
        "Your audit request was received — we'll email your full report to " +
        email +
        " shortly. (Instant on-page results are being re-enabled.)",
    },
    503
  );
}

export default {
  async fetch(req, env) {
    const { pathname } = new URL(req.url);

    if (req.method === "OPTIONS") {
      return new Response(null, { headers: CORS });
    }
    if (req.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    if (pathname === "/api/contact") return handleContact(req, env);
    if (pathname === "/api/audit/run") return handleAuditRun(req, env);

    return json({ error: "Not found" }, 404);
  },
};
