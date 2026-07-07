/**
 * TEMPORARY article-content import endpoint (removed after use).
 * Receives { articles: [{ slug, markdown }] } and for each published article:
 *   1. converts the markdown to a proper Lexical editor state (headings/lists intact)
 *   2. optionally imports the legacy remote hero image into the media library
 *      (stored on Vercel Blob in production) and links it
 * Guarded by ?key=<PAYLOAD_SECRET>. No filesystem access — content arrives in the request.
 */
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

type Item = { slug: string; markdown: string }

export async function POST(req: Request) {
  const key = new URL(req.url).searchParams.get('key')
  if (!key || key !== process.env.PAYLOAD_SECRET) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  let body: { articles?: Item[]; importImages?: boolean }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'bad json' }, { status: 400 })
  }
  const items = Array.isArray(body.articles) ? body.articles : []
  const importImages = body.importImages !== false

  const payload = await getPayload({ config })
  const editorConfig = await editorConfigFactory.default({ config: payload.config })

  const report: Record<string, string> = {}
  for (const item of items) {
    try {
      const found = await payload.find({
        collection: 'articles',
        where: { slug: { equals: item.slug } },
        limit: 1,
        depth: 0,
      })
      if (!found.docs.length) {
        report[item.slug] = 'not found'
        continue
      }
      const doc = found.docs[0] as Record<string, unknown>
      const update: Record<string, unknown> = {}

      // 1) markdown -> Lexical
      if (item.markdown && item.markdown.trim()) {
        update.content = convertMarkdownToLexical({ editorConfig, markdown: item.markdown })
      }

      // 2) hero image -> media library (only if not already an upload)
      let imgNote = ''
      if (importImages && !doc.heroImage) {
        const legacy = (await import('@/data/articles.json')).default as Array<{ slug: string; heroImage?: string; title?: string }>
        const url = legacy.find((a) => a.slug === item.slug)?.heroImage
        if (url && url.startsWith('http')) {
          try {
            const res = await fetch(url)
            if (res.ok) {
              const buf = Buffer.from(await res.arrayBuffer())
              const mime = res.headers.get('content-type') || 'image/jpeg'
              const ext = mime.includes('png') ? 'png' : mime.includes('webp') ? 'webp' : 'jpg'
              const media = await payload.create({
                collection: 'media',
                data: { alt: String(doc.title ?? item.slug) },
                file: { data: buf, mimetype: mime, name: `${item.slug}-hero.${ext}`, size: buf.length },
              })
              update.heroImage = (media as { id: string }).id
              imgNote = ' +image'
            } else imgNote = ' (image fetch ' + res.status + ')'
          } catch (e) {
            imgNote = ' (image err: ' + (e instanceof Error ? e.message : 'x').slice(0, 40) + ')'
          }
        }
      }

      if (Object.keys(update).length) {
        await payload.update({ collection: 'articles', id: (doc as { id: string | number }).id as never, data: update as never })
        report[item.slug] = 'updated' + imgNote
      } else {
        report[item.slug] = 'nothing to do'
      }
    } catch (e) {
      report[item.slug] = 'ERR ' + (e instanceof Error ? e.message : String(e)).slice(0, 80)
    }
  }
  return NextResponse.json({ ok: true, report })
}
