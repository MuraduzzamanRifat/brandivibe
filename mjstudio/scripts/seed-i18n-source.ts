/**
 * Phase 1a seed — moves the content that lives in code into Payload.
 *
 *   data/industries.ts  -> industries (incl. all 280 serviceFraming rows)
 *   data/glossary.ts    -> glossary
 *
 * Everything is written to the `en` locale and marked
 * `translationStatus: 'published'` for English only. No other locale is
 * touched: a locale must not look translated before a human has reviewed it.
 *
 * SAFETY: refuses to run unless DATABASE_URI_MIGRATION is set and is *not* the
 * production connection string. Run it against a Neon branch. See
 * scripts/seed-i18n-source.md.
 *
 * Idempotent: matches on slug and updates, so re-running never duplicates.
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { industries as staticIndustries } from '../src/data/industries'
import { glossary as staticGlossary } from '../src/data/glossary'

async function main() {
  const target = process.env.DATABASE_URI_MIGRATION?.trim()
  const active = process.env.DATABASE_URI?.trim()

  if (!target) {
    throw new Error(
      'DATABASE_URI_MIGRATION is not set. Put your Neon *branch* connection string there.'
    )
  }

  /**
   * Payload connects with DATABASE_URI. Requiring it to equal
   * DATABASE_URI_MIGRATION is how we prove, at runtime, that this seed is
   * pointed at the throwaway branch and not at production — you cannot run it
   * by accident while DATABASE_URI still points at the live database.
   */
  if (active !== target) {
    throw new Error(
      'Refusing to run: DATABASE_URI does not equal DATABASE_URI_MIGRATION.\n' +
        'Point DATABASE_URI at the Neon branch for the duration of the migration,\n' +
        'so Payload writes to the branch and never to production.'
    )
  }

  // Say out loud which endpoint we are about to write to.
  const endpoint = target.match(/@(ep-[a-z0-9-]+)/)?.[1] ?? 'unknown'
  console.log(`writing to Neon endpoint: ${endpoint}\n`)

  const payload = await getPayload({ config })

  // ---- services: needed to resolve serviceFraming relationships -----------
  const services = await payload.find({
    collection: 'services',
    limit: 200,
    depth: 0,
    overrideAccess: true,
  })
  const serviceIdBySlug = new Map<string, string | number>()
  for (const doc of services.docs) {
    const d = doc as { id: string | number; slug?: string }
    if (d.slug) serviceIdBySlug.set(d.slug, d.id)
  }
  console.log(`resolved ${serviceIdBySlug.size} services`)

  // ---- industries ---------------------------------------------------------
  let framingsWritten = 0
  let framingsSkipped = 0

  for (const ind of staticIndustries) {
    const serviceFraming: Array<{ service: string | number; framing: string }> = []
    for (const [serviceSlug, framing] of Object.entries(ind.serviceFraming)) {
      const id = serviceIdBySlug.get(serviceSlug)
      if (!id) {
        // Loud, never silent — a dropped framing means that combo page quietly
        // falls back to boilerplate, which is what this whole phase fixes.
        console.warn(`  ! ${ind.slug}: no service "${serviceSlug}" — framing dropped`)
        framingsSkipped++
        continue
      }
      serviceFraming.push({ service: id, framing })
      framingsWritten++
    }

    const data = {
      name: ind.name,
      slug: ind.slug,
      pluralName: ind.pluralName,
      shortLabel: ind.shortLabel,
      intro: ind.intro,
      buyerPersona: ind.buyerPersona,
      conversionFrame: ind.conversionFrame,
      industrySignal: ind.industrySignal,
      painPoints: ind.painPoints.map((text) => ({ text })),
      examples: ind.examples.map((name) => ({ name })),
      industryFaqs: ind.industryFaqs.map((f) => ({ question: f.q, answer: f.a })),
      serviceFraming,
      translationStatus: 'published' as const,
    }

    const existing = await payload.find({
      collection: 'industries',
      where: { slug: { equals: ind.slug } },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.docs.length) {
      await payload.update({
        collection: 'industries',
        id: (existing.docs[0] as { id: string | number }).id,
        data,
        locale: 'en',
        overrideAccess: true,
      })
      console.log(`  ~ industry ${ind.slug} (${serviceFraming.length} framings)`)
    } else {
      await payload.create({ collection: 'industries', data, locale: 'en', overrideAccess: true })
      console.log(`  + industry ${ind.slug} (${serviceFraming.length} framings)`)
    }
  }

  // ---- glossary -----------------------------------------------------------
  for (const term of staticGlossary) {
    const data = {
      term: term.term,
      slug: term.slug,
      definition: term.definition,
      alsoKnownAs: (term.alsoKnownAs ?? []).map((text) => ({ text })),
      whyItMatters: term.whyItMatters,
      components: (term.components ?? []).map((text) => ({ text })),
      whenItApplies: term.whenItApplies,
      faqs: (term.faqs ?? []).map((f) => ({ question: f.q, answer: f.a })),
      category: term.category,
      seo: { metaTitle: term.metaTitle, metaDescription: term.metaDescription },
      translationStatus: 'published' as const,
      _status: 'published' as const,
    }

    const existing = await payload.find({
      collection: 'glossary',
      where: { slug: { equals: term.slug } },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.docs.length) {
      await payload.update({
        collection: 'glossary',
        id: (existing.docs[0] as { id: string | number }).id,
        data,
        locale: 'en',
        overrideAccess: true,
      })
      console.log(`  ~ glossary ${term.slug}`)
    } else {
      await payload.create({ collection: 'glossary', data, locale: 'en', overrideAccess: true })
      console.log(`  + glossary ${term.slug}`)
    }
  }

  // relatedTerms needs every term to exist first.
  for (const term of staticGlossary) {
    if (!term.relatedSlugs?.length) continue
    const self = await payload.find({
      collection: 'glossary',
      where: { slug: { equals: term.slug } },
      limit: 1,
      overrideAccess: true,
    })
    if (!self.docs.length) continue
    const related = await payload.find({
      collection: 'glossary',
      where: { slug: { in: term.relatedSlugs } },
      limit: 50,
      overrideAccess: true,
    })
    await payload.update({
      collection: 'glossary',
      id: (self.docs[0] as { id: string | number }).id,
      data: { relatedTerms: related.docs.map((d) => (d as { id: string | number }).id) },
      overrideAccess: true,
    })
  }

  console.log(
    `\ndone — ${staticIndustries.length} industries, ${framingsWritten} framings written` +
      (framingsSkipped ? `, ${framingsSkipped} DROPPED (see warnings above)` : '') +
      `, ${staticGlossary.length} glossary terms.`
  )
  if (framingsWritten !== 280) {
    console.warn(`\n! expected 280 framings, wrote ${framingsWritten}. Investigate before cutting over.`)
  }
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
