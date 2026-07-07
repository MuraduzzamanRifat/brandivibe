import 'server-only'
import { cache } from 'react'
import { readFile } from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import { getPayload } from 'payload'
import config from '@payload-config'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import { lexicalToParagraphs } from '@/lib/content'
import articlesData from '@/data/articles.json'

/**
 * Article store — Payload-backed.
 *
 * List + metadata come from the `articles` collection (CMS-managed). Article
 * *bodies* for the 12 migrated legacy posts still render from their intact
 * original Markdown at content/journal/<slug>.mdx (so no formatting is lost);
 * any NEW article authored in the CMS renders from its Lexical body. Migrating
 * the legacy bodies into the rich editor properly is a follow-up.
 *
 * Hero images fall back to the legacy URLs in data/articles.json until real
 * images are uploaded to the media library.
 */

export type ArticleMeta = {
  id: string
  slug: string
  title: string
  excerpt: string
  primaryKeyword: string
  secondaryKeywords: string[]
  heroImage: string
  seoScore?: number
  wordCount: number
  publishedAt: string
}

const client = cache(async () => getPayload({ config }))
const CONTENT_DIR = path.resolve(process.cwd(), 'content', 'journal')

function toArr<T = Record<string, unknown>>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : []
}
function mediaUrl(m: unknown): string {
  if (m && typeof m === 'object' && 'url' in (m as object)) {
    const u = (m as { url?: string }).url
    if (typeof u === 'string') return u
  }
  return ''
}
function legacy(slug: string) {
  return (articlesData as Array<{ slug: string; heroImage?: string; wordCount?: number }>).find((a) => a.slug === slug)
}

function mapMeta(doc: Record<string, unknown>): ArticleMeta {
  const slug = String(doc.slug ?? '')
  const paras = lexicalToParagraphs(doc.content)
  const tags = toArr<{ name?: string }>(doc.tags)
    .filter((t) => typeof t === 'object' && t !== null)
    .map((t) => t.name ?? '')
    .filter(Boolean)
  const cat = doc.category && typeof doc.category === 'object' ? String((doc.category as { name?: string }).name ?? '') : ''
  const l = legacy(slug)
  return {
    id: String(doc.id ?? ''),
    slug,
    title: String(doc.title ?? ''),
    excerpt: String(doc.excerpt ?? ''),
    primaryKeyword: cat || tags[0] || '',
    secondaryKeywords: tags,
    heroImage: mediaUrl(doc.heroImage) || l?.heroImage || '',
    wordCount: l?.wordCount ?? paras.join(' ').split(/\s+/).filter(Boolean).length,
    publishedAt: String(doc.publishedAt ?? doc.createdAt ?? ''),
  }
}

export const getArticles = cache(async (): Promise<ArticleMeta[]> => {
  const payload = await client()
  const res = await payload.find({
    collection: 'articles',
    where: { _status: { equals: 'published' } },
    limit: 200,
    depth: 1,
    sort: '-publishedAt',
    overrideAccess: true,
  })
  return res.docs.map((d) => mapMeta(d as Record<string, unknown>))
})

export async function getArticle(slug: string): Promise<ArticleMeta | undefined> {
  return (await getArticles()).find((a) => a.slug === slug)
}

export type LoadedArticle = {
  frontmatter: {
    title: string
    slug: string
    excerpt: string
    primaryKeyword: string
    secondaryKeywords: string[]
    heroImage: string
    publishedAt: string
  }
  html: string
}

function lexicalBodyToHTML(content: unknown): string {
  try {
    const html = convertLexicalToHTML({ data: content as never, disableContainer: true })
    if (typeof html === 'string' && html.trim()) return html
  } catch {
    /* fall through to paragraph rendering */
  }
  return lexicalToParagraphs(content)
    .map((p) => `<p>${p.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`)
    .join('\n')
}

export async function loadArticle(slug: string): Promise<LoadedArticle | null> {
  const meta = await getArticle(slug)
  if (!meta) return null

  let html = ''
  try {
    // Legacy posts: render from intact original Markdown (best fidelity).
    const raw = await readFile(path.join(CONTENT_DIR, `${slug}.mdx`), 'utf8')
    const out = await marked.parse(matter(raw).content, { gfm: true, breaks: false })
    html = typeof out === 'string' ? out : String(out)
  } catch {
    // New CMS article (no MDX file): render from the Lexical body.
    const payload = await client()
    const res = await payload.find({
      collection: 'articles',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
      overrideAccess: true,
    })
    if (res.docs.length) html = lexicalBodyToHTML((res.docs[0] as Record<string, unknown>).content)
  }

  return {
    frontmatter: {
      title: meta.title,
      slug: meta.slug,
      excerpt: meta.excerpt,
      primaryKeyword: meta.primaryKeyword,
      secondaryKeywords: meta.secondaryKeywords,
      heroImage: meta.heroImage,
      publishedAt: meta.publishedAt,
    },
    html,
  }
}
