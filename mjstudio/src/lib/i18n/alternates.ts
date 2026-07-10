import 'server-only'
import type { Metadata } from 'next'
import { DEFAULT_LOCALE, getLocale, localizedPath, type LocaleCode } from './config'
import { getEnabledLocales } from './enabled'

const SITE = 'https://brandivibe.com'

/**
 * hreflang + canonical for one page.
 *
 * `translatedLocales` must list only the locales where this *specific* page
 * genuinely exists in that language. Emitting hreflang for a locale that
 * silently falls back to English tells Google two URLs are equivalent
 * translations when they're the same English text — which is how multilingual
 * sites end up with thousands of duplicate pages.
 *
 * Every page self-references its canonical, and English carries x-default:
 * it's the fallback for any language we don't serve.
 */
export async function buildAlternates(
  path: string,
  translatedLocales?: readonly LocaleCode[]
): Promise<NonNullable<Metadata['alternates']>> {
  const enabled = await getEnabledLocales()

  // Intersect what's enabled site-wide with what's translated for this page.
  const available = (translatedLocales ?? enabled).filter((l) => enabled.includes(l))
  const locales = available.includes(DEFAULT_LOCALE)
    ? available
    : ([DEFAULT_LOCALE, ...available] as LocaleCode[])

  const languages: Record<string, string> = {}
  for (const code of locales) {
    languages[getLocale(code).hreflang] = `${SITE}${localizedPath(path, code)}`
  }
  languages['x-default'] = `${SITE}${localizedPath(path, DEFAULT_LOCALE)}`

  return { languages }
}

/** Canonical URL for a page in a locale — always self-referencing. */
export function canonicalFor(path: string, locale: LocaleCode): string {
  return `${SITE}${localizedPath(path, locale)}`
}
