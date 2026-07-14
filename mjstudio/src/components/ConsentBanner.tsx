"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";

/**
 * Cookie-consent bar for Google Analytics.
 *
 * Consent Mode v2 denies analytics_storage in the EEA/UK until the visitor
 * accepts (see Analytics.tsx), so GA is genuinely held back — this bar is what
 * collects that decision, not a decorative notice.
 *
 * Whether to show it depends on localStorage, which doesn't exist on the
 * server. Reading it via useSyncExternalStore (rather than setState in an
 * effect) gives React an explicit server snapshot — so the markup hydrates
 * cleanly instead of flashing a banner the server never rendered.
 *
 * The choice persists under `bv-consent`, so it's asked once. A visitor can
 * change their mind through the footer's "Cookie choices" button, which fires
 * the `bv:open-consent` event this listens for.
 */
const KEY = "bv-consent";

type Choice = "granted" | "denied";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Reopening is transient UI state — it isn't persisted, so it lives here rather
// than in storage.
let forcedOpen = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const reopen = () => {
    forcedOpen = true;
    emit();
  };
  window.addEventListener("bv:open-consent", reopen);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("bv:open-consent", reopen);
  };
}

function shouldAsk(): boolean {
  if (forcedOpen) return true;
  try {
    return !localStorage.getItem(KEY);
  } catch {
    // Storage blocked (private mode / strict settings). Ask anyway — the choice
    // just won't persist, which is the privacy-safe way to fail.
    return true;
  }
}

// The server can't know; render nothing there and let the client decide.
const neverOnServer = () => false;

export function ConsentBanner() {
  const open = useSyncExternalStore(subscribe, shouldAsk, neverOnServer);
  const acceptRef = useRef<HTMLButtonElement>(null);

  // Move focus to the primary action so keyboard users land inside the bar.
  useEffect(() => {
    if (open) acceptRef.current?.focus();
  }, [open]);

  const decide = useCallback((choice: Choice) => {
    try {
      localStorage.setItem(KEY, choice);
    } catch {
      /* not persistable — the consent update below still applies to this visit */
    }
    window.gtag?.("consent", "update", { analytics_storage: choice });
    forcedOpen = false;
    emit();
  }, []);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      className="fixed inset-x-0 bottom-0 z-[90] px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto flex max-w-[900px] flex-col gap-4 rounded-2xl border border-border bg-surface p-5 shadow-lg sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        <div className="flex-1">
          <p id="consent-title" className="font-display text-lg font-semibold tracking-tight">
            A quick word about cookies.
          </p>
          <p className="mt-1.5 text-[0.95rem] leading-relaxed text-foreground/70">
            We&apos;d like to use Google Analytics to see which pages are actually useful. It
            sets one cookie and tells us nothing personal about you. Say no and the site works
            exactly the same &mdash; we&apos;d rather ask than assume. Details in our{" "}
            <Link
              href="/privacy-policy"
              className="font-medium text-primary-strong underline underline-offset-4 hover:text-primary-deep"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2.5">
          <button
            ref={acceptRef}
            type="button"
            onClick={() => decide("granted")}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary-strong px-5 py-2.5 font-medium text-white transition-colors hover:bg-primary-deep"
          >
            That&apos;s fine
          </button>
          <button
            type="button"
            onClick={() => decide("denied")}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-border-strong bg-surface px-5 py-2.5 font-medium text-foreground transition-colors hover:border-foreground/30"
          >
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
}
