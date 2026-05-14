import { describe, it, expect } from "vitest";
import {
  pickNextSender,
  recordSend,
  poolDailyCapacity,
} from "@/lib/brain/sender-rotation";
import type { BrainData, SenderAccount } from "@/lib/brain-storage";

/**
 * Contract tests for the multi-sender rotation. This is the highest-risk
 * pure function in the brain — a bad pick can route mail through a paused
 * domain, exceed a warmup cap, or cluster everything on one account. The
 * rules these tests pin down:
 *
 *   1. Eligibility filter — disabled, circuit-broken, at-cap → excluded.
 *   2. Load balance — pick the account with the lowest sent-today count.
 *   3. Round-robin tiebreak — when tied at zero, oldest lastSentAt wins.
 *   4. Warmup curve — new accounts cap at 5/day on day 1, +3/day, dailyCap
 *      from day 30. Same curve as the legacy single-sender, per-account.
 *   5. recordSend mutates the right fields, sets warmupStartedAt on first
 *      send only, never on later sends.
 *   6. poolDailyCapacity sums across enabled, non-broken accounts only.
 *
 * Reference time is fixed to a single UTC midnight so warmup-day math is
 * deterministic across timezones.
 */

const NOW = new Date("2026-05-11T12:00:00Z");

/** Build a minimal BrainData with only senderAccounts populated. The function
 *  under test reads no other fields, so a partial cast is safe. */
function makeBrain(senderAccounts: SenderAccount[]): BrainData {
  return { senderAccounts } as unknown as BrainData;
}

/** Sender factory with sensible defaults; overrides win. */
function makeSender(overrides: Partial<SenderAccount> = {}): SenderAccount {
  return {
    id: overrides.id ?? "m1",
    fromEmail: overrides.fromEmail ?? "m1@brandivibe.site",
    domain: overrides.domain ?? "brandivibe.site",
    enabled: overrides.enabled ?? true,
    dailyCap: overrides.dailyCap ?? 50,
    ...overrides,
  };
}

const today = NOW.toISOString().slice(0, 10);

describe("pickNextSender — eligibility filter", () => {
  it("returns null when the pool is empty", () => {
    expect(pickNextSender(makeBrain([]), NOW)).toBeNull();
  });

  it("returns null when every account is disabled", () => {
    const brain = makeBrain([
      makeSender({ id: "m1", enabled: false }),
      makeSender({ id: "m2", enabled: false }),
    ]);
    expect(pickNextSender(brain, NOW)).toBeNull();
  });

  it("returns null when every account is circuit-broken", () => {
    const brain = makeBrain([
      makeSender({
        id: "m1",
        circuitBreakerTrippedAt: "2026-05-10T00:00:00Z",
        circuitBreakerReason: "hard-bounce",
      }),
      makeSender({
        id: "m2",
        circuitBreakerTrippedAt: "2026-05-10T00:00:00Z",
      }),
    ]);
    expect(pickNextSender(brain, NOW)).toBeNull();
  });

  it("returns null when every eligible account is at cap", () => {
    // Day-1 warmup cap is 5. Pre-fill that to push it over.
    const brain = makeBrain([
      makeSender({
        id: "m1",
        warmupStartedAt: NOW.toISOString(),
        sentByDay: { [today]: 5 },
      }),
    ]);
    expect(pickNextSender(brain, NOW)).toBeNull();
  });

  it("skips disabled / broken / at-cap and returns the one eligible account", () => {
    const brain = makeBrain([
      makeSender({ id: "m1", enabled: false }),
      makeSender({
        id: "m2",
        circuitBreakerTrippedAt: "2026-05-10T00:00:00Z",
      }),
      makeSender({
        id: "m3",
        warmupStartedAt: NOW.toISOString(),
        sentByDay: { [today]: 5 },
      }),
      makeSender({ id: "m4" }),
    ]);
    const pick = pickNextSender(brain, NOW);
    expect(pick).not.toBeNull();
    expect(pick!.account.id).toBe("m4");
  });
});

describe("pickNextSender — load balancing", () => {
  it("picks the account with the lowest sent-today count", () => {
    const brain = makeBrain([
      makeSender({
        id: "m1",
        warmupStartedAt: "2026-04-01T00:00:00Z", // fully warmed
        sentByDay: { [today]: 30 },
      }),
      makeSender({
        id: "m2",
        warmupStartedAt: "2026-04-01T00:00:00Z",
        sentByDay: { [today]: 10 },
      }),
      makeSender({
        id: "m3",
        warmupStartedAt: "2026-04-01T00:00:00Z",
        sentByDay: { [today]: 20 },
      }),
    ]);
    expect(pickNextSender(brain, NOW)!.account.id).toBe("m2");
  });

  it("round-robins by lastSentAt when sent-today counts are tied", () => {
    const brain = makeBrain([
      makeSender({
        id: "m-newer",
        warmupStartedAt: "2026-04-01T00:00:00Z",
        lastSentAt: "2026-05-11T11:00:00Z",
      }),
      makeSender({
        id: "m-oldest",
        warmupStartedAt: "2026-04-01T00:00:00Z",
        lastSentAt: "2026-05-11T08:00:00Z",
      }),
      makeSender({
        id: "m-middle",
        warmupStartedAt: "2026-04-01T00:00:00Z",
        lastSentAt: "2026-05-11T10:00:00Z",
      }),
    ]);
    expect(pickNextSender(brain, NOW)!.account.id).toBe("m-oldest");
  });

  it("treats an account that has never sent as oldest in the tiebreak", () => {
    const brain = makeBrain([
      makeSender({
        id: "m-used",
        warmupStartedAt: "2026-04-01T00:00:00Z",
        lastSentAt: "2026-05-11T08:00:00Z",
      }),
      makeSender({ id: "m-never" /* no lastSentAt */ }),
    ]);
    expect(pickNextSender(brain, NOW)!.account.id).toBe("m-never");
  });
});

