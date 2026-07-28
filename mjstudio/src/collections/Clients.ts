import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slugField'
import { isStaff } from '../access/roles'

export const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'industry', 'website'],
    group: 'People & Clients',
  },
  access: {
    // Staff-only. This is the tenant-anchor table (every portal permission keys
    // off it) — it must NOT be world-readable, or one client could enumerate the
    // whole customer roster via /api/clients. Nothing reads it publicly: the
    // case-study renderer fetches client name/logo with overrideAccess. If a
    // public logo wall is ever needed, fetch a scoped subset server-side.
    read: isStaff,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'The business name, exactly how they like it written.',
      },
    },
    slugField('name'),
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Their logo, ideally a clean transparent PNG or SVG.',
      },
    },
    {
      name: 'website',
      type: 'text',
      admin: {
        description: 'Full URL to their site, e.g. https://example.com',
      },
    },
    {
      name: 'industry',
      type: 'relationship',
      relationTo: 'industries',
      hasMany: false,
      admin: {
        description: 'The industry this client works in.',
      },
    },
    {
      name: 'blurb',
      type: 'textarea',
      admin: {
        description: 'One friendly line about who they are or what they do.',
      },
    },
  ],
}
