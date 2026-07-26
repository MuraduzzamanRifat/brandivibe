import type { CollectionConfig } from 'payload'
import { isStaff } from '../../access/roles'
import { CURRENCY_OPTIONS } from './shared'

/**
 * ERP — Estimates (the `/price` command as a record).
 *
 * Priced on value, VERIFIED on cost. Whatever number you propose, the estimate
 * always shows the internal cost and the floor price beneath it, and computes
 * the actual margin — so a deal can never quietly slip below its target. When
 * the proposed price is under the cost floor, `marginStatus` says so in capitals:
 * the bad number leads, it doesn't hide.
 *
 * The three-option pattern (Reduced / Recommended / Expanded) is modelled with
 * the `option` field: make three estimates that differ in SCOPE (line items),
 * never in discount.
 */
export const Estimates: CollectionConfig = {
  slug: 'estimates',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'option', 'proposedPrice', 'actualMargin', 'marginStatus', 'status'],
    group: 'ERP',
    description: 'Quotes with cost-floor + margin math built in.',
  },
  access: { read: isStaff, create: isStaff, update: isStaff, delete: isStaff },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data) return data
        const effort = (data.effort ?? []) as { hours?: number; rate?: number; lineCost?: number }[]
        // Per-line cost, then the internal cost total.
        let internalCost = 0
        for (const line of effort) {
          line.lineCost = Math.round((line.hours ?? 0) * (line.rate ?? 0))
          internalCost += line.lineCost
        }
        data.internalCost = internalCost

        const marginPct = Math.min(Math.max(Number(data.targetGrossMargin ?? 55), 0), 99)
        // Floor = the lowest price that still hits the target margin.
        data.floorPrice = marginPct < 99 ? Math.round(internalCost / (1 - marginPct / 100)) : internalCost
        data.floorPrice = Math.max(data.floorPrice, internalCost)

        const proposed = Number(data.proposedPrice ?? 0)
        data.actualMargin = proposed > 0 ? Math.round(((proposed - internalCost) / proposed) * 1000) / 10 : 0

        if (proposed <= 0) {
          data.marginStatus = 'No price set'
        } else if (proposed < internalCost) {
          data.marginStatus = 'LOSS — priced below cost'
        } else if (proposed < data.floorPrice) {
          data.marginStatus = `BELOW FLOOR — escalate (needs ${data.floorPrice})`
        } else {
          data.marginStatus = 'OK'
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true, admin: { description: 'e.g. "Acme website rebuild — Recommended".' } },
    {
      type: 'row',
      fields: [
        { name: 'client', type: 'relationship', relationTo: 'clients', hasMany: false },
        { name: 'project', type: 'relationship', relationTo: 'projects', hasMany: false, admin: { description: 'Optional — the delivery project, once it exists.' } },
        { name: 'deal', type: 'relationship', relationTo: 'deals', hasMany: false, admin: { description: 'Optional — the pipeline deal this quotes.' } },
      ],
    },
    {
      name: 'option',
      type: 'select',
      defaultValue: 'recommended',
      admin: { position: 'sidebar', description: 'Options differ in SCOPE, never in discount.' },
      options: [
        { label: 'Reduced', value: 'reduced' },
        { label: 'Recommended', value: 'recommended' },
        { label: 'Expanded', value: 'expanded' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Sent', value: 'sent' },
        { label: 'Accepted', value: 'accepted' },
        { label: 'Declined', value: 'declined' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'currency', type: 'select', defaultValue: 'USD', options: CURRENCY_OPTIONS, admin: { position: 'sidebar' } },
        {
          name: 'targetGrossMargin',
          type: 'number',
          defaultValue: 55,
          min: 0,
          max: 99,
          admin: { position: 'sidebar', description: 'Target gross margin %. Drives the floor price.' },
        },
      ],
    },
    {
      name: 'effort',
      type: 'array',
      label: 'Effort (role × hours)',
      minRows: 1,
      admin: { description: 'What the work actually costs. Pull rates from the Rate Card.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'roleRef', type: 'relationship', relationTo: 'rate-card', hasMany: false, admin: { description: 'Optional link to the rate-card role.' } },
            { name: 'label', type: 'text', admin: { description: 'e.g. "Design", "Front-end build".' } },
            { name: 'hours', type: 'number', defaultValue: 0, min: 0 },
            { name: 'rate', type: 'number', defaultValue: 0, min: 0, admin: { description: 'Loaded rate for this role (snapshot).' } },
          ],
        },
        { name: 'lineCost', type: 'number', admin: { readOnly: true, description: 'hours × rate — computed.' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'internalCost', type: 'number', admin: { readOnly: true, description: 'Σ effort — computed.' } },
        { name: 'floorPrice', type: 'number', admin: { readOnly: true, description: 'Lowest price hitting target margin — computed.' } },
      ],
    },
    {
      name: 'proposedPrice',
      type: 'number',
      min: 0,
      admin: { description: 'What you intend to quote (price on value; this verifies on cost).' },
    },
    {
      type: 'row',
      fields: [
        { name: 'actualMargin', type: 'number', admin: { readOnly: true, description: 'Actual gross margin % at the proposed price.' } },
        { name: 'marginStatus', type: 'text', admin: { readOnly: true, description: 'OK / BELOW FLOOR / LOSS — the bad number, first.' } },
      ],
    },
    { name: 'notes', type: 'textarea' },
  ],
}
