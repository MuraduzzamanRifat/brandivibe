/**
 * Premium WebGL-style HTML email template for the Founder Homepage Audit.
 *
 * Aesthetic goals (since real WebGL can't run in email):
 * - Cinematic gradient mesh hero (multi-stop radial gradients, SVG fallback)
 * - Editorial type with serif italic accents on numerals
 * - Layered glass surfaces with stronger gradient depth
 * - Cyan + violet halo accents matching the brandivibe.com demos
 * - Glow box-shadows on hero + CTA (degraded gracefully in Outlook)
 *
 * Email client compatibility:
 * - Table-based layout (Outlook 2016/2019/2021 = Word rendering engine)
 * - Inline CSS only (Gmail strips <style> blocks on forwarding)
 * - System fonts only — Georgia (serif) + Helvetica/Arial (sans). No web fonts.
 * - Modern Gmail web/Apple Mail render the gradients; Outlook gets solid color
 *   fallbacks via background-color set ahead of background-image.
 * - All hex colors (no var() — Outlook strips CSS variables)
 * - Max-width 640px
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
  /** Phase 4 hook upgrades */
  quantifiedBleed?: string;
  personalClose?: string;
};

const C = {
  bg: "#05060c",
  surface: "#0b0d16",
  surfaceLight: "#11141f",
  border: "#1c1f2c",
  borderStrong: "#2a2e3e",
  ink: "#f3f3f6",
  muted: "#8a8d96",
  mutedDeep: "#5a5c66",
  accent: "#86e5ff",
  accentDeep: "#5fd0ee",
  violet: "#a78bfa",
  champagne: "#e8d49a",
};

