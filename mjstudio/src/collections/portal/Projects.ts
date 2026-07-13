import type { CollectionConfig } from 'payload'
import { isStaff, staffOrOwnClient } from '../../access/roles'

/**
 * Portal — Projects. The root of the client portal: everything a client sees
 * (milestones, tasks, files, invoices, messages, approvals) hangs off one of
 * these.
 *
 * A client can READ their own projects and nothing else; only staff create or
 * change them. `staffOrOwnClient` enforces that at the query layer — a client
 * literally cannot fetch a project whose `client` isn't their company.
 *
 * `completionPercent` is a headline number staff set; the portal ALSO derives a
 * live progress bar from the project's milestones/tasks, so the client sees
 * both the stated figure and the granular truth.
 */
export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'client', 'status', 'completionPercent', 'targetDate'],
    group: 'Client Portal',
    description: 'Client delivery projects — the spine of the portal.',
  },
  access: {
    read: staffOrOwnClient,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      required: true,
      hasMany: false,
      admin: { description: 'Whose project this is. Drives every portal permission.' },
    },
    {
      name: 'summary',
      type: 'textarea',
      admin: { description: 'One or two lines the client sees at the top of the project.' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'discovery',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Discovery', value: 'discovery' },
        { label: 'Design', value: 'design' },
        { label: 'In development', value: 'development' },
        { label: 'In review', value: 'review' },
        { label: 'Launched', value: 'launched' },
        { label: 'On hold', value: 'on-hold' },
        { label: 'Complete', value: 'complete' },
      ],
    },
    {
      name: 'completionPercent',
      type: 'number',
      min: 0,
      max: 100,
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Headline progress %. The portal also shows a task-derived bar.' },
    },
    {
      type: 'row',
      fields: [
        { name: 'startDate', type: 'date' },
        { name: 'targetDate', type: 'date', admin: { description: 'Planned go-live.' } },
      ],
    },
    {
      name: 'team',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      filterOptions: () => ({ role: { in: ['admin', 'editor'] } }),
      admin: { description: 'Studio people on this project.' },
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: { description: 'What this project covers.' },
    },
    {
      // Cover image shown at the top of the client's project page.
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
