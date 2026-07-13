import type { CollectionConfig } from 'payload'
import { isAdmin, adminOnlyField, roleOf } from '../access/roles'

/**
 * Users — everyone who logs in: studio staff AND portal clients, one auth
 * system with a `role` that decides what they can touch.
 *
 *   admin   full control
 *   editor  content + operations, no user/role management
 *   client  a customer login, scoped to ONE company via `client`
 *
 * A single auth collection (rather than a separate Clients-auth one) means one
 * login screen, one password-reset flow, and access rules that read `role`
 * everywhere. The `client` relationship scopes a portal user to their own
 * company's projects, invoices and messages.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Settings',
  },
  auth: {
    tokenExpiration: 60 * 60 * 8, // 8h sessions
    maxLoginAttempts: 8,
    lockTime: 10 * 60 * 1000,
  },
  access: {
    // Only admins see the whole list; a signed-in user can read their own doc
    // (Payload needs self-read for the session to resolve).
    read: ({ req: { user } }) => {
      if (roleOf(user) === 'admin') return true
      if (!user) return false
      return { id: { equals: user.id } }
    },
    create: isAdmin,
    update: ({ req: { user } }) => {
      if (roleOf(user) === 'admin') return true
      if (!user) return false
      return { id: { equals: user.id } } // edit yourself only
    },
    delete: isAdmin,
    // Clients must never reach the Payload admin UI — they use /portal.
    admin: ({ req: { user } }) => {
      const r = roleOf(user)
      return r === 'admin' || r === 'editor'
    },
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'client',
      access: { update: adminOnlyField, create: adminOnlyField },
      admin: { position: 'sidebar', description: 'Determines what this person can access.' },
      options: [
        { label: 'Admin (studio owner)', value: 'admin' },
        { label: 'Editor (studio staff)', value: 'editor' },
        { label: 'Client (portal login)', value: 'client' },
      ],
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      hasMany: false,
      access: { update: adminOnlyField },
      admin: {
        position: 'sidebar',
        description: 'For client logins — the company whose portal they can see.',
        condition: (data) => data?.role === 'client',
      },
    },
    {
      name: 'title',
      type: 'text',
      admin: { description: 'Job title, e.g. "Head of Marketing" (shown in the portal).' },
    },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
  ],
}
