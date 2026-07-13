import type { CollectionConfig } from 'payload'
import { isStaff, staffOrOwnViaProject, roleOf, clientIdOf, isSignedIn } from '../../access/roles'

/**
 * Portal — Messages. A per-project thread between the studio and the client.
 *
 * This is the one portal collection a client can WRITE to. Two hooks keep that
 * safe: the sender is forced to the current user (a client can't post as
 * someone else), and a client can only post to a project belonging to their own
 * company (checked before the row is written, so it can't be spoofed via the
 * REST API).
 */
export const ProjectMessages: CollectionConfig = {
  slug: 'project-messages',
  labels: { singular: 'Message', plural: 'Messages' },
  admin: {
    useAsTitle: 'preview',
    defaultColumns: ['preview', 'project', 'sender', 'createdAt'],
    group: 'Client Portal',
  },
  access: {
    read: staffOrOwnViaProject('project'),
    create: isSignedIn, // constrained by the hook below
    update: isStaff, // messages aren't edited by clients
    delete: isStaff,
  },
  hooks: {
    beforeValidate: [
      async ({ data, req, operation }) => {
        if (operation !== 'create' || !data) return data
        // Always stamp the real sender.
        data.sender = req.user?.id
        // A client may only post into their own company's project.
        if (roleOf(req.user) === 'client') {
          const cid = clientIdOf(req.user)
          const project = await req.payload.findByID({
            collection: 'projects',
            id: data.project as string,
            depth: 0,
            overrideAccess: true,
          })
          const owner = typeof project.client === 'object' ? project.client.id : project.client
          if (!cid || owner !== cid) {
            throw new Error('You can only message on your own project.')
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      required: true,
      hasMany: false,
    },
    { name: 'body', type: 'textarea', required: true },
    {
      name: 'sender',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'attachments',
      type: 'relationship',
      relationTo: 'project-files',
      hasMany: true,
      admin: { description: 'Optional files referenced in this message.' },
    },
    {
      // Denormalised one-liner for the admin list view.
      name: 'preview',
      type: 'text',
      admin: { hidden: true },
      hooks: {
        beforeChange: [({ data }) => String(data?.body ?? '').slice(0, 60)],
      },
    },
  ],
}
