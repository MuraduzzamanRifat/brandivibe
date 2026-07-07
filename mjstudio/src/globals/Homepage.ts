import type { GlobalConfig } from 'payload'

/**
 * Homepage — editable copy for the home page hero, reassurance cards, the
 * "what we do" section heading, and the process steps. Field defaults hold the
 * current live copy, so the page renders correctly before anyone edits it.
 */
export const Homepage: GlobalConfig = {
  slug: 'homepage',
  admin: { group: 'Site' },
  access: { read: () => true },
  fields: [
    {
      type: 'collapsible',
      label: 'Hero',
      fields: [
        { name: 'heroEyebrow', type: 'text', defaultValue: '— Your friendly digital studio' },
        {
          name: 'heroHeadline',
          type: 'text',
          defaultValue: 'Everything your business needs to grow online, ',
          admin: { description: 'Leading part of the headline (before the highlighted words).' },
        },
        {
          name: 'heroHeadlineAccent',
          type: 'text',
          defaultValue: 'under one warm roof',
          admin: { description: 'The highlighted (gradient) words.' },
        },
        {
          name: 'heroHeadlineTail',
          type: 'text',
          defaultValue: '.',
          admin: { description: 'Anything after the highlighted words (e.g. a full stop).' },
        },
        {
          name: 'heroSubhead',
          type: 'textarea',
          defaultValue:
            'Websites, software, marketing, content, design, and AI — made by a small, senior team that actually enjoys the work. Premium quality, none of the corporate coldness.',
        },
      ],
    },
    {
      name: 'reassurance',
      type: 'array',
      admin: { description: 'The three reassurance cards under the hero.' },
      defaultValue: [
        { title: 'A senior team who cares', body: 'You work with people who do the actual work — no juniors, no hand-offs, no call centre.' },
        { title: 'Quick, and kept in the loop', body: 'We move fast, share progress as we go, and reply within a day. No black boxes.' },
        { title: 'You own everything', body: 'Your code, your accounts, your files. We build it to be yours — never locked in.' },
      ],
      fields: [
        { name: 'title', type: 'text' },
        { name: 'body', type: 'textarea' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Services section',
      fields: [
        { name: 'servicesEyebrow', type: 'text', defaultValue: '— What we do' },
        { name: 'servicesHeading', type: 'text', defaultValue: 'Six ways we help, one team to call.' },
        {
          name: 'servicesSubhead',
          type: 'textarea',
          defaultValue:
            'Most businesses juggle a web person, an SEO person, a designer, a developer… We bring it together, so the whole thing pulls in the same direction.',
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Process section',
      fields: [
        { name: 'processEyebrow', type: 'text', defaultValue: '— How it works' },
        { name: 'processHeading', type: 'text', defaultValue: 'Working together feels easy.' },
        {
          name: 'process',
          type: 'array',
          defaultValue: [
            { number: '01', title: 'Say hello', body: "Tell us what you're hoping to do. A friendly chat, no pressure, no jargon — just working out if we're a good fit." },
            { number: '02', title: 'Make a plan', body: "We map the goal, the shape of the work, and a clear price. You'll know exactly what you're getting before we start." },
            { number: '03', title: 'Build it together', body: 'We do the work in close contact, sharing progress often so it always feels like yours, right up to launch.' },
            { number: '04', title: 'Launch & look after', body: 'We ship it properly, show you how everything works, and stick around to help it grow.' },
          ],
          fields: [
            { name: 'number', type: 'text' },
            { name: 'title', type: 'text' },
            { name: 'body', type: 'textarea' },
          ],
        },
      ],
    },
  ],
}
