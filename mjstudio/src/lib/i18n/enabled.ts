import 'server-only'
import { cache } from 'react'
import { FALLBACK_ENABLED_LOCALES, isLocale, type LocaleCode } from './config'

/**
 * The locales the public site currently serves.
 *
 * Today this is a static, English-only list. Once the localization migration
 * (Phase 1a) lands, the `language-settings` global becomes the source and this
 * body swaps to:
 *
 *   const payload = await getPayload({ config })
 *   const settings = await payload.findGlobal({ slug: 'language-settings', overrideAccess: true })
 *   return dedupe([DEFAULT_LOCALE, ...settings.enabledLocales.filter(isLocale)])
 *
 * The async signature exists precisely so that swap is a one-line change and
 * no caller has to move. English is always included — it is the canonical site
 * and the hreflang x-default, so it can never be switched off by accident.
 *
 * A locale only reaches this list once its content is translated and reviewed.
 * Enabling one earlier would serve English under a foreign URL, which is
 * duplicate content rather than internationalization.
 */
export const getEnabledLocales = cache(async (): Promise<LocaleCode[]> => {
  return [...FALLBACK_ENABLED_LOCALES]
})

/** True when a locale is both supported and switched on in the admin. */
export async function isEnabledLocale(code: string): Promise<boolean> {
  if (!isLocale(code)) return false
  return (await getEnabledLocales()).includes(code)
}
