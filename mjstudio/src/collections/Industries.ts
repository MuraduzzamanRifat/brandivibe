import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slugField'

export const Industries: CollectionConfig = {
  slug: 'industries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt'],
    group: 'Taxonomy',
    description: 'The verticals and industries we love working with. Also powers the /industries pages.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'The name of the industry, e.g. "Healthcare" or "SaaS".',
      },
    },
    slugField('name'),
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'A short, friendly summary of how we help brands in this space.',
      },
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'A small icon or logo to represent this industry.',
      },
    },
  ],
}
