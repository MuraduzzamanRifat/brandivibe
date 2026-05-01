import { NextResponse } from "next/server";
import { authorizedCron } from "@/lib/brain/auth";
import { loadBrain, saveBrain, type SenderAccount } from "@/lib/brain-storage";
import { poolDailyCapacity } from "@/lib/brain/sender-rotation";

/**
 * Sender pool admin API.
 *
 *   GET    /api/brain/senders                 → list pool + capacity stats
 *   POST   /api/brain/senders { action, ... } → mutate pool
 *
 * Actions:
 *   - "seed"   — populate the pool with 10 default accounts (if pool is empty)
 *   - "add"    — add a single account: { fromEmail, fromName?, dailyCap? }
 *   - "toggle" — flip enabled flag: { id, enabled }
 *   - "reset-circuit-breaker" — clear circuitBreakerTrippedAt: { id }
 *   - "remove" — delete an account: { id }
 *
 * All mutations require x-brain-secret. GET is public.
 */

export const dynamic = "force-dynamic";

const DEFAULT_SEED_ACCOUNTS: Array<Omit<SenderAccount, "domain">> = [
  { id: "primary", fromEmail: "hello@send.brandivibe.site", enabled: true, dailyCap: 50, fromName: "Muraduzzaman at Brandivibe" },
  { id: "m1", fromEmail: "hello@m1.brandivibe.site", enabled: false, dailyCap: 50, fromName: "Muraduzzaman at Brandivibe" },
  { id: "m2", fromEmail: "hello@m2.brandivibe.site", enabled: false, dailyCap: 50, fromName: "Muraduzzaman at Brandivibe" },
  { id: "m3", fromEmail: "hello@m3.brandivibe.site", enabled: false, dailyCap: 50, fromName: "Muraduzzaman at Brandivibe" },
  { id: "m4", fromEmail: "hello@m4.brandivibe.site", enabled: false, dailyCap: 50, fromName: "Muraduzzaman at Brandivibe" },
  { id: "m5", fromEmail: "hello@m5.brandivibe.site", enabled: false, dailyCap: 50, fromName: "Muraduzzaman at Brandivibe" },
  { id: "m6", fromEmail: "hello@m6.brandivibe.site", enabled: false, dailyCap: 50, fromName: "Muraduzzaman at Brandivibe" },
  { id: "m7", fromEmail: "hello@m7.brandivibe.site", enabled: false, dailyCap: 50, fromName: "Muraduzzaman at Brandivibe" },
  { id: "m8", fromEmail: "hello@m8.brandivibe.site", enabled: false, dailyCap: 50, fromName: "Muraduzzaman at Brandivibe" },
  { id: "m9", fromEmail: "hello@m9.brandivibe.site", enabled: false, dailyCap: 50, fromName: "Muraduzzaman at Brandivibe" },
];

function domainOf(email: string): string {
  return email.split("@")[1]?.toLowerCase() ?? "";
}

export async function GET() {
  const brain = await loadBrain();
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const pool = poolDailyCapacity(brain, now);
  return NextResponse.json({
    accounts: brain.senderAccounts ?? [],
    pool: {
      ...pool,
      today,
    },
  });
}

export async function POST(req: Request) {
  if (!authorizedCron(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    action?: "seed" | "add" | "toggle" | "reset-circuit-breaker" | "remove";
    id?: string;
    fromEmail?: string;
    fromName?: string;
    dailyCap?: number;
    enabled?: boolean;
  };

  const brain = await loadBrain();
  brain.senderAccounts = brain.senderAccounts ?? [];

  switch (body.action) {
    case "seed": {
      if (brain.senderAccounts.length > 0) {
        return NextResponse.json({ error: "pool already seeded; use add instead" }, { status: 400 });
      }
      brain.senderAccounts = DEFAULT_SEED_ACCOUNTS.map((a) => ({
        ...a,
        domain: domainOf(a.fromEmail),
      }));
      await saveBrain(brain);
      return NextResponse.json({ ok: true, seeded: brain.senderAccounts.length, accounts: brain.senderAccounts });
    }
    case "add": {
      if (!body.fromEmail) return NextResponse.json({ error: "fromEmail required" }, { status: 400 });
      const id = body.id || `s${brain.senderAccounts.length + 1}`;
      if (brain.senderAccounts.find((a) => a.id === id)) {
        return NextResponse.json({ error: `id "${id}" already exists` }, { status: 400 });
      }
      const account: SenderAccount = {
        id,
        fromEmail: body.fromEmail,
        fromName: body.fromName,
        domain: domainOf(body.fromEmail),
        enabled: body.enabled ?? false,
        dailyCap: body.dailyCap ?? 50,
      };
      brain.senderAccounts.push(account);
      await saveBrain(brain);
      return NextResponse.json({ ok: true, account });
    }
    case "toggle": {
      if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
      const account = brain.senderAccounts.find((a) => a.id === body.id);
      if (!account) return NextResponse.json({ error: "not found" }, { status: 404 });
      account.enabled = body.enabled ?? !account.enabled;
      await saveBrain(brain);
      return NextResponse.json({ ok: true, account });
    }
    case "reset-circuit-breaker": {
      if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
      const account = brain.senderAccounts.find((a) => a.id === body.id);
      if (!account) return NextResponse.json({ error: "not found" }, { status: 404 });
      account.circuitBreakerTrippedAt = undefined;
      account.circuitBreakerReason = undefined;
      await saveBrain(brain);
      return NextResponse.json({ ok: true, account });
    }
    case "remove": {
      if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
      const before = brain.senderAccounts.length;
      brain.senderAccounts = brain.senderAccounts.filter((a) => a.id !== body.id);
      if (brain.senderAccounts.length === before) {
        return NextResponse.json({ error: "not found" }, { status: 404 });
      }
      await saveBrain(brain);
      return NextResponse.json({ ok: true });
    }
    default:
      return NextResponse.json({
        error: "action required: seed | add | toggle | reset-circuit-breaker | remove",
      }, { status: 400 });
  }
}
