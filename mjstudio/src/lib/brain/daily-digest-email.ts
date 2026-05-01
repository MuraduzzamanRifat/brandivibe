import { loadBrain } from "../brain-storage";
import { sendTransactional } from "./transactional";

/**
 * Daily activity digest emailed to the operator. Single morning summary of
 * everything the brain did the previous day — emails sent, opens, clicks,
 * replies, new prospects sourced, drafts generated, bookings, articles
 * published. Goal: glance once, see what the brain is doing, no dashboard
 * required.
 *
 * Sent to NOTIFICATION_EMAIL (falls back to ALERT_EMAIL, then to a hardcoded
 * default). Uses the existing Resend transactional path.
 */

const DEFAULT_RECIPIENT = "mjrifat54@gmail.com";

function fmtPercent(n: number, total: number): string {
  if (total === 0) return "—";
  return `${((n / total) * 100).toFixed(1)}%`;
}

function isoYesterday(): { start: string; end: string; label: string } {
  const now = new Date();
  const end = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  end.setUTCHours(23, 59, 59, 999);
  const start = new Date(end);
  start.setUTCHours(0, 0, 0, 0);
  return {
    start: start.toISOString(),
    end: end.toISOString(),
    label: end.toISOString().slice(0, 10),
  };
}

function inWindow(timestamp: string | undefined, start: string, end: string): boolean {
  if (!timestamp) return false;
  return timestamp >= start && timestamp <= end;
}

export type DigestStats = {
  date: string;
  emails: {
    sent: number;
    opened: number;
    clicked: number;
    replied: number;
    bounced: number;
  };
  prospects: {
    added: number;
    bySource: Record<string, number>;
    researched: number;
  };
  channels: {
    twitterIntentNew: number;
    linkedinDraftsNew: number;
    rawSourcePoolNew: number;
  };
  content: {
    articlesPublished: number;
    fbPostsQueued: number;
  };
  bookings: number;
  totals: {
    pipeline: number;
    contactedEver: number;
    repliedEver: number;
  };
};

export async function buildDailyDigest(): Promise<DigestStats> {
  const brain = await loadBrain();
  const { start, end, label } = isoYesterday();

  const queue = brain.outboundQueue ?? [];
  const sentYesterday = queue.filter(
    (e) => e.sentAt && inWindow(e.sentAt, start, end) && (e.status === "sent" || e.status === "bounced")
  );

  const opened = sentYesterday.filter((e) => (e.metrics?.opens ?? 0) > 0).length;
  const clicked = sentYesterday.filter((e) => (e.metrics?.clicks ?? 0) > 0).length;
  const replied = sentYesterday.filter((e) => e.metrics?.replied).length;
  const bounced = sentYesterday.filter((e) => e.metrics?.bounced || e.status === "bounced").length;

  const prospectsAdded = brain.prospects.filter((p) => inWindow(p.createdAt, start, end));
  const bySource: Record<string, number> = {};
  for (const p of prospectsAdded) {
    bySource[p.source] = (bySource[p.source] ?? 0) + 1;
  }

  const researchedYesterday = brain.prospects.filter(
    (p) => p.deepResearch && inWindow(p.deepResearch.createdAt, start, end)
  ).length;

  const twitterNew = (brain.twitterIntent ?? []).filter((l) => inWindow(l.capturedAt, start, end)).length;
  const linkedinNew = (brain.linkedinDrafts ?? []).filter((d) => inWindow(d.createdAt, start, end)).length;
  const rawPoolNew = (brain.rawSourcePool ?? []).filter((s) => inWindow(s.stagedAt, start, end)).length;

  const articlesPublished = (brain.articles ?? []).filter((a) => inWindow(a.publishedAt, start, end)).length;
  const fbPostsQueued = (brain.fbQueue ?? []).filter((p) => inWindow(p.createdAt, start, end)).length;

  const bookings = brain.prospects.filter(
    (p) => p.status === "booked" && inWindow(p.updatedAt, start, end)
  ).length;

  return {
    date: label,
    emails: {
      sent: sentYesterday.length,
      opened,
      clicked,
      replied,
      bounced,
    },
    prospects: {
      added: prospectsAdded.length,
      bySource,
      researched: researchedYesterday,
    },
    channels: {
      twitterIntentNew: twitterNew,
      linkedinDraftsNew: linkedinNew,
      rawSourcePoolNew: rawPoolNew,
    },
    content: {
      articlesPublished,
      fbPostsQueued,
    },
    bookings,
    totals: {
      pipeline: brain.prospects.filter((p) => p.status !== "lost" && p.status !== "closed").length,
      contactedEver: brain.prospects.filter((p) => (p.sequence?.stage ?? 0) > 0).length,
      repliedEver: brain.prospects.filter((p) => p.sequence?.lastOutcome === "replied").length,
    },
  };
}

