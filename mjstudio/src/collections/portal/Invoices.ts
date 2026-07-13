import type { CollectionConfig } from 'payload'
import { isStaff, staffOrOwnClient } from '../../access/roles'

/**
 * Portal — Invoices. What the client owes and has paid. Line items are an
 * array; `total` is computed from them so it can never drift from the maths.
 *
 * A client reads only their own company's invoices (ownership via `client`),
 * and can never edit one — payment status is set by staff.
 */
export const Invoices: CollectionConfig = {
  slug: 'invoices',
  admin: {
    useAsTitle: 'number',
    defaultColumns: ['number', 'client', 'status', 'total', 'dueDate'],
    group: 'Client Portal',
  },
  access: {
    read: staffOrOwnClient,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  fields: [
    { name: 'number', type: 'text', required: true, unique: true, admin: { description: 'e.g. INV-2026-014' } },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      required: true,
      hasMany: false,
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: false,
      admin: { description: 'Optional — the project this invoice is for.' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Sent', value: 'sent' },
        { label: 'Paid', value: 'paid' },
        { label: 'Overdue', value: 'overdue' },
        { label: 'Void', value: 'void' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'issueDate', type: 'date' },
        { name: 'dueDate', type: 'date', admin: { position: 'sidebar' } },
      ],
    },
    {
      name: 'currency',
      type: 'select',
      defaultValue: 'USD',
      admin: { position: 'sidebar' },
      options: ['USD', 'EUR', 'GBP', 'BDT', 'AUD', 'CAD'].map((c) => ({ label: c, value: c })),
    },
    {
      name: 'lineItems',
      type: 'array',
      minRows: 1,
      admin: { description: 'What the client is being billed for.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'description', type: 'text', required: true },
            { name: 'quantity', type: 'number', defaultValue: 1, min: 0 },
            { name: 'unitPrice', type: 'number', defaultValue: 0, min: 0 },
          ],
        },
      ],
    },
    {
      name: 'total',
      type: 'number',
      admin: { readOnly: true, position: 'sidebar', description: 'Computed from line items.' },
      hooks: {
        beforeChange: [
          ({ data }) => {
            const items = (data?.lineItems ?? []) as { quantity?: number; unitPrice?: number }[]
            return items.reduce((sum, li) => sum + (li.quantity ?? 0) * (li.unitPrice ?? 0), 0)
          },
        ],
      },
    },
    {
      name: 'paymentLink',
      type: 'text',
      admin: { description: 'Optional Stripe/PayPal link the client can pay through.' },
    },
    { name: 'notes', type: 'textarea' },
  ],
}
