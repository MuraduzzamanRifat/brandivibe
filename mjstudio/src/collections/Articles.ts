import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slugField'
import { seoField } from '../fields/seoField'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'author', 'publishedAt'],
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The headline for this article — clear and inviting.',
      },
    },
    slugField('title'),
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'A short teaser shown in listings and previews.',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: false,
      admin: {
        description: 'The main topic bucket this article belongs to.',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        description: 'A few keywords to help readers find related pieces.',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      hasMany: false,
      admin: {
        description: 'Who wrote this piece.',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'The lead image shown at the top of the article.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      admin: {
        description:
          'The article body. Richer blocks like code, video, and FAQ arrive in a later phase.',
      },
    },
    {
      name: 'readingTime',
      type: 'number',
      admin: {
        description: 'Estimated minutes; auto-calculation added later',
        position: 'sidebar',
      },
    },
    {
      name: 'relatedArticles',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
      admin: {
        description: 'Other articles worth reading alongside this one.',
      },
    },
    {
      name: 'relatedServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: {
        description: 'Services this article naturally connects to.',
      },
    },
    {
      name: 'relatedCaseStudies',
      type: 'relationship',
      relationTo: 'case-studies',
      hasMany: true,
      admin: {
        description: 'Case studies that bring this topic to life.',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        description: 'When this article goes live.',
        position: 'sidebar',
      },
    },
    {
      name: 'enableComments',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Let readers leave comments on this article.',
        position: 'sidebar',
      },
    },
    seoField,
  ],
}
