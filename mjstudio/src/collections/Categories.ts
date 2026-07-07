import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slugField'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'color'],
    group: 'Content',
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
        description: 'The category name your readers will see, like "Design" or "Growth".',
      },
    },
    slugField('name'),
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'A short, friendly note about what this category covers.',
      },
    },
    {
      name: 'color',
      type: 'text',
      admin: {
        description: 'Hex accent used on category chips',
      },
    },
  ],
}
