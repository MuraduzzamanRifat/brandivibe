# Phase 1a — migration runbook

**Nothing here touches production.** Every step runs against a Neon *branch*.

## 0. Prerequisites

In the Neon console: `Branches → Create branch` from `main`, name it
`i18n-migration`. Copy its connection string into `.env` (gitignored):

```
DATABASE_URI_MIGRATION=postgresql://...
```

## 1. Why a branch and not production

Enabling Payload `localization` moves the SEO plugin's `meta_*` columns off
`services` / `articles` / `case_studies` into new `<table>_locales` tables.

The code **currently deployed** queries `services.meta_title`. The instant those
columns move, production's Payload queries fail — before the new code ships.
There is no push-then-deploy ordering that avoids the window, so we prove the
whole migration on a branch first and cut over deliberately.

## 2. What the migration does

| Change | Effect |
| --- | --- |
| `localization: { locales: 21, defaultLocale: 'en', fallback: true }` | creates `<table>_locales` for every collection with a localized field |
| `localized: true` on prose fields | those columns move into `*_locales` |
| `translationStatus` (localized select) | per-locale publish gate; Payload's `_status` is per-document and cannot express "Spanish live, German in review" |
| `Glossary` collection | new table; glossary leaves `data/glossary.ts` |
| `Industries.serviceFraming` | the 280 framings leave `data/industries.ts` |
| `LanguageSettings` global | new table; admin enable/disable of locales |

Deliberately **not** localized: `slug`, `order`, `icon`, `category`,
`relatedTerms`. They are structure, and hreflang pairs a page with its
translation *by slug* — a translated slug would break the pairing.

## 3. Order of operations

1. Point local `DATABASE_URI` at the branch.
2. Uncomment the `localization` block in `payload.config.ts`; register
   `LanguageSettings` and `Glossary`.
3. Start the dev server so Payload's Postgres adapter pushes the schema
   (`push: true` in dev). The standalone `payload` CLI is unusable here — Node 24
   + tsx throws `ERR_REQUIRE_ASYNC_MODULE` loading the config.
4. Seed English content from the static files (`seed-i18n-source.ts`):
   - 8 industries × (painPoints, examples, conversionFrame, industrySignal,
     industryFaqs) and **280 serviceFraming rows**
   - 12 glossary terms
   - every seeded doc gets `translationStatus: 'published'` **for `en` only**
5. Verify against a preview deploy pointed at the branch:
   - `/` and `/services/webgl-3d-experiences/saas` render identical copy to prod
   - `/es` still 404s (es not enabled — no translations exist yet)
   - admin shows the locale switcher and a `translationStatus` per locale
6. Only then: snapshot production, migrate, deploy in the same window.

## 4. Rollback

Delete the Neon branch. Production was never touched.

## 5. After this lands

Phase 1b translates the seeded English into es/de/ja — AI draft, human review,
`translationStatus: published` per locale — and only then are those locales
enabled in the admin. A locale is never enabled before its content is reviewed;
that is what keeps ~1,500 URLs from becoming duplicate-content mass.
