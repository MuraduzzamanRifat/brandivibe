import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { isStaff } from '../../access/roles'

/**
 * Email — Templates. Reusable bodies. A campaign can start from one of these
 * rather than a blank page. Supports {{name}} / {{email}} merge tags, which the
 * sender substitutes per recipient.
 */
export const EmailTemplates: CollectionConfig = {
  slug: 'email-templates',
  labels: { singular: 'Template', plural: 'Templates' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'subject'],
    group: 'Email Marketing',
    description: 'Reusable email bodies. Use {{name}} and {{email}} as merge tags.',
  },
  access: { read: isStaff, create: isStaff, update: isStaff, delete: isStaff },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'subject', type: 'text', required: true },
    { name: 'preheader', type: 'text', admin: { description: 'The grey preview line after the subject in an inbox.' } },
    {
      name: 'body',
      type: 'richText',
      editor: lexicalEditor(),
      required: true,
    },
  ],
}
