import Script from "next/script";
import { ConsentBanner } from "./ConsentBanner";

/**
 * Google Analytics 4 with Consent Mode v2.
 *
 * Loaded `afterInteractive` so the tag never blocks first paint — measurement
 * shouldn't cost the hero its LCP.
 *
 * CONSENT: the `gtag('consent','default',…)` calls MUST reach the dataLayer
 * before `gtag('config',…)`, or GA will have already set `_ga` by the time the
 * visitor is asked. That ordering is only guaranteed if they share one inline
 * script — hence the defaults live here rather than in the banner component.
 *
 *   - EEA + UK  -> analytics denied until the visitor actively accepts.
 *   - Elsewhere -> granted by default (lawful there), and the banner still
 *                  offers a one-click opt-out.
 *
 * A previous choice is replayed from localStorage on load, so returning
 * visitors are never asked twice.
 *
 * The ID reads from NEXT_PUBLIC_GA_ID when set, so a preview deploy can point
 * elsewhere — or switch analytics off entirely — with no code change.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-L7JTQ14C4Y";

// EEA member states + UK. Consent Mode matches these against Google's own
// geo lookup, so we never have to IP-locate the visitor ourselves (which would
// force every page to render dynamically).
const CONSENT_REQUIRED_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IS", "IE", "IT", "LV", "LI", "LT", "LU", "MT", "NL", "NO", "PL",
  "PT", "RO", "SK", "SI", "ES", "SE", "GB",
];

export function Analytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}

          // Region-specific default first — it wins over the global one below.
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            region: ${JSON.stringify(CONSENT_REQUIRED_REGIONS)},
            wait_for_update: 500
          });
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'granted'
          });

          // Replay a returning visitor's saved choice before anything is measured.
          try {
            var c = localStorage.getItem('bv-consent');
            if (c === 'granted' || c === 'denied') {
              gtag('consent', 'update', { analytics_storage: c });
            }
          } catch (e) {}

          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
      <ConsentBanner />
    </>
  );
}
