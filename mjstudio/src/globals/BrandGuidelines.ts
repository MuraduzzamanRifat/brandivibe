import type { GlobalConfig } from 'payload'

/**
 * Brand Writing Guidelines — the editorial rulebook. The AI writing assistant
 * (next phase) reads this to keep generated content in Brandivibe's voice.
 */
export const BrandGuidelines: GlobalConfig = {
  slug: 'brand-guidelines',
  label: 'Brand Writing Guidelines',
  admin: { group: 'Site' },
  access: { read: () => true },
  fields: [
    {
      name: 'voice',
      type: 'textarea',
      defaultValue:
        'Warm, friendly, and human. A small senior team that enjoys the work. Premium quality without corporate coldness. Confident but never boastful.',
      admin: { description: 'How Brandivibe sounds — the personality behind the words.' },
    },
    {
      name: 'tone',
      type: 'textarea',
      defaultValue:
        'Plain-spoken and honest. Short sentences. No jargon, no hype. Talk to the reader like a smart friend. British-adjacent warmth, US spelling.',
      admin: { description: 'Register and rhythm of the writing.' },
    },
    {
      name: 'terminology',
      type: 'array',
      admin: { description: 'Preferred terms — use these, not the alternatives.' },
      defaultValue: [
        { use: 'Google My Business (GMB)', notInsteadOf: 'GBP' },
        { use: 'case study', notInsteadOf: 'portfolio piece' },
      ],
      fields: [
        { name: 'use', type: 'text' },
        { name: 'notInsteadOf', type: 'text', label: 'Instead of' },
      ],
    },
    {
      name: 'bannedWords',
      type: 'array',
      admin: { description: 'Words and phrases that never appear in Brandivibe copy.' },
      defaultValue: [
        { word: 'synergy' },
        { word: 'leverage (as a verb)' },
        { word: 'game-changing' },
        { word: 'cutting-edge' },
      ],
      fields: [{ name: 'word', type: 'text' }],
    },
    {
      name: 'ctaStyle',
      type: 'textarea',
      defaultValue:
        'Primary CTA is "Book a free call" linking to /#contact. Secondary is "Get a free audit" linking to /audit. Always reassure: no pressure, no jargon, honest advice.',
      admin: { description: 'How calls-to-action are phrased and placed.' },
    },
    {
      name: 'formattingRules',
      type: 'textarea',
      defaultValue:
        'H2 for main sections, H3 for sub-points. Short paragraphs (2-4 sentences). Use bullet lists for scannability. One CTA mid-article, one at the end. Alt text on every image.',
      admin: { description: 'Structure and formatting conventions.' },
    },
    {
      name: 'styleExamples',
      type: 'array',
      admin: { description: 'Great example sentences that nail the voice.' },
      fields: [{ name: 'example', type: 'textarea' }],
    },
  ],
}
