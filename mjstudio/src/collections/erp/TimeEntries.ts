import type { CollectionConfig } from 'payload'
import { isStaff } from '../../access/roles'

/**
 * ERP — Time Entries. Logged hours per project, valued at the role's loaded
 * rate. This is the "actual" side of profitability: an estimate says what the
 * work should cost; time entries say what it did. `cost` is computed from hours
 * × the rate-card loaded rate (snapshotted onto the entry), so a project's real
 * labour cost is the sum of its entries — no spreadsheet, no guessing.
 */
export const TimeEntries: CollectionConfig = {
  slug: 'time-entries',
  labels: { singular: 'Time entry', plural: 'Time entries' },
  admin: {
    useAsTitle: 'summary',
    defaultColumns: ['summary', 'project', 'person', 'hours', 'cost', 'date', 'billable'],
    group: 'ERP',
    description: 'Logged hours → real project cost.',
  },
  access: { read: isStaff, create: isStaff, update: isStaff, delete: isStaff },
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (!data) return data
        // Snapshot the loaded rate from the rate-card role when one is linked
        // and no explicit rate was entered. Snapshot (not live lookup) so a
        // later rate change doesn't rewrite historical cost.
        if (data.roleRef && (data.rate == null || data.rate === 0)) {
          try {
            const role = await req.payload.findByID({ collection: 'rate-card', id: data.roleRef, depth: 0 })
            const loaded = (role as { loadedRate?: number })?.loadedRate
            if (typeof loaded === 'number') data.rate = loaded
          } catch {
            /* role not found — leave rate as entered */
          }
        }
        data.cost = Math.round((data.hours ?? 0) * (data.rate ?? 0))
        return data
      },
    ],
  },
  fields: [
    { name: 'summary', type: 'text', required: true, admin: { description: 'What you worked on.' } },
    {
      type: 'row',
      fields: [
        { name: 'project', type: 'relationship', relationTo: 'projects', required: true, hasMany: false },
        { name: 'person', type: 'relationship', relationTo: 'users', hasMany: false, filterOptions: () => ({ role: { in: ['admin', 'editor'] } }), admin: { description: 'Who did the work.' } },
        { name: 'roleRef', type: 'relationship', relationTo: 'rate-card', hasMany: false, admin: { description: 'Role — sets the rate.' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'date', type: 'date' },
        { name: 'hours', type: 'number', required: true, min: 0, admin: { description: 'Hours worked (decimals OK, e.g. 1.5).' } },
        { name: 'rate', type: 'number', min: 0, admin: { description: 'Loaded rate — auto-filled from the role if blank.' } },
      ],
    },
    { name: 'cost', type: 'number', admin: { readOnly: true, description: 'hours × rate — computed.' } },
    {
      name: 'billable',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Counts toward client billing (vs internal/non-billable time).' },
    },
  ],
}
