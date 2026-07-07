import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slugField'

/**
 * Industries — the verticals Brandivibe serves. Powers the editable /industries
 * hub cards (and shares slugs with the services×industries programmatic pages).
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
      admin: { description: 'Short display name, e.g. "SaaS" or "Real Estate".' },
    },
    slugField('name'),
    {
      name: 'pluralName',
      type: 'text',
      admin: { description: 'Plural form used in copy, e.g. "SaaS companies".' },
    },
    {
      name: 'shortLabel',
      type: 'text',
      admin: { description: 'A one-line descriptor, e.g. "Software-as-a-Service".' },
    },
    {
      name: 'intro',
      type: 'textarea',
      admin: { description: 'The opening paragraph shown on the industry card.' },
    },
    {
      name: 'buyerPersona',
      type: 'textarea',
      admin: { description: 'Who we build for in this industry.' },
    },
    {
      name: 'description',
      type: 'textarea',
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
  ],
}
