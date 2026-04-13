import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

/**
 * Simple file-based storage for the AI sales brain. No database required.
 * Stores prospects + drafts in JSON files under `mjstudio/data/`.
 *
 * This directory is gitignored (see .gitignore) so real prospect data
 * never ends up in the repo. The seed file is separate and committed.
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
    | "error";
  timestamp: string;
  description: string;
  prospectId?: string;
  draftId?: string;
  source?: string;
  model?: string;
  tokens?: number;
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
};

const DATA_DIR = path.resolve(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "brain.json");

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

export async function loadBrain(): Promise<BrainData> {
  await ensureDataDir();
  try {
    const raw = await readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as BrainData;
    if (!parsed.activities) parsed.activities = [];
    return parsed;
  } catch {
    return { prospects: [], drafts: [], activities: [] };
  }
}

export async function saveBrain(data: BrainData): Promise<void> {
  await ensureDataDir();
  await writeFile(FILE, JSON.stringify(data, null, 2), "utf8");
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

export async function seedIfEmpty(seeds: Prospect[]): Promise<number> {
  const data = await loadBrain();
  if (data.prospects.length > 0) return 0;
  data.prospects = seeds;
  await saveBrain(data);
  return seeds.length;
}
