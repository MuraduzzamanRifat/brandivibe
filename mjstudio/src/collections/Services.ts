import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slugField'
import { seoField } from '../fields/seoField'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'pillar', 'featured'],
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The name of the service as it appears everywhere.',
      },
    },
    slugField('title'),
    {
      name: 'pillar',
      type: 'select',
      required: true,
      admin: {
        description: 'Which of our six pillars this service belongs to.',
      },
      options: [
        { label: 'Web Development', value: 'web-development' },
        { label: 'Software', value: 'software' },
        { label: 'Digital Marketing', value: 'digital-marketing' },
        { label: 'Creative Content', value: 'creative-content' },
        { label: 'Creative Design', value: 'creative-design' },
        { label: 'AI & Automation', value: 'ai-automation' },
      ],
    },
    {
      name: 'hook',
      type: 'text',
      admin: {
        description: 'One punchy line that grabs attention.',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      admin: {
        description: 'A short supporting line under the hook.',
      },
    },
    {
      name: 'accent',
      type: 'text',
      admin: {
        description: 'A hex colour like #FF6A3D. It tints this service page to give it its own feel.',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      admin: {
        description: 'A brief plain-language summary of the service.',
      },
    },
    {
      name: 'heroBody',
      type: 'richText',
      admin: {
        description: 'The intro prose that opens the service page.',
      },
    },
    {
      name: 'bullets',
      type: 'array',
      admin: {
        description: 'Quick value bullets — the fast reasons to care.',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
        },
      ],
    },
    {
      name: 'capabilities',
      type: 'array',
      admin: {
        description: 'What we actually do — the concrete capabilities on offer.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'body',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'whenYouNeedThis',
      type: 'array',
      admin: {
        description: 'Signs that tell a visitor this service is right for them.',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
        },
      ],
    },
    {
      name: 'process',
      type: 'array',
      admin: {
        description: 'Our numbered steps, from first hello to delivery.',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          admin: {
            description: 'Short step marker, e.g. "01".',
          },
        },
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'body',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'deliverables',
      type: 'array',
      admin: {
        description: 'The tangible things a client walks away with.',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
        },
      ],
    },
    {
      name: 'faqs',
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
      admin: {
        description: 'FAQs specific to this service.',
      },
    },
    {
      name: 'relatedServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: {
        description: 'Other services that pair nicely with this one.',
      },
    },
    {
      name: 'industries',
      type: 'relationship',
      relationTo: 'industries',
      hasMany: true,
      admin: {
        description: 'Industries this service is a great fit for.',
      },
    },
    {
      name: 'technologies',
      type: 'relationship',
      relationTo: 'technologies',
      hasMany: true,
      admin: {
        description: 'Tools and technologies we lean on for this service.',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional hero image for the service page.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      admin: {
        description: 'Turn on to spotlight this service.',
      },
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        description: 'Lower shows first within its pillar',
        position: 'sidebar',
      },
    },
    seoField,
  ],
}
