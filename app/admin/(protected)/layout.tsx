import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/auth';
import { signOut } from '../actions';

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user) redirect('/admin/login');
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <b className="brand__name" style={{ fontSize: 18 }}>Vero Salon — Admin</b>
        <form action={signOut}><button className="btn btn--ghost">Sign out</button></form>
      </header>
      {children}
    </div>
  );
}
