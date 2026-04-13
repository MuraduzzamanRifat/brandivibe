# Brandivibe — Go-To-Market Strategy

## GTM motion

**Sales-led, outbound-heavy, founder-direct.**

Why not PLG: you can't freemium a custom website. The product IS the project.

Why not purely inbound: Brandivibe has zero domain authority, zero organic traffic yet. Inbound will take 6-12 months to warm up. Outbound can generate pipeline in week 1.

Why founder-direct: One person, no sales reps, no middle layer. I am the product, the pitch, and the contact. Every email comes from me.

---

## Pipeline target (solo studio capacity)

```
Goal: 2 signed projects per quarter
Average deal: $50,000
Quarterly revenue: $100,000
Annual revenue (8 projects/yr): $400,000

Pipeline required (at ~10% close rate):
  20 serious conversations per quarter
  = 200 qualified leads per quarter
  = ~600 raw prospects touched per quarter
  = ~200 per month outbound
  = ~50 per week
  = ~10 per workday
```

**The AI brain's job is to make 10 prospects/day feasible for one person.**

---

## Channel mix

| Channel | % of effort | Why |
|---|---|---|
| **Cold outbound email** (via AI brain) | 50% | Highest leverage. AI finds + drafts. I review + send. |
| **X/Twitter engagement** | 20% | Commenting on founder threads in target verticals builds warm surface |
| **LinkedIn DM** (to Heads of Design / Marketing) | 15% | Champion play — bypass founder gatekeeping |
| **Warm referrals** | 10% | Ask every closed client for 1 intro (huge close rate) |
| **Content / SEO** | 5% | Slow-burn — case studies, process posts, Brandivibe process open-sourced |