function renderHtml(stats: DigestStats): string {
  const rate = (n: number, total: number) =>
    total === 0 ? "—" : `${((n / total) * 100).toFixed(1)}%`;

  const sourceRows = Object.entries(stats.prospects.bySource)
    .map(([k, v]) => `<tr><td style="padding:6px 12px">${k}</td><td style="padding:6px 12px;text-align:right">${v}</td></tr>`)
    .join("");

  return `<!DOCTYPE html>
<html>
<body style="margin:0;background:#08080a;color:#eaeaea;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;padding:32px">
  <div style="max-width:640px;margin:0 auto">
    <div style="font-family:ui-monospace,Menlo,monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.3em;color:#84e1ff;margin-bottom:8px">— Brain digest · ${stats.date}</div>
    <h1 style="font-size:28px;margin:0 0 32px;color:#fff;font-weight:600;letter-spacing:-0.02em">Yesterday at Brandivibe</h1>

    <h2 style="font-size:13px;text-transform:uppercase;letter-spacing:0.2em;color:#84e1ff;font-family:ui-monospace,Menlo,monospace;margin:24px 0 12px">— Outbound</h2>
    <table style="width:100%;border-collapse:collapse;background:#0e0e10;border-radius:12px;overflow:hidden">
      <tr><td style="padding:14px 16px;color:#888">Emails sent</td><td style="padding:14px 16px;text-align:right;font-weight:600;color:#fff">${stats.emails.sent}</td></tr>
      <tr><td style="padding:14px 16px;color:#888;border-top:1px solid #1a1a1c">Opened</td><td style="padding:14px 16px;text-align:right;color:#fff;border-top:1px solid #1a1a1c">${stats.emails.opened} <span style="color:#666;font-size:13px">(${rate(stats.emails.opened, stats.emails.sent)})</span></td></tr>
      <tr><td style="padding:14px 16px;color:#888;border-top:1px solid #1a1a1c">Clicked</td><td style="padding:14px 16px;text-align:right;color:#fff;border-top:1px solid #1a1a1c">${stats.emails.clicked} <span style="color:#666;font-size:13px">(${rate(stats.emails.clicked, stats.emails.sent)})</span></td></tr>
      <tr><td style="padding:14px 16px;color:#888;border-top:1px solid #1a1a1c">Replied</td><td style="padding:14px 16px;text-align:right;color:#84e1ff;font-weight:600;border-top:1px solid #1a1a1c">${stats.emails.replied} <span style="color:#666;font-size:13px;font-weight:400">(${rate(stats.emails.replied, stats.emails.sent)})</span></td></tr>
      <tr><td style="padding:14px 16px;color:#888;border-top:1px solid #1a1a1c">Bounced</td><td style="padding:14px 16px;text-align:right;color:#fb923c;border-top:1px solid #1a1a1c">${stats.emails.bounced}</td></tr>
    </table>

    <h2 style="font-size:13px;text-transform:uppercase;letter-spacing:0.2em;color:#84e1ff;font-family:ui-monospace,Menlo,monospace;margin:32px 0 12px">— Pipeline</h2>
    <table style="width:100%;border-collapse:collapse;background:#0e0e10;border-radius:12px;overflow:hidden">
      <tr><td style="padding:14px 16px;color:#888">New prospects added</td><td style="padding:14px 16px;text-align:right;color:#fff;font-weight:600">${stats.prospects.added}</td></tr>
      <tr><td style="padding:14px 16px;color:#888;border-top:1px solid #1a1a1c">Deep-researched</td><td style="padding:14px 16px;text-align:right;color:#fff;border-top:1px solid #1a1a1c">${stats.prospects.researched}</td></tr>
      <tr><td style="padding:14px 16px;color:#888;border-top:1px solid #1a1a1c">Bookings</td><td style="padding:14px 16px;text-align:right;color:#86efac;font-weight:600;border-top:1px solid #1a1a1c">${stats.bookings}</td></tr>
    </table>
    ${sourceRows ? `<div style="margin-top:8px;padding:8px 16px;color:#666;font-size:13px"><strong style="color:#888">By source</strong><table style="width:100%;border-collapse:collapse;margin-top:6px;font-family:ui-monospace,Menlo,monospace;font-size:12px">${sourceRows}</table></div>` : ""}

    <h2 style="font-size:13px;text-transform:uppercase;letter-spacing:0.2em;color:#84e1ff;font-family:ui-monospace,Menlo,monospace;margin:32px 0 12px">— Multi-channel</h2>
    <table style="width:100%;border-collapse:collapse;background:#0e0e10;border-radius:12px;overflow:hidden">
      <tr><td style="padding:14px 16px;color:#888">Twitter intent leads captured</td><td style="padding:14px 16px;text-align:right;color:#fff;font-weight:600">${stats.channels.twitterIntentNew}</td></tr>
      <tr><td style="padding:14px 16px;color:#888;border-top:1px solid #1a1a1c">LinkedIn DM drafts queued</td><td style="padding:14px 16px;text-align:right;color:#fff;border-top:1px solid #1a1a1c">${stats.channels.linkedinDraftsNew}</td></tr>
      <tr><td style="padding:14px 16px;color:#888;border-top:1px solid #1a1a1c">Raw source signals staged</td><td style="padding:14px 16px;text-align:right;color:#fff;border-top:1px solid #1a1a1c">${stats.channels.rawSourcePoolNew}</td></tr>
    </table>

    <h2 style="font-size:13px;text-transform:uppercase;letter-spacing:0.2em;color:#84e1ff;font-family:ui-monospace,Menlo,monospace;margin:32px 0 12px">— Content</h2>
    <table style="width:100%;border-collapse:collapse;background:#0e0e10;border-radius:12px;overflow:hidden">
      <tr><td style="padding:14px 16px;color:#888">Articles published</td><td style="padding:14px 16px;text-align:right;color:#fff;font-weight:600">${stats.content.articlesPublished}</td></tr>
      <tr><td style="padding:14px 16px;color:#888;border-top:1px solid #1a1a1c">FB posts queued</td><td style="padding:14px 16px;text-align:right;color:#fff;border-top:1px solid #1a1a1c">${stats.content.fbPostsQueued}</td></tr>
    </table>

    <h2 style="font-size:13px;text-transform:uppercase;letter-spacing:0.2em;color:#84e1ff;font-family:ui-monospace,Menlo,monospace;margin:32px 0 12px">— Cumulative</h2>
    <table style="width:100%;border-collapse:collapse;background:#0e0e10;border-radius:12px;overflow:hidden">
      <tr><td style="padding:14px 16px;color:#888">Active pipeline</td><td style="padding:14px 16px;text-align:right;color:#fff;font-weight:600">${stats.totals.pipeline}</td></tr>
      <tr><td style="padding:14px 16px;color:#888;border-top:1px solid #1a1a1c">Contacted ever</td><td style="padding:14px 16px;text-align:right;color:#fff;border-top:1px solid #1a1a1c">${stats.totals.contactedEver}</td></tr>
      <tr><td style="padding:14px 16px;color:#888;border-top:1px solid #1a1a1c">Replied ever</td><td style="padding:14px 16px;text-align:right;color:#84e1ff;font-weight:600;border-top:1px solid #1a1a1c">${stats.totals.repliedEver}</td></tr>
    </table>

    <div style="margin-top:40px;padding-top:24px;border-top:1px solid #1a1a1c;font-family:ui-monospace,Menlo,monospace;font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.2em">
      Sent automatically by the Brandivibe brain · brandivibe.com/dashboard
    </div>
  </div>
</body>
</html>`;
}

