'use client';
import { useEffect, useRef, useState } from 'react';
import { signOut } from '@/app/admin/actions';
import type { Profile } from '@/lib/supabase/auth';

export function NavAuth({ profile }: { profile: Profile | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!profile) return <a href="/login" className="nav__cta">Sign in</a>;

  const dash = profile.role === 'admin' ? '/admin' : profile.role === 'staff' ? '/admin/schedule' : '/account';
  const dashLabel = profile.role === 'user' ? 'Account' : profile.role === 'staff' ? 'My schedule' : 'Admin';
  const name = profile.fullName ?? profile.email ?? 'Account';
  const initial = name.trim().charAt(0).toUpperCase() || '?';

  return (
    <div className={`nav-profile${open ? ' open' : ''}`} ref={ref}>
      <button
        type="button"
        className="nav-profile__btn"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="avatar avatar--sm"><b>{initial}</b></span>
      </button>

      <div className="nav-profile__menu" role="menu" hidden={!open}>
        <div className="nav-profile__head">
          <span className="avatar avatar--sm"><b>{initial}</b></span>
          <div className="nav-profile__id">
            <b>{profile.fullName ?? 'Account'}</b>
            {profile.email && <span>{profile.email}</span>}
          </div>
        </div>
        <a href={dash} role="menuitem" className="nav-profile__item" onClick={() => setOpen(false)}>
          {dashLabel}
        </a>
        <form action={signOut}>
          <button type="submit" role="menuitem" className="nav-profile__item nav-profile__item--danger">
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
