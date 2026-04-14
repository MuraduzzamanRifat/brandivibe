import type { EmailTemplate } from "../brain-storage";

/**
 * Default email templates seeded into the CRM on first load. All follow the
 * voice contract from marketing/sequences.md and include {{merge}} slots the
 * CRM compose flow auto-fills from the selected contact.
 *
 * Every template is fully editable in the dashboard. The user can modify
 * name, subject, body, category at any time. They can also delete a seed
 * template and it won't be re-added unless the templates array is emptied.
 *
 * Merge slot reference (auto-filled from the selected contact):
 *   {{firstName}}    — first name or "there"
 *   {{name}}         — full name
 *   {{company}}      — company name or the domain root
 *   {{website}}      — full website URL
 *   {{domain}}       — domain without https:// or www.
 *   {{location}}     — location string
 *   {{observation}}  — deep-research observation (if available)
 *   {{calendly}}     — BRANDIVIBE_CALENDLY_URL env var
 *   {{email}}        — contact email (rarely used in body)
 */

const now = new Date().toISOString();

export const SEED_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "tpl-cold-observation",
    name: "Cold opener — specific observation",
    category: "cold",
    isSystem: true,
    subject: "two things I'd fix on {{domain}}",
    body: `{{firstName}},

I was looking at {{website}} and noticed {{observation}}.

I run Brandivibe — a solo studio that rebuilds founder homepages in 6 weeks for $35–90K. Not pitching yet, just curious: is that on your "fine for now" pile or actively bugging you?

One-line answer is plenty.

Muraduzzaman
Brandivibe — brandivibe.com`,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "tpl-value-drop",
    name: "Value drop — three observations",
    category: "followup",
    isSystem: true,
    subject: "3 things I'd fix on {{domain}}",
    body: `{{firstName}} — no reply needed, just sharing.

I spent 20 minutes on {{website}} this morning. Three things worth fixing:

1. [observation 1 — customize me]
2. [observation 2 — customize me]
3. [observation 3 — customize me]

The one I'd fix first is the hero. It's a 1–2 day lift and probably moves your conversion more than anything else on the site.

brandivibe.com/neuron is what a {{company}}-stage rebuild looks like at the $35–90K tier. Worth 15 min of poking around even if you don't end up working with me.

Muraduzzaman
Brandivibe`,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "tpl-loom-offer",
    name: "Free loom walkthrough offer",
    category: "loom",
    isSystem: true,
    subject: "{{company}} — 5-min loom walkthrough?",
    body: `{{firstName}},

I'll record a 5-minute loom walking through exactly how I'd fix the top issue on {{website}} — specific changes, before/after, no pitch. Free, async, in your inbox within 48 hours.

Interested? Reply "loom" and I'll get it recorded by end of week.

Or if you'd rather talk live: {{calendly}}

Muraduzzaman
Brandivibe — brandivibe.com`,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "tpl-quick-followup",
    name: "Quick follow-up — still there?",
    category: "followup",
    isSystem: true,
    subject: "re: {{domain}}",
    body: `{{firstName}},

Following up on my note from earlier — did my email make it through the filter or did I completely miss the mark on what you're focused on right now?

Either answer is useful. One line is plenty.

Muraduzzaman
Brandivibe`,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "tpl-breakup",
    name: "Breakup — closing the loop",
    category: "breakup",
    isSystem: true,
    subject: "closing the loop on {{company}}",
    body: `{{firstName}},

Closing this thread — I've got a standard 4-touch rule and this is touch 4.

If "not interested" → one-line reply stops me forever, no hard feelings.
If "not now" → I'll circle back next quarter.
If I just caught you on a bad week → {{calendly}}

Either way, good luck with {{company}}.

Muraduzzaman
Brandivibe — brandivibe.com`,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "tpl-audit-recipient",
    name: "Audit recipient — warm follow-up",
    category: "audit",
    isSystem: true,
    subject: "the loom for {{domain}}",
    body: `{{firstName}},

Thanks for running the audit on {{website}} — I saw the report fire in my inbox this morning.

If you want me to actually record that 5-minute loom I offered at the bottom of the audit, just reply "loom" and I'll have it in your inbox within 48 hours. No pitch, no slides, just the top priority from your report walked through with screenshots of how I'd fix it.

Or grab 15 min: {{calendly}}

Muraduzzaman
Brandivibe`,
    createdAt: now,
    updatedAt: now,
  },
];
