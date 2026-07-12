# Brandivibe — Website Brief

*A full overview of what the site is, how it's built, and what's still missing.*
*Every number here was read from the live site, not from memory.*

---

## 1. What this is

Brandivibe is a digital studio site selling six things under one roof: web
development, custom software, digital marketing, creative content, design, and
AI automation. Founded 2024 by Muraduzzaman, operating from Dhaka and working
remotely with founders worldwide.

The positioning is deliberately **warm and honest** rather than corporate: senior
people doing the work, one fixed price agreed up front, and the client owns
everything built. That honesty is the strategy, not a decoration — it shows up
in the copy ("nobody honest can guarantee a ranking"), in the refusal to publish
invented statistics, and in a homepage section that lists five reasons *not* to
hire the studio.

**Live at:** https://brandivibe.com

---

## 2. Scale

| | Count |
| --- | --- |
| Total indexed URLs | **364** |
| Service pages | 35 |
| Service × industry pages | **280** |
| Glossary terms | 12 |
| Journal articles | 12 |
| Portfolio demos | 13 |
| Industries served | 8 |

The 280 service×industry pages are the long-tail SEO engine — `/services/<service>/<industry>`
(e.g. *WebGL for SaaS*, *Local SEO for hospitality*). They are **assembled from
data**, not hand-written: an industry record supplies the framing, a service
record supplies the capabilities. Change one industry and 35 pages update.

---

## 3. Stack

**Framework:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4
**CMS:** Payload 3.85 on PostgreSQL (Neon)
**Hosting:** Vercel · Vercel Blob for media
**3D / motion:** Three.js + React Three Fiber · Framer Motion · Lenis

The site is its own proof: the tech-stack section on the homepage names these
tools precisely because a visitor can open dev tools and verify the claim.

---

## 4. Site architecture

```
/                        homepage (12 sections — see below)
/services                pillar hub -> 35 service pages
  /services/<service>              service detail
  /services/<service>/<industry>   280 long-tail pages
/industries              8 verticals
/case-studies            portfolio with results
/journal                 12 long-form essays
/glossary                12 definitional pages (built for AI citation)
/portfolio               13 interactive demos
/about  /contact  /audit (lead magnet: free website audit)

/sitemap.xml  /robots.txt  /llms.txt   crawler + AI-assistant surfaces
/brand-og  /logo                       generated brand assets
/admin                                 Payload CMS
```

---

## 5. Homepage (12 sections)

Ordered to move a stranger from *"I have a problem"* to *"I'll email them"*:

1. **Hero** — headline, two CTAs, honest trust bar (signals, never invented stats)
2. **Reassurance** — three promises
3. **Problems** — names the pain before naming any product
4. **Outcomes** — people buy the change, not the noun; each routes to the service that delivers it
5. **Pillars** — the six service areas
6. **Industry navigator** — surfaces the 280 long-tail pages
7. **Proof / testimonials** — *renders only when reviews exist* (currently empty)
8. **Process** — how a project runs
9. **Comparison** — how the studio differs, with the competitor column hedged ("often", "usually")
10. **Tech stack** — the tools named and verifiable
11. **After launch** — the question everyone has and nobody answers
12. **Why not us** — five reasons *not* to hire them. The most disarming section on the page
13. **FAQ** — 17 questions, all feeding FAQPage schema

---

## 6. Search, AI search, and structured data

**Schema (live on the homepage alone):** Organization (with logo), WebSite,
Person, ContactPoint, PostalAddress, FAQPage, Question, Answer, ImageObject.
Elsewhere: Service, Article, Blog, BreadcrumbList, DefinedTerm, CollectionPage,
ItemList, Offer, OfferCatalog.

**Built for AI answers (AEO/GEO):**
- `llms.txt` — a curated map of the site for ChatGPT, Claude, Perplexity, generated live from the CMS
- `robots.txt` explicitly welcomes GPTBot, ClaudeBot, PerplexityBot, Google-Extended
- 12 glossary pages structured so the definition is the *first* sentence — the line an AI lifts
- 17 FAQs in schema, which is the single largest AI-citation surface on the site

**Internal linking:** journal essays → the service they argue for + the term they
define; service pages → the glossary terms they use. Nothing is orphaned.

---

## 7. Design and performance

**Look:** warm ivory canvas, coral primary, six pillar accents. A site-wide
**WebGL background** — slow coral/teal blooms drifting behind every page —
plus a live, draggable 3D object on the page that sells 3D.

**Guardrails that keep it fast:**
- three.js is **0 bytes** in every page's initial load; it downloads only on scroll
- the hero paints from CSS, before JavaScript — it is the LCP element
- images via `next/image`: a journal thumbnail went **328 KB → 15 KB** (WebP)
- reduced-motion and mobile get a still gradient, no render loop

**Accessibility:** WCAG AA throughout — every button colour was computed to clear
4.5:1, 44px touch targets, keyboard-accessible menus, visible focus, screen-reader
announcements on the contact form.

---

## 8. The CMS

Payload admin at `/admin`, 15 collections:

`Services` `CaseStudies` `Articles` `Testimonials` `Industries` `Clients`
`Team` `Authors` `Technologies` `Categories` `Tags` `FAQs` `Media` `Leads` `Users`

Plus globals for the homepage content and brand guidelines. Contact-form
submissions land in **Leads** with a status pipeline (new → contacted →
qualified → proposal → won/lost).

---

## 9. What's live vs what's missing

### Live and working
Everything above. 364 URLs, all returning 200. Lead capture functioning.

### The honest gaps

| Gap | Why it matters |
| --- | --- |
| **0 testimonials** | The proof section is built into **316 pages** and renders nothing. It also blocks star-rating schema in Google. Three real Upwork reviews exist and are not yet entered. |
| **1 case study, no numbers** | The page says "real projects, real results" and shows no results. |
| **No published pricing** | Decided yes, ranges not yet supplied. |

**There is no fabricated proof anywhere on this site, and that is deliberate.**
An external audit recommended adding "100+ Projects Delivered", "96% Client
Retention", "+310% Organic Traffic". None of it is true, so none of it is here.
Fabricated stats were also *removed* from the journal for the same reason: the
moment a prospect asks *"which 100 projects?"*, the number costs more than it
earned — and fake review markup is a fast route to a Google penalty.

The site's credibility gap is not solvable by writing. It closes the moment real
proof is entered.

---

## 10. Next up

1. **Enter the 3 testimonials** — unlocks 316 pages of proof *and* rating schema
2. **One case study with real numbers** — even modest, real figures beat impressive fake ones
3. **Pricing ranges** → enables a published pricing section and an interactive cost estimator
4. **Rotate credentials** — `PAYLOAD_SECRET` and the Neon password were exposed in a chat transcript (never in the repo)

Parked, built but not shipped: a full internationalisation foundation
(21 languages, hreflang, per-locale publishing) on `feat/i18n-foundation`.
Deliberately not merged — a language should not launch before its content is
translated and reviewed.
