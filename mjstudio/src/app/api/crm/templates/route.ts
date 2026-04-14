import { NextResponse } from "next/server";
import {
  listEmailTemplates,
  upsertEmailTemplate,
  seedTemplatesIfEmpty,
  logActivity,
} from "@/lib/brain-storage";
import { SEED_EMAIL_TEMPLATES } from "@/lib/brain/seed-templates";

/**
 * GET  /api/crm/templates  — list all templates (auto-seeds on first read)
 * POST /api/crm/templates  — create a new custom template
 */

export const dynamic = "force-dynamic";

export async function GET() {
  const seeded = await seedTemplatesIfEmpty(SEED_EMAIL_TEMPLATES);
  const templates = await listEmailTemplates();
  return NextResponse.json({ templates, seeded });
}

export async function POST(req: Request) {
  let body: {
    id?: string;
    name?: string;
    subject?: string;
    body?: string;
    category?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }
  if (!body.name?.trim() || !body.subject?.trim() || !body.body?.trim()) {
    return NextResponse.json(
      { error: "name, subject, body are required" },
      { status: 400 }
    );
  }
  const tpl = await upsertEmailTemplate({
    name: body.name.trim(),
    subject: body.subject.trim(),
    body: body.body,
    category: (body.category as "custom") ?? "custom",
    isSystem: false,
  });
  await logActivity({
    type: "crm-template-edited",
    description: `New template created: "${tpl.name}"`,
  });
  return NextResponse.json({ ok: true, template: tpl });
}
