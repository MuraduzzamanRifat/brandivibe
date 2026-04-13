# Deploying to Koyeb

This repo contains 3 Next.js 16 apps (`mjstudio`, `helix`, `neuron`). Each deploys as a separate Koyeb service pointing at the same repo.

## 1. Prerequisites

- A free Koyeb account — [sign up](https://app.koyeb.com/auth/signup)
- GitHub repo access (Koyeb will request read permission on your account)

## 2. Create a service (repeat 3×)

Do the following steps three times — once for each app.

### Step A — New Service
1. Go to https://app.koyeb.com/
2. Click **Create Service**
3. Choose **GitHub** as the source
4. Select `MuraduzzamanRifat/brandivibe`
5. Branch: `main`

### Step B — Build settings
| Field | Value for `mjstudio` | Value for `helix` | Value for `neuron` |
|---|---|---|---|
| **Work directory** | `mjstudio` | `helix` | `neuron` |
| **Build command** | `npm ci && npm run build` | `npm ci && npm run build` | `npm ci && npm run build` |
| **Run command** | `npm run start` | `npm run start` | `npm run start` |
| **Port** | `3000` | `3000` | `3000` |
| **Protocol** | `HTTP` | `HTTP` | `HTTP` |

> Note: although `dev` runs on 3001/3002 locally, `start` uses Next.js's default PORT (3000) so Koyeb's `$PORT` env var works automatically.

### Step C — Instance
- **Instance type**: `eco-nano` (free tier is fine for all 3)
- **Region**: pick closest to your audience (e.g. `fra` for Europe, `was` for US East)
- **Scaling**: Min 0, Max 1 (scale-to-zero to stay free)

### Step D — Service name
- `mjstudio` → `mjstudio-brandivibe`
- `helix` → `helix-brandivibe`
- `neuron` → `neuron-brandivibe`

Click **Deploy**.

First build takes 3-6 minutes. Subsequent deploys from Git push are faster.

## 3. Custom domain (optional)

After each service is live, Koyeb gives you a free `*.koyeb.app` URL. To add a custom domain:

1. Go to the service → **Settings** → **Domains**
2. Click **Add domain**, enter e.g. `helix.yourdomain.com`
3. Add the CNAME record Koyeb shows at your DNS provider
4. Wait 5-15 minutes for SSL to be issued automatically

## 4. Updating

Every push to `main` auto-redeploys. That's it.

## 5. Environment variables (if needed later)

- `PEXELS_API_KEY` — only needed if you run `_audit/fetch-stock*.mjs` again. Build doesn't need it (videos are committed).
- `NEXT_PUBLIC_*` — add any public env vars via Koyeb's service → **Settings** → **Environment variables**.

## 6. Troubleshooting

- **Build fails on `npm ci`** — make sure `package-lock.json` is committed (it is).
- **App crashes with "port in use"** — check you removed `-p 3001`/`-p 3002` from the `start` script. They're already removed.
- **Videos/images not serving** — Koyeb serves `/public` automatically for Next.js apps. If a 404 happens, check the path is exact (case-sensitive on Linux).
- **Slow cold starts** — scale-to-zero means the first request after idle takes ~15 seconds to warm up. Set Min instances to 1 if you need always-on (not free).
