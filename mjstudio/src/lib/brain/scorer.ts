import { getOpenAI, MODELS } from "../openai";
import {
  loadBrain,
  saveBrain,
  addLearning,
  type LearningEntry,
} from "../brain-storage";

/**
 * Self-learning scorer. Runs after the executor. Pulls metrics for anything
 * published >24h ago and not yet scored, then asks GPT-4o-mini to extract
 * one short "insight" per batch that the next planner run will see.
 *
 * Gracefully skips any signal whose env vars are missing.
 */

function plausibleEnv() {
  return {
    siteId: process.env.PLAUSIBLE_SITE_ID,
    apiKey: process.env.PLAUSIBLE_API_KEY,
  };
}

async function pullPlausible(slug: string): Promise<{ pageviews: number; avgTime: number; bounceRate: number } | null> {
  const { siteId, apiKey } = plausibleEnv();
  if (!siteId || !apiKey) return null;
  const params = new URLSearchParams({
    site_id: siteId,
    period: "7d",
    metrics: "pageviews,visit_duration,bounce_rate",
    filters: `event:page==/journal/${slug}`,
  });
  const url = `https://plausible.io/api/v1/stats/aggregate?${params.toString()}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
  if (!res.ok) return null;
  const json = (await res.json()) as {
    results?: {
      pageviews?: { value: number };
      visit_duration?: { value: number };
      bounce_rate?: { value: number };
    };
  };
  const r = json.results;
  if (!r) return null;
  return {
    pageviews: r.pageviews?.value ?? 0,
    avgTime: r.visit_duration?.value ?? 0,
    bounceRate: r.bounce_rate?.value ?? 0,
  };
}

async function pullFbInsights(fbPostId: string): Promise<{ reach: number; reactions: number; clicks: number } | null> {
  const token = process.env.FACEBOOK_ACCESS_TOKEN;
  if (!token) return null;
  const metrics = "post_impressions_unique,post_reactions_by_type_total,post_clicks";
  const url = `https://graph.facebook.com/v19.0/${fbPostId}/insights?metric=${metrics}&access_token=${token}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const json = (await res.json()) as { data?: Array<{ name: string; values: Array<{ value: unknown }> }> };
  const get = (name: string) => {
    const row = json.data?.find((d) => d.name === name);
    const v = row?.values?.[0]?.value;
    if (typeof v === "number") return v;
    if (v && typeof v === "object") {
      return Object.values(v as Record<string, number>).reduce((s, n) => s + (typeof n === "number" ? n : 0), 0);
    }
    return 0;
  };
  return {
    reach: get("post_impressions_unique"),
    reactions: get("post_reactions_by_type_total"),
    clicks: get("post_clicks"),
  };
}

export type ScoreSummary = {
  articlesScored: number;
  fbPostsScored: number;
  insightsLearned: number;
  tokens: number;
};

export async function scoreYesterday(): Promise<ScoreSummary> {
  const summary: ScoreSummary = { articlesScored: 0, fbPostsScored: 0, insightsLearned: 0, tokens: 0 };
  const brain = await loadBrain();
  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;

  // 1. Articles
  const articles = brain.articles ?? [];
  for (const a of articles) {
    if (a.metrics) continue;
    if (now - new Date(a.publishedAt).getTime() < DAY) continue;
    const m = await pullPlausible(a.slug);
    if (m) {
      a.metrics = { ...m, lastPulledAt: new Date().toISOString() };
      summary.articlesScored++;
    }
  }

  // 2. FB posts
  const queue = brain.fbQueue ?? [];
  for (const p of queue) {
    if (p.metrics) continue;
    if (!p.publishedAt || !p.fbPostId) continue;
    if (now - new Date(p.publishedAt).getTime() < DAY) continue;
    const m = await pullFbInsights(p.fbPostId);
    if (m) {
      p.metrics = { ...m, lastPulledAt: new Date().toISOString() };
      summary.fbPostsScored++;
    }
  }

  await saveBrain(brain);

  // 3. Extract insights if we have enough evidence
  if (summary.articlesScored + summary.fbPostsScored > 0 || (brain.articles ?? []).some((a) => a.rating) || (brain.fbQueue ?? []).some((p) => p.rating)) {
    const insight = await extractInsight(brain);
    if (insight) {
      await addLearning(insight.entry);
      summary.insightsLearned = 1;
      summary.tokens = insight.tokens;
    }
  }

  return summary;
}

async function extractInsight(
  brain: Awaited<ReturnType<typeof loadBrain>>
): Promise<{ entry: LearningEntry; tokens: number } | null> {
  const openai = getOpenAI();
  const evidence = {
    topArticles: (brain.articles ?? [])
      .filter((a) => a.metrics || a.rating)
      .slice(0, 10)
      .map((a) => ({
        title: a.title,
        primaryKeyword: a.primaryKeyword,
        pageviews: a.metrics?.pageviews ?? 0,
        avgTime: a.metrics?.avgTime ?? 0,
        rating: a.rating,
      })),
    topFbPosts: (brain.fbQueue ?? [])
      .filter((p) => p.metrics || p.rating)
      .slice(0, 10)
      .map((p) => ({
        body: p.body.slice(0, 120),
        reach: p.metrics?.reach ?? 0,
        reactions: p.metrics?.reactions ?? 0,
        clicks: p.metrics?.clicks ?? 0,
        rating: p.rating,
      })),
  };

  if (evidence.topArticles.length === 0 && evidence.topFbPosts.length === 0) return null;

  const completion = await openai.chat.completions.create({
    model: MODELS.FAST,
    response_format: { type: "json_object" },
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content:
          "You are a terse marketing analyst. Given recent article and FB post performance data, emit ONE short insight (≤180 chars) about what is working or failing. The next content planner will read this verbatim. Return {\"insight\": string}.",
      },
      { role: "user", content: JSON.stringify(evidence) },
    ],
  });
  const content = completion.choices[0]?.message?.content ?? "{}";
  let parsed: { insight?: string };
  try {
    parsed = JSON.parse(content);
  } catch {
    return null;
  }
  if (!parsed.insight) return null;
  const entry: LearningEntry = {
    id: `learn_${Date.now()}`,
    date: new Date().toISOString().slice(0, 10),
    signal: (brain.articles ?? []).some((a) => a.metrics)
      ? "traffic"
      : (brain.fbQueue ?? []).some((p) => p.metrics)
      ? "fb"
      : "manual",
    insight: parsed.insight,
    evidence,
  };
  return { entry, tokens: completion.usage?.total_tokens ?? 0 };
}
