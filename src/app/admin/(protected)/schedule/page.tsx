import { requireRole } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';

export default async function SchedulePage() {
  await requireRole(['staff', 'admin'], '/admin/schedule');
  const sb = await createClient();
  // RLS scopes staff to their own assigned bookings automatically.
  const { data } = await sb.from('bookings')
    .select('reference, starts_at, customer_name, status')
    .order('starts_at', { ascending: true });
  const rows = data ?? [];
  return (
    <div>
      <h1 className="step__title">My schedule</h1>
      {rows.length === 0 ? <p className="step__hint">No assigned bookings.</p> : (
        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 10 }}>
          {rows.map((b) => (
            <li key={b.reference} style={{ display: 'flex', justifyContent: 'space-between', padding: 12, borderBottom: '1px solid var(--line)' }}>
              <span>{new Date(b.starts_at).toLocaleString()}</span>
              <span>{b.customer_name}</span>
              <span className="tag">{b.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
