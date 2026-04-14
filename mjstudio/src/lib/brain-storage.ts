import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { isGithubStorageEnabled, pullBrainJson, pushBrainJson } from "./github-storage";

/**
 * File-based storage for the AI sales brain, with optional GitHub sync.
 *
 * Local mode: reads/writes `mjstudio/data/brain.json` (gitignored).
 * GitHub mode (when GITHUB_REPO + GITHUB_TOKEN are set): pulls brain.json
 * from the repo on cold start, caches in-process, pushes on every save.
 * Solves Koyeb's ephemeral filesystem — state survives redeploys.
 */

export type Industry =
  | "crypto"
  | "saas"
  | "fintech"
  | "ai"
  | "healthcare"
  | "luxury"
  | "ev"
  | "architecture"
  | "vc";

export type IcpTier = "A" | "B" | "C" | "D";

export type ProspectStatus =
  | "new"
  | "researched"
  | "drafted"
  | "approved"
  | "sent"
  | "replied"
  | "booked"
  | "closed"
  | "lost";

export type Prospect = {
  id: string;
  company: string;
  domain: string;
  founder: string;
  role: string;
  email: string;
  linkedin?: string;
  industry: Industry;
  stage: string;
  recentFunding?: {
    amount: string;
    date: string;
    round: string;
  };
  trigger: string;
  icpTier: IcpTier;
  icpScore: number;
  bestFitDemo:
    | "helix"
    | "neuron"
    | "axiom"
    | "pulse"
    | "aurora"
    | "orbit"
    | "monolith"
    | "atrium";
  brandWeakness: string;
  estimatedBudget: string;
  status: ProspectStatus;
  notes?: string;
  source: "seed" | "techcrunch" | "product-hunt" | "crunchbase" | "manual";
  sourceUrl?: string;
  // Phase 4 outbound fields
  scraped?: ScrapedSite;
  deepResearch?: DeepResearch;
  emailFinder?: EmailFinderResult;
  sequence?: SequenceState;
  unsubscribed?: boolean;
  unsubscribedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type Activity = {
  id: string;
  type:
    | "source-run"
    | "prospect-added"
    | "prospect-skipped"
    | "draft-generated"
    | "plan-generated"
    | "article-published"
    | "fb-queued"
    | "fb-published"
    | "fb-rejected"
    | "metrics-pulled"
    | "insight-learned"
    | "rated"
    | "prospect-scraped"
    | "prospect-researched"
    | "email-found"
    | "email-drafted"
    | "email-sent"
    | "email-failed"
    | "email-bounced"
    | "unsubscribed"
    | "sequence-advanced"
    | "gmaps-leads-ingested"
    | "crm-contact-added"
    | "crm-email-sent"
    | "crm-template-edited"
    | "error";
  timestamp: string;
  description: string;
  prospectId?: string;
  draftId?: string;
  articleId?: string;
  fbPostId?: string;
  planId?: string;
  emailId?: string;
  source?: string;
  model?: string;
  tokens?: number;
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  heroImage: string;
  seoScore: number;
  wordCount: number;
  publishedAt: string;
  metrics?: {
    pageviews: number;
    avgTime: number;
    bounceRate: number;
    lastPulledAt: string;
  };
  rating?: "up" | "down";
};

export type FbPost = {
  id: string;
  status: "queued" | "published" | "rejected";
  body: string;
  imagePrompt: string;
  imageUrl?: string;
  imagePath?: string;
  articleSlug?: string;
  hashtags?: string[];
  createdAt: string;
  publishedAt?: string;
  fbPostId?: string;
  metrics?: {
    reach: number;
    reactions: number;
    clicks: number;
    lastPulledAt: string;
  };
  rating?: "up" | "down";
};

export type ArticleSpec = {
  title: string;
  slug: string;
  excerpt: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  outline: string[];
  body: string;
  heroImagePrompt: string;
};

export type FbPostSpec = {
  body: string;
  imagePrompt: string;
  hashtags: string[];
  articleSlug?: string;
};

export type LeadGenAction = {
  kind: "outbound-email" | "linkedin-dm" | "reply" | "reshare";
  target: string;
  script: string;
  rationale: string;
};

export type Plan = {
  id: string;
  date: string;
  article: ArticleSpec;
  fbPosts: FbPostSpec[];
  leadGen: LeadGenAction[];
  model: string;
  tokens: number;
  executed: boolean;
  rating?: "up" | "down";
};

export type LearningEntry = {
  id: string;
  date: string;
  signal: "fb" | "traffic" | "reply" | "manual";
  insight: string;
  evidence: Record<string, unknown>;
};

/** Scraper output — raw pages + detected tech stack + found contact info */
export type ScrapedSite = {
  fetchedAt: string;
  homepage: string;
  about?: string;
  team?: string;
  pricing?: string;
  contact?: string;
  techStack: string[];
  designScore: number;
  foundEmails: string[];
  foundSocials: { twitter?: string; linkedin?: string; github?: string };
  /** Structured page signals used for grounded deep research + fact-checking */
  structure: {
    title: string;
    metaDescription: string;
    h1: string[];
    h2: string[];
    h3: string[];
    navLinks: Array<{ text: string; href: string }>;
    buttons: string[];
    footerLinks: string[];
    hasContact: boolean;
    hasPricing: boolean;
    hasTeam: boolean;
    hasBlog: boolean;
    hasCareers: boolean;
    hasLogin: boolean;
  };
  /** The full unstripped HTML of the homepage — searched by fact-checker */
  rawHomepage: string;
};

/** Deep-research output — structured observations GPT-4o extracted */
export type DeepResearch = {
  realWeaknesses: string[];
  specificObservation: string;
  oneSentenceImpact: string;
  currentPainArea: string;
  observation1: string;
  observation2: string;
  observation3: string;
  fix1OneLine: string;
  fix2OneLine: string;
  fix3OneLine: string;
  topPriorityObservation: string;
  fixTimeEstimate: string;
  conversionMetric: string;
  industryName: string;
  techStackSummary: string;
  currentDesignScore: number;
  budget: string;
  decisionMaker: { name: string; role: string; firstName: string };
  confidence: number;
  /** Phase 4 hook upgrades — quantified loss-aversion line + 1-sentence personal note */
  quantifiedBleed?: string;
  personalClose?: string;
  createdAt: string;
  model: string;
  tokens: number;
};

/** Email finder output */
export type EmailFinderResult = {
  winner: string;
  source: "scraped" | "pattern";
  confidence: number;
  candidates: Array<{ email: string; score: number; reason: string }>;
  createdAt: string;
};

/** Sequence state attached to every prospect */
export type SequenceState = {
  stage: 0 | 1 | 2 | 3 | 4;
  nextSendAt?: string;
  lastSentAt?: string;
  lastOutcome?: "sent" | "bounced" | "opened" | "replied" | "stopped" | "unsubscribed";
  unsubscribeToken?: string;
};

/**
 * A lead scraped from Google Maps via the Brandivibe Chrome extension.
 *
 * Only 4 fields are stored: name, email (required, enriched server-side from
 * the website during ingestion), website, location. Leads without an email
 * are DROPPED at ingest time — they're not stored.
 */
export type GmapsLead = {
  id: string;
  name: string;
  email: string;
  website: string;
  location: string;
  /** Other emails found on the same site, kept for fallback */
  altEmails?: string[];
  /** The Maps search query that surfaced this lead */
  query: string;
  scrapedAt: string;
  source: "gmaps-extension";
  /** When the user converted this to a Prospect via the dashboard */
  convertedToProspect?: boolean;
  convertedProspectId?: string;
};

/**
 * CRM layer — unified contacts, editable email templates, and a history
 * of manually-sent emails. Sits alongside the autonomous Phase 4 pipeline:
 * contacts can come from gmaps leads, techcrunch prospects, audit requests,
 * or be added manually. Templates are fully editable — the user can create,
 * modify, and delete their own on top of the seed set.
 */

export type EmailTemplate = {
  id: string;
  name: string;
  category: "cold" | "followup" | "loom" | "breakup" | "audit" | "custom";
  subject: string;
  body: string;
  /** If true, this template came from the seed set — still fully editable */
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CrmContactStatus =
  | "new"
  | "contacted"
  | "replied"
  | "booked"
  | "closed-won"
  | "closed-lost"
  | "unsubscribed";

export type CrmContactSource =
  | "gmaps"
  | "techcrunch"
  | "audit"
  | "manual"
  | "imported";

export type CrmContact = {
  id: string;
  name: string;
  email: string;
  company?: string;
  website?: string;
  location?: string;
  status: CrmContactStatus;
  source: CrmContactSource;
  /** Free-text notes the user can add */
  notes?: string;
  /** Reference back to the original record (prospect id, gmaps lead id, etc) */
  sourceRefId?: string;
  /** Deep research snippet if available from the Phase 4 pipeline */
  observation?: string;
  tags?: string[];
  lastContactedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type CrmEmail = {
  id: string;
  contactId: string;
  templateId?: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  status: "draft" | "sent" | "failed";
  resendId?: string;
  failReason?: string;
  sentAt?: string;
  createdAt: string;
};

/** A single email queued to go out via Resend */
export type OutboundEmail = {
  id: string;
  prospectId: string;
  sequenceTouch: 1 | 2 | 3 | 4;
  subject: string;
  body: string;
  to: string;
  from: string;
  replyTo: string;
  sendAt: string;
  createdAt: string;
  status: "queued" | "sent" | "failed" | "bounced" | "suppressed";
  resendId?: string;
  sentAt?: string;
  failReason?: string;
  model?: string;
  tokens?: number;
};

/**
 * DailyRun is the idempotency/resume ledger for the brain cron. Keyed by
 * date (YYYY-MM-DD). Each phase (plan, article, fb-per-post, score) has a
 * status we consult before doing the work so retries never duplicate
 * LLM/DALL-E spend and a killed request can be resumed from checkpoint.
 */
export type DailyRun = {
  date: string;
  startedAt: string;
  updatedAt: string;
  planId?: string;
  phases: {
    plan: "pending" | "done" | "failed";
    article: "pending" | "done" | "failed" | "skipped";
    fb: Array<"pending" | "done" | "failed">;
    score: "pending" | "done" | "failed";
    research?: "pending" | "done" | "failed";
    sequence?: "pending" | "done" | "failed";
    send?: "pending" | "done" | "failed";
  };
  lastError?: string;
};

export type Draft = {
  id: string;
  prospectId: string;
  subject: string;
  body: string;
  variant: "funding" | "launch" | "hire" | "brand-weakness" | "manual";
  persona: "economic" | "technical" | "champion";
  model: string;
  tokensUsed?: number;
  createdAt: string;
  approved: boolean;
};

type BrainData = {
  prospects: Prospect[];
  drafts: Draft[];
  activities?: Activity[];
  articles?: Article[];
  fbQueue?: FbPost[];
  plans?: Plan[];
  learning?: LearningEntry[];
  runs?: DailyRun[];
  outboundQueue?: OutboundEmail[];
  /** Daily send counter keyed by YYYY-MM-DD — used by warmup gate */
  sendCounts?: Record<string, number>;
  /** Per-domain last-send timestamp — used by per-domain cap */
  lastSendByDomain?: Record<string, string>;
  /** ISO date the sender started sending — used to compute warmup day */
  sendingSince?: string;
  /** Google Maps leads scraped via the Brandivibe Chrome extension */
  gmapsLeads?: GmapsLead[];
  /** CRM layer — see types above */
  crmContacts?: CrmContact[];
  emailTemplates?: EmailTemplate[];
  crmEmails?: CrmEmail[];
};

const DATA_DIR = path.resolve(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "brain.json");

let memCache: BrainData | null = null;
let memSha: string | undefined = undefined;

function ensureShape(d: Partial<BrainData> | undefined | null): BrainData {
  return {
    prospects: d?.prospects ?? [],
    drafts: d?.drafts ?? [],
    activities: d?.activities ?? [],
    articles: d?.articles ?? [],
    fbQueue: d?.fbQueue ?? [],
    plans: d?.plans ?? [],
    learning: d?.learning ?? [],
    runs: d?.runs ?? [],
    outboundQueue: d?.outboundQueue ?? [],
    sendCounts: d?.sendCounts ?? {},
    lastSendByDomain: d?.lastSendByDomain ?? {},
    sendingSince: d?.sendingSince,
    gmapsLeads: d?.gmapsLeads ?? [],
    crmContacts: d?.crmContacts ?? [],
    emailTemplates: d?.emailTemplates ?? [],
    crmEmails: d?.crmEmails ?? [],
  };
}

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

async function loadFromDisk(): Promise<BrainData> {
  await ensureDataDir();
  try {
    const raw = await readFile(FILE, "utf8");
    return ensureShape(JSON.parse(raw) as Partial<BrainData>);
  } catch {
    return ensureShape(null);
  }
}

export async function loadBrain(): Promise<BrainData> {
  if (memCache) return memCache;
  if (isGithubStorageEnabled()) {
    try {
      const pulled = await pullBrainJson();
      if (pulled) {
        memCache = ensureShape(pulled.data as Partial<BrainData>);
        memSha = pulled.sha;
        return memCache;
      }
    } catch (err) {
      console.error("[brain] GitHub pull failed, falling back to disk:", err);
    }
  }
  memCache = await loadFromDisk();
  return memCache;
}

export async function saveBrain(data: BrainData): Promise<void> {
  const shaped = ensureShape(data);
  memCache = shaped;
  await ensureDataDir();
  await writeFile(FILE, JSON.stringify(shaped, null, 2), "utf8");
  if (isGithubStorageEnabled()) {
    try {
      memSha = await pushBrainJson(shaped, memSha);
    } catch (err) {
      console.error("[brain] GitHub push failed:", err);
    }
  }
}

export async function upsertProspect(p: Prospect): Promise<void> {
  const data = await loadBrain();
  const idx = data.prospects.findIndex((x) => x.id === p.id);
  if (idx >= 0) {
    data.prospects[idx] = { ...p, updatedAt: new Date().toISOString() };
  } else {
    data.prospects.push(p);
  }
  await saveBrain(data);
}

export async function addDraft(d: Draft): Promise<void> {
  const data = await loadBrain();
  data.drafts.push(d);
  // bump prospect status to drafted
  const p = data.prospects.find((x) => x.id === d.prospectId);
  if (p && (p.status === "new" || p.status === "researched")) {
    p.status = "drafted";
    p.updatedAt = new Date().toISOString();
  }
  await saveBrain(data);
}

export async function logActivity(a: Omit<Activity, "id" | "timestamp"> & { id?: string; timestamp?: string }): Promise<Activity> {
  const data = await loadBrain();
  const activity: Activity = {
    id: a.id ?? `act_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: a.timestamp ?? new Date().toISOString(),
    type: a.type,
    description: a.description,
    prospectId: a.prospectId,
    draftId: a.draftId,
    source: a.source,
    model: a.model,
    tokens: a.tokens,
  };
  data.activities = data.activities ?? [];
  data.activities.unshift(activity);
  if (data.activities.length > 500) data.activities.length = 500;
  await saveBrain(data);
  return activity;
}

export async function loadActivities(limit = 50): Promise<Activity[]> {
  const data = await loadBrain();
  return (data.activities ?? []).slice(0, limit);
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function enqueueOutbound(email: OutboundEmail): Promise<void> {
  const data = await loadBrain();
  data.outboundQueue = data.outboundQueue ?? [];
  data.outboundQueue.push(email);
  if (data.outboundQueue.length > 2000) {
    data.outboundQueue = data.outboundQueue.slice(-2000);
  }
  await saveBrain(data);
}

export async function updateOutbound(
  id: string,
  patch: Partial<OutboundEmail>
): Promise<void> {
  const data = await loadBrain();
  const q = data.outboundQueue ?? [];
  const idx = q.findIndex((x) => x.id === id);
  if (idx >= 0) {
    q[idx] = { ...q[idx], ...patch };
    await saveBrain(data);
  }
}

export async function updateProspectResearch(
  id: string,
  patch: Partial<Prospect>
): Promise<void> {
  const data = await loadBrain();
  const p = data.prospects.find((x) => x.id === id);
  if (p) {
    Object.assign(p, patch);
    p.updatedAt = new Date().toISOString();
    await saveBrain(data);
  }
}

export async function ingestGmapsLeads(
  leads: GmapsLead[]
): Promise<{ added: number; deduped: number }> {
  if (!Array.isArray(leads) || leads.length === 0) return { added: 0, deduped: 0 };
  const data = await loadBrain();
  data.gmapsLeads = data.gmapsLeads ?? [];
  // Dedupe primarily by email (the unique key per business contact)
  const existingKeys = new Set(
    data.gmapsLeads.map((l) => l.email.toLowerCase())
  );
  let added = 0;
  let deduped = 0;
  for (const l of leads) {
    if (!l.email) {
      deduped++;
      continue;
    }
    const key = l.email.toLowerCase();
    if (existingKeys.has(key)) {
      deduped++;
      continue;
    }
    existingKeys.add(key);
    data.gmapsLeads.push({
      ...l,
      id: l.id || `gm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      source: "gmaps-extension",
      scrapedAt: l.scrapedAt || new Date().toISOString(),
    });
    added++;
  }
  if (data.gmapsLeads.length > 50_000) {
    data.gmapsLeads = data.gmapsLeads.slice(-50_000);
  }
  await saveBrain(data);
  return { added, deduped };
}

export async function listGmapsLeads(limit = 500): Promise<GmapsLead[]> {
  const data = await loadBrain();
  return (data.gmapsLeads ?? []).slice(-limit).reverse();
}

// ─────────────── CRM: Contacts ───────────────

export async function listCrmContacts(): Promise<CrmContact[]> {
  const data = await loadBrain();
  return (data.crmContacts ?? []).slice().reverse();
}

export async function upsertCrmContact(c: Partial<CrmContact> & { email: string; name: string }): Promise<CrmContact> {
  const data = await loadBrain();
  data.crmContacts = data.crmContacts ?? [];
  const now = new Date().toISOString();
  const emailLower = c.email.toLowerCase();
  const existing = data.crmContacts.find((x) => x.email.toLowerCase() === emailLower);
  if (existing) {
    Object.assign(existing, c, { email: emailLower, updatedAt: now });
    await saveBrain(data);
    return existing;
  }
  const contact: CrmContact = {
    id: c.id || `crm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: c.name,
    email: emailLower,
    company: c.company,
    website: c.website,
    location: c.location,
    status: c.status ?? "new",
    source: c.source ?? "manual",
    notes: c.notes,
    sourceRefId: c.sourceRefId,
    observation: c.observation,
    tags: c.tags,
    lastContactedAt: c.lastContactedAt,
    createdAt: now,
    updatedAt: now,
  };
  data.crmContacts.push(contact);
  await saveBrain(data);
  return contact;
}

export async function patchCrmContact(id: string, patch: Partial<CrmContact>): Promise<CrmContact | null> {
  const data = await loadBrain();
  const contact = (data.crmContacts ?? []).find((c) => c.id === id);
  if (!contact) return null;
  Object.assign(contact, patch, { updatedAt: new Date().toISOString() });
  await saveBrain(data);
  return contact;
}

export async function deleteCrmContact(id: string): Promise<boolean> {
  const data = await loadBrain();
  const before = (data.crmContacts ?? []).length;
  data.crmContacts = (data.crmContacts ?? []).filter((c) => c.id !== id);
  if (data.crmContacts.length === before) return false;
  await saveBrain(data);
  return true;
}

/**
 * Import contacts from the existing data sources (gmaps leads, prospects,
 * audit requests) and dedupe them by email. Never overwrites a manually
 * edited contact.
 */
export async function syncCrmContactsFromSources(): Promise<{ added: number; skipped: number }> {
  const data = await loadBrain();
  data.crmContacts = data.crmContacts ?? [];
  const existing = new Set(data.crmContacts.map((c) => c.email.toLowerCase()));
  let added = 0;
  let skipped = 0;

  // 1. From gmaps leads — they always have email after our Phase 4 enrichment
  for (const lead of data.gmapsLeads ?? []) {
    if (!lead.email) continue;
    if (existing.has(lead.email.toLowerCase())) { skipped++; continue; }
    const contact: CrmContact = {
      id: `crm_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: lead.name,
      email: lead.email.toLowerCase(),
      website: lead.website,
      location: lead.location,
      status: "new",
      source: "gmaps",
      sourceRefId: lead.id,
      createdAt: lead.scrapedAt,
      updatedAt: lead.scrapedAt,
    };
    data.crmContacts.push(contact);
    existing.add(contact.email);
    added++;
  }

  // 2. From prospects — only those with emails (from email-finder or audit)
  for (const p of data.prospects) {
    const email = (p.emailFinder?.winner || p.email || "").toLowerCase();
    if (!email) continue;
    if (existing.has(email)) { skipped++; continue; }
    const contact: CrmContact = {
      id: `crm_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: p.founder || p.company,
      email,
      company: p.company,
      website: p.domain,
      status: "new",
      source: p.source === "manual" ? "audit" : "techcrunch",
      sourceRefId: p.id,
      observation: p.deepResearch?.specificObservation,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    };
    data.crmContacts.push(contact);
    existing.add(email);
    added++;
  }

  await saveBrain(data);
  return { added, skipped };
}

// ─────────────── CRM: Templates ───────────────

export async function listEmailTemplates(): Promise<EmailTemplate[]> {
  const data = await loadBrain();
  return (data.emailTemplates ?? []).slice().sort((a, b) => a.name.localeCompare(b.name));
}

export async function upsertEmailTemplate(t: Partial<EmailTemplate> & { name: string; subject: string; body: string }): Promise<EmailTemplate> {
  const data = await loadBrain();
  data.emailTemplates = data.emailTemplates ?? [];
  const now = new Date().toISOString();
  if (t.id) {
    const existing = data.emailTemplates.find((x) => x.id === t.id);
    if (existing) {
      Object.assign(existing, t, { updatedAt: now });
      await saveBrain(data);
      return existing;
    }
  }
  const template: EmailTemplate = {
    id: t.id || `tpl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: t.name,
    category: t.category ?? "custom",
    subject: t.subject,
    body: t.body,
    isSystem: t.isSystem ?? false,
    createdAt: now,
    updatedAt: now,
  };
  data.emailTemplates.push(template);
  await saveBrain(data);
  return template;
}

export async function deleteEmailTemplate(id: string): Promise<boolean> {
  const data = await loadBrain();
  const before = (data.emailTemplates ?? []).length;
  data.emailTemplates = (data.emailTemplates ?? []).filter((t) => t.id !== id);
  if (data.emailTemplates.length === before) return false;
  await saveBrain(data);
  return true;
}

/** Seed the template collection with the default set if empty. */
export async function seedTemplatesIfEmpty(seeds: EmailTemplate[]): Promise<number> {
  const data = await loadBrain();
  if ((data.emailTemplates ?? []).length > 0) return 0;
  data.emailTemplates = seeds;
  await saveBrain(data);
  return seeds.length;
}

// ─────────────── CRM: Sent emails history ───────────────

export async function addCrmEmail(email: CrmEmail): Promise<void> {
  const data = await loadBrain();
  data.crmEmails = data.crmEmails ?? [];
  data.crmEmails.unshift(email);
  if (data.crmEmails.length > 5000) data.crmEmails = data.crmEmails.slice(0, 5000);
  // Bump contact status + lastContactedAt when a send succeeds
  if (email.status === "sent") {
    const contact = (data.crmContacts ?? []).find((c) => c.id === email.contactId);
    if (contact) {
      contact.lastContactedAt = email.sentAt || new Date().toISOString();
      if (contact.status === "new") contact.status = "contacted";
      contact.updatedAt = new Date().toISOString();
    }
  }
  await saveBrain(data);
}

export async function listCrmEmailsForContact(contactId: string): Promise<CrmEmail[]> {
  const data = await loadBrain();
  return (data.crmEmails ?? []).filter((e) => e.contactId === contactId);
}

export async function markUnsubscribed(prospectId: string): Promise<void> {
  const data = await loadBrain();
  const p = data.prospects.find((x) => x.id === prospectId);
  if (p) {
    p.unsubscribed = true;
    p.unsubscribedAt = new Date().toISOString();
    if (p.sequence) p.sequence.lastOutcome = "unsubscribed";
    // Suppress all queued outbound for this prospect
    for (const e of data.outboundQueue ?? []) {
      if (e.prospectId === prospectId && e.status === "queued") {
        e.status = "suppressed";
        e.failReason = "unsubscribed";
      }
    }
    await saveBrain(data);
  }
}

export async function getOrCreateRun(date: string, fbSlots = 3): Promise<DailyRun> {
  const data = await loadBrain();
  data.runs = data.runs ?? [];
  let run = data.runs.find((r) => r.date === date);
  if (!run) {
    run = {
      date,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      phases: {
        plan: "pending",
        article: "pending",
        fb: Array.from({ length: fbSlots }, () => "pending" as const),
        score: "pending",
        research: "pending",
        sequence: "pending",
        send: "pending",
      },
    };
    data.runs.unshift(run);
    if (data.runs.length > 60) data.runs.length = 60;
    await saveBrain(data);
  } else {
    // Backfill phases for old runs that predate Phase 4
    if (!run.phases.research) run.phases.research = "pending";
    if (!run.phases.sequence) run.phases.sequence = "pending";
    if (!run.phases.send) run.phases.send = "pending";
  }
  return run;
}

export async function updateRun(
  date: string,
  patch: (r: DailyRun) => void
): Promise<DailyRun> {
  const data = await loadBrain();
  data.runs = data.runs ?? [];
  const run = data.runs.find((r) => r.date === date);
  if (!run) throw new Error(`DailyRun ${date} not found`);
  patch(run);
  run.updatedAt = new Date().toISOString();
  await saveBrain(data);
  return run;
}

export async function addPlan(plan: Plan): Promise<void> {
  const data = await loadBrain();
  data.plans = data.plans ?? [];
  data.plans.unshift(plan);
  if (data.plans.length > 90) data.plans.length = 90;
  await saveBrain(data);
}

export async function markPlanExecuted(id: string): Promise<void> {
  const data = await loadBrain();
  const p = (data.plans ?? []).find((x) => x.id === id);
  if (p) {
    p.executed = true;
    await saveBrain(data);
  }
}

export async function addArticle(article: Article): Promise<void> {
  const data = await loadBrain();
  data.articles = data.articles ?? [];
  data.articles.unshift(article);
  await saveBrain(data);
}

export async function addFbPost(post: FbPost): Promise<void> {
  const data = await loadBrain();
  data.fbQueue = data.fbQueue ?? [];
  data.fbQueue.unshift(post);
  await saveBrain(data);
}

export async function updateFbPost(id: string, patch: Partial<FbPost>): Promise<void> {
  const data = await loadBrain();
  const q = data.fbQueue ?? [];
  const idx = q.findIndex((x) => x.id === id);
  if (idx >= 0) {
    q[idx] = { ...q[idx], ...patch };
    await saveBrain(data);
  }
}

export async function addLearning(entry: LearningEntry): Promise<void> {
  const data = await loadBrain();
  data.learning = data.learning ?? [];
  data.learning.unshift(entry);
  if (data.learning.length > 200) data.learning.length = 200;
  await saveBrain(data);
}

export async function rateItem(
  kind: "article" | "fbPost" | "draft" | "plan",
  id: string,
  vote: "up" | "down"
): Promise<boolean> {
  const data = await loadBrain();
  let target: { rating?: "up" | "down" } | undefined;
  if (kind === "article") target = (data.articles ?? []).find((x) => x.id === id);
  else if (kind === "fbPost") target = (data.fbQueue ?? []).find((x) => x.id === id);
  else if (kind === "plan") target = (data.plans ?? []).find((x) => x.id === id);
  else if (kind === "draft") target = data.drafts.find((x) => x.id === id) as unknown as { rating?: "up" | "down" };
  if (!target) return false;
  target.rating = vote;
  await saveBrain(data);
  return true;
}

export async function seedIfEmpty(seeds: Prospect[]): Promise<number> {
  const data = await loadBrain();
  if (data.prospects.length > 0) return 0;
  data.prospects = seeds;
  await saveBrain(data);
  return seeds.length;
}
