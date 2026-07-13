import 'server-only'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import { openPixelUrl, clickUrl, unsubscribeUrl, type Track } from './tracking'

/**
 * Turns a campaign's rich-text body into a sendable HTML email for ONE
 * recipient: merge tags filled, every link rewritten for click tracking, an
 * open pixel and a compliant unsubscribe footer appended, all wrapped in a warm
 * branded shell with inline styles (email clients strip <style>).
 */

export type Recipient = { id: string; email: string; name?: string; unsubscribeToken: string }

function mergeTags(html: string, r: Recipient): string {
  return html
    .replaceAll('{{name}}', escapeHtml(r.name || 'there'))
    .replaceAll('{{email}}', escapeHtml(r.email))
}

/** Rewrite every http(s) href to go through the click tracker. */
function trackLinks(html: string, track: Track): string {
  return html.replace(/href="(https?:\/\/[^"]+)"/g, (_m, url) => `href="${clickUrl(track, url)}"`)
}

export function renderCampaignEmail(opts: {
  bodyLexical: unknown
  campaignId: string
  recipient: Recipient
  preheader?: string
}): { html: string; text: string } {
  const { bodyLexical, campaignId, recipient, preheader } = opts
  const track: Track = { c: campaignId, s: recipient.id }

  let inner = ''
  try {
    inner = convertLexicalToHTML({ data: bodyLexical as never })
  } catch {
    inner = ''
  }
  inner = mergeTags(inner, recipient)
  inner = trackLinks(inner, track)

  const html = shell({
    inner,
    preheader: preheader ? mergeTags(escapeHtml(preheader), recipient) : '',
    pixel: openPixelUrl(track),
    unsub: unsubscribeUrl(recipient.unsubscribeToken),
  })

  // Plain-text fallback (crude but real — some clients prefer it).
  const text = inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  return { html, text }
}

function shell({
  inner,
  preheader,
  pixel,
  unsub,
}: {
  inner: string
  preheader: string
  pixel: string
  unsub: string
}): string {
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#fbf6ef;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>` : ''}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fbf6ef;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid rgba(42,35,31,0.10);">
        <tr><td style="padding:28px 32px 8px;">
          <span style="display:inline-block;width:34px;height:34px;line-height:34px;text-align:center;border-radius:9px;background:#d13000;color:#fff;font-family:Georgia,serif;font-weight:700;font-size:20px;">b</span>
        </td></tr>
        <tr><td style="padding:8px 32px 24px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#2a231f;font-size:16px;line-height:1.6;">
          ${inner}
        </td></tr>
        <tr><td style="padding:20px 32px;border-top:1px solid rgba(42,35,31,0.10);font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#7c6f65;font-size:12px;line-height:1.6;">
          Brandivibe · Dhaka, Bangladesh · <a href="https://brandivibe.com" style="color:#7c6f65;">brandivibe.com</a><br>
          You're receiving this because you signed up at brandivibe.com.
          <a href="${unsub}" style="color:#7c6f65;text-decoration:underline;">Unsubscribe</a>.
        </td></tr>
      </table>
    </td></tr>
  </table>
  <img src="${pixel}" width="1" height="1" alt="" style="display:block;border:0;">
</body></html>`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
