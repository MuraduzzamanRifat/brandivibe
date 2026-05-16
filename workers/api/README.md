# Brandivibe API + CRM Worker

brandivibe.com is a static GitHub Pages site (no server). This one
Cloudflare Worker restores everything dynamic:

| Path | What |
|---|---|
| `POST /api/contact` | Contact form → emails you via Resend. **Fully working.** |
| `POST /api/audit/run` | Audit form → captures the lead + notifies you. |
| `GET /crm` | **Operator CRM app** — password-gated, served entirely by the Worker (never on the public static site). |
| `/api/crm/*` | CRM JSON API (auth-gated): contacts CRUD, templates, send, email history. |

## The CRM

A full single-operator CRM, **better than crm.mjrifat.com** because it
shares one datastore with the AI brain:

- **Contacts** — list, search, status filter, add, edit (status / notes /
  tags), delete. Auto-includes prospects the brain syncs in.
- **Compose & send** — pick a template or write freeform, send via Resend,
  logged as a `CrmEmail`, contact auto-moves `new → contacted`.
- **Templates** — create / edit / delete (cold, followup, loom, breakup,
  audit, custom).
- **Email history** per contact, **sent counts**, **follow-up** via the
  status pipeline.

**Datastore = the same `mjstudio/data/brain.json` the brain uses**, via the
GitHub Contents API. Every write is GET(sha)→mutate→PUT(sha) with a
409-retry, so the brain (GitHub Actions) and the CRM never overwrite each
other. CRM changes show up in the read-only `/dashboard` and feed the
brain's outreach engine (sender pool, sequences, tracking).

## Deploy (one-time, ~4 min)

```bash
npm install -g wrangler
cd workers/api
wrangler login

# required
wrangler secret put RESEND_API_KEY        # Resend key
wrangler secret put BRAIN_GH_PAT          # GitHub PAT (this repo, Contents: R/W)
wrangler secret put CRM_PASSWORD          # pick your CRM login password
wrangler secret put CRM_SESSION_SECRET    # paste a long random string
# optional
wrangler secret put NOTIFICATION_EMAIL    # default mjrifat54@gmail.com
wrangler secret put RESEND_FROM_EMAIL     # default hello@send.brandivibe.site

wrangler deploy
```

Generate a session secret:
`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

`wrangler.toml` already pins the routes `brandivibe.com/api/*` and
`brandivibe.com/crm*` — the moment `wrangler deploy` finishes:

- the contact form sends, and
- **the CRM is live at `https://brandivibe.com/crm`** (log in with
  `CRM_PASSWORD`).

### Dashboard option (no CLI)

Cloudflare dashboard → Workers & Pages → Create Worker `brandivibe-api` →
paste `worker.js` → Settings → Variables: add the four required secrets →
Settings → Domains & Routes: add `brandivibe.com/api/*` **and**
`brandivibe.com/crm*`.

## Test

```bash
curl -X POST https://brandivibe.com/api/contact -H 'Content-Type: application/json' \
  -d '{"name":"Test","email":"you@example.com","company":"Acme","message":"hi"}'
# → {"ok":true}

open https://brandivibe.com/crm     # log in, add a contact, send a test email
```

## Notes

- The CRM is **operator-only**: HMAC-signed httpOnly session cookie,
  12-hour expiry, `CRM_PASSWORD` gate. Data is fetched only after auth —
  no lead data is ever in static HTML.
- `BRAIN_GH_PAT` here is a **Cloudflare** secret (separate from the GitHub
  Actions secret of the same purpose). Same kind of PAT, set in both
  places.
- `RESEND_FROM_EMAIL` must be a Resend-verified sender;
  `send.brandivibe.site` already is.
- Secrets live in Cloudflare only — never committed.
