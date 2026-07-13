import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { isStaff } from '../../access/roles'

/**
 * Email — Campaigns. A single send: subject, from, body, the lists it targets,
 * and the running stats it accumulates.
 *
 * Sending is NOT triggered by editing this row. It's an explicit action against
 * the guarded endpoint POST /api/email/send (see lib/email/send.ts), so a
 * half-finished draft can never blast an audience by accident. `status` is set
 * by that endpoint, not by hand.
 */
export const EmailCampaigns: CollectionConfig = {
  slug: 'email-campaigns',
  labels: { singular: 'Campaign', plural: 'Campaigns' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'sentAt'],
    group: 'Email Marketing',
    description: 'One row per send. Use the Send action rather than editing status by hand.',
  },
  access: { read: isStaff, create: isStaff, update: isStaff, delete: isStaff },
  fields: [
    { name: 'name', type: 'text', required: true, admin: { description: 'Internal name.' } },
    {
      type: 'row',
      fields: [
        { name: 'subject', type: 'text', required: true },
        { name: 'preheader', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'fromName', type: 'text', required: true, defaultValue: 'Brandivibe' },
        { name: 'fromEmail', type: 'email', required: true, defaultValue: 'hello@brandivibe.com' },
        { name: 'replyTo', type: 'email' },
      ],
    },
    {
      name: 'lists',
      type: 'relationship',
      relationTo: 'email-lists',
      hasMany: true,
      required: true,
      admin: { description: 'Who receives this. De-duplicated across lists at send time.' },
    },
    {
      name: 'template',
      type: 'relationship',
      relationTo: 'email-templates',
      hasMany: false,
      admin: { description: 'Optional — start from a template (its body is copied in).' },
    },
    {
      name: 'body',
      type: 'richText',
      editor: lexicalEditor(),
      required: true,
      admin: { description: 'Use {{name}} and {{email}} merge tags. An unsubscribe link is appended automatically.' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      access: {
        // Status is owned by the send pipeline, not the editor.
        update: () => false,
      },
      admin: { position: 'sidebar', readOnly: true },
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Sending', value: 'sending' },
        { label: 'Sent', value: 'sent' },
        { label: 'Failed', value: 'failed' },
      ],
    },
    { name: 'scheduledFor', type: 'date', admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'sentAt', type: 'date', admin: { position: 'sidebar', readOnly: true } },
    {
      name: 'stats',
      type: 'group',
      admin: { readOnly: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'recipients', type: 'number', defaultValue: 0 },
            { name: 'sent', type: 'number', defaultValue: 0 },
            { name: 'failed', type: 'number', defaultValue: 0 },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'opens', type: 'number', defaultValue: 0 },
            { name: 'clicks', type: 'number', defaultValue: 0 },
            { name: 'unsubscribes', type: 'number', defaultValue: 0 },
          ],
        },
      ],
    },
  ],
}
