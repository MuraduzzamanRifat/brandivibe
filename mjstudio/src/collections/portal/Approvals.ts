import type { CollectionConfig } from 'payload'
import { isStaff, staffOrOwnViaProject, staffOnlyField, roleOf } from '../../access/roles'

/**
 * Portal — Approvals. Staff request a sign-off (a design, a deliverable, a
 * scope change); the client approves it or asks for changes.
 *
 * The client can UPDATE the row, but field-level access locks every field to
 * staff EXCEPT `decision` and `clientComment`. So a client can record their
 * verdict and nothing else — they can't rewrite the request itself. A hook
 * stamps who decided and when the moment a decision lands.
 */
export const Approvals: CollectionConfig = {
  slug: 'approvals',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'project', 'decision', 'requestedAt'],
    group: 'Client Portal',
  },
  access: {
    read: staffOrOwnViaProject('project'),
    create: isStaff,
    // Clients may update (to record a decision) on their own project's approvals;
    // field-level access below is what actually limits WHAT they can change.
    update: staffOrOwnViaProject('project'),
    delete: isStaff,
  },
  hooks: {
    beforeChange: [
      ({ data, req, originalDoc }) => {
        const decided = data?.decision && data.decision !== 'pending'
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
    { name: 'title', type: 'text', required: true, access: { update: staffOnlyField } },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      required: true,
      hasMany: false,
      access: { update: staffOnlyField },
    },
    { name: 'description', type: 'textarea', access: { update: staffOnlyField } },
    {
      name: 'item',
      type: 'relationship',
      relationTo: 'project-files',
      hasMany: false,
      access: { update: staffOnlyField },
      admin: { description: 'The file being approved, if any.' },
    },
    {
      // The one field a client actually sets.
      name: 'decision',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Awaiting your review', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Changes requested', value: 'changes' },
      ],
    },
    {
      name: 'clientComment',
      type: 'textarea',
      admin: { description: 'The client can add a note with their decision.' },
    },
    {
      name: 'requestedAt',
      type: 'date',
      access: { update: staffOnlyField },
      admin: { position: 'sidebar' },
    },
    {
      name: 'decidedBy',
      type: 'relationship',
      relationTo: 'users',
      access: { update: staffOnlyField },
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'decidedAt',
      type: 'date',
      access: { update: staffOnlyField },
      admin: { readOnly: true, position: 'sidebar' },
    },
  ],
}
