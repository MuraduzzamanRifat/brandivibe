import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slugField'

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'email'],
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
        description: 'The author’s full name, shown on their article bylines.',
      },
    },
    slugField('name'),
    {
      name: 'role',
      type: 'text',
      admin: {
        description: 'Their title or role, e.g. “Content Lead” or “Guest Writer”.',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      admin: {
        description: 'A short, friendly bio to introduce this author to readers.',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'A profile photo or headshot for this author.',
      },
    },
    {
      name: 'email',
      type: 'text',
      // Authors are publicly readable (bylines), but the email must not be
      // served to anonymous API/GraphQL callers — it would be harvestable.
      // Field-level read gate: signed-in staff only.
      access: {
        read: ({ req: { user } }) => Boolean(user),
      },
      admin: {
        description: 'Internal contact email (optional) — never shown publicly.',
      },
    },
    {
      name: 'socials',
      type: 'array',
      admin: {
        description: 'Links to this author’s social profiles.',
      },
      fields: [
        {
          name: 'platform',
          type: 'text',
          admin: {
            description: 'The platform name, e.g. “LinkedIn”, “X”, “Instagram”.',
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
  ],
}
