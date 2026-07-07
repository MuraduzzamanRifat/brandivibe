import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slugField'
import { seoField } from '../fields/seoField'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'featured', 'publishedAt'],
    group: 'Content',
    description: 'Our flagship project write-ups — the full story of what we built and the results it drove.',
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
        description: 'The headline for this case study — keep it clear and specific.',
      },
    },
    slugField('title'),
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'A short summary that shows on cards and previews. One or two sentences is plenty.',
      },
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      hasMany: false,
      admin: {
        description: 'Who was this project for?',
      },
    },
    {
      name: 'industry',
      type: 'relationship',
      relationTo: 'industries',
      hasMany: false,
      admin: {
        description: 'The industry this client operates in.',
      },
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: {
        description: 'Which of our services did this project involve?',
      },
    },
    {
      name: 'technologies',
      type: 'relationship',
      relationTo: 'technologies',
      hasMany: true,
      admin: {
        description: 'The tools and tech we used to build it.',
      },
    },
    {
      name: 'team',
      type: 'relationship',
      relationTo: 'team',
      hasMany: true,
      admin: {
        description: 'The people who worked on this project.',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'The main image shown at the top of the case study.',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      admin: {
        description: 'A gallery of project visuals — screenshots, mockups, photos.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'caption',
          type: 'text',
          admin: {
            description: 'Optional caption for this image.',
          },
        },
      ],
    },
    {
      name: 'overview',
      type: 'richText',
      admin: {
        description: 'Introduce the client and give a high-level overview of the project.',
      },
    },
    {
      name: 'challenge',
      type: 'richText',
      admin: {
        description: 'What problem were we solving? Set up the challenge here.',
      },
    },
    {
      name: 'objectives',
      type: 'array',
      admin: {
        description: 'The goals we set out to achieve — one per item.',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
        },
      ],
    },
    {
      name: 'research',
      type: 'richText',
      admin: {
        description: 'How we approached research and shaped the strategy.',
      },
    },
    {
      name: 'designProcess',
      type: 'richText',
      admin: {
        description: 'The design journey — from ideas to polished visuals.',
      },
    },
    {
      name: 'devProcess',
      type: 'richText',
      admin: {
        description: 'How we brought the design to life in code.',
      },
    },
    {
      name: 'marketingProcess',
      type: 'richText',
      admin: {
        description: 'Marketing and AI implementation — how we helped it grow.',
      },
    },
    {
      name: 'timeline',
      type: 'array',
      admin: {
        description: 'The phases of the project, in order.',
      },
      fields: [
        {
          name: 'phase',
          type: 'text',
          admin: {
            description: 'Name of this phase, e.g. Discovery.',
          },
        },
        {
          name: 'duration',
          type: 'text',
          admin: {
            description: 'How long it took, e.g. 3 weeks.',
          },
        },
        {
          name: 'detail',
          type: 'textarea',
          admin: {
            description: 'What happened during this phase.',
          },
        },
      ],
    },
    {
      name: 'beforeAfter',
      type: 'group',
      admin: {
        description: 'Show the transformation with a before-and-after comparison.',
      },
      fields: [
        {
          name: 'beforeImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'afterImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'beforeLabel',
          type: 'text',
          admin: {
            description: 'Label for the before state, e.g. Old site.',
          },
        },
        {
          name: 'afterLabel',
          type: 'text',
          admin: {
            description: 'Label for the after state, e.g. New site.',
          },
        },
        {
          name: 'note',
          type: 'textarea',
          admin: {
            description: 'Optional note about what changed.',
          },
        },
      ],
    },
    {
      name: 'metrics',
      type: 'array',
      admin: {
        description: 'Measurable results — the numbers that prove it worked.',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          admin: {
            description: "What was measured, e.g. 'Organic traffic'.",
          },
        },
        {
          name: 'value',
          type: 'text',
          admin: {
            description: "The result, e.g. '+240%'.",
          },
        },
        {
          name: 'note',
          type: 'text',
          admin: {
            description: 'Optional context for this metric.',
          },
        },
      ],
    },
    {
      name: 'videos',
      type: 'array',
      admin: {
        description: 'Demo or walkthrough videos for this project.',
      },
      fields: [
        {
          name: 'url',
          type: 'text',
          admin: {
            description: 'Link to the video.',
          },
        },
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'A title for this video.',
          },
        },
      ],
    },
    {
      name: 'testimonial',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: false,
      admin: {
        description: 'A client testimonial to feature with this case study.',
      },
    },
    {
      name: 'relatedArticles',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
      admin: {
        description: 'Articles that pair well with this case study.',
      },
    },
    {
      name: 'relatedServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: {
        description: 'Services readers might want to explore next.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      admin: {
        description: 'Turn on to highlight this case study in featured spots.',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'When this case study went live.',
      },
    },
    seoField,
  ],
}
