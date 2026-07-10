/**
 * The single source of truth for languages.
 *
 * SUPPORTED = every locale the CMS can author. Payload is configured with all
 * of them, so an editor can start translating any language at any time.
 *
 * ENABLED  = the locales the public site actually routes, links, and indexes.
 * That list lives in the `language-settings` global so it can be changed from
 * the admin panel without a code deploy (see lib/i18n/enabled.ts).
 *
 * A locale being "supported" never puts a URL in front of Google. Only a
 * locale that is enabled AND has a page marked `translationStatus: published`
 * is indexable — that's what keeps untranslated pages from becoming a mass of
 * duplicate English content under foreign URLs.
 */

export type LocaleCode =
  | "en" | "es" | "fr" | "de" | "it" | "pt" | "nl" | "sv" | "da" | "no"
  | "fi" | "pl" | "cs" | "ro" | "tr" | "el" | "ja" | "ko" | "zh-cn" | "zh-tw" | "ar";

export type LocaleDef = {
  /** URL prefix and Payload locale code. */
  code: LocaleCode;
  /** Value for <html lang> and the hreflang attribute. */
  hreflang: string;
  /** Native name, shown in the switcher — never translate this. */
  label: string;
  /** English name, for the admin panel. */
  englishName: string;
  dir: "ltr" | "rtl";
};

export const DEFAULT_LOCALE: LocaleCode = "en";

export const SUPPORTED_LOCALES: readonly LocaleDef[] = [
  { code: "en", hreflang: "en", label: "English", englishName: "English", dir: "ltr" },
  { code: "es", hreflang: "es", label: "Español", englishName: "Spanish", dir: "ltr" },
  { code: "fr", hreflang: "fr", label: "Français", englishName: "French", dir: "ltr" },
  { code: "de", hreflang: "de", label: "Deutsch", englishName: "German", dir: "ltr" },
  { code: "it", hreflang: "it", label: "Italiano", englishName: "Italian", dir: "ltr" },
  { code: "pt", hreflang: "pt", label: "Português", englishName: "Portuguese", dir: "ltr" },
  { code: "nl", hreflang: "nl", label: "Nederlands", englishName: "Dutch", dir: "ltr" },
  { code: "sv", hreflang: "sv", label: "Svenska", englishName: "Swedish", dir: "ltr" },
  { code: "da", hreflang: "da", label: "Dansk", englishName: "Danish", dir: "ltr" },
  { code: "no", hreflang: "no", label: "Norsk", englishName: "Norwegian", dir: "ltr" },
  { code: "fi", hreflang: "fi", label: "Suomi", englishName: "Finnish", dir: "ltr" },
  { code: "pl", hreflang: "pl", label: "Polski", englishName: "Polish", dir: "ltr" },
  { code: "cs", hreflang: "cs", label: "Čeština", englishName: "Czech", dir: "ltr" },
  { code: "ro", hreflang: "ro", label: "Română", englishName: "Romanian", dir: "ltr" },
  { code: "tr", hreflang: "tr", label: "Türkçe", englishName: "Turkish", dir: "ltr" },
  { code: "el", hreflang: "el", label: "Ελληνικά", englishName: "Greek", dir: "ltr" },
  { code: "ja", hreflang: "ja", label: "日本語", englishName: "Japanese", dir: "ltr" },
  { code: "ko", hreflang: "ko", label: "한국어", englishName: "Korean", dir: "ltr" },
  // Script subtags (not region) are what Google wants for Chinese.
  { code: "zh-cn", hreflang: "zh-Hans", label: "简体中文", englishName: "Chinese (Simplified)", dir: "ltr" },
  { code: "zh-tw", hreflang: "zh-Hant", label: "繁體中文", englishName: "Chinese (Traditional)", dir: "ltr" },
  { code: "ar", hreflang: "ar", label: "العربية", englishName: "Arabic", dir: "rtl" },
] as const;

export const SUPPORTED_CODES: readonly LocaleCode[] = SUPPORTED_LOCALES.map((l) => l.code);

/**
 * Locales enabled if the admin global is unreachable (cold build, DB hiccup).
 *
 * English only, deliberately. A locale must not be enabled before its content
 * is translated and reviewed — otherwise /es/ just serves English under a
 * Spanish URL, which is duplicate content, not internationalization. The
 * es/de/ja pilot gets switched on from the admin once Phase 1b lands.
 */
export const FALLBACK_ENABLED_LOCALES: readonly LocaleCode[] = ["en"];

/** Locales targeted by the first translation pilot. */
export const PILOT_LOCALES: readonly LocaleCode[] = ["es", "de", "ja"];

export function isLocale(value: string): value is LocaleCode {
  return (SUPPORTED_CODES as readonly string[]).includes(value);
}

export function getLocale(code: string): LocaleDef {
  return SUPPORTED_LOCALES.find((l) => l.code === code) ?? SUPPORTED_LOCALES[0];
}

/**
 * Public URL for a path in a given locale. English is unprefixed — it is the
 * canonical site, so `/about` not `/en/about`.
 */
export function localizedPath(path: string, locale: LocaleCode): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean === "/" ? "/" : clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** Splits "/es/about" into { locale: "es", path: "/about" }. */
export function splitLocale(pathname: string): { locale: LocaleCode; path: string } {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (first && isLocale(first)) {
    const rest = "/" + segments.slice(1).join("/");
    return { locale: first, path: rest === "/" ? "/" : rest.replace(/\/$/, "") };
  }
  return { locale: DEFAULT_LOCALE, path: pathname === "" ? "/" : pathname };
}

/** Best match for an Accept-Language header, or null when nothing fits. */
export function matchAcceptLanguage(
  header: string | null,
  enabled: readonly LocaleCode[]
): LocaleCode | null {
  if (!header) return null;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.trim().toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    if (isLocale(tag) && enabled.includes(tag)) return tag;
    // "es-ES" -> "es"; "zh-Hans-CN" -> try zh-cn
    const base = tag.split("-")[0];
    if (tag.startsWith("zh")) {
      const zh: LocaleCode = /hant|tw|hk|mo/.test(tag) ? "zh-tw" : "zh-cn";
      if (enabled.includes(zh)) return zh;
    }
    if (isLocale(base) && enabled.includes(base)) return base;
  }
  return null;
}

export const LOCALE_COOKIE = "NEXT_LOCALE";
