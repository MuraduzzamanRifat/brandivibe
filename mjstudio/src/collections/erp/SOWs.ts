import type { CollectionConfig } from 'payload'
import { isStaff } from '../../access/roles'

/**
 * ERP — Statements of Work (the `/sow` command as a record).
 *
 * Scope is the product: every deliverable carries a noun, a count, a format, a
 * definition of done, and a revision count. An unnumbered revision is an
 * infinite revision.
 *
 * `exclusions` is the load-bearing field — the thing that stops scope creep
 * before it starts. A SOW whose exclusions are shorter than its deliverables
 * has not been written yet.
 */
export const SOWs: CollectionConfig = {
  slug: 'sows',
  labels: { singular: 'SOW', plural: 'SOWs' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'project', 'status', 'updatedAt'],
    group: 'ERP',
    description: 'Deliverables, exclusions, acceptance — the scope contract.',
  },
  access: { read: isStaff, create: isStaff, update: isStaff, delete: isStaff },
  fields: [
    { name: 'title', type: 'text', required: true, admin: { description: 'e.g. "Acme — Website rebuild SOW".' } },
    {
      type: 'row',
      fields: [
        { name: 'project', type: 'relationship', relationTo: 'projects', required: true, hasMany: false },
        { name: 'estimate', type: 'relationship', relationTo: 'estimates', hasMany: false, admin: { description: 'The accepted estimate this SOW is built from.' } },
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
        { label: 'Signed', value: 'signed' },
        { label: 'Superseded', value: 'superseded' },
      ],
    },
    {
      name: 'deliverables',
      type: 'array',
      minRows: 1,
      admin: { description: 'Each deliverable: a noun, a count, a format, and a stopping condition.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true, admin: { description: 'e.g. "Unique page designs".' } },
            { name: 'qty', type: 'number', defaultValue: 1, min: 0 },
            { name: 'format', type: 'text', admin: { description: 'e.g. "Figma, desktop + mobile".' } },
          ],
        },
        { name: 'definitionOfDone', type: 'textarea', required: true, admin: { description: 'The stopping condition — approved by whom, in what state.' } },
        {
          name: 'revisionRounds',
          type: 'number',
          defaultValue: 2,
          min: 0,
          admin: { description: 'Included revision rounds. Blank/0 is NOT unlimited — set a real number.' },
        },
        { name: 'excluded', type: 'text', admin: { description: 'Anything adjacent this deliverable explicitly does NOT include.' } },
      ],
    },
    {
      name: 'exclusions',
      type: 'textarea',
      required: true,
      admin: {
        description:
          'THE load-bearing section. Everything this engagement does not cover — write it longest. If it is shorter than the deliverables, keep going.',
      },
    },
    {
      name: 'assumptions',
      type: 'array',
      admin: { description: 'Every assumption you made to scope this. If it can’t survive being written down, it was a guess.' },
      fields: [{ name: 'assumption', type: 'text', required: true }],
    },
    {
      name: 'clientDependencies',
      type: 'array',
      admin: { description: 'What you need FROM the client, by when — the things that stall delivery when late.' },
      fields: [{ name: 'dependency', type: 'text', required: true }],
    },
    { name: 'acceptanceCriteria', type: 'textarea', admin: { description: 'How "done" is agreed and signed off.' } },
    {
      name: 'changeOrderProcess',
      type: 'textarea',
      defaultValue:
        'Work outside this SOW is quoted as a change order and agreed in writing before it starts. Nothing out of scope is absorbed silently.',
    },
    {
      name: 'paymentSchedule',
      type: 'array',
      admin: { description: 'Staged payments tied to milestones.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'milestone', type: 'text', required: true },
            { name: 'percent', type: 'number', min: 0, max: 100, admin: { description: '% of total.' } },
            { name: 'trigger', type: 'text', admin: { description: 'What releases this payment.' } },
          ],
        },
      ],
    },
  ],
}
