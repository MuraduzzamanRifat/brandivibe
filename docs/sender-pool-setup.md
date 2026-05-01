# Multi-sender pool setup — getting to 500 emails/day

The brain now supports a **pool of sender accounts** instead of a single
`hello@send.brandivibe.site` address. With 10 enabled accounts each capped
at 50/day after warmup, the system can ship **~500 emails/day** total
without any one domain getting flagged.

## What's already shipped (in code)

- `SenderAccount` type in `brain-storage.ts` — one entry per sending identity
- Round-robin rotation in `lib/brain/sender-rotation.ts` — picks the lowest-utilized eligible account on every send
- Per-account warmup curves (day 1 = 5, +3/day, steady at `dailyCap` after day 30)
- Per-account circuit breaker — if a Resend send returns "domain not verified" / "recipient blocked" / similar reputation errors, that account auto-pauses until manually reset
- Admin endpoint at `/api/brain/senders` for seed/add/toggle/remove

## What you need to do

### Step 1: seed the default pool

After Koyeb deploys this commit, run:

```bash
curl -X POST https://brandivibe.com/api/brain/senders \
  -H "x-brain-secret: YOUR_BRAIN_CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"action":"seed"}'
```

This creates 10 accounts:
- `primary` — `hello@send.brandivibe.site` (enabled, your existing one)
- `m1`–`m9` — `hello@m1.brandivibe.site`, `hello@m2.brandivibe.site`, … (disabled until you finish DNS)

### Step 2: configure DNS for each subdomain

For **each** of `m1.brandivibe.site` through `m9.brandivibe.site`, add the
following records at your DNS provider (the same one that hosts
`brandivibe.site`):

#### MX (so the subdomain accepts inbound for replies/bounces)

```
m1.brandivibe.site.    MX    10    feedback-smtp.us-east-1.amazonses.com
```

(If you keep using Resend rather than SES, point at Resend's MX:)

```
m1.brandivibe.site.    MX    10    feedback-smtp.eu-west-1.amazonses.com
```

#### SPF (1 TXT per subdomain)

```
m1.brandivibe.site.    TXT    "v=spf1 include:amazonses.com -all"
```

#### DKIM (3 CNAMEs per subdomain — Resend will give you the exact values)

In the Resend dashboard, click **Add Domain** for each subdomain. Resend
shows three CNAME records like:

```
resend._domainkey.m1.brandivibe.site.    CNAME    resend1.dkim.amazonses.com
resend2._domainkey.m1.brandivibe.site.   CNAME    resend2.dkim.amazonses.com
resend3._domainkey.m1.brandivibe.site.   CNAME    resend3.dkim.amazonses.com
```

Copy those into your DNS provider verbatim.

#### DMARC (one TXT, can be shared across all subdomains)

```
_dmarc.m1.brandivibe.site.    TXT    "v=DMARC1; p=none; rua=mailto:dmarc@brandivibe.site"
```

`p=none` for the first 30 days while warming up, then upgrade to
`p=quarantine` once the SPF/DKIM/DMARC alignment is consistent.

### Step 3: verify each domain in Resend

Resend dashboard → Domains → click each one → wait for the green
"Verified" indicator. Usually 5–30 minutes after DNS changes.

### Step 4: enable the account in the pool

Once Resend says the domain is verified, flip the account on:

```bash
curl -X POST https://brandivibe.com/api/brain/senders \
  -H "x-brain-secret: YOUR_BRAIN_CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"action":"toggle","id":"m1","enabled":true}'
```

Repeat for `m2` through `m9` as you finish their DNS.

## Capacity math

| Status | Daily output |
|---|---|
| Just seeded, only `primary` enabled | 5 → 50/day over 30 days |
| 5 accounts enabled, all warmed up | 250/day |
| 10 accounts enabled, all warmed up | 500/day |

Because each account warms up independently, you can stagger the rollout
— start with `primary` + 2 new ones, monitor deliverability for a week,
then enable more.

## Monitoring

```bash
curl https://brandivibe.com/api/brain/senders
```

Returns each account's `sentByDay`, `sentLifetime`, `lastSentAt`,
`circuitBreakerTrippedAt`, plus overall pool capacity vs sent today.

The daily digest (already shipped — sent each morning to
`mjrifat54@gmail.com`) will start including a per-sender breakdown
once multi-sender mode is active.

## Reset a paused sender

If a sender trips its circuit breaker (e.g. a hard bounce flagged the
domain), inspect the reason at `/api/brain/senders`, fix the underlying
issue (spammy content, bad list, DNS drift), then:

```bash
curl -X POST https://brandivibe.com/api/brain/senders \
  -H "x-brain-secret: YOUR_BRAIN_CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"action":"reset-circuit-breaker","id":"m3"}'
```

## Why subdomains, not separate domains?

- **Cheaper** — no extra domain registration costs
- **Cleaner reputation isolation than aliases** — each subdomain has its own DKIM keys
- **Same root brand** — recipients still see `@brandivibe.site` family
- **Easier DNS** — one provider, sibling records

If you ever want hardened reputation isolation (e.g. when reaching very
sensitive industries), you can register actual separate domains and add
them via the `add` action with their own `fromEmail` — the rotator
treats every account the same regardless of root domain.
