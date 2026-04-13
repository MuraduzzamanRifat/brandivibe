# Brandivibe outbound sequences (canonical)

This doc is the authoritative template for every cold outreach email the
brain sends. The drafter (`lib/brain/email-drafter-v2.ts`) loads this as
part of its system prompt alongside `icp.md`, `positioning.md`,
`messaging.md`, and `battlecards.md`.

**Never deviate from the voice, structure, or length targets below.** If
the drafter produces an email that violates these rules, the email is
rejected and re-prompted.

## Sequence: Founder cold outbound

| Meta | Value |
|---|---|
| Trigger | Prospect researched + email confidence ≥ 70 |
| Type | Cold B2B sales sequence |
| Length | 4 emails over 15 days |
| Cadence | Day 0, Day 3, Day 8, Day 15 |
| Send window | Tue-Thu, 9-11am recipient local time |
| Hard-skip | Weekends, Mondays, Fridays |
| Exit conditions | any reply → pause. unsubscribe → permanent stop. hard bounce → mark bad + stop. |
| Max touches | 4. Never email the same prospect from this sequence again without an intervening positive reply. |

## Voice contract

- Direct, founder-to-founder, confident but never salesy.
- Zero "I hope this finds you well". Zero "quick question" if it's not actually a question. Zero em-dash openers.
- First-person singular (I / me), not "we" — Brandivibe is one person.
- Every email references something **specific** the scraper found on the prospect's live site. If the drafter cannot produce a specific observation, **do not send**.
- No emoji except possibly 👍/👎 in internal thread replies (not outbound).
- Plain text body. No HTML tables. Links are naked URLs so Gmail doesn't hide them behind "click here".
- Sign-off is always:
  ```
  Muraduzzaman
  Brandivibe — brandivibe.com
  ```

## Merge slots (from DeepResearch)

Every email uses some subset of these, all produced by the deep-research pipeline:

| Slot | Source | Example |
|---|---|---|
| `{firstName}` | email-finder / scraper /team page | "Marcus" |
| `{company}` | prospect record | "Lattice Protocol" |
| `{specificObservation}` | DeepResearch.realWeaknesses[0] | "hero video is 14MB and pushes LCP past 4s" |
| `{oneSentenceImpact}` | DeepResearch inference | "Most visitors bail before they see pricing" |
| `{currentPainArea}` | DeepResearch.painArea | "homepage performance" |
| `{observation1/2/3}` | DeepResearch.realWeaknesses[0..2] | "Mobile nav collapses below the fold" |
| `{fix1/2/3OneLine}` | DeepResearch.fixes[0..2] | "move the CTA button above the hero video" |
| `{topPriorityObservation}` | DeepResearch.topPriority | "hero performance" |
| `{fixTimeEstimate}` | DeepResearch.fixTimeEstimate | "2-day" |
| `{conversionMetric}` | DeepResearch.conversionMetric | "signup rate" |
| `{industryName}` | prospect.industry humanized | "DeFi" / "fintech" / "AI infra" |
| `{closestDemo}` | DeepResearch.bestFitDemo | "helix" |
| `{techStackSummary}` | scraper.tech-detect | "WordPress + Elementor" |
| `{currentDesignScore}` | DeepResearch.designScore | 5 |
| `{budget}` | prospect.estimatedBudget | "$35-50K" |
| `{nextQuarter}` | auto-calculated | "Q3 2026" |
| `{calendlyLink}` | env var `BRANDIVIBE_CALENDLY_URL` or placeholder `[Calendly — coming soon, reply 'send loom' for now]` |
| `{unsubscribeLink}` | auto-generated per-prospect HMAC-signed link |
| `{physicalAddress}` | env var `BRANDIVIBE_MAILING_ADDRESS` (CAN-SPAM + GDPR legal requirement) |

## The four emails

### Email 1 — Specific observation (Day 0)

**Goal:** get any reply. No demo ask. One job.

- Length: 70-90 words
- Subject: 35-55 chars, must contain `{firstName}` OR `{company}`
- Suggested subject: `{firstName}, your {specificObservation} caught my eye`
- Preview text: `Noticed something on {company}.com that's probably costing you`

```
{firstName},

I was poking around {company}.com and noticed {specificObservation}.
{oneSentenceImpact}.

I run Brandivibe — a solo web design studio that rebuilds founder
homepages into {closestDemo}-grade experiences. Not pitching yet.

Quick question: is the {currentPainArea} bugging you, or is it on the
"fine for now" pile? One-line answer is plenty.

Muraduzzaman
Brandivibe — brandivibe.com

{unsubscribeLink} · {physicalAddress}
```

### Email 2 — Three-observation value drop (Day 3)

**Goal:** build trust by giving free value. Still no ask.

- Length: 160-200 words
- Subject: `3 things I spotted on {company}.com`
- Preview: `No pitch. Just what I'd tell a friend.`
- Only sent if email 1 got no reply and did not bounce.

