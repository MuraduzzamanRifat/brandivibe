import type { CollectionConfig } from 'payload'
import { isStaff } from '../../access/roles'

/**
 * CRM — Deals. The sales pipeline: one row per opportunity, moved through
 * stages. `weightedValue` is computed (value × probability) so a forecast is
 * available without a spreadsheet.
 */
export const Deals: CollectionConfig = {
  slug: 'deals',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'company', 'stage', 'value', 'expectedCloseDate', 'owner'],
    group: 'CRM',
    description: 'The sales pipeline.',
  },
  access: { read: isStaff, create: isStaff, update: isStaff, delete: isStaff },
  fields: [
    { name: 'title', type: 'text', required: true, admin: { description: 'e.g. "Acme — website rebuild".' } },
    {
      name: 'stage',
      type: 'select',
      required: true,
      defaultValue: 'new',
      admin: { position: 'sidebar' },
      options: [
        { label: 'New', value: 'new' },
        { label: 'Qualifying', value: 'qualifying' },
        { label: 'Proposal sent', value: 'proposal' },
        { label: 'Negotiation', value: 'negotiation' },
        { label: 'Won', value: 'won' },
        { label: 'Lost', value: 'lost' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'value', type: 'number', min: 0, admin: { description: 'Estimated deal value.' } },
        {
          name: 'currency',
          type: 'select',
          defaultValue: 'USD',
          options: ['USD', 'EUR', 'GBP', 'BDT', 'AUD', 'CAD'].map((c) => ({ label: c, value: c })),
        },
        {
          name: 'probability',
          type: 'number',
          min: 0,
          max: 100,
          defaultValue: 20,
          admin: { description: 'Win likelihood %, for the forecast.' },
        },
      ],
    },
    {
      name: 'weightedValue',
      type: 'number',
      admin: { readOnly: true, description: 'value × probability — computed.' },
      hooks: {
        beforeChange: [
          ({ data }) => Math.round(((data?.value ?? 0) * (data?.probability ?? 0)) / 100),
        ],
      },
    },
    { name: 'expectedCloseDate', type: 'date', admin: { position: 'sidebar' } },
    {
      name: 'company',
      type: 'relationship',
      relationTo: 'clients',
      hasMany: false,
    },
    {
      name: 'primaryContact',
      type: 'relationship',
      relationTo: 'contacts',
      hasMany: false,
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      filterOptions: () => ({ role: { in: ['admin', 'editor'] } }),
      admin: { position: 'sidebar' },
    },
    {
      // On won, an admin can spin up the delivery Project from this deal.
      name: 'wonProject',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: false,
      admin: { position: 'sidebar', description: 'The delivery project this became, once won.' },
    },
    { name: 'notes', type: 'textarea' },
  ],
}
