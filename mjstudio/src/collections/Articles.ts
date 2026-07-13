import type { CollectionConfig } from 'payload'
import {
  BlocksFeature,
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { slugField } from '../fields/slugField'
import { seoField } from '../fields/seoField'
import { editorBlocks } from '../blocks/editorBlocks'

// Local text extractor (avoids importing lib/content, which would create a
// circular import back into payload.config).
type LexNode = { text?: string; children?: LexNode[]; root?: LexNode }
function lexText(node: LexNode | undefined): string {
  if (!node) return ''
  if (typeof node.text === 'string') return node.text
  if (Array.isArray(node.children)) return node.children.map(lexText).join(' ')
  return ''
}

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'author', 'publishedAt'],
    group: 'Content',
    // Live side-by-side preview while writing (draft-aware).
    livePreview: {
      // Fall back to production, not localhost — a missing env var in the live
      // admin should still open the real site, not a dead localhost link.
      url: ({ data }) =>
        `${process.env.NEXT_PUBLIC_SITE_URL || 'https://brandivibe.com'}/journal/${data?.slug ?? ''}?preview=1`,
    },
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: {
      autosave: { interval: 1500 }, // Content Studio: auto-save while typing
    },
    maxPerDoc: 50,
  },
  hooks: {
    beforeChange: [
      // Auto-compute word count + reading time from the body.
      ({ data }) => {
        try {
          const root = (data?.content as LexNode | undefined)?.root
          const words = lexText(root).split(/\s+/).filter(Boolean).length
          if (words > 0) {
            data.wordCount = words
            data.readingTime = Math.max(1, Math.round(words / 220))
          }
        } catch {
          /* leave manual values untouched */
        }
        return data
      },
    ],
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
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          FixedToolbarFeature(),
          EXPERIMENTAL_TableFeature(),
          BlocksFeature({ blocks: editorBlocks }),
        ],
      }),
      admin: {
        description:
          'The article body. Use "/" or the + button for blocks: callouts, CTAs, code, video embeds, stats, FAQs, tables.',
      },
    },
    {
      // Content Studio: keyword research workspace (stored per article).
      name: 'keywords',
      type: 'group',
      admin: {
        description: 'SEO keyword research for this article.',
      },
      fields: [
        { name: 'focusKeyword', type: 'text', admin: { description: 'The primary keyword this article targets.' } },
        {
          name: 'secondaryKeywords',
          type: 'array',
          fields: [{ name: 'keyword', type: 'text' }],
        },
        {
          name: 'searchIntent',
          type: 'select',
          options: [
            { label: 'Informational', value: 'informational' },
            { label: 'Commercial', value: 'commercial' },
            { label: 'Transactional', value: 'transactional' },
            { label: 'Navigational', value: 'navigational' },
          ],
        },
        {
          name: 'competitorUrls',
          type: 'array',
          fields: [{ name: 'url', type: 'text' }],
          admin: { description: 'Top-ranking pages to beat.' },
        },
        { name: 'notes', type: 'textarea' },
      ],
    },
    {
      name: 'wordCount',
      type: 'number',
      admin: {
        description: 'Auto-computed from the body on save.',
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'readingTime',
      type: 'number',
      admin: {
        description: 'Minutes — auto-computed from the body on save.',
        position: 'sidebar',
        readOnly: true,
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
