# GitHub-only migration (Koyeb → GitHub Pages + Actions)

Goal: kill the Koyeb dependency entirely. Static site on GitHub Pages, all
brain logic in GitHub Actions, state in `brain.json` on GitHub.

## Stage A — Static build infrastructure ✅ (this commit)

- `next.config.ts` now supports dual-mode: default Koyeb build + static
  export build via `NEXT_BUILD_TARGET=static`.
- `/journal/[slug]` and `/audit/[slug]` get `generateStaticParams` so the
  build pre-renders one HTML file per article + per prospect.
- All `force-dynamic` exports on user-facing pages flipped to `force-static`
  (journal index, audit pages, uturn checkout/product/success).
- New workflow `.github/workflows/deploy-static.yml`:
  - Triggers on main pushes that touch `mjstudio/src/**`,
    `mjstudio/data/brain.json`, etc.
  - Deletes `src/app/api`, `src/app/dashboard`, `src/app/feed.xml` (these
    can't coexist with output: "export").
  - Builds with `NEXT_BUILD_TARGET=static` and deploys `out/` to Pages.
- `public/CNAME` set to `brandivibe.com` so the custom domain stays.

**Validation step** after this commit lands: enable GitHub Pages in repo
settings, confirm a build runs and the preview URL renders the site
correctly. The Koyeb build is untouched and still serves production.

## Stage B — Brain logic out of API routes

Each currently-hit endpoint moves into a standalone Node script that runs
inside GitHub Actions. The shape of the change:

  Before:
    POST /api/brain/source-pulse  ← workflow `curl`s this
    (Koyeb serves the route, which calls into lib/brain/source-tick.ts)

  After:
    .github/scripts/source-pulse.ts  ← workflow runs `npx tsx` directly
    (script imports the same lib/brain code, reads/writes brain.json via
     GitHub API)

Concrete migration list:

| Cron | Current API route | New script |
|---|---|---|
| brain-daily | `/api/brain/run-daily` | `.github/scripts/run-daily.ts` |
| brain-hourly | `/api/brain/tick-hourly` | `.github/scripts/tick-hourly.ts` |
| brain-source-pulse | `/api/brain/source-pulse` | `.github/scripts/source-pulse.ts` |
| brain-twitter-intent | `/api/brain/twitter-intent` | `.github/scripts/twitter-intent.ts` |
| brain-linkedin-draft | `/api/brain/linkedin-draft` | `.github/scripts/linkedin-draft.ts` |
| brain-learning-digest | `/api/brain/learning/digest` | `.github/scripts/learning-digest.ts` |
| brain-daily-digest-email | `/api/brain/daily-digest-email` | `.github/scripts/daily-digest-email.ts` |
| brain-health | `/api/brain/health` | `.github/scripts/health-check.ts` |
| brain-backfill | `/api/brain/backfill` | `.github/scripts/backfill-articles.ts` |

All scripts share a tiny harness:
  1. `await loadBrainFromGithub()` — pulls `brain.json` via Octokit
  2. Run the brain function
  3. `await saveBrainToGithub(brain)` — commits + pushes
  4. Logs to GitHub Actions output (replaces dashboard activity feed)

Secrets needed in GitHub Actions environment:
  - `OPENAI_API_KEY`, `RESEND_API_KEY`, `BRAVE_SEARCH_API_KEY`
  - `PEXELS_API_KEY`
  - `BRAIN_CRON_SECRET` (no longer needed for HMAC validation since
    workflows authenticate via repo permissions, but keep for legacy
    activity log compatibility)

## Stage C — Decommission

After Stage B is verified working for ≥ 1 week:

1. **Delete Koyeb-only code**:
   - `mjstudio/src/app/api/**`
   - `mjstudio/src/app/dashboard/**`
   - Webhook handlers (`/api/brain/webhook/*`, `/api/blast/webhook`)
   - `/api/brain/book` redirect — replace email links with direct Cal.com URLs
   - The static build workflow can stop deleting these and just always build
2. **Delete Koyeb-only workflows** that hit endpoints (the brain-X.yml
   files become obsolete once Stage B replaces them).
3. **Switch DNS**: in domain registrar, update A/AAAA records from Koyeb
   IP to GitHub Pages IPs (185.199.108.153, 185.199.109.153, 185.199.110.153,
   185.199.111.153). Or switch the CNAME to `<user>.github.io`.
4. **Decommission Koyeb** in the Koyeb dashboard.

## Things you lose

- **Dashboard at `/dashboard`** — was server-rendered React with live state.
  Replacement: read `brain.json` directly on GitHub, or build a static
  read-only `/dashboard.html` from a script.
- **`/audit` form submission** — was POST to `/api/audit/run`. Replace
  the form with a Cal.com booking link or a Tally.so/Typeform embed.
- **Resend webhooks** — open/click/bounce events stored via webhook.
  Replacement: rely on Resend dashboard for those metrics, OR run an
  hourly script that pulls Resend's recent events API and updates
  brain.json.
- **`/api/brain/book` click tracking** — the redirect endpoint that logged
  booking-intent clicks. Replace with a Cal.com link directly. You lose
  the per-prospect "they clicked the booking link" signal but Cal.com
  will tell you who actually booked.

## Decision points still open

- Where do per-prospect audit pages get rebuilt? Each new prospect requires
  a static rebuild + redeploy (~3 min). Acceptable since the brain only
  produces ~10-20 new prospects per day.
- Should webhook reply detection be replaced with Resend's polling API
  or just abandoned (you read replies in your inbox anyway)?
