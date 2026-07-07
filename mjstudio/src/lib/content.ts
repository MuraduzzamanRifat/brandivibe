import 'server-only'
import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'

/**
 * Payload-backed content layer for server components.
 *
 * The public shapes (Service, Pillar) match the old hardcoded `@/data/services`
 * module exactly, so the existing warm components render unchanged — only the
 * data source moved to the database. Client components still import `pillars`
 * (static, structural) from here.
 */

export type ServiceProcessStep = { label: string; title: string; body: string }
export type ServiceCapability = { title: string; body: string }
export type Service = {
  slug: string; num: string; pillar: string; title: string; hook: string; tagline: string
  accent: string; summary: string; heroBody: string[]; bullets: string[]
  capabilities: ServiceCapability[]; whenYouNeedThis: string[]; process: ServiceProcessStep[]
  deliverables: string[]; relatedDemos: string[]; faqs?: { q: string; a: string }[]
  metaTitle: string; metaDescription: string
}
export type Pillar = { slug: string; title: string; accent: string; blurb: string }

/** The six pillars are fixed site structure, not editable content — kept static. */
export const pillars: Pillar[] = [
  { slug: 'web-development', title: 'Web Development', accent: '#FF6A3D', blurb: 'Fast, beautiful websites — from simple to cinematic 3D.' },
  { slug: 'software', title: 'Software Development', accent: '#0FA598', blurb: 'Custom software that runs your business, your way.' },
  { slug: 'digital-marketing', title: 'Digital Marketing', accent: '#F5A524', blurb: 'Get found and get chosen — SEO, ads, and social that pay off.' },
  { slug: 'creative-content', title: 'Creative Content', accent: '#E85D9A', blurb: 'Words, posts, and video that sound like you.' },
  { slug: 'creative-design', title: 'Creative Design', accent: '#7B6EF6', blurb: 'Design people just get, and love to look at.' },
  { slug: 'ai-automation', title: 'AI & Automation', accent: '#2FBF71', blurb: 'Your always-on teammate — automations and AI agents.' },
]

const pillarTitleBySlug = Object.fromEntries(pillars.map((p) => [p.slug, p.title]))

// ---- Lexical helpers -------------------------------------------------------
type LexNode = { text?: string; children?: LexNode[]; root?: LexNode }
function nodeText(node: LexNode | undefined): string {
  if (!node) return ''
  if (typeof node.text === 'string') return node.text
  if (Array.isArray(node.children)) return node.children.map(nodeText).join('')
  return ''
}
/** Top-level blocks of a Lexical value -> array of plain-text paragraphs. */
export function lexicalToParagraphs(value: unknown): string[] {
  const root = (value as LexNode | undefined)?.root
  if (!root?.children) return []
  return root.children.map((c) => nodeText(c).trim()).filter(Boolean)
}

/** Lexical value -> HTML string ('' when empty). Falls back to escaped paragraphs. */
export function lexicalToHTML(value: unknown): string {
  if (!value) return ''
  try {
    const html = convertLexicalToHTML({ data: value as never, disableContainer: true })
    if (typeof html === 'string' && html.trim()) return html
  } catch {
    /* fall through */
  }
  return lexicalToParagraphs(value)
    .map((p) => `<p>${p.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`)
    .join('\n')
}

/** Extract a usable URL from an upload relation (or '' if none). */
export function mediaURL(m: unknown): string {
  if (m && typeof m === 'object' && 'url' in (m as object)) {
    const u = (m as { url?: string }).url
    if (typeof u === 'string') return u
  }
  return ''
}

// ---- Payload client (singleton) -------------------------------------------
const client = cache(async () => getPayload({ config }))

