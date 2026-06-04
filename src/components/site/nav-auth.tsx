import { getProfile } from '@/lib/supabase/auth';
import { signOut } from '@/app/admin/actions';

export async function NavAuth() {
  const profile = await getProfile();
  if (!profile) return <a href="/login" className="nav__cta">Sign in</a>;
  const dash = profile.role === 'admin' ? '/admin' : profile.role === 'staff' ? '/admin/schedule' : '/account';
  const label = profile.role === 'user' ? 'Account' : profile.role === 'staff' ? 'My schedule' : 'Admin';
  return (
    <span style={{ display: 'inline-flex', gap: 14, alignItems: 'center' }}>
      <a href={dash}>{label}</a>
      <form action={signOut}><button className="btn btn--ghost">Sign out</button></form>
    </span>
  );
}
