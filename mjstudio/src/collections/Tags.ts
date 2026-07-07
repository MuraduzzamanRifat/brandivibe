import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slugField'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
    group: 'Content',
    description: 'Simple labels you can attach to articles to group related reads together.',
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
        description: 'The tag name readers will see, like "SEO" or "Branding".',
      },
    },
    slugField('name'),
  ],
}
