import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slugField'
import { translationStatus } from '../fields/translationStatus'

/**
 * Glossary — definitional pages built for AI extraction.
 *
 * Each term renders at /glossary/[slug] with the definition first, because
 * that sentence is what ChatGPT, Perplexity and Google AI Overviews lift when
 * answering "what is X". Everything after it is supporting context.
 *
 * Moved here from data/glossary.ts so terms can be authored and translated in
 * the admin. `slug`, `category` and `relatedTerms` stay shared across locales —
 * they are structure, not prose, and hreflang pairs pages by slug.
 */
export const Glossary: CollectionConfig = {
  slug: 'glossary',
  admin: {
    useAsTitle: 'term',
    defaultColumns: ['term', 'category', 'translationStatus'],
    group: 'Content',
    description:
      'Plain-English definitions. Sentence one must answer "what is X" with no surrounding context — that is the line AI search quotes.',
  },
  access: {
    read: () => true,
  },
  versions: { drafts: true },
  fields: [
    {
      name: 'term',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'e.g. "WebGL Website".' },
    },
    slugField('term'),
    {
      name: 'definition',
      type: 'textarea',
      required: true,
      localized: true,
      admin: {
        description:
          'One or two self-contained sentences. THIS IS THE LINE AI WILL LIFT — it must stand alone, with no "it" or "this" pointing at earlier text.',
      },
    },
    {
      name: 'alsoKnownAs',
      type: 'array',
      localized: true,
      admin: { description: 'Synonyms people search for instead.' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'whyItMatters',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'components',
      type: 'array',
      localized: true,
      admin: { description: 'What the thing actually includes.' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'whenItApplies',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'relatedTerms',
      type: 'relationship',
      relationTo: 'glossary',
      hasMany: true,
      admin: { description: 'Structural, so it is shared across every language.' },
    },
    {
      name: 'faqs',
      type: 'array',
      localized: true,
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'websites',
      options: [
        { label: 'Websites', value: 'websites' },
        { label: 'AI', value: 'ai' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Growth', value: 'growth' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'seo',
      type: 'group',
      localized: true,
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
      ],
    },
    translationStatus,
  ],
}
