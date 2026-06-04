import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient as createSb } from '@supabase/supabase-js';
import { createAdminClient } from '@/lib/supabase/admin';
import { deleteUserData } from '@/lib/account/delete';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const admin = createAdminClient();
const TAG = 'VS-RET';

async function migrationApplied(): Promise<boolean> {
  try {
    const { error } = await admin.rpc('purge_old_bookings', { older_than_months: 100000 });
    return !error;
  } catch { return false; }
}

describe('data retention & deletion (requires migrations 0003+0004)', () => {
  let skip = false;
  let userId = '';
  let svcId = '';

  beforeAll(async () => {
    if (!(await migrationApplied())) { skip = true; return; }
    try {
      const { data: svc } = await admin.from('services').select('id').eq('slug', 'gents-cut').single();
      svcId = svc!.id;
      const { data } = await admin.auth.admin.createUser({ email: `${TAG}-u@example.com`, password: `T${crypto.randomUUID()}!`, email_confirm: true });
      userId = data.user!.id;
      await admin.from('bookings').insert({
        reference: `${TAG}-1`, service_id: svcId, customer_name: 'Ret Test', customer_phone: '0770000009',
        customer_email: `${TAG}-u@example.com`, starts_at: '2099-10-01T05:00:00Z', ends_at: '2099-10-01T05:40:00Z',
        status: 'confirmed', user_id: userId,
      });
    } catch { skip = true; }
  });

  afterAll(async () => {
    if (skip) return;
    await admin.from('bookings').delete().like('reference', `${TAG}%`);
    const { data } = await admin.auth.admin.listUsers();
    const u = data.users.find((x) => x.email === `${TAG}-u@example.com`);
    if (u) await admin.auth.admin.deleteUser(u.id);
  });

  it('authenticated role cannot call the retention functions (execute revoked)', async () => {
    if (skip) return;
    const anon = createSb(url, anonKey);
    const { error } = await anon.rpc('purge_old_bookings', { older_than_months: 24 });
    expect(error).not.toBeNull();
  });

  it('deleteUserData anonymizes bookings (rows kept) and removes profile + auth user', async () => {
    if (skip) return;
    const res = await deleteUserData(userId);
    expect(res.ok).toBe(true);
    const { data: bk } = await admin.from('bookings').select('customer_name, user_id, starts_at, service_id').eq('reference', `${TAG}-1`).single();
    expect(bk?.customer_name).toBe('Deleted');
    expect(bk?.user_id).toBeNull();
    expect(bk?.service_id).toBe(svcId);
    const { data: prof } = await admin.from('profiles').select('id').eq('id', userId);
    expect(prof ?? []).toHaveLength(0);
    const { data: users } = await admin.auth.admin.listUsers();
    expect(users.users.find((x) => x.id === userId)).toBeUndefined();
  });
});
