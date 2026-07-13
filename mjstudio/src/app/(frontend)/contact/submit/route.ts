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

  // Honeypot: real users never fill this. Any truthy value = bot (omitting the
  // field no longer bypasses it). Pretend success so bots don't retry.
  if (body.website) {
    return NextResponse.json({ ok: true })
  }

  const name = String(body.name ?? '').trim()
  const email = String(body.email ?? '').trim()
  const message = String(body.message ?? '').trim()
  const company = String(body.company ?? '').trim()
  const service = String(body.service ?? '').trim()
  const source = String(body.source ?? '').trim()

  if (!name || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please add your name and a valid email address.' }, { status: 422 })
  }

  // Length caps so this (the only unauthenticated write path) can't be used to
  // POST multi-megabyte payloads at the Leads table.
  if (
    name.length > 120 ||
    email.length > 200 ||
    company.length > 160 ||
    service.length > 80 ||
    message.length > 5000 ||
    source.length > 300
  ) {
    return NextResponse.json({ error: 'That message is too long — please shorten it and try again.' }, { status: 422 })
  }

  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'leads',
      overrideAccess: true,
      data: {
        name,
        email,
        company: company || undefined,
        service: service || undefined,
        message: message || undefined,
        source: source || undefined,
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
