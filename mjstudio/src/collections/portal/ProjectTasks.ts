import type { CollectionConfig } from 'payload'
import { isStaff, staffOrOwnViaProject } from '../../access/roles'

/**
 * Portal — Tasks. The granular work items the client's live progress bar is
 * derived from (done ÷ total). Optionally grouped under a milestone.
 */
export const ProjectTasks: CollectionConfig = {
  slug: 'project-tasks',
  labels: { singular: 'Task', plural: 'Tasks' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'project', 'milestone', 'status', 'order'],
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
    {
      name: 'milestone',
      type: 'relationship',
      relationTo: 'milestones',
      hasMany: false,
      admin: { description: 'Optional — the phase this task belongs to.' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'todo',
      admin: { position: 'sidebar' },
      options: [
        { label: 'To do', value: 'todo' },
        { label: 'In progress', value: 'in-progress' },
        { label: 'Done', value: 'done' },
      ],
    },
    {
      // Whether the client sees this task. Some internal tasks stay hidden but
      // still count toward the derived progress bar only when clientVisible.
      name: 'clientVisible',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Show this task to the client.' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
