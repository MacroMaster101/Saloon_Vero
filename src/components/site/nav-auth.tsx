import { signOut } from '@/app/admin/actions';
import type { Profile } from '@/lib/supabase/auth';

export function NavAuth({ profile }: { profile: Profile | null }) {
  if (!profile) return <a href="/login" className="nav__cta">Sign in</a>;
  const dash = profile.role === 'admin' ? '/admin' : profile.role === 'staff' ? '/admin/schedule' : '/account';
  const label = profile.role === 'user' ? 'Account' : profile.role === 'staff' ? 'My schedule' : 'Admin';
  return (
    <span className="nav__auth">
      <a href={dash}>{label}</a>
      <form action={signOut}><button className="btn btn--ghost" type="submit">Sign out</button></form>
    </span>
  );
}
