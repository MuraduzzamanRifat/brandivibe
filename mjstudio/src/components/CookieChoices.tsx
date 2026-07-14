"use client";

/**
 * Footer link that re-opens the consent bar. A consent choice you can't change
 * later isn't really a choice — this is the way back.
 */
export function CookieChoices() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("bv:open-consent"))}
      className="hover:text-foreground"
    >
      Cookie choices
    </button>
  );
}
