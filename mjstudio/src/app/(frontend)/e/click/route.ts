import { NextResponse, type NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { verifyTrack } from '@/lib/email/tracking'

/**
 * GET /e/click?t=<signed>  — logs a click, then redirects.
 *
 * The destination lives INSIDE the signed token (track.u), never in an unsigned
 * query param, so this can't be abused as an open redirect: a missing/forged
 * token — or a tampered destination — falls back to the site home. The redirect
 * still fires whether or not the event write succeeds, so a valid link always
 * reaches its target.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('t') || ''
  const track = verifyTrack(token)

  let safe = 'https://brandivibe.com'
  if (track?.u) {
    try {
      const u = new URL(track.u)
      if (u.protocol === 'http:' || u.protocol === 'https:') safe = u.toString()
    } catch {
      /* keep the safe default */
    }
  }

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
