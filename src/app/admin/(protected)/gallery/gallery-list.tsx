'use client';
import { useActionState } from 'react';
import { ListToolbar, type FilterChip } from '@/components/admin/list-toolbar';
import { ImageField } from '@/components/admin/image-field';
import { createGalleryItem, updateGalleryItem, deleteGalleryItem } from './actions';
import type { GalleryItem } from '@/lib/supabase/types';

const field: React.CSSProperties = {
  padding: '10px 12px', borderRadius: 10, border: '1.5px solid var(--line)',
  background: 'var(--bg-2)', color: 'var(--fg)', fontFamily: 'inherit', fontSize: 14,
};
const lbl: React.CSSProperties = { display: 'grid', gap: 4, fontSize: 12, color: 'var(--muted)' };

function GalleryFields({ g }: { g?: GalleryItem }) {
  return (
    <>
      <label style={lbl}>Title<input name="title" defaultValue={g?.title ?? ''} required style={field} /></label>
      <label style={lbl}>Tag<input name="tag" defaultValue={g?.tag ?? ''} style={field} /></label>
      <label style={lbl}>Category / caption<input name="category" defaultValue={g?.category ?? ''} style={field} /></label>
      <ImageField name="image_url" label="Image" defaultValue={g?.image_url ?? ''} />
      <label style={lbl}>Sort order<input name="sort_order" type="number" defaultValue={g?.sort_order ?? 0} style={field} /></label>
      <label style={{ ...lbl, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <input name="is_active" type="checkbox" defaultChecked={g?.is_active ?? true} /> Active (shown on site)
      </label>
    </>
  );
}

function CreateForm() {
  const [state, action, pending] = useActionState(
    async (_p: unknown, fd: FormData) => createGalleryItem(fd),
    undefined as undefined | { error: string } | { ok: true },
  );
  return (
    <form action={action} style={{ display: 'grid', gap: 12, maxWidth: 460, marginBottom: 28, padding: 18, border: '1.5px solid var(--line)', borderRadius: 14 }}>
      <b style={{ fontSize: 14 }}>Add a gallery item</b>
      <GalleryFields />
      {state && 'error' in state && <p style={{ color: 'var(--danger, #c0392b)', fontSize: 13, margin: 0 }}>{state.error}</p>}
      {state && 'ok' in state && <p style={{ color: 'var(--accent, green)', fontSize: 13, margin: 0 }}>Added.</p>}
      <button className="btn btn--primary" type="submit" disabled={pending}>{pending ? 'Adding…' : 'Add item'}</button>
    </form>
  );
}

function EditRow({ g }: { g: GalleryItem }) {
  const [state, action, pending] = useActionState(
    async (_p: unknown, fd: FormData) => updateGalleryItem(fd),
    undefined as undefined | { error: string } | { ok: true },
  );
  return (
    <li className="person" style={{ display: 'block', padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
        <b style={{ fontSize: 14 }}>{g.title}</b>
        <span className="step__hint" style={{ margin: 0 }}>{g.tag}{g.is_active ? '' : ' · hidden'}</span>
      </div>
      <details>
        <summary style={{ cursor: 'pointer', fontSize: 13, color: 'var(--muted)' }}>Edit</summary>
        <form action={action} style={{ display: 'grid', gap: 10, maxWidth: 460, marginTop: 12 }}>
          <input type="hidden" name="id" value={g.id} />
          <GalleryFields g={g} />
          {state && 'error' in state && <p style={{ color: 'var(--danger, #c0392b)', fontSize: 13, margin: 0 }}>{state.error}</p>}
          {state && 'ok' in state && <p style={{ color: 'var(--accent, green)', fontSize: 13, margin: 0 }}>Saved.</p>}
          <button className="btn btn--primary" type="submit" disabled={pending}>{pending ? 'Saving…' : 'Save'}</button>
        </form>
      </details>
      <form action={deleteGalleryItem} style={{ marginTop: 8 }}>
        <input type="hidden" name="id" value={g.id} />
        <button type="submit" className="btn btn--danger-outline">Delete</button>
      </form>
    </li>
  );
}

export function GalleryList({ items }: { items: GalleryItem[] }) {
  const chips: FilterChip<GalleryItem>[] = [
    { id: 'all', label: 'All', match: () => true },
    { id: 'active', label: 'Active', match: (g) => g.is_active },
    { id: 'hidden', label: 'Hidden', match: (g) => !g.is_active },
  ];
  return (
    <>
      <CreateForm />
      <ListToolbar
        items={items}
        placeholder="Search gallery…"
        searchText={(g) => `${g.title} ${g.tag} ${g.category}`}
        chips={chips}
        emptyLabel="No gallery items match your filters."
        render={(rows) => (
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 10 }}>
            {rows.map((g) => <EditRow key={g.id} g={g} />)}
          </ul>
        )}
      />
    </>
  );
}
