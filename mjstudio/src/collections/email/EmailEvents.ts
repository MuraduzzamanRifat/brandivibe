import type { CollectionConfig } from 'payload'
import { isStaff } from '../../access/roles'

/**
 * Email — Events. The raw analytics stream: one row per sent/open/click/bounce/
 * unsubscribe. Campaign stats are rolled up from these, and keeping the events
 * lets us show per-subscriber engagement and which links were clicked.
 *
 * Written by the tracking routes (/e/open, /e/click) and the send pipeline with
 * overrideAccess — never by a user in the admin, so create/update are closed.
 */
export const EmailEvents: CollectionConfig = {
  slug: 'email-events',
  labels: { singular: 'Event', plural: 'Events' },
  admin: {
    useAsTitle: 'type',
    defaultColumns: ['type', 'campaign', 'subscriber', 'url', 'createdAt'],
    group: 'Email Marketing',
    description: 'Raw open/click/bounce stream. Read-only — written by the tracking routes.',
  },
  access: {
    read: isStaff,
    create: () => false,
    update: () => false,
    delete: isStaff,
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Sent', value: 'sent' },
        { label: 'Open', value: 'open' },
        { label: 'Click', value: 'click' },
        { label: 'Bounce', value: 'bounce' },
        { label: 'Unsubscribe', value: 'unsubscribe' },
        { label: 'Complaint', value: 'complaint' },
      ],
    },
    { name: 'campaign', type: 'relationship', relationTo: 'email-campaigns', hasMany: false, index: true },
    { name: 'subscriber', type: 'relationship', relationTo: 'subscribers', hasMany: false, index: true },
    { name: 'url', type: 'text', admin: { description: 'For click events — the destination.' } },
    { name: 'userAgent', type: 'text', admin: { readOnly: true } },
  ],
}
