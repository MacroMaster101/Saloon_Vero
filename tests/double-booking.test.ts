import { describe, it, expect, afterAll } from 'vitest';
import { createAdminClient } from '@/lib/supabase/admin';

const TAG = 'VS-ITEST';
const admin = createAdminClient();

async function cleanup() {
  await admin.from('bookings').delete().like('reference', `${TAG}%`);
}

describe('double-booking protection', () => {
  afterAll(cleanup);

  it('rejects overlapping confirmed bookings for one stylist (23P01)', async () => {
    await cleanup();
    const { data: s } = await admin.from('stylists').select('id').eq('slug', 'ruwan').single();
    const { data: svc } = await admin.from('services').select('id').eq('slug', 'gents-cut').single();
    expect(s).toBeTruthy();
    expect(svc).toBeTruthy();

    const base = {
      service_id: svc!.id, stylist_id: s!.id,
      customer_name: 'Integration Test', customer_phone: '0770000000',
      starts_at: '2099-12-01T05:00:00.000Z', ends_at: '2099-12-01T05:40:00.000Z',
      status: 'confirmed' as const,
    };

    const first = await admin.from('bookings').insert({ ...base, reference: `${TAG}-1` });
    expect(first.error).toBeNull();

    // Overlaps the first (05:20–06:00 overlaps 05:00–05:40) for the same stylist.
    const second = await admin.from('bookings').insert({
      ...base, reference: `${TAG}-2`,
      starts_at: '2099-12-01T05:20:00.000Z', ends_at: '2099-12-01T06:00:00.000Z',
    });
    expect(second.error?.code).toBe('23P01');

    // A different stylist at the same time must be allowed.
    const { data: s2 } = await admin.from('stylists').select('id').eq('slug', 'sanduni').single();
    const third = await admin.from('bookings').insert({ ...base, stylist_id: s2!.id, reference: `${TAG}-3` });
    expect(third.error).toBeNull();
  });
});
