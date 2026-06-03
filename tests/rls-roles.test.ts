import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient as createSb } from '@supabase/supabase-js';
import { createAdminClient } from '@/lib/supabase/admin';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const admin = createAdminClient();
const TAG = 'VS-RLS';

async function makeUser(email: string) {
  const { data } = await admin.auth.admin.createUser({ email, password: 'Passw0rd!23', email_confirm: true });
  const id = data.user!.id;
  const sb = createSb(url, anonKey);
  await sb.auth.signInWithPassword({ email, password: 'Passw0rd!23' });
  return { id, sb };
}

describe('RLS role enforcement', () => {
  let alice: Awaited<ReturnType<typeof makeUser>>;
  let bob: Awaited<ReturnType<typeof makeUser>>;
  let svcId: string;

  beforeAll(async () => {
    const { data: svc } = await admin.from('services').select('id').eq('slug', 'gents-cut').single();
    svcId = svc!.id;
    alice = await makeUser(`${TAG}-alice@example.com`.toLowerCase());
    bob = await makeUser(`${TAG}-bob@example.com`.toLowerCase());
    await admin.from('bookings').insert({
      reference: `${TAG}-A1`, service_id: svcId, customer_name: 'Alice', customer_phone: '0770000001',
      starts_at: '2099-11-01T05:00:00Z', ends_at: '2099-11-01T05:40:00Z', status: 'confirmed', user_id: alice.id,
    });
  });

  afterAll(async () => {
    await admin.from('bookings').delete().like('reference', `${TAG}%`);
    const { data } = await admin.auth.admin.listUsers();
    for (const e of [`${TAG}-alice@example.com`, `${TAG}-bob@example.com`]) {
      const u = data.users.find((x) => x.email === e.toLowerCase());
      if (u) await admin.auth.admin.deleteUser(u.id);
    }
  });

  it('a user reads only their own bookings', async () => {
    const mine = await alice.sb.from('bookings').select('reference');
    expect(mine.data?.some((b) => b.reference === `${TAG}-A1`)).toBe(true);
    const theirs = await bob.sb.from('bookings').select('reference').eq('reference', `${TAG}-A1`);
    expect(theirs.data ?? []).toHaveLength(0);
  });

  it('a user cannot promote themselves to admin', async () => {
    await alice.sb.from('profiles').update({ role: 'admin' }).eq('id', alice.id);
    const { data } = await admin.from('profiles').select('role').eq('id', alice.id).single();
    expect(data?.role).toBe('user');
  });
});
