'use client';

import { useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { setBookingStatus, type BookingStatus } from '@/app/admin/(protected)/booking-actions';

export interface BookingRow {
  id: string;
  reference: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  stylistName: string;
  whenLabel: string;
  status: BookingStatus;
}

const STATUS_STYLE: Record<BookingStatus, { bg: string; fg: string; label: string }> = {
  confirmed: { bg: 'color-mix(in srgb, var(--brand) 14%, transparent)', fg: 'var(--brand)', label: 'Confirmed' },
  completed: { bg: 'rgba(22,127,72,.14)', fg: '#167f48', label: 'Completed' },
  no_show: { bg: 'rgba(120,120,120,.16)', fg: '#6b6b6b', label: 'No-show' },
  cancelled: { bg: 'color-mix(in srgb, var(--accent) 14%, transparent)', fg: 'var(--accent)', label: 'Cancelled' },
};

const ACTIONS: Array<{ status: BookingStatus; label: string }> = [
  { status: 'completed', label: 'Complete' },
  { status: 'no_show', label: 'No-show' },
  { status: 'cancelled', label: 'Cancel' },
];

function StatusChip({ status }: { status: BookingStatus }) {
  const s = STATUS_STYLE[status];
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: 11,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '.04em',
        padding: '4px 10px',
        borderRadius: 999,
        background: s.bg,
        color: s.fg,
      }}
    >
      {s.label}
    </span>
  );
}

export function BookingsTable({ bookings }: { bookings: BookingRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // Live updates: refresh on any change to the bookings table.
  // Harmless no-op until the table is added to the supabase_realtime publication.
  useEffect(() => {
    const sb = createClient();
    const ch = sb
      .channel('admin-bookings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => router.refresh())
      .subscribe();
    return () => {
      sb.removeChannel(ch);
    };
  }, [router]);

  function onSet(id: string, status: BookingStatus) {
    startTransition(async () => {
      const res = await setBookingStatus(id, status);
      if ('error' in res) {
        alert(`Could not update booking: ${res.error}`);
        return;
      }
      router.refresh();
    });
  }

  if (bookings.length === 0) {
    return <p className="lead" style={{ opacity: 0.7, margin: '8px 0 0' }}>Nothing here.</p>;
  }

  return (
    <div style={{ overflowX: 'auto', border: '1px solid var(--line)', borderRadius: 14 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ textAlign: 'left', background: 'var(--surface-2)' }}>
            <th style={th}>When</th>
            <th style={th}>Customer</th>
            <th style={th}>Service</th>
            <th style={th}>Stylist</th>
            <th style={th}>Ref</th>
            <th style={th}>Status</th>
            <th style={{ ...th, textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} style={{ borderTop: '1px solid var(--line)' }}>
              <td style={td}>{b.whenLabel}</td>
              <td style={td}>
                <div style={{ fontWeight: 600 }}>{b.customerName}</div>
                <div style={{ opacity: 0.65, fontSize: 12.5 }}>{b.customerPhone}</div>
              </td>
              <td style={td}>{b.serviceName}</td>
              <td style={td}>{b.stylistName}</td>
              <td style={{ ...td, fontFamily: 'ui-monospace, monospace', fontSize: 12.5 }}>{b.reference}</td>
              <td style={td}><StatusChip status={b.status} /></td>
              <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                {ACTIONS.filter((a) => a.status !== b.status).map((a) => (
                  <button
                    key={a.status}
                    className="btn btn--ghost"
                    style={{ padding: '6px 11px', fontSize: 12.5, marginLeft: 6 }}
                    disabled={pending}
                    onClick={() => onSet(b.id, a.status)}
                  >
                    {a.label}
                  </button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th: React.CSSProperties = { padding: '11px 14px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.03em', color: 'var(--fg-2)' };
const td: React.CSSProperties = { padding: '12px 14px', verticalAlign: 'middle' };
