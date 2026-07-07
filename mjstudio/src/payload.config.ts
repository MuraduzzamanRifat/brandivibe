import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
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
    // People & Clients
    Authors,
    Team,
    Clients,
    Testimonials,
    // Taxonomy
    Industries,
    Technologies,
  ],
  globals: [Homepage],
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
