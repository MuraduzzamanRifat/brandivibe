import type { CollectionConfig } from 'payload'
import { isStaff, isAdmin } from '../../access/roles'
import { CURRENCY_OPTIONS } from './shared'

/**
 * ERP — Rate Card. One row per billable role, with its FULLY-LOADED cost.
 *
 * This is the foundation of every margin figure in the ERP, so it enforces the
 * single most common (and most expensive) agency costing error: dividing annual
 * cost by 2,080 hours. A real services team bills ~1,000–1,300 hrs/head/year
 * after holidays, admin, sales and internal work. Using 2,080 understates true
 * cost by ~40% — usually the entire gap between a planned margin and an actual
 * one. So `loadedRate` is COMPUTED from annualCost ÷ annualBillableHours, and
 * annualBillableHours is hard-capped at 1,600. You cannot manufacture a cheap
 * rate by inflating the hours.
 *
 * Rates are sensitive: staff can read them, only admins can edit.
 */
export const RateCard: CollectionConfig = {
  slug: 'rate-card',
  labels: { singular: 'Role rate', plural: 'Rate card' },
  admin: {
    useAsTitle: 'role',
    defaultColumns: ['role', 'kind', 'loadedRate', 'currency', 'capacityHrsPerWeek', 'active'],
    group: 'ERP',
    description: 'Fully-loaded cost per role — the basis for every margin figure.',
  },
  access: { read: isStaff, create: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [
    { name: 'role', type: 'text', required: true, admin: { description: 'e.g. "Principal", "Designer", "Contractor — dev".' } },
    {
      name: 'kind',
      type: 'select',
      defaultValue: 'internal',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Internal', value: 'internal' },
        { label: 'Contractor', value: 'contractor' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'annualCost',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description:
              'Internal: salary + employer costs + allocated overhead. Contractor: their annual invoiced amount + your management overhead.',
          },
        },
        {
          name: 'annualBillableHours',
          type: 'number',
          required: true,
          defaultValue: 1250,
          min: 200,
          max: 1600,
          admin: {
            description:
              'Realistic services teams bill 1,000–1,300/yr — NOT 2,080. Capped at 1,600; higher understates true cost.',
          },
          validate: (value: number | null | undefined) => {
            if (value == null) return 'Required — never leave billable hours blank.'
            if (value > 1600) {
              return 'Above 1,600 billable hrs/yr is not real for a services team and understates your true cost. Use 1,000–1,300.'
            }
            if (value < 200) return 'That looks too low — check the figure.'
            return true
          },
        },
      ],
    },
    {
      name: 'loadedRate',
      type: 'number',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'annualCost ÷ annualBillableHours — computed. This is the number quotes cost against.',
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            const cost = data?.annualCost ?? 0
            const hours = data?.annualBillableHours || 1250
            return Math.round(cost / hours)
          },
        ],
      },
    },
    {
      type: 'row',
      fields: [
        { name: 'currency', type: 'select', defaultValue: 'USD', options: CURRENCY_OPTIONS },
        {
          name: 'capacityHrsPerWeek',
          type: 'number',
          min: 0,
          max: 60,
          admin: { description: 'Billable capacity per week — used by planning to flag over-allocation.' },
        },
      ],
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Uncheck to retire a role without deleting its history.' },
    },
  ],
}