No paid ads (wrong for a $50K service sold to 200-person list).
No cold calls (founders don't take them in 2026).
No events yet (expensive, slow).

---

## The outbound flywheel (what the AI brain automates)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  1. SOURCING                                                │
│    AI brain scrapes Crunchbase / TechCrunch /               │
│    Product Hunt / Twitter for trigger events:               │
│    - "Raised $X in Series A"                                │
│    - "Launching [product]"                                  │
│    - "TGE on [date]"                                        │
│                    ↓                                        │
│  2. QUALIFYING                                              │
│    AI scores against ICP tiers (see icp.md).                │
│    Pulls firmographics + psychographics.                    │
│    Matches to closest Brandivibe demo                       │
│    (Helix for crypto, Neuron for SaaS AI, etc.)             │
│                    ↓                                        │
│  3. RESEARCH                                                │
│    AI reads their current site and identifies 2-3           │
│    specific brand weaknesses they themselves would agree    │
│    with (e.g., "your mobile hero is a stretched desktop     │
│    image," "you're on the same Webflow template as          │
│    these 4 direct competitors").                            │
│                    ↓                                        │
│  4. DRAFTING                                                │
│    AI drafts a personalized cold email using the            │
│    messaging from messaging.md and references the best-fit  │
│    demo. Subject line A/B per messaging doc.                │
│                    ↓                                        │
│  5. HUMAN REVIEW (ME)                                       │
│    I review drafts in the dashboard. 80% go as-is,          │
│    20% get 30 sec edit, 5% get killed. Approve → send.      │
│                    ↓                                        │
│  6. SENDING                                                 │
│    Gmail API sends from my real address. Not a blast —      │
│    paced 15-30 emails/day to stay out of spam.              │
│                    ↓                                        │
│  7. TRACKING                                                │
│    Opens, clicks, replies logged. Auto-classify reply       │
│    sentiment (interested / decline / objection / noise).    │
│                    ↓                                        │
│  8. FOLLOW-UP                                               │
│    On replies with objections: AI drafts response           │
│    using the right battlecard. I approve. Sent.             │
│                                                             │
│    On interest: AI suggests calendar slots and a loom       │
│    walkthrough.                                             │
│                    ↓                                        │
│  9. HANDOFF                                                 │
│    Interested → Me. I take the call, close the deal,        │
│    write the code.                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

Steps 1-4 and 7-8 are AI. Steps 5, 6, 9 are me. The leverage is 10x.

---

## Trigger events to watch for (sourcing)

The AI brain's first job is to watch the web for these:

| Signal | Source | Why it matters |
|---|---|---|
| **Seed/Series A/B announcements** | Crunchbase, TechCrunch, The Information | Fresh budget, fresh taste, pre-launch urgency |
| **Product Hunt launches** | PH daily/weekly lists | Public-facing brand moment = site matters a lot |
| **Token Generation Event (TGE)** | CoinMarketCap, crypto news | 30-60 day launch window, huge site criticality |
| **Hiring Head of Design / VP Marketing** | LinkedIn, Angellist | They'll either demand a rebrand or outsource one |
| **Founder tweet: "our site sucks"** | X search | Direct buying signal |
| **Series A company still on seed-era site** | Visual audit (AI screenshots + compares) | Slow-burn opportunity |
| **Rebrand announced but no site yet** | Twitter, blog posts | Imminent need |

---

## Messaging rotation (by trigger)

Different triggers unlock different cold email openers:

### A. Funding trigger
> "Hey [name] — congrats on the [$X round]. I build cinematic Next.js sites for founders who just raised and want the site to match the round. I noticed your current homepage is [specific observation]. I've built 8 live demos including [closest-fit demo name] which I think maps directly to how [company] should show up post-round. 6-week fixed scope, $50-70K, public repo. Want to see a 90-second walkthrough?"

### B. Launch trigger
> "Hey [name] — I saw [product] launches in [X] weeks. Your launch landing page is [observation — e.g., "still using the seed deck screenshot as the hero"]. I build launch-ready Next.js sites in 6 weeks with custom WebGL heroes — here's a demo I built for a liquid staking protocol ([/helix]) that maps to how you could present [company]. If you want the site live before [event], Monday is the latest we should start. Worth a 20-min call?"

### C. Team hire trigger
> "Hey [name] — noticed [company] is hiring a Head of Design. Before they start, you might get more leverage from a launched site than a 4-month design search. I build Next.js + WebGL brand sites in 6 weeks for founders in crypto/SaaS/luxury. [Closest-fit demo link]. Fixed $50-70K, public GitHub, your code. Interested in a 20-min chat this week?"

### D. Visible brand weakness trigger
> "Hey [name] — direct observation: [specific brand weakness — e.g., "your mobile hero has your desktop hero stretched, the tagline doesn't render above the fold on a 375px screen"]. Your Series A deserves a site that doesn't do that. I build premium Next.js brand sites in 6 weeks for $50-70K. Here are 8 live demos — pick the closest to your brand voice: [link]. If this lands, I'd send a 48-hour proposal."

---

## Objection → battlecard routing

Incoming reply patterns and which battlecard the AI applies:

| Reply pattern | Battlecard to reference |
|---|---|
| "We use basement.studio already" | #1 basement.studio |
| "Studio Freight quoted us X" | #2 studio freight |
| "We'd use Webflow" | #3 Webflow template |
| "We'll hire someone in-house" | #4 In-house designer |
| "We're not ready yet" / "Next quarter" | #5 Do nothing (urgency framing) |
| "Too expensive" | #3 + #4 blended (vs. cheaper and vs. in-house) |
| "How do I know you'll deliver?" | Public GitHub + fixed milestones + 50% on milestone 1 |
| "Show me more work" | Share the 8 demos + the poster series |

---

## 90-day launch plan (for Brandivibe itself)

### Days 1-30 — Foundation
- [x] brandivibe.com live on Koyeb
- [x] 8 demos across 8 verticals
- [x] Public GitHub repo
- [x] Marketing strategy docs (this folder)
- [ ] Build AI sales brain MVP (Phase 1)
- [ ] Source first 200 Tier A prospects manually
- [ ] Draft first 20 cold emails manually to calibrate AI tone
- [ ] Send first 50 cold emails (old-fashioned)

### Days 31-60 — Automate
- [ ] AI brain sends 150 cold emails (50% automation)
- [ ] Collect first 10 replies → classify → tune AI responses
- [ ] Book first 5 discovery calls
- [ ] Close first 1-2 projects
- [ ] Public case study of first closed project

### Days 61-90 — Scale
- [ ] AI brain doing 80% of sourcing + drafting
- [ ] 200+ outbound emails/month
- [ ] 20+ discovery calls/month
- [ ] 2-3 closed projects
- [ ] First referral from a closed client
- [ ] First inbound (from Twitter engagement)

---

## Success metrics

| Metric | 30d | 60d | 90d |
|---|---|---|---|
| Outbound emails sent | 50 | 150 | 250 |
| Reply rate | 10% | 15% | 20% |
| Discovery calls booked | 3 | 10 | 20 |
| Projects closed | 0 | 1 | 3 |
| AI brain automation % | 20% | 50% | 80% |
| Revenue | $0 | $50K | $150K |

**North star**: time from lead sourced → first email sent. Target: under 60 seconds with the AI brain doing sourcing + drafting in parallel.
