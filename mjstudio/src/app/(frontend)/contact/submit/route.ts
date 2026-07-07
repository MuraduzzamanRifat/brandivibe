import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Contact-form endpoint. Validates + honeypot-checks the submission, then
 * creates a Lead in Payload (overrideAccess) so it lands in the admin.
 * Not under /api, so it never collides with Payload's REST catch-all.
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 })
  }

  // Honeypot: real users never fill this. Pretend success so bots don't retry.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true })
  }

  const name = String(body.name ?? '').trim()
  const email = String(body.email ?? '').trim()
  const message = String(body.message ?? '').trim()

  if (!name || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please add your name and a valid email address.' }, { status: 422 })
  }

  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'leads',
      overrideAccess: true,
      data: {
        name,
        email,
        company: String(body.company ?? '').trim() || undefined,
        service: String(body.service ?? '').trim() || undefined,
        message: message || undefined,
        source: String(body.source ?? '').trim() || undefined,
        status: 'new',
      },
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong on our end. Please email us instead.' },
      { status: 500 },
    )
  }
}
