import { type NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * GET /e/unsubscribe?t=<unsubscribeToken>  — one-click opt-out.
 *
 * The token is the subscriber's own stable `unsubscribeToken`, not a signed
 * campaign token — so an unsubscribe link keeps working forever, across every
 * campaign, which is what CAN-SPAM/GDPR expect. Returns a small styled
 * confirmation page rather than JSON.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('t') || ''
  let done = false

  if (token) {
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
      if (sub) {
        await payload.update({
          collection: 'subscribers',
          id: sub.id,
          data: { status: 'unsubscribed' },
          overrideAccess: true,
        })
        await payload.create({
          collection: 'email-events',
          data: { type: 'unsubscribe', subscriber: sub.id },
          overrideAccess: true,
        })
        done = true
      }
    } catch {
      /* show the generic message below */
    }
  }

  return new Response(page(done), {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}

function page(done: boolean): string {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unsubscribe · Brandivibe</title></head>
<body style="margin:0;background:#fbf6ef;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#2a231f;">
  <div style="max-width:520px;margin:12vh auto;padding:40px;background:#fff;border-radius:24px;border:1px solid rgba(42,35,31,0.10);text-align:center;">
    <span style="display:inline-block;width:44px;height:44px;line-height:44px;border-radius:12px;background:#d13000;color:#fff;font-family:Georgia,serif;font-weight:700;font-size:26px;">b</span>
    <h1 style="font-size:26px;margin:22px 0 10px;">${done ? "You're unsubscribed." : 'Link expired or invalid.'}</h1>
    <p style="color:#7c6f65;line-height:1.6;">${
      done
        ? "You won't receive any more marketing emails from us. No hard feelings — you can resubscribe any time at brandivibe.com."
        : "We couldn't find that subscription. If you keep getting emails, reply to one and a real person will sort it out."
    }</p>
    <a href="https://brandivibe.com" style="display:inline-block;margin-top:18px;color:#d13000;font-weight:600;text-decoration:none;">Back to brandivibe.com →</a>
  </div>
</body></html>`
}

export const dynamic = 'force-dynamic'
