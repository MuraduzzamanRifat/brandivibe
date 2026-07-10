import type { Field } from 'payload'

/**
 * Per-locale publishing gate.
 *
 * Payload's own `_status` (draft/published) is per *document*, not per locale —
 * so it cannot express "Spanish is live, German is still being reviewed".
 * This field is `localized`, which gives it one value per locale and closes
 * that gap.
 *
 * The frontend treats anything other than `published` as "not translated":
 * the page is excluded from that locale's sitemap and hreflang set, and
 * rendered `noindex`. That is what stops an untranslated locale from silently
 * serving English content under a foreign URL — the duplicate-content mass
 * that gets multilingual sites demoted.
 */
export const translationStatus: Field = {
  name: 'translationStatus',
  type: 'select',
  localized: true,
  required: true,
  defaultValue: 'draft',
  options: [
    { label: 'Draft — machine translated, not reviewed', value: 'draft' },
    { label: 'In review — a human is checking it', value: 'in-review' },
    { label: 'Published — reviewed, safe to index', value: 'published' },
  ],
  admin: {
    position: 'sidebar',
    description:
      'Only "Published" is indexed and linked via hreflang. Raw machine translation must never reach this state unreviewed.',
  },
}
