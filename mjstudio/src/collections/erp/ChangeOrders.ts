import type { CollectionConfig } from 'payload'
import { isStaff } from '../../access/roles'
import { CURRENCY_OPTIONS } from './shared'

/**
 * ERP — Change Orders (the `/creep` command as a record).
 *
 * Every out-of-scope request gets logged here and classified against the signed
 * SOW. Absorbing a request for free is a DECISION, not a default — so "absorbed"
 * is an explicit decision value with a reason, and the delta hours/price it cost
 * are recorded even when it isn't charged. That's what a retro reads later to
 * find where the margin actually went.
 */
export const ChangeOrders: CollectionConfig = {
  slug: 'change-orders',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'project', 'classification', 'deltaHours', 'deltaPrice', 'decision'],
    group: 'ERP',
    description: 'Scope-creep log: classify, price the delta, decide deliberately.',
  },
  access: { read: isStaff, create: isStaff, update: isStaff, delete: isStaff },
  hooks: {
    beforeChange: [
      ({ data, req, originalDoc }) => {
        if (!data) return data
        const decided = data.decision && data.decision !== 'pending'
        const wasUndecided = !originalDoc?.decision || originalDoc.decision === 'pending'
        if (decided && wasUndecided) {
          data.decidedBy = req.user?.id
          data.decidedAt = new Date().toISOString()
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true, admin: { description: 'Short name for the request.' } },
    {
      type: 'row',
      fields: [
        { name: 'project', type: 'relationship', relationTo: 'projects', required: true, hasMany: false },
        { name: 'sow', type: 'relationship', relationTo: 'sows', hasMany: false, admin: { description: 'The SOW this is tested against.' } },
      ],
    },
    { name: 'request', type: 'textarea', required: true, admin: { description: 'The client’s ask, in their words.' } },
    {
      name: 'classification',
      type: 'select',
      required: true,
      defaultValue: 'ambiguous',
      admin: { position: 'sidebar' },
      options: [
        { label: 'In scope', value: 'in-scope' },
        { label: 'Ambiguous — decide now', value: 'ambiguous' },
        { label: 'Out of scope', value: 'out-of-scope' },
      ],
    },
    {
      name: 'citedClause',
      type: 'text',
      admin: {
        description: 'If in-scope: the SOW clause that covers it. If you can’t cite one, it isn’t in scope.',
        condition: (data) => data?.classification === 'in-scope',
      },
    },
    {
      name: 'bothReadings',
      type: 'textarea',
      admin: {
        description: 'If ambiguous: state both readings, then recommend one and note the cost of the generous one.',
        condition: (data) => data?.classification === 'ambiguous',
      },
    },
    {
      type: 'row',
      fields: [
        { name: 'deltaHours', type: 'number', min: 0, admin: { description: 'Extra hours this adds.' } },
        { name: 'deltaPrice', type: 'number', min: 0, admin: { description: 'Extra price to charge, if charged.' } },
        { name: 'currency', type: 'select', defaultValue: 'USD', options: CURRENCY_OPTIONS },
      ],
    },
    { name: 'timelineImpact', type: 'text', admin: { description: 'e.g. "+1 week to launch".' } },
    {
      name: 'decision',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Charged (billed as extra)', value: 'charged' },
        { label: 'Absorbed (free — deliberate)', value: 'absorbed' },
        { label: 'Declined', value: 'declined' },
      ],
    },
    {
      name: 'decisionReason',
      type: 'textarea',
      admin: {
        description: 'Why this decision — especially if absorbed. "Absorbed silently" is not allowed; there’s always a reason.',
        condition: (data) => data?.decision === 'absorbed',
      },
    },
    { name: 'decidedBy', type: 'relationship', relationTo: 'users', admin: { readOnly: true, position: 'sidebar' } },
    { name: 'decidedAt', type: 'date', admin: { readOnly: true, position: 'sidebar' } },
  ],
}
