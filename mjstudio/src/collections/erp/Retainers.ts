import type { CollectionConfig } from 'payload'
import { isStaff } from '../../access/roles'
import { CURRENCY_OPTIONS } from './shared'

/**
 * ERP — Retainers. Recurring monthly engagements (care plans, ongoing marketing
 * or content). Distinct from project invoices because the value is a commitment
 * over time, and the thing that erodes retainer margin is unbilled overage —
 * so `includedHours` is explicit and hours beyond it are meant to be logged as
 * time and reviewed, not quietly absorbed month after month.
 */
export const Retainers: CollectionConfig = {
  slug: 'retainers',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'client', 'monthlyAmount', 'includedHours', 'status', 'startDate'],
    group: 'ERP',
    description: 'Recurring monthly engagements.',
  },
  access: { read: isStaff, create: isStaff, update: isStaff, delete: isStaff },
  fields: [
    { name: 'name', type: 'text', required: true, admin: { description: 'e.g. "Acme — care plan".' } },
    { name: 'client', type: 'relationship', relationTo: 'clients', required: true, hasMany: false },
    {
      type: 'row',
      fields: [
        { name: 'monthlyAmount', type: 'number', required: true, min: 0 },
        { name: 'currency', type: 'select', defaultValue: 'USD', options: CURRENCY_OPTIONS },
        {
          name: 'includedHours',
          type: 'number',
          min: 0,
          admin: { description: 'Hours included per month. Work beyond this is overage — log it, don’t absorb it.' },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Paused', value: 'paused' },
        { label: 'Ended', value: 'ended' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'startDate', type: 'date' },
        { name: 'endDate', type: 'date', admin: { description: 'Month-to-month; blank while active.' } },
      ],
    },
    {
      name: 'billingDay',
      type: 'number',
      min: 1,
      max: 28,
      defaultValue: 1,
      admin: { position: 'sidebar', description: 'Day of month the retainer is invoiced.' },
    },
    { name: 'scope', type: 'textarea', admin: { description: 'What the retainer covers — and what it doesn’t.' } },
    { name: 'notes', type: 'textarea' },
  ],
}
