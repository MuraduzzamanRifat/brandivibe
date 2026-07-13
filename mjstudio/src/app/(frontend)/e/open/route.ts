import { type NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { verifyTrack } from '@/lib/email/tracking'

/**
 * GET /e/open?t=<signed>  — the open-tracking pixel.
 *
 * Always returns a 1x1 transparent GIF (so a broken token never shows a broken
 * image in the inbox). A valid, signed token logs one `open` event and bumps
 * the campaign's open count; a forged token is silently ignored.
 */

const GIF = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64')

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('t') || ''
  const track = verifyTrack(token)
  if (track) {
    try {
      const payload = await getPayload({ config })
      await payload.create({
        collection: 'email-events',
        data: { type: 'open', campaign: track.c, subscriber: track.s, userAgent: req.headers.get('user-agent') || '' },
        overrideAccess: true,
      })
      await bumpStat(track.c, 'opens')
    } catch {
      /* never let tracking break the pixel */
    }
  }
  return new Response(GIF, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      'Content-Length': String(GIF.length),
    },
  })
}

async function bumpStat(campaignId: string, key: 'opens' | 'clicks' | 'unsubscribes') {
  const payload = await getPayload({ config })
  const c = await payload.findByID({ collection: 'email-campaigns', id: campaignId, depth: 0, overrideAccess: true })
  const stats = (c?.stats ?? {}) as Record<string, number>
  await payload.update({
    collection: 'email-campaigns',
    id: campaignId,
    data: { stats: { ...stats, [key]: (stats[key] ?? 0) + 1 } },
    overrideAccess: true,
  })
}

export const dynamic = 'force-dynamic'
