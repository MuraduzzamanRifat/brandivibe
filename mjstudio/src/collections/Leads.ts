import type { CollectionConfig } from 'payload'

/**
 * Leads — enquiries captured from the website contact form. Public creation is
 * blocked here; the guarded /contact/submit endpoint creates leads with
 * overrideAccess, so bots can't POST straight to the REST API.
 */
export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'service', 'status', 'createdAt'],
    group: 'Operations',
    description: 'Enquiries from the website contact form.',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'company', type: 'text' },
    { name: 'service', type: 'text', admin: { description: 'The area they chose in the form.' } },
    { name: 'message', type: 'textarea' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      admin: { position: 'sidebar' },
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Qualified', value: 'qualified' },
        { label: 'Proposal sent', value: 'proposal' },
        { label: 'Won', value: 'won' },
        { label: 'Lost', value: 'lost' },
      ],
    },
    {
      name: 'source',
      type: 'text',
      admin: { position: 'sidebar', description: 'The page the enquiry came from.' },
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      admin: { description: 'Private notes for your team — never shown to the lead.' },
    },
  ],
  timestamps: true,
}
