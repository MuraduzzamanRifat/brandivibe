import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slugField'
import { translationStatus } from '../fields/translationStatus'

/**
 * Industries — the verticals Brandivibe serves.
 *
 * This collection is also the source for every /services/<service>/<industry>
 * page: those 280 pages are *assembled* from an industry record plus a service
 * record, not hand-written. That is what makes localizing the matrix tractable
 * — translate this data once per language and all 280 combos follow.
 *
 * `localized: true` marks the prose a translator touches. Structural fields
 * (slug, order, icon) stay shared across every locale: a Spanish page must
 * live at the same slug as its English counterpart for hreflang to pair them.
 */
export const Industries: CollectionConfig = {
  slug: 'industries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'shortLabel', 'order'],
    group: 'Taxonomy',
    description: 'The verticals and industries we love working with. Powers the /industries page.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Short display name, e.g. "SaaS" or "Real Estate".' },
    },
    // NOT localized: the slug pairs an English page with its translations.
    slugField('name'),
    {
      name: 'pluralName',
      type: 'text',
      localized: true,
      admin: { description: 'Plural form used in copy, e.g. "SaaS companies".' },
    },
    {
      name: 'shortLabel',
      type: 'text',
      localized: true,
      admin: { description: 'A one-line descriptor, e.g. "Software-as-a-Service".' },
    },
    {
      name: 'intro',
      type: 'textarea',
      localized: true,
      admin: { description: 'The opening paragraph shown on the industry card.' },
    },
    {
      name: 'buyerPersona',
      type: 'textarea',
      localized: true,
      admin: { description: 'Who we build for in this industry.' },
    },
    {
      name: 'conversionFrame',
      type: 'text',
      localized: true,
      admin: { description: 'The conversion moment that matters here, e.g. "Add-to-cart → checkout".' },
    },
    {
      name: 'industrySignal',
      type: 'text',
      localized: true,
      admin: { description: 'How this vertical behaves, e.g. "mobile-first, brand-driven".' },
    },
    {
      name: 'painPoints',
      type: 'array',
      localized: true,
      admin: { description: 'Problems a buyer in this industry recognises as their own.' },
      fields: [{ name: 'text', type: 'textarea', required: true }],
    },
    {
      name: 'examples',
      type: 'array',
      localized: true,
      admin: {
        description:
          'Recognisable brands in this vertical. Reference points only — never claim these as clients.',
      },
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    {
      name: 'industryFaqs',
      type: 'array',
      localized: true,
      admin: { description: 'Questions a founder in this industry actually types.' },
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
    {
      name: 'serviceFraming',
      type: 'array',
      localized: true,
      admin: {
        description:
          'One or two sentences per service explaining why it matters for THIS industry. This is the line that makes each /services/<service>/<industry> page distinct from its siblings — a missing entry drops that page back to boilerplate.',
      },
      fields: [
        {
          name: 'service',
          type: 'relationship',
          relationTo: 'services',
          required: true,
          // The pairing is structural; only the prose below is translated.
          admin: { description: 'Which service this framing is for.' },
        },
        {
          name: 'framing',
          type: 'textarea',
          required: true,
          admin: { description: 'Warm, specific, no invented numbers or client names.' },
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: { description: 'Optional longer description.' },
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'order',
      type: 'number',
      admin: { position: 'sidebar', description: 'Lower shows first.' },
    },
    translationStatus,
  ],
}
