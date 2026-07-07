import type { Field } from 'payload'

/**
 * Shared SEO/social group. Every public content collection embeds this so the
 * SEO Center (Phase 2) has a consistent shape to read from. All fields are
 * optional and fall back to the document's title/excerpt at render time.
 */
export const seoField: Field = {
  name: 'seo',
  type: 'group',
  admin: {
    description: 'Search & social overrides. Left blank, these fall back to the title/excerpt.',
  },
  fields: [
    {
      name: 'metaTitle',
      type: 'text',
      admin: { description: 'Overrides the <title>. ~55–60 characters.' },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      admin: { description: 'Search snippet. ~150–160 characters.' },
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Social share image (1200×630 recommended).' },
    },
  ],
}
