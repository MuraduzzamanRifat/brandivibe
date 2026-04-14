import { NextResponse } from "next/server";
import {
  upsertEmailTemplate,
  deleteEmailTemplate,
  logActivity,
} from "@/lib/brain-storage";

/**
 * PATCH  /api/crm/templates/[id]  — edit a template (name, subject, body, category)
 * DELETE /api/crm/templates/[id]  — delete a template (system templates can also be deleted;
 *                                     they'll reseed only if the collection is emptied)
 */

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;
  let body: {
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
  if (!body.name || !body.subject || !body.body) {
    return NextResponse.json(
      { error: "name, subject, body are required" },
      { status: 400 }
    );
  }
  const updated = await upsertEmailTemplate({
    id,
    name: body.name,
    subject: body.subject,
    body: body.body,
    category: (body.category as "custom") ?? "custom",
    isSystem: false,
  });
  await logActivity({
    type: "crm-template-edited",
    description: `Template updated: "${updated.name}"`,
  });
  return NextResponse.json({ ok: true, template: updated });
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  const ok = await deleteEmailTemplate(id);
  if (!ok) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
