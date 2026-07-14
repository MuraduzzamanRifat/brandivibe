import Script from "next/script";

/**
 * Google Analytics 4.
 *
 * Loaded with `afterInteractive` so it never blocks first paint — the tag is
 * measurement, not content, and the homepage LCP shouldn't wait on it.
 *
 * The ID is read from NEXT_PUBLIC_GA_ID when present so staging/preview can be
 * pointed elsewhere (or switched off) without a code change. Nothing renders at
 * all when there's no ID, so a preview deploy doesn't pollute production stats.
 *
 * Note: GA4 sets first-party `_ga` cookies. The privacy policy documents this,
 * and visitors in the EU/UK legally need a consent choice before analytics
 * cookies are set — see docs/analytics.md.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-L7JTQ14C4Y";

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
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
