'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/supabase/auth';

export async function updateFullName(formData: FormData): Promise<void> {
  const user = await getUser();
  if (!user) return;
  const fullName = String(formData.get('full_name') ?? '').trim().slice(0, 120);
  const sb = await createClient();
  // RLS allows self-update; the privilege trigger ignores any role/stylist change.
  await sb.from('profiles').update({ full_name: fullName }).eq('id', user.id);
  revalidatePath('/account');
}
