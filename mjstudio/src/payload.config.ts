import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
// Content
import { Services } from './collections/Services'
import { CaseStudies } from './collections/CaseStudies'
import { Articles } from './collections/Articles'
import { Categories } from './collections/Categories'
import { Tags } from './collections/Tags'
import { FAQs } from './collections/FAQs'
// Operations
import { Leads } from './collections/Leads'
// People & Clients
import { Authors } from './collections/Authors'
import { Team } from './collections/Team'
import { Clients } from './collections/Clients'
import { Testimonials } from './collections/Testimonials'
// Taxonomy
import { Industries } from './collections/Industries'
import { Technologies } from './collections/Technologies'
// Globals
import { Homepage } from './globals/Homepage'
import { BrandGuidelines } from './globals/BrandGuidelines'
// LanguageSettings + SUPPORTED_LOCALES are wired in with the localization
// migration (Phase 1a) — registering the global creates a table.

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * Brandivibe OS — Payload configuration.
 *
 * This is the backbone of the platform: auth, roles, content collections,
 * relationships, media, drafts/versions and the REST + GraphQL API all flow
 * from here. Phase 1 starts with Users + Media; the full content model
 * (services, case studies, articles, taxonomy, testimonials, etc.) is layered
 * on next.
 */
export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '· Brandivibe OS',
    },
  },
  /**
   * ─── Payload localization: intentionally NOT enabled yet ───────────────────
   *
   * Turning this on rewrites the Postgres schema — every collection with a
   * localized field gains a `<table>_locales` table, and the SEO plugin's meta
   * group moves into it. DATABASE_URI points at the live Neon database that
   * production is serving from, so this is a real migration, not a config flag.
   *
   * It ships as its own step (Phase 1a), in this order:
   *   1. snapshot / Neon branch the database
   *   2. enable the block below + register the LanguageSettings global
   *   3. add `localized: true` to the fields we actually translate,
   *      plus the per-locale `translationStatus` gate (fields/translationStatus.ts)
   *   4. push the schema, verify, then enable es/de/ja in the admin
   *
   * Until then the routing, hreflang, sitemap and language UX below are all
   * live and harmless: only English is enabled, so nothing new is indexed.
   *
   * localization: {
   *   locales: SUPPORTED_LOCALES.map((l) => ({
   *     label: `${l.label} (${l.englishName})`,
   *     code: l.code,
   *     ...(l.dir === 'rtl' ? { rtl: true } : {}),
   *   })),
   *   defaultLocale: DEFAULT_LOCALE,
   *   fallback: true,   // editors see English as a base; the frontend queries
   *                     // with fallbackLocale:'none' so it can spot an English echo
   * },
   */
  collections: [
    Users,
    Media,
    // Content
    Services,
    CaseStudies,
    Articles,
    Categories,
    Tags,
    FAQs,
    // Operations
    Leads,
    // People & Clients
    Authors,
    Team,
    Clients,
    Testimonials,
    // Taxonomy
    Industries,
    Technologies,
  ],
  globals: [Homepage, BrandGuidelines],
  plugins: [
    // Content Studio: SEO panel with Google-preview, character counters, and
    // one-click auto-generation of titles/descriptions.
    seoPlugin({
      collections: ['articles', 'case-studies', 'services'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => {
        const d = doc as { title?: string } | undefined
        return d?.title ? `${d.title} · Brandivibe` : 'Brandivibe'
      },
      generateDescription: ({ doc }) => {
        const d = doc as { excerpt?: string; summary?: string } | undefined
        return d?.excerpt || d?.summary || ''
      },
      generateURL: ({ doc, collectionSlug }) => {
        const d = doc as { slug?: string } | undefined
        const base = 'https://brandivibe.com'
        const path = collectionSlug === 'articles' ? 'journal' : collectionSlug
        return d?.slug ? `${base}/${path}/${d.slug}` : base
      },
    }),
    // Persistent media storage on Vercel Blob (uploads survive deployments).
    // Falls back to local-disk storage in dev when no token is present.
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            collections: { media: true },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
})
