"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Check } from "lucide-react";
import {
  LOCALE_COOKIE,
  getLocale,
  localizedPath,
  splitLocale,
  type LocaleCode,
} from "@/lib/i18n/config";
import { useLocale } from "./LocaleProvider";

/**
 * Manual language switcher. Keeps the visitor on the same page, and records
 * the choice so detection never overrides it again.
 *
 * Each option carries hrefLang so crawlers can read the relationship straight
 * from the markup, and native names are used (never "Spanish" — "Español").
 */
export function LanguageSwitcher() {
  const { locale: currentLocale, enabledLocales } = useLocale();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { path } = splitLocale(pathname || "/");
  const current = getLocale(currentLocale);

  // Nothing to switch to — one language is not a choice.
  if (enabledLocales.length < 2) return null;

  function remember(code: LocaleCode) {
    document.cookie = `${LOCALE_COOKIE}=${code}; path=/; max-age=31536000; samesite=lax`;
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Change language. Current language: ${current.englishName}`}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-3 py-2 text-[0.9rem] text-foreground/75 transition-colors hover:bg-[rgba(42,35,31,0.05)] hover:text-foreground"
      >
        <Globe className="h-4 w-4" aria-hidden="true" />
        <span>{current.code.toUpperCase()}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 pt-2">
          <ul className="card-soft max-h-[60vh] w-[220px] overflow-y-auto p-2">
            {enabledLocales.map((code) => {
              const l = getLocale(code);
              const active = code === currentLocale;
              return (
                <li key={code}>
                  <Link
                    href={localizedPath(path, code)}
                    hrefLang={l.hreflang}
                    lang={l.hreflang}
                    onClick={() => remember(code)}
                    aria-current={active ? "true" : undefined}
                    className="flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-[0.95rem] text-foreground/80 transition-colors hover:bg-[rgba(42,35,31,0.05)] hover:text-foreground"
                  >
                    <span>
                      <span className="block font-medium">{l.label}</span>
                      <span className="block text-xs text-muted">{l.englishName}</span>
                    </span>
                    {active && <Check className="h-4 w-4 shrink-0 text-primary-strong" aria-hidden="true" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
