"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_LOCALE, type LocaleCode } from "@/lib/i18n/config";

type LocaleContextValue = {
  locale: LocaleCode;
  enabledLocales: LocaleCode[];
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  enabledLocales: [DEFAULT_LOCALE],
});

/**
 * Carries the active locale and the enabled set from the server layout down to
 * client chrome (the nav switcher, the suggestion banner).
 *
 * Without this, every page would have to thread `lang` and `enabledLocales`
 * into <WarmNav /> by hand — fifteen call sites that would silently rot the
 * first time someone added a page.
 */
export function LocaleProvider({
  locale,
  enabledLocales,
  children,
}: LocaleContextValue & { children: ReactNode }) {
  return (
    <LocaleContext.Provider value={{ locale, enabledLocales }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}
