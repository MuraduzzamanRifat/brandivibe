import 'server-only'
import fs from 'fs'
import path from 'path'

/**
 * Optional artwork for services, industries and the about page.
 *
 * Same contract as problem-images.ts: existence is checked at BUILD time, so a
 * missing file simply means the section keeps its current gradient/typographic
 * treatment instead of shipping a broken <img> and a 404. Images can be added
 * one at a time and nothing else has to change.
 *
 *   public/services/<service-slug>.jpg     e.g. public/services/local-seo.jpg
 *   public/industries/<industry-slug>.jpg  e.g. public/industries/fintech.jpg
 *   public/about/<name>.jpg                e.g. public/about/studio.jpg
 *
 * Target 1600x1000 (16:10) and keep each under ~300KB; next/image does the rest.
 */
const EXTS = ['jpg', 'jpeg', 'png', 'webp'] as const

function lookup(dir: string, slug: string): string | null {
  if (!slug) return null
  for (const ext of EXTS) {
    const file = `${slug}.${ext}`
    try {
      if (fs.existsSync(path.join(process.cwd(), 'public', dir, file))) {
        return `/${dir}/${file}`
      }
    } catch {
      // Unreadable directory is the same as "no image" — never throw here.
    }
  }
  return null
}

/** Artwork for one service, or null to keep the accent-gradient hero. */
export function serviceImage(slug: string): string | null {
  return lookup('services', slug)
}

/** Artwork for one industry, or null to keep the plain card. */
export function industryImage(slug: string): string | null {
  return lookup('industries', slug)
}

/** Artwork for an about-page slot, or null to keep the text-only layout. */
export function aboutImage(name: string): string | null {
  return lookup('about', name)
}
