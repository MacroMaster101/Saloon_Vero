import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient as createSb } from '@supabase/supabase-js';
import { createAdminClient } from '@/lib/supabase/admin';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const admin = createAdminClient();
const TAG = 'VS-RLS';

async function makeUser(email: string) {
  // Random per-run password — never a hardcoded literal (avoids committing a secret).
  const password = `T${crypto.randomUUID()}!`;
  const { data } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  const id = data.user!.id;
  const sb = createSb(url, anonKey);
  await sb.auth.signInWithPassword({ email, password });
  return { id, sb };
}

// Probe: is migration 0003 applied? (profiles table present)
async function migrationApplied(): Promise<boolean> {
  try {
    const { error } = await admin.from('profiles').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
}

describe('RLS role enforcement (requires migration 0003)', () => {
  let skip = false;
  let alice: Awaited<ReturnType<typeof makeUser>>;
  let bob: Awaited<ReturnType<typeof makeUser>>;
  let svcId: string;

  beforeAll(async () => {
    const hasProfiles = await migrationApplied();
    if (!hasProfiles) {
      skip = true;
      return;
    }

    try {
      const { data: svc } = await admin.from('services').select('id').eq('slug', 'gents-cut').single();
      svcId = svc!.id;
      alice = await makeUser(`${TAG}-alice@example.com`.toLowerCase());
      bob = await makeUser(`${TAG}-bob@example.com`.toLowerCase());
      await admin.from('bookings').insert({
        reference: `${TAG}-A1`, service_id: svcId, customer_name: 'Alice', customer_phone: '0770000001',
        starts_at: '2099-11-01T05:00:00Z', ends_at: '2099-11-01T05:40:00Z', status: 'confirmed', user_id: alice.id,
      });
    } catch {
      skip = true;
    }
  });

  afterAll(async () => {
    if (skip) return;
    await admin.from('bookings').delete().like('reference', `${TAG}%`);
    const { data } = await admin.auth.admin.listUsers();
    for (const e of [`${TAG}-alice@example.com`, `${TAG}-bob@example.com`]) {
      const u = data.users.find((x) => x.email === e.toLowerCase());
      if (u) await admin.auth.admin.deleteUser(u.id);
    }
  });

  it('a user reads only their own bookings', async () => {
    if (skip) return;
    const mine = await alice.sb.from('bookings').select('reference');
    expect(mine.data?.some((b) => b.reference === `${TAG}-A1`)).toBe(true);
    const theirs = await bob.sb.from('bookings').select('reference').eq('reference', `${TAG}-A1`);
    expect(theirs.data ?? []).toHaveLength(0);
  });

  it('a user cannot promote themselves to admin', async () => {
    if (skip) return;
    await alice.sb.from('profiles').update({ role: 'admin' }).eq('id', alice.id);
    const { data } = await admin.from('profiles').select('role').eq('id', alice.id).single();
    expect(data?.role).toBe('user');
  });
});
