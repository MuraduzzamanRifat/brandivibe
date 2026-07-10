"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import {
  LOCALE_COOKIE,
  getLocale,
  isLocale,
  localizedPath,
  splitLocale,
  type LocaleCode,
} from "@/lib/i18n/config";
import { useLocale } from "./LocaleProvider";

const DISMISS_KEY = "bv-lang-suggestion-dismissed";

/**
 * Offers the visitor their browser's language — it never redirects them.
 *
 * Auto-redirecting on Accept-Language is the classic international-SEO
 * mistake: Googlebot crawls from US IPs as en-US, so a redirect means the
 * Spanish and Japanese versions are never discovered. Serving the requested
 * URL and *suggesting* the alternative keeps every locale crawlable, can't
 * create a redirect loop, and lets a Spanish speaker read the English page if
 * that's what they came for.
 *
 * The visitor's explicit choice (this banner, or the switcher) writes the
 * NEXT_LOCALE cookie and always wins over detection.
 */
export function LanguageSuggestion() {
  const { locale: currentLocale, enabledLocales } = useLocale();
  const pathname = usePathname();
  const [suggested, setSuggested] = useState<LocaleCode | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(DISMISS_KEY) === "1") return;
    // An explicit past choice outranks browser detection.
    if (document.cookie.includes(`${LOCALE_COOKIE}=`)) return;

    for (const raw of navigator.languages ?? [navigator.language]) {
      const tag = raw.toLowerCase();
      const candidate = tag.startsWith("zh")
        ? (/hant|tw|hk|mo/.test(tag) ? "zh-tw" : "zh-cn")
        : tag.split("-")[0];
      if (isLocale(candidate) && enabledLocales.includes(candidate) && candidate !== currentLocale) {
        setSuggested(candidate);
        return;
      }
    }
  }, [currentLocale, enabledLocales]);

  if (!suggested) return null;

  const target = getLocale(suggested);
  const { path } = splitLocale(pathname || "/");

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setSuggested(null);
  }

  function choose() {
    // One year, root path — the choice follows them across the site.
    document.cookie = `${LOCALE_COOKIE}=${suggested}; path=/; max-age=31536000; samesite=lax`;
  }

  return (
    <div
      role="region"
      aria-label="Language suggestion"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-[560px] rounded-2xl border border-border bg-surface p-4 shadow-[0_18px_40px_-18px_rgba(42,35,31,0.35)] sm:inset-x-auto sm:right-5 sm:bottom-5"
    >
      <div className="flex items-center gap-3">
        <p className="flex-1 text-sm text-foreground/80" lang={target.hreflang}>
          This page is also available in{" "}
          <span className="font-medium text-foreground">{target.label}</span>.
        </p>
        <Link
          href={localizedPath(path, suggested)}
          onClick={choose}
          hrefLang={target.hreflang}
          className="shrink-0 rounded-full bg-primary-strong px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-deep"
        >
          {target.label}
        </Link>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss language suggestion"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted hover:bg-[rgba(42,35,31,0.06)] hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
