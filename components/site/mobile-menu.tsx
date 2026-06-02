'use client';

import { useState } from 'react';

const LINKS: { href: string; label: string }[] = [
  { href: '#services', label: 'Services' },
  { href: '#destinations', label: 'Our Work' },
  { href: '#how', label: 'Your Visit' },
  { href: '#team', label: 'Stylists' },
  { href: '#visit', label: 'Find Us' },
  { href: '#book', label: 'Book now' },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="nav__burger"
        id="burger"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <span></span><span></span><span></span>
      </button>

      <div className={`mobile-menu${open ? ' open' : ''}`} id="mobileMenu">
        <div className="mobile-menu__top">
          <div className="brand">
            <span className="brand__mark" style={{ color: 'var(--color-primary-light)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" width="30" height="30" aria-hidden="true"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><line x1="8.12" y1="8.12" x2="12" y2="12"></line></svg>
            </span>
            <span className="brand__name" style={{ color: 'var(--cream)' }}>VERO<small>SALON · UNISEX</small></span>
          </div>
          <button className="mobile-menu__close" id="menuClose" aria-label="Close" onClick={() => setOpen(false)}>×</button>
        </div>
        <nav>
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} data-close onClick={() => setOpen(false)}>{l.label}</a>
          ))}
        </nav>
      </div>
    </>
  );
}
