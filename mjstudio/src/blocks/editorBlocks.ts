import type { Block } from 'payload'

/**
 * Content Studio — blocks available INSIDE the rich-text editor (via
 * BlocksFeature). Each has a matching HTML converter in lib/content.ts so the
 * frontend renders it with the warm design system.
 */

export const CalloutBlock: Block = {
  slug: 'callout',
  labels: { singular: 'Callout', plural: 'Callouts' },
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'info',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Tip', value: 'tip' },
        { label: 'Warning', value: 'warning' },
        { label: 'Success', value: 'success' },
      ],
    },
    { name: 'title', type: 'text' },
    { name: 'body', type: 'textarea', required: true },
  ],
}

export const CtaBlock: Block = {
  slug: 'cta',
  labels: { singular: 'CTA', plural: 'CTAs' },
  fields: [
    { name: 'heading', type: 'text', admin: { description: 'e.g. "Want results like this?"' } },
    { name: 'body', type: 'textarea' },
    { name: 'buttonLabel', type: 'text', defaultValue: 'Book a free call' },
    { name: 'buttonHref', type: 'text', defaultValue: '/#contact' },
  ],
}

export const CodeBlock: Block = {
  slug: 'codeBlock',
  labels: { singular: 'Code block', plural: 'Code blocks' },
  fields: [
    {
      name: 'language',
      type: 'select',
      defaultValue: 'typescript',
      options: ['typescript', 'javascript', 'html', 'css', 'json', 'bash', 'python', 'sql', 'plaintext'].map(
        (v) => ({ label: v, value: v }),
      ),
    },
    { name: 'code', type: 'code', required: true },
  ],
}

export const VideoEmbedBlock: Block = {
  slug: 'videoEmbed',
  labels: { singular: 'Video embed', plural: 'Video embeds' },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: { description: 'YouTube or Vimeo URL — embedded responsively.' },
    },
    { name: 'caption', type: 'text' },
  ],
}

export const StatsBlock: Block = {
  slug: 'stats',
  labels: { singular: 'Statistics', plural: 'Statistics' },
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      fields: [
        { name: 'value', type: 'text', required: true, admin: { description: 'e.g. "+240%"' } },
        { name: 'label', type: 'text', required: true, admin: { description: 'e.g. "Organic traffic"' } },
      ],
    },
  ],
}

export const FaqBlock: Block = {
  slug: 'faqBlock',
  labels: { singular: 'FAQ section', plural: 'FAQ sections' },
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
  ],
}

export const editorBlocks: Block[] = [CalloutBlock, CtaBlock, CodeBlock, VideoEmbedBlock, StatsBlock, FaqBlock]
