import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'client', 'featured'],
    group: 'People & Clients',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      admin: {
        description: 'The kind words themselves — paste the client quote here.',
      },
    },
    {
      name: 'authorName',
      type: 'text',
      admin: {
        description: 'Who said it (e.g. Jane Doe).',
      },
    },
    {
      name: 'authorRole',
      type: 'text',
      admin: {
        description: 'Their role or title (e.g. Head of Marketing).',
      },
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      hasMany: false,
      admin: {
        description: 'The client company this quote belongs to.',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'A friendly headshot of the person, if you have one.',
      },
    },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      admin: {
        description: '1-5 stars',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      admin: {
        description: 'Turn on to spotlight this testimonial in featured spots.',
      },
    },
  ],
}
