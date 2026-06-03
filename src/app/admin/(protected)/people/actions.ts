'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/supabase/auth';

export async function setRole(formData: FormData): Promise<void> {
  await requireRole(['admin'], '/admin/people');
  const id = String(formData.get('id') ?? '');
  const role = String(formData.get('role') ?? 'user');
  const stylistRaw = String(formData.get('stylist_id') ?? '');
  const stylist_id = stylistRaw === '' ? null : stylistRaw;
  if (!['user', 'staff', 'admin'].includes(role)) return;
  const sb = await createClient();
  // Admin RLS allows this; the privilege trigger permits role/stylist change for admins.
  await sb.from('profiles').update({ role: role as 'user' | 'staff' | 'admin', stylist_id }).eq('id', id);
  revalidatePath('/admin/people');
}
