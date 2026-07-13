import type { CollectionConfig } from 'payload'
import { isStaff } from '../../access/roles'

/**
 * CRM — Contacts. The people the studio talks to, attached to a company
 * (Clients). A website Lead is converted into a Contact once it's real.
 *
 * Staff-only throughout: a portal client must never see the CRM.
 */
export const Contacts: CollectionConfig = {
  slug: 'contacts',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'company', 'lifecycleStage', 'owner'],
    group: 'CRM',
    description: 'People — leads, prospects, and client-side contacts.',
  },
  access: { read: isStaff, create: isStaff, update: isStaff, delete: isStaff },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'firstName', type: 'text', required: true },
        { name: 'lastName', type: 'text' },
      ],
    },
    {
      // Derived title so lists read nicely without forcing a last name.
      name: 'fullName',
      type: 'text',
      admin: { hidden: true },
      hooks: {
        beforeChange: [
          ({ data }) => [data?.firstName, data?.lastName].filter(Boolean).join(' ').trim(),
        ],
      },
    },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', index: true },
        { name: 'phone', type: 'text' },
      ],
    },
    { name: 'jobTitle', type: 'text' },
    {
      name: 'company',
      type: 'relationship',
      relationTo: 'clients',
      hasMany: false,
      admin: { description: 'The company this person belongs to.' },
    },
    {
      name: 'lifecycleStage',
      type: 'select',
      defaultValue: 'lead',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Lead', value: 'lead' },
        { label: 'Marketing qualified', value: 'mql' },
        { label: 'Sales qualified', value: 'sql' },
        { label: 'Opportunity', value: 'opportunity' },
        { label: 'Customer', value: 'customer' },
        { label: 'Lost / cold', value: 'lost' },
      ],
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      filterOptions: () => ({ role: { in: ['admin', 'editor'] } }),
      admin: { position: 'sidebar', description: 'Who owns this relationship.' },
    },
    {
      name: 'source',
      type: 'select',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Website form', value: 'website' },
        { label: 'Referral', value: 'referral' },
        { label: 'Upwork', value: 'upwork' },
        { label: 'Outbound', value: 'outbound' },
        { label: 'Social', value: 'social' },
        { label: 'Other', value: 'other' },
      ],
    },
    { name: 'tags', type: 'text', hasMany: true, admin: { position: 'sidebar' } },
    {
      name: 'linkedFromLead',
      type: 'relationship',
      relationTo: 'leads',
      hasMany: false,
      admin: { position: 'sidebar', description: 'The website enquiry this contact came from, if any.' },
    },
    { name: 'notes', type: 'textarea' },
  ],
}
