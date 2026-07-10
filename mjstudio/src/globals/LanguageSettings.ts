import type { GlobalConfig } from 'payload'
import { SUPPORTED_LOCALES, FALLBACK_ENABLED_LOCALES } from '../lib/i18n/config'

/**
 * Which languages the public site routes, links, and indexes.
 *
 * Every locale in SUPPORTED_LOCALES can be *authored* in the admin at any
 * time. Only the ones enabled here get a URL prefix, an hreflang entry, and a
 * place in the sitemap — so an editor can translate German quietly for weeks
 * before it ever reaches Google.
 *
 * English is always enabled: it is the canonical site and the x-default.
 */
export const LanguageSettings: GlobalConfig = {
  slug: 'language-settings',
  label: 'Languages',
  admin: {
    group: 'Settings',
    description:
      'Turn a language on only once its pages are reviewed. Enabling a language publishes its URLs to search engines.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'enabledLocales',
      type: 'select',
      hasMany: true,
      required: true,
      // Starts English-only on purpose — see FALLBACK_ENABLED_LOCALES.
      defaultValue: [...FALLBACK_ENABLED_LOCALES],
      options: SUPPORTED_LOCALES.map((l) => ({
        label: `${l.label} — ${l.englishName} (/${l.code})`,
        value: l.code,
      })),
      admin: {
        description:
          'English is always served at the root and cannot be removed. Others appear at /<code>/.',
      },
    },
    {
      name: 'showSuggestionBanner',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description:
          "Offer visitors their browser's language with a dismissible banner. We never auto-redirect — that hides other languages from search engines.",
      },
    },
  ],
}
