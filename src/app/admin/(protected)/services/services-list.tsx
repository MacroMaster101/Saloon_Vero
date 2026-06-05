'use client';
import { useActionState } from 'react';
import { ListToolbar, type FilterChip } from '@/components/admin/list-toolbar';
import { createService, updateService, deleteService } from './actions';
import { money } from '@/lib/format';
import type { Service } from '@/lib/supabase/types';

const field: React.CSSProperties = {
  padding: '10px 12px', borderRadius: 10, border: '1.5px solid var(--line)',
  background: 'var(--bg-2)', color: 'var(--fg)', fontFamily: 'inherit', fontSize: 14,
};
const lbl: React.CSSProperties = { display: 'grid', gap: 4, fontSize: 12, color: 'var(--muted)' };

/** Format a duration in minutes to a human-readable label, e.g. 90 → "1h 30min", 30 → "30min". */
function durationLabel(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

function ServiceFields({ s }: { s?: Service }) {
  return (
    <>
      <label style={lbl}>Name<input name="name" defaultValue={s?.name ?? ''} required style={field} /></label>
      <label style={lbl}>Slug (optional)<input name="slug" defaultValue={s?.slug ?? ''} placeholder="auto from name" style={field} /></label>
      <label style={lbl}>Description<input name="description" defaultValue={s?.description ?? ''} style={field} /></label>
      <label style={lbl}>Category
        <select name="category" defaultValue={s?.category ?? 'hair'} style={field}>
          <option value="hair">hair</option><option value="beauty">beauty</option>
        </select>
      </label>
      <label style={lbl}>Price (LKR)<input name="price_lkr" type="number" min={0} defaultValue={s?.price_lkr ?? 0} required style={field} /></label>
      <label style={lbl}>Duration (min)<input name="duration_min" type="number" min={1} defaultValue={s?.duration_min ?? 30} required style={field} /></label>
      <label style={lbl}>Icon<input name="icon" defaultValue={s?.icon ?? 'scissors'} style={field} /></label>
      <label style={lbl}>Sort order<input name="sort_order" type="number" defaultValue={s?.sort_order ?? 0} style={field} /></label>
      <label style={{ ...lbl, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <input name="bookable" type="checkbox" defaultChecked={s?.bookable ?? true} /> Bookable
      </label>
      <label style={{ ...lbl, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <input name="is_active" type="checkbox" defaultChecked={s?.is_active ?? true} /> Active (shown on site)
      </label>
    </>
  );
}

function CreateForm() {
  const [state, action, pending] = useActionState(
    async (_p: unknown, fd: FormData) => createService(fd),
    undefined as undefined | { error: string } | { ok: true },
  );
  return (
    <form action={action} style={{ display: 'grid', gap: 12, maxWidth: 460, marginBottom: 28, padding: 18, border: '1.5px solid var(--line)', borderRadius: 14 }}>
      <b style={{ fontSize: 14 }}>Add a service</b>
      <ServiceFields />
      {state && 'error' in state && <p style={{ color: 'var(--danger, #c0392b)', fontSize: 13, margin: 0 }}>{state.error}</p>}
      {state && 'ok' in state && <p style={{ color: 'var(--accent, green)', fontSize: 13, margin: 0 }}>Added.</p>}
      <button className="btn btn--primary" type="submit" disabled={pending}>{pending ? 'Adding…' : 'Add service'}</button>
    </form>
  );
}

function EditRow({ s }: { s: Service }) {
  const [state, action, pending] = useActionState(
    async (_p: unknown, fd: FormData) => updateService(fd),
    undefined as undefined | { error: string } | { ok: true },
  );
  return (
    <li className="person" style={{ display: 'block', padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
        <b style={{ fontSize: 14 }}>{s.name}</b>
        <span className="step__hint" style={{ margin: 0 }}>{money(s.price_lkr)} · {durationLabel(s.duration_min)} · {s.category}{s.is_active ? '' : ' · hidden'}</span>
      </div>
      <details>
        <summary style={{ cursor: 'pointer', fontSize: 13, color: 'var(--muted)' }}>Edit</summary>
        <form action={action} style={{ display: 'grid', gap: 10, maxWidth: 460, marginTop: 12 }}>
          <input type="hidden" name="id" value={s.id} />
          <ServiceFields s={s} />
          {state && 'error' in state && <p style={{ color: 'var(--danger, #c0392b)', fontSize: 13, margin: 0 }}>{state.error}</p>}
          {state && 'ok' in state && <p style={{ color: 'var(--accent, green)', fontSize: 13, margin: 0 }}>Saved.</p>}
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn--primary" type="submit" disabled={pending}>{pending ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      </details>
      <form action={deleteService} style={{ marginTop: 8 }}>
        <input type="hidden" name="id" value={s.id} />
        <button type="submit" className="btn btn--danger-outline">Delete</button>
      </form>
    </li>
  );
}

export function ServicesList({ services }: { services: Service[] }) {
  const chips: FilterChip<Service>[] = [
    { id: 'all', label: 'All', match: () => true },
    { id: 'hair', label: 'Hair', match: (s) => s.category === 'hair' },
    { id: 'beauty', label: 'Beauty', match: (s) => s.category === 'beauty' },
    { id: 'hidden', label: 'Hidden', match: (s) => !s.is_active },
  ];
  return (
    <>
      <CreateForm />
      <ListToolbar
        items={services}
        placeholder="Search services…"
        searchText={(s) => `${s.name} ${s.category} ${s.slug}`}
        chips={chips}
        emptyLabel="No services match your filters."
        render={(rows) => (
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 10 }}>
            {rows.map((s) => <EditRow key={s.id} s={s} />)}
          </ul>
        )}
      />
    </>
  );
}
