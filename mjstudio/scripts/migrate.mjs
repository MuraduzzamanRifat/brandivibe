#!/usr/bin/env node
/**
 * Cross-platform migration runner.
 *
 * Payload's Postgres migrations must run against a DIRECT (non-pooled) Neon
 * connection, but the app runs against the pooled one. Rather than fight
 * per-OS env-var expansion in npm scripts, this wrapper swaps DATABASE_URI to
 * DATABASE_URI_MIGRATION (when set) and then delegates to the Payload CLI.
 *
 *   node scripts/migrate.mjs create   ->  payload migrate:create
 *   node scripts/migrate.mjs          ->  payload migrate            (run pending)
 *   node scripts/migrate.mjs status   ->  payload migrate:status
 */
import { spawnSync } from 'node:child_process'

if (process.env.DATABASE_URI_MIGRATION) {
  process.env.DATABASE_URI = process.env.DATABASE_URI_MIGRATION
}
process.env.NODE_OPTIONS = [process.env.NODE_OPTIONS, '--no-deprecation'].filter(Boolean).join(' ')

const [sub, ...rest] = process.argv.slice(2)
const command =
  sub === 'create' ? 'migrate:create' : sub === 'status' ? 'migrate:status' : sub ? `migrate:${sub}` : 'migrate'

const res = spawnSync('payload', [command, ...rest], { stdio: 'inherit', shell: true })
process.exit(res.status ?? 1)
