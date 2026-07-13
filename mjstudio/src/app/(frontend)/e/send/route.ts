import { NextResponse, type NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sendCampaign } from '@/lib/email/send'
import { roleOf } from '@/access/roles'

/**
 * POST /e/send  { campaignId }
 *
 * Staff-only trigger for a campaign send. Auth is resolved from the Payload
 * session cookie via payload.auth — the same session that guards the admin — so
 * this cannot be hit by an anonymous request. Kept off /api so robots.txt's
 * /api/ disallow doesn't matter and the route reads clearly as an action.
 */
export async function POST(req: NextRequest) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })
  const role = roleOf(user as never)
  if (role !== 'admin' && role !== 'editor') {
    return NextResponse.json({ error: 'Not authorised' }, { status: 401 })
  }

  let campaignId: string | undefined
  try {
    campaignId = (await req.json())?.campaignId
  } catch {
    /* no body */
  }
  if (!campaignId) return NextResponse.json({ error: 'campaignId required' }, { status: 400 })

  const result = await sendCampaign(campaignId)
  return NextResponse.json(result, { status: result.ok ? 200 : 409 })
}
