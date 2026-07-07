import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slugField'

export const Technologies: CollectionConfig = {
  slug: 'technologies',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'url'],
    group: 'Taxonomy',
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
        description: 'The name of the tool or technology, e.g. Next.js, Figma, or OpenAI.',
      },
    },
    slugField('name'),
    {
      name: 'category',
      type: 'select',
      admin: {
        description: 'Where this tool fits in the stack — helps us group things nicely.',
      },
      options: [
        { label: 'Frontend', value: 'frontend' },
        { label: 'Backend', value: 'backend' },
        { label: 'CMS', value: 'cms' },
        { label: 'AI', value: 'ai' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Design', value: 'design' },
        { label: 'Infrastructure', value: 'infrastructure' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'A small logo or icon for this technology.',
      },
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        description: 'Link to the official site, so folks can learn more.',
      },
    },
  ],
}
