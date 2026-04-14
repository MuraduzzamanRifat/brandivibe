import { NextResponse } from "next/server";
import {
  patchCrmContact,
  deleteCrmContact,
  listCrmEmailsForContact,
} from "@/lib/brain-storage";

/**
 * GET    /api/crm/contacts/[id]   — full contact record + email history
 * PATCH  /api/crm/contacts/[id]   — update status, notes, tags
 * DELETE /api/crm/contacts/[id]   — remove the contact (email history is kept)
 */

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const emails = await listCrmEmailsForContact(id);
  return NextResponse.json({ emails });
}

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }
  const updated = await patchCrmContact(id, body);
  if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true, contact: updated });
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  const ok = await deleteCrmContact(id);
  if (!ok) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
