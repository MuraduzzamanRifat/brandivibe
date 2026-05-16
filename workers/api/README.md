# Brandivibe API Worker

Restores `brandivibe.com/api/contact` and `/api/audit/run` after the
Koyeb → GitHub Pages migration (static sites have no server).

## What it does

| Endpoint | Behaviour |
|---|---|
| `POST /api/contact` | Validates the contact form, emails the submission to the operator via Resend, `reply_to` = the visitor. Returns `{ok:true}`. **Fully working.** |
| `POST /api/audit/run` | Emails the audit request (URL + email) to the operator so no lead is lost, returns a friendly "we'll email your report" message. The full GPT instant-audit port is the next step. |

The static forms already POST to these exact paths — no frontend change.

## Deploy (one-time, ~3 min)

### Option A — Wrangler CLI (recommended)

```bash
npm install -g wrangler
cd workers/api
wrangler login                       # opens browser, authorises your CF account
wrangler secret put RESEND_API_KEY   # paste your Resend key when prompted
# optional:
wrangler secret put NOTIFICATION_EMAIL   # default mjrifat54@gmail.com
wrangler secret put RESEND_FROM_EMAIL    # default hello@send.brandivibe.site
wrangler deploy
```

`wrangler deploy` reads `wrangler.toml`, which already has the route
`brandivibe.com/api/*` — so as soon as it deploys, the live contact form
works. (The `brandivibe.com` zone must be on the same Cloudflare account.)

### Option B — Cloudflare dashboard (no CLI)

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Worker** →
   name it `brandivibe-api` → **Deploy**.
2. **Edit code** → paste the entire contents of `worker.js` → **Deploy**.
3. Worker → **Settings → Variables and Secrets** → add **Secret**
   `RESEND_API_KEY` = your Resend key. (Optionally `NOTIFICATION_EMAIL`,
   `RESEND_FROM_EMAIL`, `RESEND_REPLY_TO`.)
4. Worker → **Settings → Domains & Routes** → **Add route** →
   `brandivibe.com/api/*` → zone `brandivibe.com` → Save.

## Test

```bash
curl -X POST https://brandivibe.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"you@example.com","company":"Acme","message":"hello"}'
# → {"ok":true}  and an email lands in the operator inbox
```

Or just submit the form on `https://brandivibe.com/#contact`.

## Notes

- `RESEND_FROM_EMAIL` must be a Resend-verified sender. `send.brandivibe.site`
  already has Resend DNS from the brain setup, so the default works.
- The Worker route takes priority over GitHub Pages for `/api/*` only;
  every other path still serves the static site.
- Secrets are never committed — they live in Cloudflare, set via the steps
  above.
