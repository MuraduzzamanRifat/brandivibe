import type { BrainData, SenderAccount } from "../brain-storage";

/**
 * Multi-sender rotation. With N enabled sender accounts each capping at 30-50
 * emails/day, the system can sustain 300-500 emails/day instead of being
 * stuck behind a single account's warmup curve.
 *
 * Pick algorithm (in priority order):
 *   1. Filter to enabled accounts that are NOT circuit-broken
 *   2. Skip accounts already at their per-day cap (warmup-aware)
 *   3. Pick the account with the LOWEST sent-today count (load balance)
 *   4. Tie-break by oldest lastSentAt (round-robin)
 *
 * Warmup curve per account: day 1 = 5, +3/day, steady at dailyCap from day 30.
 * Same curve as the legacy single-sender, just applied per-account so a brand
 * new sender ramps up alongside fully-warmed-up ones.
 *
 * Returns null if NO sender is eligible — caller should not send and should
 * keep the email queued for the next tick.
 */

const WARMUP_START = 5;
const WARMUP_STEP = 3;
const WARMUP_CAP_DAYS = 30;

function todayKey(now: Date): string {
  return now.toISOString().slice(0, 10);
}

function daysSince(iso: string, now: Date): number {
  return Math.floor((now.getTime() - new Date(iso).getTime()) / 86_400_000);
}

/** Effective per-day cap for an account, given its warmup state. */
function effectiveCap(account: SenderAccount, now: Date): number {
  if (!account.warmupStartedAt) return WARMUP_START;
  const dayIndex = daysSince(account.warmupStartedAt, now) + 1;
  if (dayIndex >= WARMUP_CAP_DAYS) return account.dailyCap;
  return Math.min(account.dailyCap, WARMUP_START + (dayIndex - 1) * WARMUP_STEP);
}

export type SenderPickResult = {
  account: SenderAccount;
  effectiveCap: number;
  sentToday: number;
};

/**
 * Pick the next eligible sender. MUTATES brain.senderAccounts in-place by
 * updating the chosen account's sentByDay, sentLifetime, lastSentAt — caller
 * is responsible for the saveBrain() call after the actual send completes.
 *
 * Returns null when every account is at cap or disabled.
 */
export function pickNextSender(brain: BrainData, now: Date = new Date()): SenderPickResult | null {
  const accounts = brain.senderAccounts ?? [];
  const today = todayKey(now);

  type Eligible = { account: SenderAccount; cap: number; sent: number };
  const eligible: Eligible[] = [];

  for (const account of accounts) {
    if (!account.enabled) continue;
    if (account.circuitBreakerTrippedAt) continue;
    const cap = effectiveCap(account, now);
    const sent = (account.sentByDay ?? {})[today] ?? 0;
    if (sent >= cap) continue;
    eligible.push({ account, cap, sent });
  }

  if (eligible.length === 0) return null;

  // Sort by lowest sent-today first; tiebreak by oldest lastSentAt so we
  // round-robin through accounts that are tied at zero.
  eligible.sort((a, b) => {
    if (a.sent !== b.sent) return a.sent - b.sent;
    const ta = a.account.lastSentAt ? new Date(a.account.lastSentAt).getTime() : 0;
    const tb = b.account.lastSentAt ? new Date(b.account.lastSentAt).getTime() : 0;
    return ta - tb;
  });

  return {
    account: eligible[0].account,
    effectiveCap: eligible[0].cap,
    sentToday: eligible[0].sent,
  };
}

/**
 * Mark a successful send against the account in-place. Caller saves brain
 * once per tick (not per send) for efficiency.
 */
export function recordSend(account: SenderAccount, now: Date = new Date()): void {
  const today = todayKey(now);
  account.sentByDay = account.sentByDay ?? {};
  account.sentByDay[today] = (account.sentByDay[today] ?? 0) + 1;
  account.sentLifetime = (account.sentLifetime ?? 0) + 1;
  account.lastSentAt = now.toISOString();
  if (!account.warmupStartedAt) {
    account.warmupStartedAt = now.toISOString();
  }
}

/**
 * Total daily cap across all enabled, non-broken senders — what the entire
 * pool can deliver today, accounting for individual warmup states.
 */
export function poolDailyCapacity(brain: BrainData, now: Date = new Date()): {
  capacity: number;
  sentToday: number;
  remaining: number;
  enabledAccounts: number;
} {
  const accounts = brain.senderAccounts ?? [];
  const today = todayKey(now);
  let capacity = 0;
  let sent = 0;
  let enabled = 0;

  for (const account of accounts) {
    if (!account.enabled) continue;
    if (account.circuitBreakerTrippedAt) continue;
    enabled++;
    capacity += effectiveCap(account, now);
    sent += (account.sentByDay ?? {})[today] ?? 0;
  }

  return {
    capacity,
    sentToday: sent,
    remaining: Math.max(0, capacity - sent),
    enabledAccounts: enabled,
  };
}

/**
 * Auto-pause an account on suspicious failures. Some Resend error messages
 * indicate reputation problems (recipient blocked, hard bounce) — we don't
 * want to keep firing through a domain that's flagged.
 */
export function tripCircuitBreaker(account: SenderAccount, reason: string, now: Date = new Date()): void {
  account.circuitBreakerTrippedAt = now.toISOString();
  account.circuitBreakerReason = reason;
}
