import { requireRole } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import { getMyBookings } from '@/lib/queries';
import { ProfileForm } from './profile-form';
import { DeleteAccount } from './delete-account';
import { AccountTabs } from './account-tabs';
import { Icon } from '@/components/ui/icon';

const TZ = 'Asia/Colombo';
const dateFmt = new Intl.DateTimeFormat('en-LK', { timeZone: TZ, month: 'short', year: 'numeric' });
const stampFmt = new Intl.DateTimeFormat('en-LK', { timeZone: TZ, day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
const whenFmt = new Intl.DateTimeFormat('en-LK', { timeZone: TZ, weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true });

const TAG_CLASS: Record<string, string> = { confirmed: 'tag--confirmed', completed: 'tag--completed', no_show: 'tag--no_show', cancelled: 'tag--cancelled' };

export default async function AccountPage() {
  const profile = await requireRole(['user', 'staff', 'admin'], '/account');
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  const bookings = await getMyBookings(profile.userId, profile.email);

  const memberSince = user?.created_at ? dateFmt.format(new Date(user.created_at)) : '—';
  const lastSignIn = user?.last_sign_in_at ? stampFmt.format(new Date(user.last_sign_in_at)) : '—';
  const initial = (profile.fullName || profile.email || '?').trim().charAt(0).toUpperCase();
  const avatarUrl = (user?.user_metadata?.avatar_url as string | undefined) ?? null;

  const bookingsView = bookings.length === 0 ? (
    <p className="step__hint">No bookings yet.</p>
  ) : (
    <ul className="bk-list" style={{ maxWidth: 560 }}>
      {bookings.map((b) => (
        <li key={b.reference} className="bk-card">
          <span className="bk-card__ic"><Icon name="scissors" className="ic-lg" /></span>
          <div className="bk-card__info"><b>{b.reference}</b><span>{whenFmt.format(new Date(b.starts_at))}</span></div>
          <span className={`tag ${TAG_CLASS[b.status] ?? ''}`} style={{ marginLeft: 'auto' }}>{b.status}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <AccountTabs
      name={profile.fullName ?? ''} role={profile.role} initial={initial}
      memberSince={memberSince} lastSignIn={lastSignIn} avatarUrl={avatarUrl}
      profile={<ProfileForm fullName={profile.fullName ?? ''} email={profile.email ?? ''} role={profile.role} />}
      bookings={bookingsView}
      settings={<DeleteAccount />}
    />
  );
}
