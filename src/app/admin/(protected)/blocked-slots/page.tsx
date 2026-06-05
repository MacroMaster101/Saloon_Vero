import { createClient } from '@/lib/supabase/server';
import { getStylists } from '@/lib/queries';
import type { BlockedSlot } from '@/lib/supabase/types';
import { BlockForm } from '@/components/admin/block-form';
import { deleteBlock } from './block-actions';

const TZ = 'Asia/Colombo';
const whenFmt = new Intl.DateTimeFormat('en-LK', {
  timeZone: TZ,
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

type Row = BlockedSlot & { stylists: { name: string } | null };

export default async function BlockedSlotsPage() {
  const sb = await createClient();
  const [{ data }, stylists] = await Promise.all([
    sb
      .from('blocked_slots')
      .select('*, stylists(name)')
      .gt('ends_at', new Date().toISOString())
      .order('starts_at'),
    getStylists(),
  ]);
  const rows = (data ?? []) as unknown as Row[];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <h1 className="h-section" style={{ fontSize: 32 }}>Blocked slots</h1>
        <a href="/admin" className="btn btn--ghost">Back to dashboard</a>
      </div>
      <p className="lead" style={{ marginTop: 12 }}>
        Block off time for a stylist or the whole salon. Booking availability hides these times.
      </p>

      <BlockForm stylists={stylists} />

      <section style={{ marginTop: 40 }}>
        <h2 className="h-section" style={{ fontSize: 20, marginBottom: 12 }}>Upcoming blocks</h2>
        {rows.length === 0 ? (
          <p className="lead">No upcoming blocks.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
            {rows.map((b) => (
              <li
                key={b.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 16,
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: '1.5px solid var(--line)',
                  background: 'var(--bg-2)',
                }}
              >
                <div style={{ display: 'grid', gap: 4 }}>
                  <b style={{ fontSize: 15 }}>{b.stylists?.name ?? 'Whole salon'}</b>
                  <span style={{ fontSize: 14, color: 'var(--muted)' }}>
                    {whenFmt.format(new Date(b.starts_at))} – {whenFmt.format(new Date(b.ends_at))}
                  </span>
                  {b.reason && <span style={{ fontSize: 13, color: 'var(--muted)' }}>{b.reason}</span>}
                </div>
                <form action={deleteBlock}>
                  <input type="hidden" name="id" value={b.id} />
                  <button className="btn btn--ghost">Remove</button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