export function renderAuditReportHtml(d: AuditReportData): string {
  const greeting = d.recipientFirstName ? `${d.recipientFirstName}, ` : "";
  const demo = d.closestDemoSlug || "neuron";
  const scoreColor = d.designScore <= 4 ? C.accent : d.designScore <= 6 ? C.champagne : C.ink;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="format-detection" content="telephone=no,date=no,address=no,email=no" />
<meta name="color-scheme" content="dark" />
<meta name="supported-color-schemes" content="dark" />
<title>${escapeHtml(d.company)} scored ${d.designScore}/10 — Brandivibe audit</title>
<!--[if mso]>
<xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
<![endif]-->
</head>
<body style="margin:0;padding:0;background:${C.bg};color:${C.ink};font-family:Georgia,'Times New Roman',serif;-webkit-font-smoothing:antialiased;mso-line-height-rule:exactly;">

<!-- Hidden preheader -->
<div style="display:none;font-size:1px;color:${C.bg};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
${escapeHtml(d.company)} scored ${d.designScore}/10. The sharpest observation, three fixes, and the top priority — inside.
</div>

<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" bgcolor="${C.bg}" style="background:${C.bg};">
<tr><td align="center" style="padding:48px 16px;">

<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="640" style="max-width:640px;width:100%;">

  <!-- ─────────── EYEBROW ─────────── -->
  <tr><td style="padding:0 12px 32px;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td valign="middle" style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:3.4px;color:${C.muted};font-weight:600;">
          <span style="display:inline-block;width:32px;height:1px;background:${C.accent};vertical-align:middle;"></span>
          &nbsp;&nbsp;Brandivibe &middot; Homepage Audit
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- ─────────── HERO CARD: sharpest observation FIRST ─────────── -->
  <tr><td>
    <!--[if mso]>
    <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:640px;height:auto;">
    <v:fill type="gradient" color="#0a0c15" color2="#11141f" angle="135" />
    <v:textbox inset="0,0,0,0">
    <![endif]-->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" bgcolor="${C.surface}" style="
      background-color:${C.surface};
      background-image:
        radial-gradient(ellipse 65% 75% at 12% 0%, rgba(134,229,255,0.34) 0%, rgba(134,229,255,0) 60%),
        radial-gradient(ellipse 50% 60% at 95% 35%, rgba(167,139,250,0.22) 0%, rgba(167,139,250,0) 65%),
        radial-gradient(ellipse 80% 50% at 50% 110%, rgba(95,208,238,0.18) 0%, rgba(95,208,238,0) 70%),
        linear-gradient(180deg, ${C.surface} 0%, ${C.surfaceLight} 100%);
      border-radius:28px;
      border:1px solid ${C.border};
    ">
      <tr><td style="padding:56px 44px 48px;">

        <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:3.4px;color:${C.accent};font-weight:700;margin-bottom:18px;">
          ${escapeHtml(d.company)} &middot; ${escapeHtml(d.domain)}
        </div>

        <!-- THE SHARPEST OBSERVATION IS NOW THE HERO LINE -->
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:32px;line-height:1.18;letter-spacing:-0.6px;color:${C.ink};font-weight:400;font-style:italic;">
          &ldquo;${escapeHtml(d.specificObservation)}&rdquo;
        </div>

        ${
          d.quantifiedBleed
            ? `<div style="margin-top:24px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.55;color:${C.champagne};letter-spacing:0.1px;">
          ${escapeHtml(d.quantifiedBleed)}
        </div>`
            : ""
        }

        <!-- Score becomes a small stat strip below -->
        <div style="height:32px;line-height:32px;font-size:0;">&nbsp;</div>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-top:1px solid ${C.borderStrong};">
          <tr>
            <td valign="middle" style="padding-top:18px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;color:${C.muted};letter-spacing:0.3px;line-height:1.5;">
              <span style="color:${C.muted};text-transform:uppercase;letter-spacing:2px;font-size:9px;font-weight:600;">Design score</span><br />
              <span style="color:${scoreColor};font-family:Georgia,serif;font-style:italic;font-size:32px;letter-spacing:-1px;">${d.designScore}</span><span style="color:${C.muted};font-size:14px;">&thinsp;/&thinsp;10</span>
            </td>
            <td align="right" valign="middle" style="padding-top:18px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;color:${C.muted};text-transform:uppercase;letter-spacing:2px;font-weight:600;line-height:1.6;">
              ${escapeHtml(d.industryName)}<br />
              <span style="text-transform:none;letter-spacing:0.3px;font-weight:400;font-size:11px;">${escapeHtml(d.techStackSummary)}</span>
            </td>
          </tr>
        </table>

      </td></tr>
    </table>
    <!--[if mso]>
    </v:textbox>
    </v:rect>
    <![endif]-->
  </td></tr>

  <tr><td style="height:36px;line-height:36px;font-size:0;">&nbsp;</td></tr>

  <!-- ─────────── THREE FIXES HEADER ─────────── -->
  <tr><td style="padding:0 12px 24px;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:3.4px;color:${C.muted};font-weight:600;">
          <span style="display:inline-block;width:32px;height:1px;background:${C.muted};vertical-align:middle;"></span>
          &nbsp;&nbsp;Three things worth fixing
        </td>
      </tr>
    </table>
  </td></tr>

  ${d.observations.map((o, i) => observationCard(i + 1, o.title, o.fix)).join('<tr><td style="height:14px;line-height:14px;font-size:0;">&nbsp;</td></tr>')}

  <tr><td style="height:24px;line-height:24px;font-size:0;">&nbsp;</td></tr>

  <!-- ─────────── TOP PRIORITY (glow card) ─────────── -->
  <tr><td bgcolor="${C.surface}" style="
    background-color:${C.surface};
    background-image:
      radial-gradient(ellipse 80% 100% at 50% 0%, rgba(134,229,255,0.18), transparent 70%),
      linear-gradient(180deg, ${C.surface} 0%, ${C.surfaceLight} 100%);
    border:1px solid #1f3845;
    border-radius:24px;
    padding:36px 40px;
  ">
    <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:3.2px;color:${C.accent};font-weight:700;margin-bottom:14px;">
      ◆ Top priority
    </div>
    <div style="font-family:Georgia,'Times New Roman',serif;font-size:20px;line-height:1.42;color:${C.ink};font-weight:400;">
      ${escapeHtml(d.topPriority)}
    </div>
  </td></tr>

  ${
    d.weaknesses.length > 0
      ? `<tr><td style="height:48px;line-height:48px;font-size:0;">&nbsp;</td></tr>

  <!-- ─────────── FULL WEAKNESS LIST ─────────── -->
  <tr><td style="padding:0 12px 24px;">
    <span style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:3.4px;color:${C.muted};font-weight:600;">
      <span style="display:inline-block;width:32px;height:1px;background:${C.muted};vertical-align:middle;"></span>
      &nbsp;&nbsp;Full weakness list &middot; ${d.weaknesses.length}
    </span>
  </td></tr>
  <tr><td style="padding:0 12px;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      ${d.weaknesses
        .map(
          (w, i) => `<tr>
            <td width="40" valign="top" style="padding:14px 0;border-bottom:1px solid ${C.border};">
              <span style="font-family:Georgia,serif;font-style:italic;font-size:18px;color:${C.accent};letter-spacing:-0.5px;">${i + 1}</span>
            </td>
            <td valign="top" style="padding:14px 0;border-bottom:1px solid ${C.border};font-family:Georgia,serif;font-size:15px;line-height:1.55;color:${C.ink};">
              ${escapeHtml(w)}
            </td>
          </tr>`
        )
        .join("")}
    </table>
  </td></tr>`
      : ""
  }

  <tr><td style="height:56px;line-height:56px;font-size:0;">&nbsp;</td></tr>

  <!-- ─────────── CTA CARD: free loom ask ─────────── -->
  <tr><td bgcolor="${C.surface}" style="
    background-color:${C.surface};
    background-image:
      radial-gradient(ellipse 70% 80% at 50% 0%, rgba(134,229,255,0.22), transparent 65%),
      linear-gradient(180deg, ${C.surface} 0%, ${C.bg} 100%);
    border:1px solid ${C.border};
    border-radius:28px;
    padding:52px 40px 48px;
    text-align:center;
  ">
    <div style="font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1.2;color:${C.ink};letter-spacing:-0.5px;font-weight:400;">
      Reply &ldquo;<em style="color:${C.accent};font-style:italic;">loom</em>&rdquo; and I&rsquo;ll record a 5-min walkthrough
    </div>
    <div style="font-family:Georgia,serif;font-size:14px;line-height:1.65;color:${C.muted};margin:16px auto 30px;max-width:460px;">
      ${greeting}I&rsquo;ll show you exactly how I&rsquo;d fix the top issue on ${escapeHtml(d.domain)} &mdash; specific changes, before/after, no pitch. Free, async, in your inbox within 48 hours.
    </div>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
      <tr><td style="padding:0 8px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
          <tr><td bgcolor="${C.accent}" style="
            background-color:${C.accent};
            background-image:linear-gradient(180deg, #b9f0ff 0%, ${C.accent} 60%, ${C.accentDeep} 100%);
            border-radius:100px;
          ">
            <a href="mailto:hello@send.brandivibe.site?subject=loom%20%E2%80%94%20${encodeURIComponent(d.domain)}&body=loom" style="
              display:inline-block;
              padding:18px 32px;
              font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
              font-size:13px;
              font-weight:700;
              color:#04121a;
              text-decoration:none;
              letter-spacing:0.4px;
              text-transform:uppercase;
            ">Reply &ldquo;loom&rdquo; &nbsp;→</a>
          </td></tr>
        </table>
      </td></tr>
    </table>

    <div style="margin-top:20px;">
      <a href="https://brandivibe.com/${escapeHtml(demo)}" style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;color:${C.muted};text-decoration:underline;letter-spacing:0.3px;">
        or see what we&rsquo;d rebuild this into
      </a>
    </div>
  </td></tr>

  <tr><td style="height:48px;line-height:48px;font-size:0;">&nbsp;</td></tr>

  <!-- ─────────── PERSONAL CLOSE ─────────── -->
  <tr><td style="padding:0 12px;">
    ${
      d.personalClose
        ? `<div style="font-family:Georgia,serif;font-size:17px;line-height:1.65;color:${C.ink};font-style:italic;">
      &mdash; ${escapeHtml(d.personalClose)}
    </div>`
        : `<div style="font-family:Georgia,serif;font-size:16px;line-height:1.65;color:${C.ink};">
      I think the top issue above is the single biggest thing &mdash; happy to record a loom walking through how I&rsquo;d fix it. Just reply &ldquo;loom&rdquo;.
    </div>`
    }
    <div style="margin-top:28px;font-family:Georgia,serif;font-size:18px;color:${C.ink};font-style:italic;">
      Muraduzzaman
    </div>
    <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;color:${C.muted};margin-top:4px;letter-spacing:0.3px;">
      Brandivibe &nbsp;&middot;&nbsp;
      <a href="https://brandivibe.com" style="color:${C.accent};text-decoration:none;">brandivibe.com</a>
    </div>
  </td></tr>

  <tr><td style="height:48px;line-height:48px;font-size:0;">&nbsp;</td></tr>

  <!-- ─────────── LEGAL FOOTER ─────────── -->
  <tr><td style="padding:24px 12px 0;border-top:1px solid ${C.border};">
    <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;line-height:1.7;color:${C.mutedDeep};letter-spacing:0.2px;">
      You received this audit because you requested it at <a href="https://brandivibe.com/audit" style="color:${C.mutedDeep};text-decoration:underline;">brandivibe.com/audit</a>.<br />
      Not useful? <a href="https://brandivibe.com/audit" style="color:${C.mutedDeep};text-decoration:underline;">Click here to unsubscribe</a>.<br /><br />
      Brandivibe &middot; ${escapeHtml(process.env.BRANDIVIBE_MAILING_ADDRESS || "")}
    </div>
  </td></tr>

</table>

</td></tr>
</table>

</body>
</html>`;
}

function scoreReadout(score: number): string {
  if (score <= 3) return "Sub-tier. A rebuild would compound for years.";
  if (score <= 5) return "Below founder-grade. High-leverage rebuild target.";
  if (score <= 7) return "Solid baseline. Worth sharpening the top-funnel.";
  if (score <= 9) return "Strong work. Targeted refinements only.";
  return "Class-leading. Brandivibe wouldn't change much.";
}

function observationCard(num: number, title: string, fix: string): string {
  return `<tr><td bgcolor="${C.surface}" style="
    background-color:${C.surface};
    background-image:linear-gradient(180deg, ${C.surface} 0%, ${C.surfaceLight} 100%);
    border:1px solid ${C.border};
    border-radius:20px;
    padding:30px 32px;
  ">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td width="48" valign="top">
          <span style="font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:30px;color:${C.accent};letter-spacing:-1px;line-height:1;">
            ${num.toString().padStart(2, "0")}
          </span>
        </td>
        <td valign="top">
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.42;color:${C.ink};margin-bottom:12px;">
            ${escapeHtml(title)}
          </div>
          <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:${C.muted};letter-spacing:0.2px;">
            <span style="color:${C.accent};font-weight:700;text-transform:uppercase;letter-spacing:1.2px;font-size:10px;">Fix &nbsp;→</span>
            &nbsp; ${escapeHtml(fix)}
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