```
{firstName} — no reply needed, just sharing.

Since I last wrote, I spent 20 minutes actually using {company}.com.
Three things I'd mention to a friend:

1. {observation1} — {fix1OneLine}
2. {observation2} — {fix2OneLine}
3. {observation3} — {fix3OneLine}

The one I'd fix first is {topPriorityObservation}. It's a {fixTimeEstimate}
lift and probably moves {conversionMetric} more than anything else on
the site.

I built brandivibe.com/{closestDemo} as a reference for what
{industryName} founder sites can look like at the $35-90K tier. Worth
15 min of poking around even if you don't end up working with me.

Muraduzzaman
Brandivibe

{unsubscribeLink} · {physicalAddress}
```

### Email 3 — Comparison + soft call ask (Day 8)

**Goal:** the actual sales ask. Two parallel CTAs for double reply rate.

- Length: 130-170 words
- Subject: `Comparison: {company}.com vs brandivibe.com/{closestDemo}`
- Preview: `Side by side, 15 minutes, zero pressure`

```
{firstName},

Direct comparison. {company}.com is currently a {techStackSummary}
build scoring ~{currentDesignScore}/10 on the things I care about
(type, grid, motion, performance, conversion).

brandivibe.com/{closestDemo} is what a {budget} rebuild looks like
when a solo designer who ships in 6 weeks takes it on. Same CMS
ergonomics. Production Next.js codebase you own the day we're done.

If you have 15 minutes this week I'll walk you through where the
delta is biggest for {company} specifically — Loom or live, your
pick. No slides, no pitch deck, no "discovery call" theatre.

Pick a time: {calendlyLink}
Or reply "send loom" and I'll record one in the next 48 hours.

Muraduzzaman
Brandivibe — $35-90K · 6-week fixed scope · production code

{unsubscribeLink} · {physicalAddress}
```

### Email 4 — Breakup (Day 15)

**Goal:** clean final close. Breakup emails historically have the highest reply rate of any touch in a sequence — people respect finality.

- Length: 50-80 words
- Subject: `Closing the loop on {company}`
- Preview: `One-line reply helps me plan`

```
{firstName},

Closing this thread — I've got a standard 4-touch rule and this is
touch 4.

If "not interested" → one-line reply stops me forever, no hard feelings.
If "not now" → I'll circle back in {nextQuarter}.
If I just caught you on a bad week → {calendlyLink}

Either way, genuinely good luck with {company}.

Muraduzzaman
Brandivibe — brandivibe.com

{unsubscribeLink} · {physicalAddress}
```

## Warmup schedule

Mandatory. Overriding this gets the sending domain blacklisted.

| Day | Max sends |
|---|---|
| 1 | 5 |
| 2 | 8 |
| 3 | 11 |
| 4 | 14 |
| 5 | 17 |
| ... | +3/day |
| 30 | 92 |
| 31+ | 50 (steady state — can be raised after 60 days clean) |

Per-domain cap: **1 email per recipient domain per 3 days**, regardless of warmup headroom. Prevents looking like a blast to a single company.

## Reply classifier

Every incoming reply runs through GPT-4o-mini with this schema:

```json
{
  "sentiment": "positive" | "not-now" | "not-interested" | "angry" | "neutral-question",
  "shouldStopSequence": boolean,
  "shouldAutoUnsubscribe": boolean,
  "shouldRescheduleMonths": number | null,
  "notifyHuman": boolean
}
```

- `positive` → stop sequence, notify human immediately
- `not-now` with `shouldRescheduleMonths: 3` → pause, revive in 3 months
- `not-interested` → stop sequence, no follow-up ever
- `angry` → stop sequence + auto-unsubscribe + notify human
- `neutral-question` → notify human, don't auto-answer

## Metric targets (months 1-3)

| Metric | Target | Kill-switch |
|---|---|---|
| Delivery rate | ≥ 95% | < 85% → pause sends |
| Bounce rate | ≤ 5% | > 8% → pause, audit email finder |
| Open rate | ≥ 40% | < 25% → rewrite subjects |
| Reply rate (any) | ≥ 8% | < 3% → rewrite sequence |
| Positive reply rate | ≥ 2% | tracked, not killed on |
| Unsubscribe rate | ≤ 1.5% | > 3% → ICP targeting issue |
| Calls booked / 100 sent | 1 in warmup → 3 steady | — |

## Drafter rejection rules

The drafter is re-prompted (up to 2 retries) if its output violates any of:

1. Uses any merge slot as a literal word in the body (e.g. "your `{specificObservation}`" leaking through)
2. Email 1 exceeds 90 words or is under 60 words
3. Any email is missing the unsubscribe line or physical address
4. Subject line is over 60 characters
5. Body starts with "I hope this finds you well", "Hope you're well", or any variant
6. Body contains an em-dash in the opening sentence
7. `{specificObservation}` is generic ("your website could be better", "your brand needs work", anything not traceable to a DeepResearch field)

If all 3 attempts fail, the prospect is marked `needs-manual-research: true` and pushed to a human-review queue on /dashboard instead of sent.
