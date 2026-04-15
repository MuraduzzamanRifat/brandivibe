import { NextResponse } from "next/server";
import { setBlastConfig, getBlastConfig, logActivity } from "@/lib/brain-storage";
import { resetBlast } from "@/lib/brain/blast";

/**
 * POST /api/blast/control
 * Body: { action: "pause" | "resume" | "reset" | "set-cap" | "set-template",
 *         dailyCap?: number, templateId?: string }
 */

export const dynamic = "force-dynamic";

type Body = {
  action?:
    | "pause"
    | "resume"
    | "reset"
    | "set-cap"
    | "set-template"
    | "toggle-warmup";
  dailyCap?: number;
  templateId?: string;
  warmupEnabled?: boolean;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  switch (body.action) {
    case "pause": {
      const cfg = await setBlastConfig({ status: "paused" });
      await logActivity({ type: "email-sent", description: "Blast paused" });
      return NextResponse.json({ ok: true, config: cfg });
    }
    case "resume": {
      // Resuming after a circuit breaker trip clears the trip reason so the
      // next tick doesn't immediately re-pause on the same stale metrics.
      // The user is making an explicit "I've reviewed the list" acknowledgement.
      const cfg = await setBlastConfig({
        status: "running",
        circuitBreakerTrippedAt: undefined,
        circuitBreakerReason: undefined,
      });
      await logActivity({ type: "email-sent", description: "Blast resumed" });
      return NextResponse.json({ ok: true, config: cfg });
    }
    case "toggle-warmup": {
      const enabled = body.warmupEnabled !== false;
      // Preserve the original warmupStartedAt when toggling off-then-on so the
      // ramp resumes at the correct day instead of restarting at day 1.
      const existing = await getBlastConfig();
      const cfg = await setBlastConfig({
        warmupEnabled: enabled,
        warmupStartedAt: enabled
          ? existing?.warmupStartedAt ?? new Date().toISOString()
          : existing?.warmupStartedAt,
      });
      await logActivity({
        type: "email-sent",
        description: enabled ? "Blast warmup ramp enabled" : "Blast warmup ramp disabled",
      });
      return NextResponse.json({ ok: true, config: cfg });
    }
    case "reset": {
      await resetBlast();
      await logActivity({ type: "email-sent", description: "Blast reset" });
      return NextResponse.json({ ok: true, config: null });
    }
    case "set-cap": {
      const dailyCap = Math.max(1, Math.min(10000, Number(body.dailyCap) || 500));
      const cfg = await setBlastConfig({ dailyCap });
      return NextResponse.json({ ok: true, config: cfg });
    }
    case "set-template": {
      if (!body.templateId) {
        return NextResponse.json({ error: "templateId required" }, { status: 400 });
      }
      const cfg = await setBlastConfig({ templateId: body.templateId });
      return NextResponse.json({ ok: true, config: cfg });
    }
    default:
      return NextResponse.json({ error: "unknown action" }, { status: 400 });
  }
}
