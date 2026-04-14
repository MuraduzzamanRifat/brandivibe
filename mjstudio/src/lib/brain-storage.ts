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

/** A lead scraped from Google Maps via the Brandivibe Chrome extension */
export type GmapsLead = {
  id: string;
  /** Google's place_id if we can extract it, else hash of name+address */
  placeId?: string;
  name: string;
  address?: string;
  phone?: string;
  website?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  lat?: number;
  lng?: number;
  hours?: string;
  query: string;
  scrapedAt: string;
  source: "gmaps-extension";
  /** When the user converted this to a Prospect via the dashboard */
  convertedToProspect?: boolean;
  convertedProspectId?: string;
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
  const existingKeys = new Set(
    data.gmapsLeads.map((l) => l.placeId || `${l.name}|${l.address ?? ""}`.toLowerCase())
  );
  let added = 0;
  let deduped = 0;
  for (const l of leads) {
    const key = (l.placeId || `${l.name}|${l.address ?? ""}`).toLowerCase();
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
