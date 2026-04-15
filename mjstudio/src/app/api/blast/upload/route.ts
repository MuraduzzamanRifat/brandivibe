import { NextResponse } from "next/server";
import { setBlastConfig, logActivity } from "@/lib/brain-storage";
import { uploadList } from "@/lib/brain/blast";

/**
 * POST /api/blast/upload  (multipart/form-data)
 *   file:       the .txt/.csv file (one email per line)
 *   dailyCap:   optional, defaults to 500
 *   templateId: optional, can be set later in the UI
 *
 * Writes the cleaned, deduped list to data/blast-list.txt + mirrors to GitHub.
 * Resets sentCount/sentByDay so the campaign starts fresh.
 *
 * Body limit on Next.js route handlers defaults to 4MB. For 500K emails
 * (~12MB) the user will need to upload from the dashboard which sends as
 * multipart — Next.js route handlers handle multipart up to ~25MB by default.
 * For larger lists, increase the runtime body size in next.config.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(req: Request) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch (err) {
    return NextResponse.json(
      { error: `invalid form data: ${err instanceof Error ? err.message : String(err)}` },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file required" }, { status: 400 });
  }

  const dailyCapRaw = formData.get("dailyCap");
  const dailyCap = Math.max(
    1,
    Math.min(10000, Number(dailyCapRaw ?? 500) || 500)
  );

  const templateIdRaw = formData.get("templateId");
  const templateId =
    typeof templateIdRaw === "string" && templateIdRaw.trim()
      ? templateIdRaw.trim()
      : undefined;

  // Default to warmup ON — safer for unfamiliar sender domains. User can
  // opt out explicitly by sending warmupEnabled=false in the form.
  const warmupRaw = formData.get("warmupEnabled");
  const warmupEnabled = warmupRaw === "false" ? false : true;

  const text = await file.text();
  if (!text.trim()) {
    return NextResponse.json({ error: "file is empty" }, { status: 400 });
  }

  const { totalRows, listSha } = await uploadList(text, file.name);
  if (totalRows === 0) {
    return NextResponse.json(
      { error: "no valid emails found in file" },
      { status: 400 }
    );
  }

  const nowIso = new Date().toISOString();
  const cfg = await setBlastConfig({
    id: `blast_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    active: true,
    status: "running",
    totalRows,
    sentCount: 0,
    dailyCap,
    sentByDay: {},
    templateId,
    listSha,
    filename: file.name,
    uploadedAt: nowIso,
    warmupEnabled,
    warmupStartedAt: warmupEnabled ? nowIso : undefined,
  });

  await logActivity({
    type: "email-sent",
    description: `Blast list uploaded: ${file.name} (${totalRows} valid emails, cap ${dailyCap}/day)`,
  });

  return NextResponse.json({ ok: true, config: cfg });
}
