import type { Field } from 'payload'

/** URL-safe slug. "AI & Automation" -> "ai-and-automation". */
export const slugify = (val: string): string =>
  val
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

/**
 * A reusable slug field. Lives in the sidebar, is unique + indexed, and
 * auto-fills from a source field (default `title`) when left blank.
 */
export const slugField = (source = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: 'URL segment. Auto-filled from the title if left blank.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.length > 0) return slugify(value)
        const src = (data?.[source] as string | undefined) ?? ''
        return src ? slugify(src) : value
      },
    ],
  },
})
