import type { CollectionConfig } from 'payload'

/**
 * Users — the people who log in to Brandivibe OS.
 *
 * `auth: true` gives real login sessions, password reset and access control,
 * replacing the old pasted-token admin. Roles are added in the workflow phase
 * (admin / editor / author / client) to drive per-collection permissions.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email'],
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
}
