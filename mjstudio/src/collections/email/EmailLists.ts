import type { CollectionConfig } from 'payload'
import { isStaff } from '../../access/roles'
import { slugField } from '../../fields/slugField'

/**
 * Email — Lists. Named segments a campaign is sent to (e.g. "Newsletter",
 * "Prospects", "Past clients"). A subscriber can belong to several.
 */
export const EmailLists: CollectionConfig = {
  slug: 'email-lists',
  labels: { singular: 'List', plural: 'Lists' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'description'],
    group: 'Email Marketing',
  },
  access: { read: isStaff, create: isStaff, update: isStaff, delete: isStaff },
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('name'),
    { name: 'description', type: 'textarea' },
  ],
}
