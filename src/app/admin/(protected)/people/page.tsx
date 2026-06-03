import { requireRole } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import { setRole } from './actions';

export default async function PeoplePage() {
  await requireRole(['admin'], '/admin/people');
  const sb = await createClient();
  const { data: profiles } = await sb.from('profiles').select('id, full_name, email, role, stylist_id').order('created_at', { ascending: true });
  const { data: stylists } = await sb.from('stylists').select('id, name').order('sort_order');
  const people = profiles ?? [];
  return (
    <div>
      <h1 className="step__title">People</h1>
      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 12 }}>
        {people.map((p) => (
          <li key={p.id} className="book__card" style={{ padding: 16 }}>
            <form action={setRole} style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <input type="hidden" name="id" value={p.id} />
              <b style={{ minWidth: 160 }}>{p.full_name ?? '—'}</b>
              <span className="step__hint">{p.email}</span>
              <select name="role" defaultValue={p.role} aria-label="Role">
                <option value="user">user</option>
                <option value="staff">staff</option>
                <option value="admin">admin</option>
              </select>
              <select name="stylist_id" defaultValue={p.stylist_id ?? ''} aria-label="Linked stylist">
                <option value="">— no stylist —</option>
                {(stylists ?? []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <button className="btn btn--primary" type="submit">Save</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
