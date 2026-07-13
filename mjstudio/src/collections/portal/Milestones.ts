import type { CollectionConfig } from 'payload'
import { isStaff, staffOrOwnViaProject } from '../../access/roles'

/**
 * Portal — Milestones. The phases of a project, shown to the client as the
 * timeline. Ownership is one hop away (via `project.client`), so access uses
 * `staffOrOwnViaProject`.
 */
export const Milestones: CollectionConfig = {
  slug: 'milestones',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'project', 'status', 'dueDate', 'order'],
    group: 'Client Portal',
  },
  access: {
    read: staffOrOwnViaProject('project'),
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      required: true,
      hasMany: false,
    },
    { name: 'description', type: 'textarea' },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'upcoming',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Upcoming', value: 'upcoming' },
        { label: 'In progress', value: 'in-progress' },
        { label: 'Done', value: 'done' },
        { label: 'Blocked', value: 'blocked' },
      ],
    },
    { name: 'dueDate', type: 'date', admin: { position: 'sidebar' } },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower shows first on the timeline.' },
    },
  ],
}
