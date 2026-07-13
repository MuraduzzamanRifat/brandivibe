import type { CollectionConfig } from 'payload'
import { isStaff } from '../../access/roles'

/**
 * CRM — Activities. The timeline: every note, call, email, meeting and task
 * logged against a contact or deal. This is what turns the CRM from a static
 * address book into a record of the relationship.
 *
 * A `task` activity carries a due date and a done flag, so the same collection
 * powers a simple follow-up to-do list (filter type=task, done=false).
 */
export const Activities: CollectionConfig = {
  slug: 'activities',
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['subject', 'type', 'contact', 'deal', 'dueDate', 'done', 'owner'],
    group: 'CRM',
    description: 'Notes, calls, emails, meetings and follow-up tasks.',
  },
  access: { read: isStaff, create: isStaff, update: isStaff, delete: isStaff },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'note',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Note', value: 'note' },
        { label: 'Call', value: 'call' },
        { label: 'Email', value: 'email' },
        { label: 'Meeting', value: 'meeting' },
        { label: 'Task', value: 'task' },
      ],
    },
    { name: 'subject', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
    {
      type: 'row',
      fields: [
        { name: 'contact', type: 'relationship', relationTo: 'contacts', hasMany: false },
        { name: 'deal', type: 'relationship', relationTo: 'deals', hasMany: false },
      ],
    },
    {
      // Only meaningful for type=task, but harmless elsewhere.
      name: 'dueDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        condition: (data) => data?.type === 'task',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'done',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', condition: (data) => data?.type === 'task' },
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      filterOptions: () => ({ role: { in: ['admin', 'editor'] } }),
      admin: { position: 'sidebar' },
    },
  ],
}
