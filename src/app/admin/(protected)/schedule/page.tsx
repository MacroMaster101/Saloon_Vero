import { requireRole } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import { ScheduleList, type SchedRow } from './schedule-list';

const TZ = 'Asia/Colombo';
const whenFmt = new Intl.DateTimeFormat('en-LK', { timeZone: TZ, weekday: 'short', day: 'numeric', month: 'short' });
const timeFmt = new Intl.DateTimeFormat('en-LK', { timeZone: TZ, hour: 'numeric', minute: '2-digit', hour12: true });

export default async function SchedulePage() {
  await requireRole(['staff', 'admin'], '/admin/schedule');
  const sb = await createClient();
  const { data } = await sb.from('bookings')
    .select('reference, starts_at, customer_name, status')
    .order('starts_at', { ascending: true });

  const rows: SchedRow[] = ((data ?? []) as Array<{ reference: string; starts_at: string; customer_name: string; status: string }>).map((b) => {
    const d = new Date(b.starts_at);
    const t = timeFmt.format(d); // e.g. "2:30 PM"
    const parts = t.split(/\s+/);
    const timeLabel = parts[0] ?? '';
    const ampm = parts[1] ?? '';
    return { reference: b.reference, whenLabel: whenFmt.format(d), timeLabel, ampm, customer: b.customer_name, status: b.status };
  });

  return (
    <div>
      <span className="eyebrow">Your day</span>
      <h1 className="h-section" style={{ fontSize: 30, margin: '8px 0 6px' }}>My schedule</h1>
      <p className="step__hint" style={{ marginBottom: 22 }}>Your assigned appointments only.</p>
      {rows.length === 0 ? <p className="step__hint">No assigned bookings.</p> : <ScheduleList rows={rows} />}
    </div>
  );
}
