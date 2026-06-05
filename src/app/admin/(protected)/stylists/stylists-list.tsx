'use client';
import { useActionState } from 'react';
import { ListToolbar, type FilterChip } from '@/components/admin/list-toolbar';
import { ImageField } from '@/components/admin/image-field';
import { createStylist, updateStylist, deleteStylist } from './actions';
import type { Stylist } from '@/lib/supabase/types';

const field: React.CSSProperties = {
  padding: '10px 12px', borderRadius: 10, border: '1.5px solid var(--line)',
  background: 'var(--bg-2)', color: 'var(--fg)', fontFamily: 'inherit', fontSize: 14,
};
const lbl: React.CSSProperties = { display: 'grid', gap: 4, fontSize: 12, color: 'var(--muted)' };

function StylistFields({ s }: { s?: Stylist }) {
  return (
    <>
      <label style={lbl}>Name<input name="name" defaultValue={s?.name ?? ''} required style={field} /></label>
      <label style={lbl}>Slug (optional)<input name="slug" defaultValue={s?.slug ?? ''} placeholder="auto from name" style={field} /></label>
      <label style={lbl}>Role<input name="role" defaultValue={s?.role ?? ''} style={field} /></label>
      <label style={lbl}>Tags (comma separated)<input name="tags" defaultValue={(s?.tags ?? []).join(', ')} style={field} /></label>
      <ImageField name="avatar_url" label="Avatar" defaultValue={s?.avatar_url ?? ''} />
      <label style={lbl}>Sort order<input name="sort_order" type="number" defaultValue={s?.sort_order ?? 0} style={field} /></label>
      <label style={{ ...lbl, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <input name="is_active" type="checkbox" defaultChecked={s?.is_active ?? true} /> Active (shown on site)
      </label>
    </>
  );
}

function CreateForm() {
  const [state, action, pending] = useActionState(
    async (_p: unknown, fd: FormData) => createStylist(fd),
    undefined as undefined | { error: string } | { ok: true },
  );
  return (
    <form action={action} style={{ display: 'grid', gap: 12, maxWidth: 460, marginBottom: 28, padding: 18, border: '1.5px solid var(--line)', borderRadius: 14 }}>
      <b style={{ fontSize: 14 }}>Add a stylist</b>
      <StylistFields />
      {state && 'error' in state && <p style={{ color: 'var(--danger, #c0392b)', fontSize: 13, margin: 0 }}>{state.error}</p>}
      {state && 'ok' in state && <p style={{ color: 'var(--accent, green)', fontSize: 13, margin: 0 }}>Added.</p>}
      <button className="btn btn--primary" type="submit" disabled={pending}>{pending ? 'Adding…' : 'Add stylist'}</button>
    </form>
  );
}

function EditRow({ s }: { s: Stylist }) {
  const [state, action, pending] = useActionState(
    async (_p: unknown, fd: FormData) => updateStylist(fd),
    undefined as undefined | { error: string } | { ok: true },
  );
  return (
    <li className="person" style={{ display: 'block', padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
        <b style={{ fontSize: 14 }}>{s.name}</b>
        <span className="step__hint" style={{ margin: 0 }}>{s.role}{s.is_active ? '' : ' · hidden'}</span>
      </div>
      <details>
        <summary style={{ cursor: 'pointer', fontSize: 13, color: 'var(--muted)' }}>Edit</summary>
        <form action={action} style={{ display: 'grid', gap: 10, maxWidth: 460, marginTop: 12 }}>
          <input type="hidden" name="id" value={s.id} />
          <StylistFields s={s} />
          {state && 'error' in state && <p style={{ color: 'var(--danger, #c0392b)', fontSize: 13, margin: 0 }}>{state.error}</p>}
          {state && 'ok' in state && <p style={{ color: 'var(--accent, green)', fontSize: 13, margin: 0 }}>Saved.</p>}
          <button className="btn btn--primary" type="submit" disabled={pending}>{pending ? 'Saving…' : 'Save'}</button>
        </form>
      </details>
      <form action={deleteStylist} style={{ marginTop: 8 }}>
        <input type="hidden" name="id" value={s.id} />
        <button type="submit" className="btn btn--danger-outline">Delete</button>
      </form>
    </li>
  );
}

export function StylistsList({ stylists }: { stylists: Stylist[] }) {
  const chips: FilterChip<Stylist>[] = [
    { id: 'all', label: 'All', match: () => true },
    { id: 'active', label: 'Active', match: (s) => s.is_active },
    { id: 'hidden', label: 'Hidden', match: (s) => !s.is_active },
  ];
  return (
    <>
      <CreateForm />
      <ListToolbar
        items={stylists}
        placeholder="Search stylists…"
        searchText={(s) => `${s.name} ${s.role} ${(s.tags ?? []).join(' ')}`}
        chips={chips}
        emptyLabel="No stylists match your filters."
        render={(rows) => (
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 10 }}>
            {rows.map((s) => <EditRow key={s.id} s={s} />)}
          </ul>
        )}
      />
    </>
  );
}
