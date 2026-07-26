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

## Prerequisites (owner, one-time)

1. **Restore the real `DATABASE_URI`** in local `.env` (copy from Vercel → Settings → Environment Variables). The value currently in `.env` is a placeholder and every DB command below will fail with `password authentication failed` until it's real.
2. **Set `DATABASE_URI_MIGRATION`** to the Neon **direct** connection string (the host *without* `-pooler`). Neon dashboard → Connection Details → untick "Pooled connection".
3. Confirm `PAYLOAD_SECRET` and `BLOB_READ_WRITE_TOKEN` are set in Vercel (Production + Preview).
4. (Recommended, unrelated to this branch but overdue) rotate `PAYLOAD_SECRET` and the Neon password, since they were previously exposed.

---

## Ship it (in order)

```bash
git checkout feat/agency-platform

# 0. This branch predates the audit/SEO/analytics/consent work now on main.
#    Merge main in first so the platform ships WITH those fixes, not without them.
#    Expect a small conflict in payload.config.ts (this branch adds the migration
#    config + collections; keep both) — resolve by keeping this branch's db block
#    and collection list, plus main's analytics.
git merge main
npx tsc --noEmit   # confirm the merge is clean

# 1. Sanity: types must be clean (already run above)

# 2. Generate the migration that creates all 22 tables + their _rels join tables.
#    Runs against the DIRECT connection via the wrapper. Review the SQL it writes
#    under src/migrations/ before committing — it should be all CREATE TABLE, no DROP.
npm run migrate:create

git add src/migrations
git commit -m "feat(platform): initial migration for CRM/portal/email/ERP tables"

# 3. Apply it to the database you're about to deploy against (staging or prod).
npm run migrate
npm run migrate:status   # should show the migration as run

# 4. Add the deploy-time migration step so future schema changes ship automatically.
#    In Vercel → Settings → Build & Development → Build Command:
#        npm run migrate && next build
#    (or keep `next build` and run `npm run migrate` from a Vercel deploy hook.)

# 5. Merge and deploy.
git checkout main
git merge feat/agency-platform
git push
```

After deploy, verify: sign in at `/admin` as an admin, create a test client user + project, then open `/portal` in a private window as that client and confirm they see only their project.

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
