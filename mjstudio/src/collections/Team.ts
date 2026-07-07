import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slugField'

export const Team: CollectionConfig = {
  slug: 'team',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'order'],
    group: 'People & Clients',
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
        description: 'The team member’s full name, as you’d like it shown on the site.',
      },
    },
    slugField('name'),
    {
      name: 'role',
      type: 'text',
      admin: {
        description: 'Their job title or role, e.g. “Brand Strategist” or “Lead Designer”.',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      admin: {
        description: 'A short, friendly bio that gives people a feel for who they are.',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'A profile photo. Square, well-lit headshots look best.',
      },
    },
    {
      name: 'skills',
      type: 'array',
      admin: {
        description: 'The things this person is great at. Add one skill per row.',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
        },
      ],
    },
    {
      name: 'socials',
      type: 'array',
      admin: {
        description: 'Links to their social or professional profiles.',
      },
      fields: [
        {
          name: 'platform',
          type: 'text',
          admin: {
            description: 'The platform name, e.g. LinkedIn, X, Instagram.',
          },
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            description: 'The full link to their profile.',
          },
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Controls where this person appears in the team list. Lower numbers come first.',
      },
    },
  ],
}
