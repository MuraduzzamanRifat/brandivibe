# Agency Platform — CRM, Client Portal, Email Marketing & ERP

**Branch:** `feat/agency-platform`
**Status:** code-complete, type-checked (`tsc` exit 0), **not yet deployed** — it needs one database migration before it can go to production.

This document is the runbook to ship it. Follow it in order. Nothing here fabricates data or touches the live marketing site's behaviour until the final merge.

---

## What this branch adds

Four systems, built on one login (a single `users` collection with `admin` / `editor` / `client` roles), **22 new Payload collections**:

| System | Collections | What it does |
| --- | --- | --- |
| **CRM** | `contacts`, `deals`, `activities` | Contact records, a weighted deal pipeline, and a call/email/meeting/task log. Staff-only. |
| **Client Portal** | `projects`, `milestones`, `project-tasks`, `project-files`, `invoices`, `project-messages`, `approvals` | Clients log in at `/portal`, see only their own company's projects, and track progress %, a milestone timeline, tasks, downloadable files, invoices (with pay links), a message thread, and sign-off approvals — all in real time. |
| **Email Marketing** | `subscribers`, `email-lists`, `email-templates`, `email-campaigns`, `email-events` | Lists, templates with `{{name}}`/`{{email}}` merge, campaigns sent via Resend, and open/click/unsubscribe tracking with HMAC-signed pixels — a better version of crm.mjrifat.com. |
| **ERP** | `rate-card`, `estimates`, `sows`, `change-orders`, `expenses`, `retainers`, `time-entries` | The agency operating layer — quote → SOW → deliver → measure. Staff-only. See the ERP section below. |

**Access model** (`src/access/roles.ts`): ownership is enforced at the query layer with Payload `Where` filters (`{ client: { equals: cid } }`), not booleans — so a client physically cannot fetch another company's rows even by guessing IDs. Clients never reach the Payload `/admin` UI; they use `/portal`. The ERP is staff-only; the Rate Card is read-staff / **edit-admin** because loaded rates are sensitive.

---

## The ERP (Agency OS, made persistent)

Seven staff-only collections that operationalise agency discipline directly in the admin — the reasoning the "Agency OS" prompt describes, backed by real records instead of markdown files:

| Collection | Group | The discipline it enforces |
| --- | --- | --- |
| **Rate Card** | ERP | Fully-loaded cost per role. `loadedRate` is **computed** from `annualCost ÷ annualBillableHours`, and billable hours are **hard-capped at 1,600** — you cannot manufacture a cheap rate by dividing by 2,080 (the ~40% costing error every agency makes). |
| **Estimates** (`/price`) | ERP | Line-item effort → internal cost → **floor price** (lowest price hitting target margin) → actual margin. `marginStatus` shouts `BELOW FLOOR` / `LOSS` when the proposed price fails — the bad number leads. Three-option pattern via the `option` field (Reduced / Recommended / Expanded — differ in scope, never discount). |
| **SOWs** (`/sow`) | ERP | Deliverables each with qty, format, definition-of-done and a **revision count** (blank ≠ unlimited). `exclusions` is a required, load-bearing field. |
| **Change Orders** (`/creep`) | ERP | Every out-of-scope ask logged, classified in / ambiguous / out, priced (delta hours + price). "Absorbed" is an explicit decision with a required reason — never a silent default. |
| **Expenses** | ERP | Non-labour project costs; `billable` + `rebilled` flags stop pass-throughs being billed twice or missed. |
| **Retainers** | ERP | Recurring monthly engagements with explicit `includedHours` so overage is visible, not absorbed. |
| **Time Entries** | ERP | Logged hours valued at the role's loaded rate (auto-pulled from the Rate Card) → real project cost = the "actual" side of margin. |

**Profitability (planned vs actual)** is intentionally *not* a live computed field yet — cross-collection aggregation is a reporting concern, and a half-working margin number is worse than none. The data to compute it is all captured: **planned** = `estimates.internalCost`; **actual** = Σ `time-entries.cost` + Σ `expenses.amount` for the project. Building that report (an admin view or a `/erp/profitability` route) is the clean next step once the DB is live — see "After the DB is restored" below.

**Suggested order of use:** Rate Card → Estimate (quote) → SOW (scope) → deliver, logging Time Entries + Expenses → Change Orders as scope shifts → read planned-vs-actual at close.

---

## Why it can't just be merged

Payload only auto-pushes schema to Postgres **in development**. A production `next build` runs no schema push — it only *queries*. So if this merges to `main` as-is, every portal/CRM/email query hits a table that doesn't exist and 500s.

The fix is a committed migration that creates the tables, plus a deploy step that runs it. The config on this branch is already wired for that:

- `src/payload.config.ts` — `push: process.env.NODE_ENV !== 'production'` (dev pushes, prod never does) and `migrationDir: .../migrations`.
- `scripts/migrate.mjs` + npm scripts `migrate:create` / `migrate` / `migrate:status` — cross-platform, and they swap `DATABASE_URI` → `DATABASE_URI_MIGRATION` (the Neon **direct**, non-pooled host) for the migration run.
- `secret:` now throws if `PAYLOAD_SECRET` is unset in production instead of signing tokens with `''`.

