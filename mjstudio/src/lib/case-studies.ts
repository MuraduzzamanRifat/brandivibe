import 'server-only'
import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { lexicalToHTML, lexicalToParagraphs, mediaURL } from '@/lib/content'

/**
 * Case-study (portfolio) store — Payload-backed.
 * List/cards use CaseStudyMeta; the detail page loads the full record with
 * every storytelling section (challenge → process → results → testimonial).
 */

export type CaseMetric = { label: string; value: string; note?: string }

export type CaseStudyMeta = {
  id: string
  slug: string
  title: string
  client: string
  industry: string
  services: string[]
  excerpt: string
  heroImage: string
  metrics: CaseMetric[]
  featured?: boolean
  publishedAt: string
}

const client = cache(async () => getPayload({ config }))

type Doc = Record<string, unknown>
const arr = <T = Doc>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : [])
const relName = (v: unknown, key = 'name'): string =>
  v && typeof v === 'object' ? String((v as Doc)[key] ?? '') : ''

function mapMeta(doc: Doc): CaseStudyMeta {
  return {
    id: String(doc.id ?? ''),
    slug: String(doc.slug ?? ''),
    title: String(doc.title ?? ''),
    client: relName(doc.client),
    industry: relName(doc.industry),
    services: arr<Doc>(doc.services).map((s) => String(s.title ?? '')).filter(Boolean),
    excerpt: String(doc.excerpt ?? ''),
    heroImage: mediaURL(doc.heroImage),
    metrics: arr<{ label?: string; value?: string; note?: string }>(doc.metrics).map((m) => ({
      label: m.label ?? '',
      value: m.value ?? '',
      note: m.note ?? '',
    })),
    featured: Boolean(doc.featured),
    publishedAt: String(doc.publishedAt ?? doc.createdAt ?? ''),
  }
}

export const getCaseStudies = cache(async (): Promise<CaseStudyMeta[]> => {
  const payload = await client()
  const res = await payload.find({
    collection: 'case-studies',
    where: { _status: { equals: 'published' } },
    limit: 100,
    depth: 1,
    sort: '-publishedAt',
    overrideAccess: true,
  })
  return res.docs.map((d) => mapMeta(d as Doc))
})

export async function getFeaturedCaseStudies(limit = 3): Promise<CaseStudyMeta[]> {
  const sorted = await getCaseStudies()
  const featured = sorted.filter((c) => c.featured)
  return (featured.length ? featured : sorted).slice(0, limit)
}

export async function getCaseStudy(slug: string): Promise<CaseStudyMeta | undefined> {
  return (await getCaseStudies()).find((c) => c.slug === slug)
}

// ---- Full detail record -----------------------------------------------------

export type CaseStudyFull = CaseStudyMeta & {
  technologies: string[]
  team: string[]
  overviewHtml: string
  challengeHtml: string
  objectives: string[]
  researchHtml: string
  designHtml: string
  devHtml: string
  marketingHtml: string
  timeline: { phase: string; duration: string; detail: string }[]
  beforeAfter: { beforeImage: string; afterImage: string; beforeLabel: string; afterLabel: string; note: string } | null
  gallery: { image: string; caption: string }[]
  videos: { url: string; title: string }[]
  testimonial: { quote: string; authorName: string; authorRole: string } | null
  relatedServices: { title: string; slug: string }[]
  seoTitle: string
  seoDescription: string
}

export async function getCaseStudyFull(slug: string): Promise<CaseStudyFull | null> {
  const payload = await client()
  const res = await payload.find({
    collection: 'case-studies',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    limit: 1,
    depth: 2,
    overrideAccess: true,
  })
  if (!res.docs.length) return null
  const doc = res.docs[0] as Doc

  const ba = (doc.beforeAfter ?? null) as Doc | null
  const beforeAfter =
    ba && (ba.beforeImage || ba.afterImage)
      ? {
          beforeImage: mediaURL(ba.beforeImage),
          afterImage: mediaURL(ba.afterImage),
          beforeLabel: String(ba.beforeLabel ?? 'Before'),
          afterLabel: String(ba.afterLabel ?? 'After'),
          note: String(ba.note ?? ''),
        }
      : null

  const t = doc.testimonial as Doc | null | undefined
  const testimonial =
    t && typeof t === 'object' && t.quote
      ? { quote: String(t.quote), authorName: String(t.authorName ?? ''), authorRole: String(t.authorRole ?? '') }
      : null

  const seo = (doc.seo ?? {}) as { metaTitle?: string; metaDescription?: string }

  return {
    ...mapMeta(doc),
    technologies: arr<Doc>(doc.technologies).map((x) => String(x.name ?? '')).filter(Boolean),
    team: arr<Doc>(doc.team).map((x) => String(x.name ?? '')).filter(Boolean),
    overviewHtml: lexicalToHTML(doc.overview),
    challengeHtml: lexicalToHTML(doc.challenge),
    objectives: arr<{ text?: string }>(doc.objectives).map((o) => o.text ?? '').filter(Boolean),
    researchHtml: lexicalToHTML(doc.research),
    designHtml: lexicalToHTML(doc.designProcess),
    devHtml: lexicalToHTML(doc.devProcess),
    marketingHtml: lexicalToHTML(doc.marketingProcess),
    timeline: arr<{ phase?: string; duration?: string; detail?: string }>(doc.timeline).map((s) => ({
      phase: s.phase ?? '',
      duration: s.duration ?? '',
      detail: s.detail ?? '',
    })),
    beforeAfter,
    gallery: arr<Doc>(doc.gallery)
      .map((g) => ({ image: mediaURL(g.image), caption: String(g.caption ?? '') }))
      .filter((g) => g.image),
    videos: arr<{ url?: string; title?: string }>(doc.videos)
      .map((v) => ({ url: v.url ?? '', title: v.title ?? '' }))
      .filter((v) => v.url),
    testimonial,
    relatedServices: arr<Doc>(doc.relatedServices)
      .map((s) => ({ title: String(s.title ?? ''), slug: String(s.slug ?? '') }))
      .filter((s) => s.slug),
    seoTitle: seo.metaTitle || String(doc.title ?? ''),
    seoDescription: seo.metaDescription || String(doc.excerpt ?? ''),
  }
}

/** Plain-text summary paragraphs for schema/description fallbacks. */
export function overviewText(value: unknown): string {
  return lexicalToParagraphs(value).join(' ')
}
