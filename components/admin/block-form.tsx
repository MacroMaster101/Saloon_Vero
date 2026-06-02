'use client';
import { useActionState } from 'react';
import { createBlock } from '@/app/admin/(protected)/blocked-slots/block-actions';
import { minutesToLabel } from '@/lib/format';
import type { Stylist } from '@/lib/supabase/types';

const fieldStyle: React.CSSProperties = {
  padding: '13px 14px',
  borderRadius: 12,
  border: '1.5px solid var(--line)',
  background: 'var(--surface-2)',
  color: 'var(--fg)',
  fontFamily: 'inherit',
  fontSize: 15,
};

const labelStyle: React.CSSProperties = {
  display: 'grid',
  gap: 6,
  fontSize: 13,
  color: 'var(--muted)',
};

function rangeOptions(from: number, to: number): number[] {
  const out: number[] = [];
  for (let m = from; m <= to; m += 30) out.push(m);
  return out;
}

const START_OPTIONS = rangeOptions(600, 1410);
const END_OPTIONS = rangeOptions(630, 1440);

export function BlockForm({ stylists }: { stylists: Stylist[] }) {
  const [state, action, pending] = useActionState(
    async (_prev: unknown, fd: FormData) => createBlock(fd),
    undefined as undefined | { error: string } | { ok: true },
  );

  return (
    <form action={action} style={{ display: 'grid', gap: 14, maxWidth: 460, marginTop: 20 }}>
      <label style={labelStyle}>
        Stylist
        <select name="stylistId" defaultValue="all" style={fieldStyle}>
          <option value="all">Whole salon</option>
          {stylists.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </label>

      <label style={labelStyle}>
        Date
        <input name="date" type="date" required style={fieldStyle} />
      </label>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <label style={labelStyle}>
          Start
          <select name="startMin" defaultValue={600} style={fieldStyle}>
            {START_OPTIONS.map((m) => (
              <option key={m} value={m}>{minutesToLabel(m)}</option>
            ))}
          </select>
        </label>
        <label style={labelStyle}>
          End
          <select name="endMin" defaultValue={630} style={fieldStyle}>
            {END_OPTIONS.map((m) => (
              <option key={m} value={m}>{minutesToLabel(m)}</option>
            ))}
          </select>
        </label>
      </div>

      <label style={labelStyle}>
        Reason (optional)
        <input name="reason" type="text" placeholder="e.g. Holiday, training" style={fieldStyle} />
      </label>

      {state && 'error' in state && (
        <p style={{ color: 'var(--color-danger)', fontSize: 14, margin: 0 }}>{state.error}</p>
      )}

      <button className="btn btn--primary" disabled={pending}>
        {pending ? 'Adding…' : 'Add block'}
      </button>
    </form>
  );
}
