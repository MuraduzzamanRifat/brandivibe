import type { CollectionConfig, Where } from 'payload'
import { isStaff, staffOrOwnViaProject, roleOf } from '../../access/roles'

/**
 * Portal — Files. Deliverables and shared documents. This is an UPLOAD
 * collection, so each row IS the file (stored on Vercel Blob like Media).
 *
 * A client sees a file only when it belongs to their project AND is marked
 * clientVisible — internal working files can live here without leaking. The
 * clientVisible gate is applied on top of the ownership filter.
 */
export const ProjectFiles: CollectionConfig = {
  slug: 'project-files',
  labels: { singular: 'File', plural: 'Files' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'project', 'category', 'clientVisible'],
    group: 'Client Portal',
  },
  upload: {
    mimeTypes: ['image/*', 'application/pdf', 'video/*', 'application/zip', 'application/*'],
  },
  access: {
    read: (args) => {
      const user = args.req.user
      if (!user) return false
      const base = staffOrOwnViaProject('project')(args)
      // staff: unrestricted (base is `true`)
      if (roleOf(user) === 'admin' || roleOf(user) === 'editor') return base
      // clients: own project (base is a Where) AND explicitly shared
      if (base === false) return false
      return { and: [base as Where, { clientVisible: { equals: true } }] } as Where
    },
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  fields: [
    { name: 'title', type: 'text', admin: { description: 'A friendly name (defaults to the filename).' } },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      required: true,
      hasMany: false,
    },
    {
      name: 'category',
      type: 'select',
      defaultValue: 'deliverable',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Deliverable', value: 'deliverable' },
        { label: 'Design', value: 'design' },
        { label: 'Document', value: 'document' },
        { label: 'Invoice', value: 'invoice' },
        { label: 'Working file', value: 'working' },
      ],
    },
    {
      name: 'clientVisible',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Uncheck to keep this internal.' },
    },
  ],
}
