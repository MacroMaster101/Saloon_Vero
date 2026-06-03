import { requireRole } from '@/lib/supabase/auth';
import { getMyBookings } from '@/lib/queries';
import { ProfileForm } from './profile-form';

export default async function AccountPage() {
  const profile = await requireRole(['user', 'staff', 'admin'], '/account');
  const bookings = await getMyBookings(profile.userId, profile.email);
  return (
    <main className="section"><div className="wrap">
      <span className="eyebrow">Your account</span>
      <h1 className="h-section">Hello{profile.fullName ? `, ${profile.fullName}` : ''}</h1>
      <div style={{ display: 'grid', gap: 32, gridTemplateColumns: '1fr', marginTop: 24 }}>
        <ProfileForm fullName={profile.fullName ?? ''} email={profile.email ?? ''} role={profile.role} />
        <section>
          <h2 className="step__title">Your bookings</h2>
          {bookings.length === 0 ? <p className="step__hint">No bookings yet.</p> : (
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 12 }}>
              {bookings.map((b) => (
                <li key={b.reference} className="book__card" style={{ display: 'flex', justifyContent: 'space-between', padding: 16 }}>
                  <span>{new Date(b.starts_at).toLocaleString()}</span>
                  <span className="tag">{b.status}</span>
                  <b>{b.reference}</b>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div></main>
  );
}
