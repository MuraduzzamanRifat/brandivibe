import type { CollectionConfig } from 'payload'
import { isStaff } from '../../access/roles'
import { CURRENCY_OPTIONS } from './shared'

/**
 * ERP — Expenses. Real project costs beyond labour: software, subcontractors,
 * assets, travel. These feed actual profitability — an engagement's margin is
 * its price minus (labour + these), not price minus labour alone.
 *
 * `billable` marks a pass-through the client reimburses; `rebilled` marks it as
 * already added to an invoice, so nothing is billed twice or forgotten.
 */
export const Expenses: CollectionConfig = {
  slug: 'expenses',
  admin: {
    useAsTitle: 'description',
    defaultColumns: ['description', 'project', 'category', 'amount', 'billable', 'rebilled', 'date'],
    group: 'ERP',
    description: 'Project costs beyond labour — feed real margin.',
  },
  access: { read: isStaff, create: isStaff, update: isStaff, delete: isStaff },
  fields: [
    { name: 'description', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'project', type: 'relationship', relationTo: 'projects', hasMany: false, admin: { description: 'What this cost is against.' } },
        { name: 'client', type: 'relationship', relationTo: 'clients', hasMany: false, admin: { description: 'Optional — for client-level, non-project costs.' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'amount', type: 'number', required: true, min: 0 },
        { name: 'currency', type: 'select', defaultValue: 'USD', options: CURRENCY_OPTIONS },
        { name: 'date', type: 'date', admin: { description: 'When it was incurred.' } },
      ],
    },
    {
      name: 'category',
      type: 'select',
      defaultValue: 'software',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Software / subscriptions', value: 'software' },
        { label: 'Subcontractor', value: 'subcontractor' },
        { label: 'Assets / stock / fonts', value: 'assets' },
        { label: 'Hosting / infrastructure', value: 'hosting' },
        { label: 'Travel', value: 'travel' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'billable',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'A pass-through the client reimburses (vs an internal cost you absorb).' },
    },
    {
      name: 'rebilled',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Already added to a client invoice. Keeps billable costs from being billed twice or missed.',
        condition: (data) => Boolean(data?.billable),
      },
    },
    { name: 'notes', type: 'textarea' },
  ],
}
