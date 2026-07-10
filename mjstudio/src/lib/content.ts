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

const esc = (s: unknown) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Embed URL for YouTube/Vimeo links; '' if unrecognized. */
function videoEmbedSrc(url: string): string {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/)
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`
  const vm = url.match(/vimeo\.com\/(\d+)/)
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`
  return ''
}

const CALLOUT_COLORS: Record<string, string> = {
  info: '#7B6EF6',
  tip: '#0FA598',
  warning: '#F5A524',
  success: '#2FBF71',
}

type BlockFields = Record<string, unknown>

/** HTML converters for the Content Studio editor blocks (warm design system). */
const blockConverters = {
  callout: ({ node }: { node: { fields: BlockFields } }) => {
    const f = node.fields
    const color = CALLOUT_COLORS[String(f.style ?? 'info')] ?? CALLOUT_COLORS.info
    return `<aside style="border-left:4px solid ${color};background:${color}14;border-radius:14px;padding:1rem 1.25rem;margin:1.5rem 0">${
      f.title ? `<p style="font-weight:600;margin:0 0 .35rem">${esc(f.title)}</p>` : ''
    }<p style="margin:0">${esc(f.body)}</p></aside>`
  },
  cta: ({ node }: { node: { fields: BlockFields } }) => {
    const f = node.fields
    return `<div style="background:#fdf3e8;border-radius:20px;padding:1.75rem;margin:2rem 0;text-align:center">${
      f.heading ? `<p style="font-weight:600;font-size:1.2rem;margin:0 0 .4rem">${esc(f.heading)}</p>` : ''
    }${f.body ? `<p style="margin:0 0 1rem;color:#6b5f55">${esc(f.body)}</p>` : ''}<a href="${esc(
      f.buttonHref || '/#contact',
    )}" style="display:inline-block;background:#ff6a3d;color:#fff;border-radius:999px;padding:.8rem 1.7rem;font-weight:500;text-decoration:none">${esc(
      f.buttonLabel || 'Book a free call',
    )}</a></div>`
  },
  codeBlock: ({ node }: { node: { fields: BlockFields } }) => {
    const f = node.fields
    return `<pre style="background:#2a231f;color:#f7f1ea;border-radius:14px;padding:1.1rem 1.3rem;overflow-x:auto;margin:1.5rem 0"><code class="language-${esc(
      f.language || 'plaintext',
    )}">${esc(f.code)}</code></pre>`
  },
  videoEmbed: ({ node }: { node: { fields: BlockFields } }) => {
    const f = node.fields
    const src = videoEmbedSrc(String(f.url ?? ''))
    if (!src) return `<p><a href="${esc(f.url)}" target="_blank" rel="noopener noreferrer">${esc(f.caption || f.url)}</a></p>`
    return `<figure style="margin:1.75rem 0"><div style="position:relative;padding-top:56.25%;border-radius:16px;overflow:hidden"><iframe src="${src}" title="${esc(
      f.caption || 'Video',
    )}" style="position:absolute;inset:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe></div>${
      f.caption ? `<figcaption style="margin-top:.5rem;font-size:.85rem;color:#8a7c70">${esc(f.caption)}</figcaption>` : ''
    }</figure>`
  },
  stats: ({ node }: { node: { fields: BlockFields } }) => {
    const items = Array.isArray(node.fields.items) ? (node.fields.items as BlockFields[]) : []
    if (!items.length) return ''
    return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:1rem;margin:1.75rem 0">${items
      .map(
        (i) =>
          `<div style="background:#fff;border:1px solid rgba(42,35,31,.1);border-radius:16px;padding:1.1rem;text-align:center"><div style="font-size:1.6rem;font-weight:600;color:#ff6a3d">${esc(
            i.value,
          )}</div><div style="font-size:.85rem;color:#8a7c70;margin-top:.2rem">${esc(i.label)}</div></div>`,
      )
      .join('')}</div>`
  },
  faqBlock: ({ node }: { node: { fields: BlockFields } }) => {
    const items = Array.isArray(node.fields.items) ? (node.fields.items as BlockFields[]) : []
    return items
      .map(
        (i) =>
          `<details style="background:#fff;border:1px solid rgba(42,35,31,.1);border-radius:14px;padding: .9rem 1.1rem;margin:.6rem 0"><summary style="font-weight:500;cursor:pointer">${esc(
            i.question,
          )}</summary><p style="margin:.6rem 0 0;color:#5d5148">${esc(i.answer)}</p></details>`,
      )
      .join('')
  },
}

/** Lexical value -> HTML string ('' when empty). Falls back to escaped paragraphs. */
export function lexicalToHTML(value: unknown): string {
  if (!value) return ''
  try {
    const html = convertLexicalToHTML({
      data: value as never,
      disableContainer: true,
      converters: (({ defaultConverters }: { defaultConverters: Record<string, unknown> }) => ({
        ...defaultConverters,
        blocks: blockConverters,
      })) as never,
    })
    if (typeof html === 'string' && html.trim()) return html
  } catch {
    /* fall through */
  }
  return lexicalToParagraphs(value)
    .map((p) => `<p>${esc(p)}</p>`)
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

/**
 * Intrinsic pixel size of an upload relation, or zeros if unknown.
 * next/image needs real dimensions for auto-height responsive images —
 * guessing the aspect ratio would stretch the picture.
 */
export function mediaDims(m: unknown): { width: number; height: number } {
  if (m && typeof m === 'object') {
    const d = m as { width?: number; height?: number }
    return { width: Number(d.width) || 0, height: Number(d.height) || 0 }
  }
  return { width: 0, height: 0 }
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

// ---- Testimonials ---------------------------------------------------------
export type TestimonialItem = {
  quote: string
  authorName: string
  authorRole: string
  company: string
  rating: number
  avatar: string
  featured: boolean
}

export const getTestimonials = cache(async (): Promise<TestimonialItem[]> => {
  const payload = await client()
  const res = await payload.find({
    collection: 'testimonials',
    limit: 50,
    depth: 1,
    sort: '-createdAt',
    overrideAccess: true,
  })
  return res.docs.map((d) => {
    const doc = d as Record<string, unknown>
    const c = doc.client
    return {
      quote: String(doc.quote ?? ''),
      authorName: String(doc.authorName ?? ''),
      authorRole: String(doc.authorRole ?? ''),
      company: c && typeof c === 'object' ? String((c as { name?: string }).name ?? '') : '',
      rating: Number(doc.rating ?? 5) || 5,
      avatar: mediaURL(doc.avatar),
      featured: Boolean(doc.featured),
    }
  })
})

export async function getFeaturedTestimonials(limit = 3): Promise<TestimonialItem[]> {
  const all = await getTestimonials()
  const featured = all.filter((t) => t.featured)
  const rest = all.filter((t) => !t.featured)
  return [...featured, ...rest].slice(0, limit) // featured first, then fill
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
