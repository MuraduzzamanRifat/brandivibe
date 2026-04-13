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
    | "error";
  timestamp: string;
  description: string;
  prospectId?: string;
  draftId?: string;
  articleId?: string;
  fbPostId?: string;
  planId?: string;
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
