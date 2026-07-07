import type { CollectionConfig } from 'payload'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'category'],
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      admin: {
        description: 'The question, written the way a real visitor would ask it.',
      },
    },
    {
      name: 'answer',
      type: 'richText',
      admin: {
        description: 'A clear, friendly answer. Keep it helpful and to the point.',
      },
    },
    {
      name: 'relatedServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: {
        description: 'Link this FAQ to any services it relates to, so it can show up on those pages.',
      },
    },
    {
      name: 'category',
      type: 'text',
      admin: {
        description: 'Optional grouping label to keep similar questions together (e.g. "Pricing", "Getting started").',
      },
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Lower numbers show first when FAQs are listed.',
      },
    },
  ],
}
