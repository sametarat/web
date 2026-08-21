import { z } from 'zod';
import { isAuthorized, isAuthConfigured } from '@/lib/crmAuth';
import {
  isStoreConfigured,
  listLeads,
  updateLead,
  deleteLead,
  LEAD_STATUSES,
} from '@/lib/leadStore';

/**
 * CRM veri uç noktası. Her istek çerezle doğrulanıyor —
 * doğrulanmamış istek hiçbir kişisel veri görmez.
 */

export const dynamic = 'force-dynamic';

function unauthorized() {
  return Response.json({ error: 'Yetkisiz.' }, { status: 401 });
}

export async function GET(req: Request) {
  if (!(await isAuthorized(req))) return unauthorized();

  if (!isStoreConfigured()) {
    return Response.json({
      configured: false,
      leads: [],
      statuses: LEAD_STATUSES,
    });
  }

  const leads = await listLeads();
  return Response.json({ configured: true, leads, statuses: LEAD_STATUSES });
}

const patchSchema = z.object({
  id: z.string().min(1).max(64),
  status: z
    .enum(['yeni', 'arandi', 'teklif', 'kazanildi', 'kaybedildi'])
    .optional(),
  note: z.string().max(2000).optional(),
});

export async function PATCH(req: Request) {
  if (!(await isAuthorized(req))) return unauthorized();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Geçersiz istek.' }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Geçersiz alan.' }, { status: 400 });

  const { id, ...patch } = parsed.data;
  const updated = await updateLead(id, patch);
  if (!updated) return Response.json({ error: 'Kayıt bulunamadı.' }, { status: 404 });

  return Response.json({ lead: updated });
}

const deleteSchema = z.object({ id: z.string().min(1).max(64) });

export async function DELETE(req: Request) {
  if (!(await isAuthorized(req))) return unauthorized();
  if (!isAuthConfigured()) return unauthorized();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Geçersiz istek.' }, { status: 400 });
  }

  const parsed = deleteSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Geçersiz kimlik.' }, { status: 400 });

  const ok = await deleteLead(parsed.data.id);
  return Response.json({ ok });
}
