import { requireRole } from '@/lib/supabase/auth';
import { signOut } from '../actions';

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireRole(['staff', 'admin'], '/admin');
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <b className="brand__name" style={{ fontSize: 18 }}>Vero Salon — {profile.role === 'admin' ? 'Admin' : 'Staff'}</b>
        <nav style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {profile.role === 'admin' && <a href="/admin/people">People</a>}
          {profile.role === 'staff' && <a href="/admin/schedule">My schedule</a>}
          <form action={signOut}><button className="btn btn--ghost">Sign out</button></form>
        </nav>
      </header>
      {children}
    </div>
  );
}
