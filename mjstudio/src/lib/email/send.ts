import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'
import { renderCampaignEmail, type Recipient } from './render'

/**
 * The campaign send pipeline.
 *
 * Flow: load the campaign → resolve every SUBSCRIBED subscriber across its
 * lists (de-duplicated by id) → render a per-recipient email (merge tags,
 * tracking, unsubscribe) → send through Resend in batches → log one `sent`
 * event each → roll the counts into the campaign and mark it sent.
 *
 * Guards that matter:
 *   - refuses to send a campaign that is already `sent`/`sending` (no double blast)
 *   - only ever emails `status: subscribed` people
 *   - RESEND_API_KEY absent → it does a full DRY RUN (renders, counts, logs
 *     nothing external) so the pipeline is testable before a key exists
 */

const RESEND_KEY = process.env.RESEND_API_KEY
const RESEND_ENDPOINT = 'https://api.resend.com/emails'
const BATCH = 50

type SendResult = { ok: boolean; recipients: number; sent: number; failed: number; dryRun: boolean; error?: string }

export async function sendCampaign(campaignId: string): Promise<SendResult> {
  const payload = await getPayload({ config })

  const campaign = await payload.findByID({ collection: 'email-campaigns', id: campaignId, depth: 0, overrideAccess: true })
  if (!campaign) return { ok: false, recipients: 0, sent: 0, failed: 0, dryRun: !RESEND_KEY, error: 'Campaign not found' }
  if (campaign.status === 'sending' || campaign.status === 'sent') {
    return { ok: false, recipients: 0, sent: 0, failed: 0, dryRun: !RESEND_KEY, error: `Campaign already ${campaign.status}` }
  }

  await payload.update({ collection: 'email-campaigns', id: campaignId, data: { status: 'sending' }, overrideAccess: true })

  const listIds = (campaign.lists ?? []).map((l: unknown) => (typeof l === 'object' ? (l as { id: string }).id : l))
  // Resolve subscribers across all target lists, subscribed only.
  const subs = await payload.find({
    collection: 'subscribers',
    where: { and: [{ status: { equals: 'subscribed' } }, { lists: { in: listIds } }] },
    limit: 100000,
    depth: 0,
    overrideAccess: true,
  })

  const recipients: Recipient[] = dedupe(
    subs.docs.map((d) => {
      const doc = d as { id: string; email: string; name?: string; unsubscribeToken: string }
      return { id: doc.id, email: doc.email, name: doc.name, unsubscribeToken: doc.unsubscribeToken }
    }),
  )

  const dryRun = !RESEND_KEY
  let sent = 0
  let failed = 0

  for (let i = 0; i < recipients.length; i += BATCH) {
    const batch = recipients.slice(i, i + BATCH)
    await Promise.all(
      batch.map(async (r) => {
        try {
          const { html, text } = renderCampaignEmail({
            bodyLexical: campaign.body,
            campaignId,
            recipient: r,
            preheader: campaign.preheader,
          })
          if (!dryRun) {
            const res = await fetch(RESEND_ENDPOINT, {
              method: 'POST',
              headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                from: `${campaign.fromName} <${campaign.fromEmail}>`,
                to: [r.email],
                reply_to: campaign.replyTo || undefined,
                subject: campaign.subject,
                html,
                text,
              }),
            })
            if (!res.ok) throw new Error(await res.text())
          }
          await payload.create({
            collection: 'email-events',
            data: { type: 'sent', campaign: campaignId, subscriber: r.id },
            overrideAccess: true,
          })
          sent++
        } catch {
          failed++
        }
      }),
    )
  }

  await payload.update({
    collection: 'email-campaigns',
    id: campaignId,
    data: {
      status: failed === recipients.length && recipients.length > 0 ? 'failed' : 'sent',
      sentAt: new Date().toISOString(),
      stats: {
        recipients: recipients.length,
        sent,
        failed,
        opens: campaign.stats?.opens ?? 0,
        clicks: campaign.stats?.clicks ?? 0,
        unsubscribes: campaign.stats?.unsubscribes ?? 0,
      },
    },
    overrideAccess: true,
  })

  return { ok: true, recipients: recipients.length, sent, failed, dryRun }
}

function dedupe(list: Recipient[]): Recipient[] {
  const seen = new Set<string>()
  return list.filter((r) => (seen.has(r.id) ? false : (seen.add(r.id), true)))
}
