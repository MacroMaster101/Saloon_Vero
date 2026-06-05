import { createClient } from '@/lib/supabase/server';
import type { Booking } from '@/lib/supabase/types';
import { BookingsTable, type BookingRow } from '@/components/admin/bookings-table';

type Row = Booking & { services: { name: string } | null; stylists: { name: string } | null };

const TZ = 'Asia/Colombo';
const dayFmt = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' });
const whenFmt = new Intl.DateTimeFormat('en-LK', {
  timeZone: TZ,
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

function toRow(b: Row): BookingRow {
  return {
    id: b.id,
    reference: b.reference,
    customerName: b.customer_name,
    customerPhone: b.customer_phone,
    serviceName: b.services?.name ?? 'Unknown service',
    stylistName: b.stylists?.name ?? 'Any',
    whenLabel: whenFmt.format(new Date(b.starts_at)),
    status: b.status,
  };
}

export default async function AdminHome() {
  const sb = await createClient();
  const { data, error } = await sb
    .from('bookings')
    .select('*, services(name), stylists(name)')
    .order('starts_at', { ascending: true });

  const rows = (data ?? []) as unknown as Row[];
  const todayKey = dayFmt.format(new Date());

  // Group by salon-local calendar date. Past bookings are excluded (Today + Upcoming only).
  const today: BookingRow[] = [];
  const upcoming: BookingRow[] = [];
  for (const b of rows) {
    const key = dayFmt.format(new Date(b.starts_at));
    if (key === todayKey) today.push(toRow(b));
    else if (key > todayKey) upcoming.push(toRow(b));
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div><span className="eyebrow">Overview</span><h1 className="h-section" style={{ fontSize: 30, marginTop: 8 }}>Dashboard</h1></div>
        <a href="/admin/blocked-slots" className="btn btn--ghost">Blocked slots</a>
      </div>

      {error && (
        <p className="lead" style={{ marginTop: 12, color: 'var(--accent)' }}>
          Could not load bookings: {error.message}
        </p>
      )}

      {!error && today.length === 0 && upcoming.length === 0 && (
        <p className="lead" style={{ marginTop: 12 }}>No bookings yet.</p>
      )}

      {!error && (today.length > 0 || upcoming.length > 0) && (
        <>
          <section style={{ marginTop: 28 }}>
            <h2 className="h-section" style={{ fontSize: 20, marginBottom: 12 }}>Today</h2>
            <BookingsTable bookings={today} />
          </section>

          <section style={{ marginTop: 36 }}>
            <h2 className="h-section" style={{ fontSize: 20, marginBottom: 12 }}>Upcoming</h2>
            <BookingsTable bookings={upcoming} />
          </section>
        </>
      )}
    </div>
  );
}
