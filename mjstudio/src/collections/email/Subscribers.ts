import type { CollectionConfig } from 'payload'
import { isStaff } from '../../access/roles'
import crypto from 'crypto'

/**
 * Email — Subscribers. The audience. Every subscriber carries a stable
 * `unsubscribeToken` so one-click unsubscribe links work without exposing the
 * database id, and a `consent` record so the list stays lawful (GDPR/CAN-SPAM).
 *
 * Staff-only in the admin. Public sign-up happens through a guarded endpoint
 * (like the contact form), never by POSTing to this collection directly.
 */
export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'status', 'source', 'createdAt'],
    group: 'Email Marketing',
  },
  access: { read: isStaff, create: isStaff, update: isStaff, delete: isStaff },
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && !data?.unsubscribeToken) {
          data.unsubscribeToken = crypto.randomBytes(24).toString('hex')
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true, index: true },
    { name: 'name', type: 'text' },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'subscribed',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Subscribed', value: 'subscribed' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
        { label: 'Bounced', value: 'bounced' },
        { label: 'Complained', value: 'complained' },
        { label: 'Pending (double opt-in)', value: 'pending' },
      ],
    },
    {
      name: 'lists',
      type: 'relationship',
      relationTo: 'email-lists',
      hasMany: true,
      admin: { description: 'Segments this person belongs to.' },
    },
    { name: 'tags', type: 'text', hasMany: true, admin: { position: 'sidebar' } },
    {
      name: 'source',
      type: 'select',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Newsletter form', value: 'newsletter' },
        { label: 'Lead magnet', value: 'lead-magnet' },
        { label: 'Import', value: 'import' },
        { label: 'Manual', value: 'manual' },
      ],
    },
    {
      name: 'consent',
      type: 'group',
      admin: { description: 'Proof of permission — keep this honest.' },
      fields: [
        { name: 'givenAt', type: 'date' },
        { name: 'ip', type: 'text', admin: { readOnly: true } },
        { name: 'method', type: 'text', admin: { description: 'e.g. "website newsletter form".' } },
      ],
    },
    {
      name: 'unsubscribeToken',
      type: 'text',
      unique: true,
      index: true,
      admin: { readOnly: true, position: 'sidebar', description: 'Powers one-click unsubscribe.' },
    },
  ],
}
