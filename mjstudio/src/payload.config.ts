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
// CRM
import { Contacts } from './collections/crm/Contacts'
import { Deals } from './collections/crm/Deals'
import { Activities } from './collections/crm/Activities'
// Client Portal
import { Projects } from './collections/portal/Projects'
import { Milestones } from './collections/portal/Milestones'
import { ProjectTasks } from './collections/portal/ProjectTasks'
import { ProjectFiles } from './collections/portal/ProjectFiles'
import { Invoices } from './collections/portal/Invoices'
import { ProjectMessages } from './collections/portal/ProjectMessages'
import { Approvals } from './collections/portal/Approvals'
// Email Marketing
import { Subscribers } from './collections/email/Subscribers'
import { EmailLists } from './collections/email/EmailLists'
import { EmailTemplates } from './collections/email/EmailTemplates'
import { EmailCampaigns } from './collections/email/EmailCampaigns'
import { EmailEvents } from './collections/email/EmailEvents'
// ERP
import { RateCard } from './collections/erp/RateCard'
import { Estimates } from './collections/erp/Estimates'
import { SOWs } from './collections/erp/SOWs'
import { ChangeOrders } from './collections/erp/ChangeOrders'
import { Expenses } from './collections/erp/Expenses'
import { Retainers } from './collections/erp/Retainers'
import { TimeEntries } from './collections/erp/TimeEntries'
// Globals
import { Homepage } from './globals/Homepage'
import { BrandGuidelines } from './globals/BrandGuidelines'

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
    // CRM
    Contacts,
    Deals,
    Activities,
    // Client Portal
    Projects,
    Milestones,
    ProjectTasks,
    ProjectFiles,
    Invoices,
    ProjectMessages,
    Approvals,
    // Email Marketing
    Subscribers,
    EmailLists,
    EmailTemplates,
    EmailCampaigns,
    EmailEvents,
    // ERP
    RateCard,
    Estimates,
    SOWs,
    ChangeOrders,
    Expenses,
    Retainers,
    TimeEntries,
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
    // Persistent upload storage on Vercel Blob (files survive deployments).
    // BOTH upload collections must be listed — `media` (marketing) AND
    // `project-files` (client deliverables). Without project-files here, portal
    // uploads write to the serverless read-only/ephemeral FS and vanish on the
    // next deploy. Falls back to local-disk storage in dev when no token is set.
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            collections: { media: true, 'project-files': true },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
  editor: lexicalEditor(),
  // Never boot with an empty JWT secret in production — that silently signs
  // every auth token with '' and makes sessions forgeable. Fail loudly instead.
  secret: (() => {
    const s = process.env.PAYLOAD_SECRET
    if (!s && process.env.NODE_ENV === 'production') {
      throw new Error('PAYLOAD_SECRET is required in production.')
    }
    return s || ''
  })(),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    // Runtime queries go through Supabase's Session pooler (DATABASE_URI) — IPv4
    // and prepared-statement-safe (the Transaction pooler on :6543 is NOT).
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      // Supabase's pooler presents a cert chain Node doesn't trust out of the
      // box (SELF_SIGNED_CERT_IN_CHAIN). SSL stays ON — we just don't verify the
      // chain, which is the standard managed-Postgres setup and applies to both
      // the dev schema push and prod runtime.
      ssl: { rejectUnauthorized: false },
    },
    migrationDir: path.resolve(dirname, 'migrations'),
    // Auto-push schema ONLY in dev. In production the build runs no push, so
    // the tables must be created by committed migrations (see runbook at
    // docs/agency-platform-migration.md).
    push: process.env.NODE_ENV !== 'production',
  }),
  sharp,
})
