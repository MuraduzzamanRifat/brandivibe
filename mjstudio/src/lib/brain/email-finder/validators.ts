/**
 * Free, no-API validators. Each returns a boolean or a cost-free signal
 * the scorer combines into a confidence number.
 *
 * - Syntax check (RFC-ish)
 * - Disposable domain blacklist
 * - MX record lookup via Node dns/promises
 * - Known catch-all provider detection (Google Workspace, Outlook, etc.)
 *
 * NOT included (intentionally):
 * - SMTP RCPT TO check — Koyeb blocks outbound port 25 so we can't do this
 *   from the server. Would need a sidecar VPS. Deferred.
 */

import { promises as dns } from "dns";

// A small sample of disposable email domains. Enough to catch the common
// burner signups; not meant to be exhaustive.
const DISPOSABLE = new Set([
  "mailinator.com",
  "10minutemail.com",
  "tempmail.com",
  "guerrillamail.com",
  "throwaway.email",
  "trashmail.com",
  "yopmail.com",
  "temp-mail.org",
  "mohmal.com",
  "fakeinbox.com",
]);

// Providers known to accept mail at any address (catch-alls). SMTP verify
// against these always returns "valid" so we can't prove a specific local
// part — we can only send our best guess and accept bounce risk.
const CATCH_ALL_PROVIDERS = new Set([
  "google.com",
  "googlemail.com",
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "microsoft.com",
  "office365.com",
  "protonmail.ch",
  "proton.me",
  "fastmail.com",
  "zoho.com",
]);

export function isValidSyntax(email: string): boolean {
  return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email);
}

export function isDisposable(email: string): boolean {
  const d = email.split("@")[1]?.toLowerCase();
  return d ? DISPOSABLE.has(d) : false;
}

export async function hasMxRecords(domain: string): Promise<boolean> {
  try {
    const mx = await dns.resolveMx(domain);
    return mx.length > 0;
  } catch {
    return false;
  }
}

/**
 * Detects whether the domain's MX provider is a known catch-all (Google
 * Workspace, Outlook, etc). If it is, SMTP verification can't prove the
 * local part exists, so confidence caps at ~60.
 */
export async function detectCatchAllProvider(domain: string): Promise<boolean> {
  try {
    const mx = await dns.resolveMx(domain);
    for (const record of mx) {
      const exchange = record.exchange.toLowerCase();
      for (const provider of CATCH_ALL_PROVIDERS) {
        if (exchange.includes(provider) || exchange.endsWith(provider)) {
          return true;
        }
      }
      if (/\.google\.com$|googlemail\.l\.google\.com$/i.test(exchange)) return true;
      if (/protection\.outlook\.com$|mail\.protection\.outlook\.com$/i.test(exchange)) return true;
    }
    return false;
  } catch {
    return false;
  }
}
