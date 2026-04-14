/**
 * HTML email template for the Founder Homepage Audit report.
 *
 * Email client compatibility rules followed:
 * - Table-based layout (Outlook doesn't support flex/grid reliably)
 * - Inline CSS only (Gmail strips <style> blocks on forwarding)
 * - No web fonts (fallback to Georgia/Helvetica, always-available)
 * - No background-image, no svg filters (spam trigger)
 * - Max width 600px (gold standard for responsive email)
 * - Solid hex colors only, no rgba
 * - Explicit width/height on images if any (none in this template)
 */

type AuditReportData = {
  company: string;
  domain: string;
  designScore: number;
  industryName: string;
  techStackSummary: string;
  specificObservation: string;
  observations: Array<{ title: string; fix: string }>;
  topPriority: string;
  weaknesses: string[];
  recipientFirstName?: string;
  closestDemoSlug?: string;
};

const C = {
  bg: "#08080a",
  surface: "#0e0e12",
  border: "#1d1d22",
  borderStrong: "#2a2a32",
  ink: "#ededf0",
  muted: "#8a8d96",
  accent: "#86e5ff",
  accentDark: "#5fd0ee",
  accentSoft: "#12252e",
};

export function renderAuditReportHtml(d: AuditReportData): string {
  const greeting = d.recipientFirstName ? `${d.recipientFirstName}, ` : "";
  const demo = d.closestDemoSlug || "neuron";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>Your homepage audit — ${escapeHtml(d.domain)}</title>
</head>
<body style="margin:0;padding:0;background:${C.bg};color:${C.ink};font-family:Georgia,'Times New Roman',serif;-webkit-font-smoothing:antialiased;">

<!-- Preheader (hidden, shows in inbox preview) -->
<div style="display:none;font-size:1px;color:${C.bg};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
${escapeHtml(d.company)} scored ${d.designScore}/10. Here's what we'd fix first.
</div>

<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="background:${C.bg};">
<tr><td align="center" style="padding:48px 24px;">

<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;width:100%;">

  <!-- HEADER -->
  <tr><td style="padding-bottom:40px;">
    <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:3px;color:${C.accent};font-weight:600;">
      — Brandivibe &middot; Homepage Audit
    </div>
  </td></tr>

  <!-- SCORE HERO -->
  <tr><td style="background:${C.surface};border:1px solid ${C.border};border-radius:20px;padding:40px 36px;">
    <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:2.4px;color:${C.muted};margin-bottom:12px;">
      The audit
    </div>
    <div style="font-size:36px;line-height:1.05;font-weight:500;letter-spacing:-1px;color:${C.ink};">
      ${escapeHtml(d.company)}
      <span style="color:${C.muted};font-weight:400;">&middot; ${escapeHtml(d.domain)}</span>
    </div>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top:32px;">
    <tr>
      <td width="33%" valign="top" style="padding-right:8px;">
        ${statCell("Design score", `${d.designScore}/10`, d.designScore <= 5)}
      </td>
      <td width="33%" valign="top" style="padding:0 4px;">
        ${statCell("Industry read", d.industryName, false)}
      </td>
      <td width="33%" valign="top" style="padding-left:8px;">
        ${statCell("Tech stack", d.techStackSummary, false)}
      </td>
    </tr>
    </table>
  </td></tr>

  <tr><td style="height:32px;line-height:32px;">&nbsp;</td></tr>

  <!-- SHARPEST OBSERVATION -->
  <tr><td style="background:${C.surface};border:1px solid ${C.border};border-radius:20px;padding:36px;">
    <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:2.4px;color:${C.accent};margin-bottom:16px;font-weight:600;">
      The sharpest observation
    </div>
    <div style="font-size:22px;line-height:1.35;color:${C.ink};font-weight:400;">
      &ldquo;${escapeHtml(d.specificObservation)}&rdquo;
    </div>
  </td></tr>

  <tr><td style="height:32px;line-height:32px;">&nbsp;</td></tr>

  <!-- THREE FIXES -->
  <tr><td>
    <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:2.4px;color:${C.muted};margin-bottom:20px;">
      &mdash; Three things worth fixing
    </div>

    ${d.observations
      .map((o, i) => observationCard(i + 1, o.title, o.fix))
      .join('<tr><td style="height:14px;line-height:14px;">&nbsp;</td></tr>')}
  </td></tr>

  <tr><td style="height:28px;line-height:28px;">&nbsp;</td></tr>

  <!-- TOP PRIORITY -->
  <tr><td style="background:${C.accentSoft};border:1px solid ${C.accent}33;border-radius:16px;padding:24px 28px;">
    <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:2.4px;color:${C.accent};font-weight:700;margin-bottom:8px;">
      Top priority
    </div>
    <div style="font-size:17px;line-height:1.45;color:${C.ink};">
      ${escapeHtml(d.topPriority)}
    </div>
  </td></tr>

  <tr><td style="height:40px;line-height:40px;">&nbsp;</td></tr>

  <!-- FULL WEAKNESS LIST -->
  ${
    d.weaknesses.length > 0
      ? `
  <tr><td>
    <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:2.4px;color:${C.muted};margin-bottom:20px;">
      &mdash; Full weakness list (${d.weaknesses.length})
    </div>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    ${d.weaknesses
      .map(
        (w, i) => `<tr>
          <td width="28" valign="top" style="padding:10px 0;">
            <span style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;color:${C.muted};font-weight:600;">${i + 1}.</span>
          </td>
          <td valign="top" style="padding:10px 0;font-size:15px;line-height:1.55;color:${C.ink}cc;">
            ${escapeHtml(w)}
          </td>
        </tr>`
      )
      .join("")}
    </table>
  </td></tr>

  <tr><td style="height:48px;line-height:48px;">&nbsp;</td></tr>
  `
      : ""
  }

  <!-- CTA -->
  <tr><td style="background:${C.surface};border:1px solid ${C.border};border-radius:20px;padding:44px 36px;text-align:center;">
    <div style="font-size:26px;line-height:1.2;font-weight:500;letter-spacing:-0.5px;color:${C.ink};margin-bottom:14px;">
      Want this fixed?
    </div>
    <div style="font-size:15px;line-height:1.6;color:${C.muted};margin-bottom:28px;max-width:440px;margin-left:auto;margin-right:auto;">
      ${greeting}Brandivibe rebuilds founder homepages in 6 weeks for $35&ndash;90K.
      One designer, production Next.js codebase you own, no retainer.
    </div>
    <a href="https://brandivibe.com/${escapeHtml(demo)}" style="display:inline-block;background:${C.accent};color:#04121a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:700;font-size:14px;padding:16px 32px;border-radius:100px;text-decoration:none;letter-spacing:0.2px;">
      See the ${escapeHtml(demo)} demo &rarr;
    </a>
    <div style="margin-top:16px;">
      <a href="https://brandivibe.com/#contact" style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;color:${C.muted};text-decoration:underline;">
        or start a conversation
      </a>
    </div>
  </td></tr>

  <tr><td style="height:48px;line-height:48px;">&nbsp;</td></tr>

  <!-- SIGNATURE -->
  <tr><td style="padding:0 8px;">
    <div style="font-size:15px;line-height:1.6;color:${C.ink}cc;font-family:Georgia,serif;">
      If any of this is useful, reply to this email and I&apos;ll walk you
      through it on a 15-minute call. No slides, no pitch deck.
    </div>
    <div style="margin-top:24px;font-size:15px;color:${C.ink};">
      Muraduzzaman
    </div>
    <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;color:${C.muted};margin-top:2px;">
      Brandivibe &middot; <a href="https://brandivibe.com" style="color:${C.accent};text-decoration:none;">brandivibe.com</a>
    </div>
  </td></tr>

  <tr><td style="height:48px;line-height:48px;">&nbsp;</td></tr>

  <!-- FOOTER / LEGAL -->
  <tr><td style="border-top:1px solid ${C.border};padding-top:28px;padding-left:8px;padding-right:8px;">
    <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;line-height:1.6;color:${C.muted};">
      You received this audit because you requested it at
      <a href="https://brandivibe.com/audit" style="color:${C.muted};">brandivibe.com/audit</a>.
      <br>
      Not useful? <a href="https://brandivibe.com/audit" style="color:${C.muted};">Click here to unsubscribe</a>.
      <br><br>
      Brandivibe &middot; ${escapeHtml(process.env.BRANDIVIBE_MAILING_ADDRESS || "")}
    </div>
  </td></tr>

</table>

</td></tr>
</table>

</body>
</html>`;
}

function statCell(label: string, value: string, highlight: boolean): string {
  const labelColor = C.muted;
  const valueColor = highlight ? C.accent : C.ink;
  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:${C.bg};border:1px solid ${C.border};border-radius:12px;">
    <tr><td style="padding:16px 14px;">
      <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:${labelColor};margin-bottom:6px;">
        ${escapeHtml(label)}
      </div>
      <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:16px;font-weight:600;color:${valueColor};letter-spacing:-0.3px;">
        ${escapeHtml(value)}
      </div>
    </td></tr>
  </table>`;
}

function observationCard(num: number, title: string, fix: string): string {
  return `<tr><td style="background:${C.surface};border:1px solid ${C.border};border-radius:16px;padding:24px 26px;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td width="36" valign="top">
          <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;color:${C.accent};font-weight:700;letter-spacing:1.4px;">${num < 10 ? "0" : ""}${num}</div>
        </td>
        <td valign="top">
          <div style="font-size:17px;line-height:1.45;color:${C.ink};font-weight:500;margin-bottom:10px;">
            ${escapeHtml(title)}
          </div>
          <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;line-height:1.55;color:${C.muted};">
            <span style="color:${C.accent};font-weight:600;">Fix &rarr;</span>
            ${escapeHtml(fix)}
          </div>
        </td>
      </tr>
    </table>
  </td></tr>`;
}

function escapeHtml(s: string | undefined | null): string {
  if (!s) return "";
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
