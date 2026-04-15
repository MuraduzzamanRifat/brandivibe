import { NextResponse } from "next/server";
import { sendTransactional } from "@/lib/brain/transactional";

export const dynamic = "force-dynamic";

const NOTIFY_EMAIL = "mjrifat54@gmail.com";

function isValidEmail(e: string): boolean {
  return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(e.trim());
}

function htmlEscape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function POST(req: Request) {
  let body: {
    name?: string;
    email?: string;
    company?: string;
    budget?: string;
    message?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const company = (body.company ?? "").trim();
  const budget = (body.budget ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  if (!isValidEmail(email)) return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  if (!message) return NextResponse.json({ error: "Message required" }, { status: 400 });

  const subject = `New inquiry from ${name}${company ? ` — ${company}` : ""}`;

  const text = [
    `New contact form submission — brandivibe.com`,
    ``,
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Company: ${company || "—"}`,
    `Budget:  ${budget || "—"}`,
    ``,
    `Message:`,
    message,
    ``,
    `---`,
    `Reply directly to this email to respond to ${name}.`,
  ].join("\n");

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /></head>
<body style="font-family:sans-serif;background:#0d0d0f;color:#e5e5e5;padding:0;margin:0;">
  <div style="max-width:600px;margin:0 auto;padding:40px 32px;">
    <div style="font-family:monospace;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#84e1ff;margin-bottom:24px;">
      — New Brandivibe inquiry
    </div>
    <h1 style="font-size:24px;font-weight:600;color:#ffffff;margin:0 0 24px;">
      ${htmlEscape(name)} wants to talk
    </h1>
    <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;color:#84e1ff;width:90px;">Email</td>
        <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#e5e5e5;">
          <a href="mailto:${htmlEscape(email)}" style="color:#84e1ff;text-decoration:none;">${htmlEscape(email)}</a>
        </td>
      </tr>
      ${company ? `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;color:#84e1ff;">Company</td>
        <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#e5e5e5;">${htmlEscape(company)}</td>
      </tr>` : ""}
      ${budget ? `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;color:#84e1ff;">Budget</td>
        <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#e5e5e5;">${htmlEscape(budget)}</td>
      </tr>` : ""}
    </table>
    <div style="font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;color:#84e1ff;margin-bottom:12px;">Message</div>
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;color:#e5e5e5;line-height:1.7;white-space:pre-wrap;">${htmlEscape(message)}</div>
    <div style="margin-top:32px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.08);font-size:13px;color:rgba(255,255,255,0.4);">
      Reply directly to this email to respond to ${htmlEscape(name)}.
    </div>
  </div>
</body>
</html>`;

  const result = await sendTransactional({
    to: NOTIFY_EMAIL,
    subject,
    text,
    html,
    replyTo: email,
  });

  if (!result.ok) {
    console.error("[contact] send failed:", result.error);
    // Still return success to the user — don't expose delivery errors
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}