describe("pickNextSender — warmup curve", () => {
  it("caps a brand-new account (no warmupStartedAt) at 5", () => {
    const brain = makeBrain([
      makeSender({ id: "m1", dailyCap: 50 /* never started */ }),
    ]);
    expect(pickNextSender(brain, NOW)!.effectiveCap).toBe(5);
  });

  it("returns the warmup cap, not dailyCap, on day 1", () => {
    const brain = makeBrain([
      makeSender({
        id: "m1",
        dailyCap: 50,
        warmupStartedAt: NOW.toISOString(),
      }),
    ]);
    // Day 1: dayIndex=1, cap = min(50, 5 + 0*3) = 5
    expect(pickNextSender(brain, NOW)!.effectiveCap).toBe(5);
  });

  it("ramps +3/day during warmup", () => {
    const tenDaysAgo = new Date(NOW.getTime() - 10 * 86_400_000).toISOString();
    const brain = makeBrain([
      makeSender({ id: "m1", dailyCap: 50, warmupStartedAt: tenDaysAgo }),
    ]);
    // dayIndex=11 → cap = min(50, 5 + 10*3) = 35
    expect(pickNextSender(brain, NOW)!.effectiveCap).toBe(35);
  });

  it("never exceeds dailyCap, even after long warmup", () => {
    const sixtyDaysAgo = new Date(NOW.getTime() - 60 * 86_400_000).toISOString();
    const brain = makeBrain([
      makeSender({ id: "m1", dailyCap: 30, warmupStartedAt: sixtyDaysAgo }),
    ]);
    expect(pickNextSender(brain, NOW)!.effectiveCap).toBe(30);
  });
});

describe("recordSend", () => {
  it("increments sent-today, sent-lifetime, and stamps lastSentAt", () => {
    const account = makeSender({ id: "m1" });
    recordSend(account, NOW);
    expect(account.sentByDay![today]).toBe(1);
    expect(account.sentLifetime).toBe(1);
    expect(account.lastSentAt).toBe(NOW.toISOString());
  });

  it("sets warmupStartedAt on the first send only, never on later sends", () => {
    const account = makeSender({ id: "m1" });
    recordSend(account, NOW);
    const firstStart = account.warmupStartedAt;
    expect(firstStart).toBe(NOW.toISOString());

    const later = new Date(NOW.getTime() + 3 * 86_400_000);
    recordSend(account, later);
    expect(account.warmupStartedAt).toBe(firstStart); // unchanged
    expect(account.sentByDay![later.toISOString().slice(0, 10)]).toBe(1);
    expect(account.sentLifetime).toBe(2);
  });

  it("accumulates sends within the same day", () => {
    const account = makeSender({ id: "m1" });
    recordSend(account, NOW);
    recordSend(account, NOW);
    recordSend(account, NOW);
    expect(account.sentByDay![today]).toBe(3);
    expect(account.sentLifetime).toBe(3);
  });
});

describe("poolDailyCapacity", () => {
  it("sums capacity, sent, and remaining across enabled non-broken accounts", () => {
    const warmedStart = "2026-04-01T00:00:00Z"; // fully warmed up
    const brain = makeBrain([
      makeSender({
        id: "m1",
        dailyCap: 50,
        warmupStartedAt: warmedStart,
        sentByDay: { [today]: 10 },
      }),
      makeSender({
        id: "m2",
        dailyCap: 30,
        warmupStartedAt: warmedStart,
        sentByDay: { [today]: 5 },
      }),
      makeSender({ id: "disabled", enabled: false, dailyCap: 999 }),
      makeSender({
        id: "broken",
        dailyCap: 999,
        circuitBreakerTrippedAt: "2026-05-10T00:00:00Z",
      }),
    ]);
    const cap = poolDailyCapacity(brain, NOW);
    expect(cap.enabledAccounts).toBe(2);
    expect(cap.capacity).toBe(80);
    expect(cap.sentToday).toBe(15);
    expect(cap.remaining).toBe(65);
  });

  it("clamps remaining to 0 even when sent overshoots capacity", () => {
    const warmedStart = "2026-04-01T00:00:00Z";
    const brain = makeBrain([
      makeSender({
        id: "m1",
        dailyCap: 10,
        warmupStartedAt: warmedStart,
        sentByDay: { [today]: 25 },
      }),
    ]);
    expect(poolDailyCapacity(brain, NOW).remaining).toBe(0);
  });

  it("reports zero capacity when nothing is eligible", () => {
    const brain = makeBrain([
      makeSender({ id: "m1", enabled: false }),
      makeSender({
        id: "m2",
        circuitBreakerTrippedAt: "2026-05-10T00:00:00Z",
      }),
    ]);
    const cap = poolDailyCapacity(brain, NOW);
    expect(cap.enabledAccounts).toBe(0);
    expect(cap.capacity).toBe(0);
    expect(cap.remaining).toBe(0);
  });
});