---

## Database: Supabase (as of this build)

The platform now runs on a **Supabase** Postgres project (fresh start — the old Neon DB was left behind), and **the schema is already created there.**

- **Project:** `jjasdpvycpeszxbnxuoz`, region **ap-northeast-1** (Tokyo).
- **Connection — use the Session pooler, not the direct host or the Transaction pooler.**
  - The **direct** host `db.<ref>.supabase.co` is **IPv6-only** on the free tier → `ENOTFOUND` from most machines and from Vercel. Don't use it.
  - The **Transaction pooler** (`:6543`) does **not** support prepared statements → Payload/drizzle breaks. Don't use it.
  - The **Session pooler** (`:5432`) is IPv4 and prepared-statement-safe. This is the one:
    `postgresql://postgres.<ref>:<PASSWORD>@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres`
  - **URL-encode the password** — `$`→`%24`, `%`→`%25`, etc. — or the driver misreads it.
- **SSL:** `src/payload.config.ts` sets `pool.ssl = { rejectUnauthorized: false }` because Supabase's pooler presents a cert chain Node doesn't trust (`SELF_SIGNED_CERT_IN_CHAIN`). SSL is still on; the chain just isn't verified. Applies to dev push and prod.
- **Schema creation:** done via **dev push** — booting `next dev` with `push:true` (dev only) created all **100 tables** (37 collections + their `_rels` join tables) directly in Supabase. Verified. So the database is ready; you do **not** need to run a migration to launch.

### Node 24 note (why the migrate CLI wasn't used)

`npm run migrate:create` fails on **Node 24** with `ERR_REQUIRE_ASYNC_MODULE` (Payload's CLI uses `tsx`'s `require()`, which can't load the Lexical editor's top-level `await`). The dev push sidesteps this entirely (Next's bundler loads the config, not `tsx`). For a proper committed migration later, run the CLI on **Node 20 or 22** (`nvm use 20`), or generate it in CI. Not needed for the initial launch since the tables already exist.

---

## Go to production on Supabase

The code is ready and the tables exist. Two things left, both in the Vercel dashboard:

1. **Point Vercel at Supabase.** Project → Settings → Environment Variables (Production + Preview):
   - `DATABASE_URI` = the **Session pooler** string above (URL-encoded password).
   - `DATABASE_URI_MIGRATION` = same string (only used if you later run migrations).
   - Confirm `PAYLOAD_SECRET` is set. `BLOB_READ_WRITE_TOKEN` too if you want uploads on Vercel Blob (else uploads fall back to local disk, which won't persist on Vercel — set the token).
2. **Deploy the platform.** Merge `feat/agency-platform` → `main` and push; Vercel builds and deploys. Production has `push:false`, so it just *connects and queries* — and the tables are already there, so it works with **no migration step**.

```bash
git checkout main
git merge feat/agency-platform
git push        # Vercel deploys; ensure the env vars above are set FIRST
```

**Order matters:** set the Vercel `DATABASE_URI` to Supabase *before* the deploy. If you deploy the platform while Vercel still points at the old (empty-of-these-tables) DB, `/admin` and `/portal` 500.

After deploy, verify: open `/admin`, create the first admin, add a test client user + project, then open `/portal` in a private window as that client and confirm they see only their own project.

### Local dev (already working)

`npm run dev` → `http://localhost:3000/admin`. First visit routes to **create-first-user**; make your admin account and the CRM / Client Portal / Email Marketing / ERP groups appear in the sidebar.

### Future schema changes

When you add or change a collection, dev push keeps local in sync automatically. For prod, generate a migration on Node 20/22 (`npm run migrate:create`), commit `src/migrations/`, and set the Vercel build command to `npm run migrate && next build` so it applies on deploy.

---

## First-run setup inside the admin

1. **Create a client company** — `Clients` collection (already existed).
2. **Create the client's login** — `Users`: set role = `client`, link the `client` relationship to that company, set a password. They now sign in at `/portal`.
3. **Create a project** — `Projects`: set the `client`, add milestones, tasks (mark `clientVisible`), upload files (untick `clientVisible` to keep a file internal), add invoices.
4. Progress % is derived automatically from client-visible tasks (done ÷ total) unless you set `completionPercent` manually.

---

## Email sending

- Set `RESEND_API_KEY` in env. **Without it, `sendCampaign` runs in DRY-RUN** (renders + logs, sends nothing) — safe for testing.
- Verify your sending domain in Resend and set `fromEmail` on each campaign to a verified address.
- Trigger a send: `POST /e/send` with `{ "campaignId": "..." }` (staff session required). It resolves subscribed recipients across the campaign's lists (deduped), renders per-recipient with tracking, and batches to Resend (50/req).
- Tracking routes are live under `/e/`: `open` (1×1 pixel), `click` (validated redirect), `unsubscribe` (token-based confirmation page).

---

## Rollback

If a deploy misbehaves: revert the merge commit on `main` and redeploy — the marketing site is unaffected because none of it imports the new collections. The tables can stay; they're only read by portal/CRM/email routes. To fully undo, write a down-migration that drops the 15 tables and their `_rels`.
