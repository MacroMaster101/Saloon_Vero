import Link from 'next/link';
import { requireRole } from '@/lib/supabase/auth';
import { signOut } from '../actions';
import { Icon, type IconName } from '@/components/ui/icon';

const ADMIN_NAV: { href: string; label: string; icon: IconName }[] = [
  { href: '/admin', label: 'Dashboard', icon: 'grid' },
  { href: '/admin/people', label: 'People', icon: 'people' },
  { href: '/admin/services', label: 'Services', icon: 'scissors' },
  { href: '/admin/stylists', label: 'Stylists', icon: 'user' },
  { href: '/admin/gallery', label: 'Gallery', icon: 'grid' },
  { href: '/admin/content', label: 'Content', icon: 'cog' },
  { href: '/admin/schedule', label: 'Schedule', icon: 'calendar' },
];
const STAFF_NAV: { href: string; label: string; icon: IconName }[] = [
  { href: '/admin/schedule', label: 'My schedule', icon: 'calendar' },
  { href: '/admin', label: 'Dashboard', icon: 'grid' },
];

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireRole(['staff', 'admin'], '/admin');
  const nav = profile.role === 'admin' ? ADMIN_NAV : STAFF_NAV;
  const initial = (profile.fullName || profile.email || '?').trim().charAt(0).toUpperCase();

  return (
    <div className="shell">
      <aside className="shell__side">
        <div className="side__brand"><span className="pole" style={{ height: 26 }} /> Vero Salon
          <span className="role-badge" style={{ marginLeft: 'auto' }}>{profile.role === 'admin' ? 'Admin' : 'Staff'}</span>
        </div>
        <div className="side__id">
          <span className="avatar"><b>{initial}</b></span>
          <div className="side__name">{profile.fullName ?? profile.email}</div>
        </div>
        <nav className="side__nav">
          {nav.map((n) => (
            <Link key={n.href} href={n.href}><Icon name={n.icon} className="ic" /> {n.label}</Link>
          ))}
        </nav>
        <div className="side__foot">
          <form action={signOut}><button className="btn btn--ghost" type="submit"><Icon name="logout" className="ic" /> Sign out</button></form>
        </div>
      </aside>
      <main className="shell__main">{children}</main>
    </div>
  );
}
