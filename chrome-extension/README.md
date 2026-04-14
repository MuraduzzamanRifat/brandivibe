# Brandivibe Maps Lead Scraper (v1.1)

Chrome extension that scrapes Google Maps business listings into the Brandivibe sales brain. Premium WebGL-style popup with built-in targeting (category + country + state + city), automatic dedupe across sessions, and real-time sync to `brandivibe.com/dashboard`.

## What's new in 1.1

- **Targeting form** — pick an industry (70+ categories), a country (200+), a state/region, and a city. The extension builds a Google Maps search URL and opens it for you.
- **Cross-session dedupe** — the extension remembers every website it has already sent to the dashboard (up to 10,000). Re-scraping the same area skips businesses you've already pulled.
- **Reset dedupe** — one-click footer link to wipe the history if you want to re-scrape.
- **Remembered form state** — last category / country / state / city persists between popup opens.

## What it does

1. You search for businesses on Google Maps (e.g. "marketing agencies seattle")
2. Click the Brandivibe extension icon → "Scrape this page"
3. The content script scrolls the results panel and parses every business card from the live DOM
4. Click "Send to dashboard" → the extension POSTs the leads to `brandivibe.com/api/leads/ingest`
5. Leads appear in your dashboard's **Maps Leads** tab, deduped by `place_id`
6. Click any lead to convert it into a real Brandivibe Prospect, which then gets fed through Phase 4's research + drafter + cold sequence pipeline

## Why a Chrome extension (not Python / Selenium / Maps API)

| Approach | Why we didn't use it |
|---|---|
| Headless Selenium / Playwright | Google aggressively detects headless browsers — needs paid proxies + captcha solvers, breaks weekly when Google updates their bot-detection layer |
| Official Google Maps API | $0.017 per Place Details call ($170 per 10k leads), no email field, no website intent signals |
| SerpAPI / Outscraper | $50–200/month, locks you into a vendor, still rate-limited |
| **This Chrome extension** | Uses your real Chrome session → real cookies, real IP, real human → no captcha, no proxies, free forever. Just won't run unattended. |

## Install (~2 minutes)

1. Download or clone this repository, then locate the `chrome-extension/` folder
2. Open Chrome and go to `chrome://extensions`
3. Toggle **Developer mode** on (top-right)
4. Click **Load unpacked**
5. Select the `chrome-extension/` folder
6. The Brandivibe icon appears in your extensions toolbar

## One-time configuration

The extension needs the same `BRAIN_CRON_SECRET` that's set in your Koyeb env vars, so it can authenticate against the dashboard ingest endpoint.

1. After installing, right-click the extension icon → **Inspect popup**
2. In the DevTools that opens, switch to the **Console** tab
3. Run this snippet (replace `YOUR_SECRET_HERE` with your actual `BRAIN_CRON_SECRET`):

```js
chrome.storage.local.set({
  ingestSecret: "YOUR_SECRET_HERE",
  endpoint: "https://brandivibe.com/api/leads/ingest"
})
```

That's it. The extension is now wired to your live dashboard.

## Daily workflow

1. Go to `google.com/maps`
2. Search for businesses you want to target — be specific. Examples:
   - `wedding photographers austin`
   - `dental clinics in jakarta`
   - `boutique hotels lisbon`
   - `fintech startups san francisco`
3. Wait for the results panel to fully load (10–20 results is normal)
4. Click the Brandivibe extension icon
5. Click **Scrape this page**
6. Wait ~10 seconds — the content script will scroll the panel automatically and pull every result it can see
7. Review the preview list in the popup
8. Click **Send to dashboard**
9. Open `brandivibe.com/dashboard` → **Maps Leads** tab → leads are there

## What gets scraped per lead

Only **4 fields**. Email is mandatory — leads without an email are dropped, never stored.

