import { NextResponse, type NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { verifyTrack } from '@/lib/email/tracking'

/**
 * GET /e/click?t=<signed>&u=<dest>  — logs a click, then redirects to <dest>.
 *
 * The redirect happens whether or not tracking succeeds, so a recipient always
 * reaches the link. `u` is validated to be an http(s) URL before redirecting so
 * the endpoint can't be abused as an open redirect to arbitrary schemes.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('t') || ''
  const dest = req.nextUrl.searchParams.get('u') || ''

  let safe = 'https://brandivibe.com'
  try {
    const u = new URL(dest)
    if (u.protocol === 'http:' || u.protocol === 'https:') safe = u.toString()
  } catch {
    /* keep the safe default */
  }

  const track = verifyTrack(token)
  if (track) {
    try {
      const payload = await getPayload({ config })
      await payload.create({
        collection: 'email-events',
        data: { type: 'click', campaign: track.c, subscriber: track.s, url: safe, userAgent: req.headers.get('user-agent') || '' },
        overrideAccess: true,
      })
      const c = await payload.findByID({ collection: 'email-campaigns', id: track.c, depth: 0, overrideAccess: true })
      const stats = (c?.stats ?? {}) as Record<string, number>
      await payload.update({
        collection: 'email-campaigns',
        id: track.c,
        data: { stats: { ...stats, clicks: (stats.clicks ?? 0) + 1 } },
        overrideAccess: true,
      })
    } catch {
      /* tracking must never block the redirect */
    }
  }

  return NextResponse.redirect(safe, 302)
}

export const dynamic = 'force-dynamic'