function renderText(stats: DigestStats): string {
  const r = (n: number, t: number) => (t === 0 ? "—" : `${((n / t) * 100).toFixed(1)}%`);
  const sources = Object.entries(stats.prospects.bySource)
    .map(([k, v]) => `  ${k}: ${v}`)
    .join("\n");

  return `BRANDIVIBE BRAIN DIGEST · ${stats.date}
Yesterday at Brandivibe

OUTBOUND
  Sent: ${stats.emails.sent}
  Opened: ${stats.emails.opened} (${r(stats.emails.opened, stats.emails.sent)})
  Clicked: ${stats.emails.clicked} (${r(stats.emails.clicked, stats.emails.sent)})
  Replied: ${stats.emails.replied} (${r(stats.emails.replied, stats.emails.sent)})
  Bounced: ${stats.emails.bounced}

PIPELINE
  New prospects: ${stats.prospects.added}
  Deep-researched: ${stats.prospects.researched}
  Bookings: ${stats.bookings}
${sources ? `  By source:\n${sources}` : ""}

MULTI-CHANNEL
  Twitter intent: ${stats.channels.twitterIntentNew}
  LinkedIn drafts: ${stats.channels.linkedinDraftsNew}
  Raw signals: ${stats.channels.rawSourcePoolNew}

CONTENT
  Articles: ${stats.content.articlesPublished}
  FB posts: ${stats.content.fbPostsQueued}

CUMULATIVE
  Active pipeline: ${stats.totals.pipeline}
  Contacted ever: ${stats.totals.contactedEver}
  Replied ever: ${stats.totals.repliedEver}

—
Sent automatically · brandivibe.com/dashboard`;
}

export async function sendDailyDigest(): Promise<{ ok: boolean; error?: string; stats: DigestStats; recipient: string }> {
  const stats = await buildDailyDigest();
  const recipient = process.env.NOTIFICATION_EMAIL || process.env.ALERT_EMAIL || DEFAULT_RECIPIENT;

  const subject = `Brain digest · ${stats.date} · ${stats.emails.sent} sent · ${stats.emails.replied} replied · ${stats.bookings} booked`;

  const result = await sendTransactional({
    to: recipient,
    subject,
    text: renderText(stats),
    html: renderHtml(stats),
    fromName: "Brandivibe Brain",
  });

  return { ok: result.ok, error: result.error, stats, recipient };
}