| Field | Required | Where it comes from |
|---|---|---|
| `name` | ✓ mandatory | Business name from the Maps card aria-label |
| `email` | ✓ **mandatory** | Server-side: scraped from the business website's homepage / about / team / pricing / contact pages |
| `website` | ✓ mandatory | First non-google.com `<a>` in the Maps card |
| `location` | optional | Address line from the Maps card |

### How email collection works

Google Maps **never** exposes business emails in listings. So:

1. The extension scrapes the Maps page for **name + website + location**
2. POSTs the batch to `brandivibe.com/api/leads/ingest`
3. The server visits each website using the existing Phase 4 scraper
4. Pulls emails from the live HTML (looks at `mailto:` links, footers, `/contact`, `/about`, `/team`, `/privacy`)
5. **Drops any lead with zero emails found** — they're not stored
6. Leads with at least 1 email are saved to `brain.gmapsLeads` with the highest-confidence email as the primary, others as `altEmails`

Realistic hit rate: ~30–60% of Maps businesses have a discoverable email on their site. Small businesses + restaurants are lower; tech/agency/professional services are higher.

## Resilience to Google DOM changes

The content script intentionally **does not rely on CSS class names** (those churn weekly on Google). Instead it uses:

- `[role="feed"]` for the results panel
- `a[href*="/maps/place/"]` for individual cards
- `aria-label` for business names
- URL fragments (`!1s...!`, `!3d...!4d...`) for `place_id` and lat/lng
- Text-heuristic parsing for category / address / phone / hours

When Google does break the scraper (it will, eventually), the fix is in `content.js` — usually 5–10 lines of regex updates.

## Privacy + safety

- The extension only runs on `google.com/maps/*` URLs
- Permissions: `activeTab`, `scripting`, `storage`, `host_permissions: google.com/maps/*` and `brandivibe.com/*`
- No tracking. No analytics. No third-party scripts.
- All scraped data goes only to your own `brandivibe.com/api/leads/ingest` endpoint, authenticated with your secret
- The secret is stored in `chrome.storage.local` (encrypted by Chrome on disk, sandboxed to this extension)

## Troubleshooting

| Problem | Fix |
|---|---|
| Popup says "Open Google Maps to begin" | The active tab isn't a Google Maps page. Switch tabs and reopen the popup. |
| "No results panel found" | You're on a single-business detail page, not search results. Run a new search. |
| "Scrape returned no data" | Scroll the results panel manually first to load more cards, then retry |
| "Network error" on sync | Check the dashboard endpoint is reachable + your `ingestSecret` matches `BRAIN_CRON_SECRET` |
| "HTTP 401 unauthorized" | The secret in `chrome.storage.local.ingestSecret` doesn't match the env var on Koyeb |
| Sync succeeded but leads don't appear in dashboard | Hit refresh on `/dashboard` → Maps Leads tab. Brain.json is GitHub-synced so there can be a 1–2s lag |

## File layout

```
chrome-extension/
├── manifest.json       # MV3 manifest, permissions
├── popup.html          # Premium WebGL-style popup UI
├── popup.css           # Cinematic gradient mesh styling
├── popup.js            # Popup controller + UI state
├── content.js          # Google Maps DOM scraper (runs on maps pages)
├── background.js       # Service worker — POSTs to brandivibe.com
├── icons/              # Brandivibe cyan placeholder icons (replace with branded ones)
└── README.md           # This file
```

## Replacing the placeholder icons

The `icons/` folder ships with auto-generated solid-cyan placeholders. To replace with branded icons:

1. Create three PNGs at exactly 16×16, 48×48, 128×128
2. Save them as `icon-16.png`, `icon-48.png`, `icon-128.png` in `chrome-extension/icons/`
3. Reload the extension at `chrome://extensions`

## Roadmap

- [ ] Auto-pagination across multiple result pages (currently scrolls one panel)
- [ ] Email enrichment via the brain's existing email-finder pipeline
- [ ] One-click "Convert to Prospect" button on each lead in the dashboard
- [ ] Batch import from CSV
- [ ] Apollo / Hunter API fallback for emails when website scrape fails