// ---- Services --------------------------------------------------------------
function mapService(doc: Record<string, unknown>): Service {
  const arr = <T = Record<string, unknown>>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : [])
  const seo = (doc.seo as { metaTitle?: string; metaDescription?: string } | undefined) ?? {}
  return {
    slug: String(doc.slug ?? ''),
    num: String(doc.order ?? ''),
    pillar: pillarTitleBySlug[String(doc.pillar)] ?? String(doc.pillar ?? ''),
    title: String(doc.title ?? ''),
    hook: String(doc.hook ?? ''),
    tagline: String(doc.tagline ?? ''),
    accent: String(doc.accent ?? '#FF6A3D'),
    summary: String(doc.summary ?? ''),
    heroBody: lexicalToParagraphs(doc.heroBody),
    bullets: arr<{ text?: string }>(doc.bullets).map((b) => b.text ?? '').filter(Boolean),
    capabilities: arr<{ title?: string; body?: string }>(doc.capabilities).map((c) => ({ title: c.title ?? '', body: c.body ?? '' })),
    whenYouNeedThis: arr<{ text?: string }>(doc.whenYouNeedThis).map((w) => w.text ?? '').filter(Boolean),
    process: arr<{ label?: string; title?: string; body?: string }>(doc.process).map((p) => ({ label: p.label ?? '', title: p.title ?? '', body: p.body ?? '' })),
    deliverables: arr<{ text?: string }>(doc.deliverables).map((d) => d.text ?? '').filter(Boolean),
    relatedDemos: [],
    faqs: arr<{ question?: string; answer?: unknown } | string>(doc.faqs)
      .filter((f): f is { question?: string; answer?: unknown } => typeof f === 'object' && f !== null)
      .map((f) => ({ q: f.question ?? '', a: lexicalToParagraphs(f.answer).join('\n\n') }))
      .filter((f) => f.q),
    metaTitle: seo.metaTitle || String(doc.title ?? ''),
    metaDescription: seo.metaDescription || String(doc.summary ?? ''),
  }
}

export const getAllServices = cache(async (): Promise<Service[]> => {
  const payload = await client()
  const res = await payload.find({
    collection: 'services',
    where: { _status: { equals: 'published' } },
    limit: 200,
    depth: 1,
    sort: 'order',
    overrideAccess: true,
  })
  return res.docs.map((d) => mapService(d as Record<string, unknown>))
})

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const payload = await client()
  const res = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  })
  return res.docs.length ? mapService(res.docs[0] as Record<string, unknown>) : null
}

export async function getServicesByPillar(pillarTitle: string): Promise<Service[]> {
  const all = await getAllServices()
  return all.filter((s) => s.pillar === pillarTitle)
}

/** Number of published services in each pillar — for the nav dropdown + home grid. */
export const getPillarCounts = cache(async (): Promise<Record<string, number>> => {
  const all = await getAllServices()
  const counts: Record<string, number> = {}
  for (const p of pillars) counts[p.title] = all.filter((s) => s.pillar === p.title).length
  return counts
})

// ---- Industries -----------------------------------------------------------
export type IndustryMeta = {
  slug: string
  name: string
  pluralName: string
  shortLabel: string
  intro: string
  buyerPersona: string
}

export const getIndustries = cache(async (): Promise<IndustryMeta[]> => {
  const payload = await client()
  const res = await payload.find({
    collection: 'industries',
    limit: 100,
    depth: 0,
    sort: 'order',
    overrideAccess: true,
  })
  return res.docs.map((d) => {
    const doc = d as Record<string, unknown>
    return {
      slug: String(doc.slug ?? ''),
      name: String(doc.name ?? ''),
      pluralName: String(doc.pluralName ?? doc.name ?? ''),
      shortLabel: String(doc.shortLabel ?? ''),
      intro: String(doc.intro ?? doc.description ?? ''),
      buyerPersona: String(doc.buyerPersona ?? ''),
    }
  })
})

// ---- Homepage global ------------------------------------------------------
export type HomepageContent = {
  heroEyebrow: string
  heroHeadline: string
  heroHeadlineAccent: string
  heroHeadlineTail: string
  heroSubhead: string
  reassurance: { title: string; body: string }[]
  servicesEyebrow: string
  servicesHeading: string
  servicesSubhead: string
  processEyebrow: string
  processHeading: string
  process: { number: string; title: string; body: string }[]
}

export const getHomepage = cache(async (): Promise<HomepageContent> => {
  const payload = await client()
  const g = (await payload.findGlobal({ slug: 'homepage', overrideAccess: true })) as Record<string, unknown>
  const arr = <T = Record<string, unknown>>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : [])
  return {
    heroEyebrow: String(g.heroEyebrow ?? ''),
    heroHeadline: String(g.heroHeadline ?? ''),
    heroHeadlineAccent: String(g.heroHeadlineAccent ?? ''),
    heroHeadlineTail: String(g.heroHeadlineTail ?? ''),
    heroSubhead: String(g.heroSubhead ?? ''),
    reassurance: arr<{ title?: string; body?: string }>(g.reassurance).map((r) => ({ title: r.title ?? '', body: r.body ?? '' })),
    servicesEyebrow: String(g.servicesEyebrow ?? ''),
    servicesHeading: String(g.servicesHeading ?? ''),
    servicesSubhead: String(g.servicesSubhead ?? ''),
    processEyebrow: String(g.processEyebrow ?? ''),
    processHeading: String(g.processHeading ?? ''),
    process: arr<{ number?: string; title?: string; body?: string }>(g.process).map((s) => ({ number: s.number ?? '', title: s.title ?? '', body: s.body ?? '' })),
  }
})
