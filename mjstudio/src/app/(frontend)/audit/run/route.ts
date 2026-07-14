import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Homepage-review request endpoint. Captures the visitor's site + email as a
 * Lead so the team can review the page by hand and reply. Mirrors
 * contact/submit: honeypot, length caps, overrideAccess create.
 *
 * Deliberately NOT under /api — that namespace is Payload's REST catch-all, and
 * a route there is swallowed (which is exactly why the old /api/audit/run 404'd).
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

/** Best-effort host extraction for a friendly confirmation ("acme.com"). */
function toDomain(raw: string): string {
  const cleaned = raw.trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '')
  return cleaned.split(/[/?#]/)[0] || cleaned
}

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 })
  }

  // Honeypot: real users never fill this. Pretend success so bots don't retry.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true, domain: '' })
  }

  const url = String(body.url ?? '').trim()
  const email = String(body.email ?? '').trim()

  // Length caps so a bot can't POST multi-megabyte payloads at the one
  // unauthenticated write path.
  if (url.length > 300 || email.length > 200) {
    return NextResponse.json({ error: 'That looks too long — please check and try again.' }, { status: 422 })
  }
  if (!url || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: 'Please add your website and a valid email address.' },
      { status: 422 },
    )
  }

  const domain = toDomain(url)

  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'leads',
      overrideAccess: true,
      data: {
        name: domain || 'Homepage review',
        email,
        message: `Free homepage review requested for: ${url}`,
        source: 'Homepage review',
        status: 'new',
      },
    })
    return NextResponse.json({ ok: true, domain })
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong on our end. Please email us instead.' },
      { status: 500 },
    )
  }
}
