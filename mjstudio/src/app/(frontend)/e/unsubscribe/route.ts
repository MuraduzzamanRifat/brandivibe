import { type NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * /e/unsubscribe?t=<unsubscribeToken>
 *
 * RFC 8058-friendly: a plain **GET never mutates**. Mail-security scanners and
 * link prefetchers fetch every URL in a message with GET — if GET unsubscribed,
 * they'd silently opt real recipients out. So GET only renders a confirmation
 * page with a button; the actual opt-out happens on **POST** (the button, or a
 * mail client honouring `List-Unsubscribe-Post: List-Unsubscribe=One-Click`,
 * which POSTs here directly). The token is the subscriber's stable
 * `unsubscribeToken`, so the link works forever across every campaign.
 */

async function unsubscribe(token: string): Promise<boolean> {
  if (!token) return false
  try {
    const payload = await getPayload({ config })
    const found = await payload.find({
      collection: 'subscribers',
      where: { unsubscribeToken: { equals: token } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const sub = found.docs[0] as { id: string } | undefined
    if (!sub) return false
    await payload.update({ collection: 'subscribers', id: sub.id, data: { status: 'unsubscribed' }, overrideAccess: true })
    await payload.create({ collection: 'email-events', data: { type: 'unsubscribe', subscriber: sub.id }, overrideAccess: true })
    return true
  } catch {
    return false
  }
}

const html = (body: string) =>
  new Response(body, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } })

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('t') || ''
  // Never mutate on GET — just confirm intent.
  return html(confirmPage(token))
}

export async function POST(req: NextRequest) {
  let token = req.nextUrl.searchParams.get('t') || ''
  if (!token) {
    try {
      const form = await req.formData()
      token = String(form.get('t') || '')
    } catch {
      /* no form body (e.g. one-click) — token stays from the query */
    }
  }
  return html(resultPage(await unsubscribe(token)))
}

const shell = (title: string, inner: string) => `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} · Brandivibe</title></head>
<body style="margin:0;background:#fbf6ef;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#2a231f;">
  <div style="max-width:520px;margin:12vh auto;padding:40px;background:#fff;border-radius:24px;border:1px solid rgba(42,35,31,0.10);text-align:center;">
    <span style="display:inline-block;width:44px;height:44px;line-height:44px;border-radius:12px;background:#d13000;color:#fff;font-family:Georgia,serif;font-weight:700;font-size:26px;">b</span>
    ${inner}
    <a href="https://brandivibe.com" style="display:inline-block;margin-top:18px;color:#d13000;font-weight:600;text-decoration:none;">Back to brandivibe.com →</a>
  </div>
</body></html>`

function confirmPage(token: string): string {
  const t = String(token).replace(/"/g, '&quot;')
  return shell(
    'Unsubscribe',
    `<h1 style="font-size:26px;margin:22px 0 10px;">Unsubscribe from our emails?</h1>
    <p style="color:#7c6f65;line-height:1.6;">Click below and you won't receive any more marketing emails from us.</p>
    <form method="post" action="/e/unsubscribe" style="margin-top:20px;">
      <input type="hidden" name="t" value="${t}">
      <button type="submit" style="border:0;cursor:pointer;background:#d13000;color:#fff;font-size:15px;font-weight:600;padding:12px 22px;border-radius:999px;">Unsubscribe me</button>
    </form>`,
  )
}

function resultPage(done: boolean): string {
  return shell(
    'Unsubscribe',
    `<h1 style="font-size:26px;margin:22px 0 10px;">${done ? "You're unsubscribed." : 'Link expired or invalid.'}</h1>
    <p style="color:#7c6f65;line-height:1.6;">${
      done
        ? "You won't receive any more marketing emails from us. No hard feelings — you can resubscribe any time at brandivibe.com."
        : "We couldn't find that subscription. If you keep getting emails, reply to one and a real person will sort it out."
    }</p>`,
  )
}

export const dynamic = 'force-dynamic'
