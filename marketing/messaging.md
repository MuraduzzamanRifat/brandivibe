# Brandivibe — Messaging Architecture

## Level 1 — Value proposition (one-liner)

**"We build Active Theory-tier websites for founders who can't afford Active Theory."**

### Shorter variants (per channel)

| Where | Variant |
|---|---|
| Homepage hero | *"We design websites that clients remember."* (current live copy) |
| Cold email subject | *"A $90K-feel site for 40% less"* |
| LinkedIn tagline | *"Premium web experiences for ambitious brands. $35-90K. 6 weeks. Live URL."* |
| X/Twitter bio | *"$90K-feel websites for founders who can't afford Active Theory. 8 live demos →"* |
| 10-second pitch | *"I build cinematic Next.js + WebGL sites for crypto, SaaS, and luxury founders. I charge $50K instead of $500K. Here are 8 live demos."* |

---

## Level 2 — Core benefits (3-5 bullets)

1. **Range proof** — 8 live demos across 8 verticals. You can see your industry before you commit.
2. **Real WebGL, real craft** — Custom R3F scenes, scroll-driven 3D, production shaders. Not Lottie, not Framer templates.
3. **Six-week delivery** — Fixed scope, fixed price. Launch before your runway stops caring.
4. **Your codebase** — Next.js 16, TypeScript, Tailwind v4. You own the code. No platform tax.
5. **One person, one contact** — Direct founder access. No account managers. No scope drift.

---

## Level 3 — Features → benefits → outcomes

| Feature | Benefit | Outcome |
|---|---|---|
| React Three Fiber + custom shaders | Live 3D heroes that scroll-link | Your site looks $250K, costs $50K |
| Next.js 16 App Router | Server components, fast Lighthouse, SEO | Ranks in Google, survives a TechCrunch spike |
| LazyVideo + IntersectionObserver | Heavy media loads on demand | 6MB initial payload (vs. 38MB naive). Mobile-friendly. |
| `prefers-reduced-motion` fallback | Accessible to all users | Passes WCAG AA, government contracts possible |
| Figma → code same week | Design + build done by same person | No Figma-to-Webflow-to-Next.js handoff tax |
| Museum poster deliverable | Physical brand artifact | Office/team totem nobody else ships |
| Public GitHub + live repo | Code review before you buy | Removes the "will they ghost me?" risk |
| 6-week fixed proposal | No hourly billing, no scope creep | Budget certainty |

---

## Level 4 — Proof points

- **Live at brandivibe.com** — not a Dribbble mockup, a real production site
- **8 distinct aesthetic systems** — Helix gold/navy, Neuron light/clean, Axiom slate/teal, Pulse sage/cream, Aurora black/gold, Orbit black/acid-green, Monolith concrete, Atrium navy/champagne
- **Self-recorded video loops** of every demo in the Featured Work cards — proof the sites are live, not static images
- **Public GitHub repo** — `github.com/MuraduzzamanRifat/brandivibe`
- **Accessibility audited** — 44px touch targets, focus-visible, reduced-motion, overflow-x safe
- **Scoped CSS per theme** — zero CSS variable collisions across 8 different aesthetic systems
- **Atomic commit history** — follow the commits to see craft evolve

---

## Persona-specific messaging

### 🧑‍💼 Economic Buyer (Founder / CEO)

**What they care about**: ROI, speed to launch, taste signal to investors/press/recruits

**Tone**: Direct, results-focused, zero fluff

**Subject lines**:
- "Your seed deck looks better than your website"
- "6 weeks until your site looks Series A-ready"
- "We saw your [Recent Funding] — now let's fix the site"

**Hero pitch**:
> "Your fund round hits TechCrunch next Tuesday. Your current site is a Webflow template that looks like every other Series A you're competing with for talent. We can have you on a brandivibe.com-tier site in 6 weeks for $50K — here are 8 live demos in 8 industries. Which one feels closest to your brand?"

**Proof**: [Helix demo link if crypto, Neuron if SaaS, etc.] + public GitHub + 6-week fixed proposal

**Objection: "$50K is a lot for a website"**
→ "You just raised $8M. Your 18-month hiring plan is $4M. One senior design hire is $180K fully loaded. We're 4 months of that one hire, and you get a live launched site in 6 weeks instead of waiting for someone to ship."

**Objection: "We're moving too fast to do a full rebrand"**
→ "Same. That's why we do 6 weeks, not 16. Week 1 is discovery, weeks 2-5 build, week 6 polish and launch. We start Monday the 14th if you say yes by Friday."

---

### 👩‍💻 Technical Buyer (CTO / Head of Engineering)

**What they care about**: Code quality, vendor lock-in, maintainability, performance

**Tone**: Technical, specific, GitHub-forward

**Subject lines**:
- "Production Next.js 16 site in 6 weeks — full code review"
- "Your designer keeps asking for 3D. I do that."

**Hero pitch**:
> "Brandivibe sites ship as Next.js 16 App Router codebases. Server components by default, Tailwind v4, Framer Motion + Lenis + R3F, lazy-loaded video via IntersectionObserver, class-scoped CSS themes, SceneErrorBoundary for WebGL graceful degrade, `prefers-reduced-motion` respected. Public repo, atomic commits, no platform lock-in. `github.com/MuraduzzamanRifat/brandivibe` — review the commit history before we talk."

**Proof**: Public GitHub repo, live site, commit history, React Three Fiber expertise visible in `useFrame` hooks

**Objection: "We have engineers, we can build this ourselves"**
→ "Completely — and you should if brand is your edge. But if your engineers are building your core product, they shouldn't be writing custom GLSL shaders and Framer Motion scroll-linked 3D for a marketing site. That's what I do. You get 6 weeks of my time. Your engineers ship the product."

**Objection: "Why not Webflow?"**
→ "Webflow's great for a content site — if you can handle it with their components. Custom 3D, scroll-pinned filmstrips, real scroll-linked GLSL, CMS-driven programmatic SEO — that's a different engine. And when you outgrow Webflow and want to eject, you can't. With us, you always own the Next.js codebase."

---

### 🎨 Champion / Influencer (Head of Design / Brand / Marketing)

**What they care about**: Craft, taste signal, what their peers will say, being the one who pushed it

**Tone**: Conspiratorial — we're on your side against budget resistance

**Subject lines**:
- "Your founder doesn't get brand yet. Let me help."
- "How to pitch a $50K site internally"

**Hero pitch**:
> "You've been pushing for a real rebrand and getting 'we'll do it after the Series B.' Here's how I'd package it for your CEO: fixed scope, fixed price, 6 weeks, launched before [event]. Here are 8 live demos you can send to your founder with 'this is what I mean.' I'll draft the internal pitch with you if that helps."

**Bonus**: We ship a museum-quality printed poster with every project. You can literally hang it in the office and say "that's our brand now."

**Objection: "I'm not sure my CEO will approve $50K"**
→ "Here's the exact doc I send: [one-pager linking the closest-fit Brandivibe demo, 6-week timeline, ROI math comparing agency vs. in-house, case for doing it before the launch instead of after]. You can forward it as-is."

---

## Messaging testing plan

- **Cold email subject A/B**: "Your site vs. your fund round" vs. "A $90K-feel site for $50K" — send 50/50 to matched prospects, measure open rate
- **Landing page headline A/B**: current ("We design websites that clients remember") vs. alternative ("Active Theory quality at indie studio prices") — measure scroll depth + demo card clicks
- **LinkedIn post format**: cold outreach DM vs. tagged comment on funding announcement — measure response rate
- **Demo-first vs. value-first cold email**: "Here are 8 demos" vs. "Here's why your site is underserving" — measure reply rate

Run 4 weeks per test, 100+ sends, record in the AI brain's CRM with `messaging_variant` field.
