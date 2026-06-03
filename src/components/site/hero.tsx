'use client';
import { useEffect, useRef } from 'react';

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // entrance
    hero.classList.add('hero--in');

    const layers = Array.from(
      hero.querySelectorAll<HTMLElement>('.pl[data-speed]'),
    );

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        for (const el of layers) {
          const speed = parseFloat(el.dataset.speed ?? '0');
          el.style.transform = `translateY(${-y * speed}px)`;
        }
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // cursor tilt (hover-capable pointers only)
    const canHover = window.matchMedia('(hover:hover)').matches;
    let onMove: ((e: MouseEvent) => void) | undefined;
    let onLeave: (() => void) | undefined;
    if (canHover) {
      onMove = (e: MouseEvent) => {
        const frame = frameRef.current;
        if (!frame) return;
        const r = hero.getBoundingClientRect();
        const mx = (e.clientX - r.left) / r.width - 0.5;
        const my = (e.clientY - r.top) / r.height - 0.5;
        frame.style.transform = `rotateY(${mx * 14}deg) rotateX(${-my * 12}deg)`;
      };
      onLeave = () => {
        const frame = frameRef.current;
        if (frame) frame.style.transform = '';
      };
      hero.addEventListener('mousemove', onMove);
      hero.addEventListener('mouseleave', onLeave);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (onMove) hero.removeEventListener('mousemove', onMove);
      if (onLeave) hero.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero__layers" id="heroLayers">
        <div className="pl pl--sun" data-speed="0.16" />
        <div className="hero__portrait pl" data-speed="0.12">
          <div className="frame hero__logocard" ref={frameRef}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="60%"
              height="60%"
              aria-label="Vero Salon"
              role="img"
            >
              <circle cx="6" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <line x1="20" y1="4" x2="8.12" y2="15.88" />
              <line x1="14.47" y1="14.48" x2="20" y2="20" />
              <line x1="8.12" y1="8.12" x2="12" y2="12" />
            </svg>
          </div>
        </div>
        <div className="pl pl--card pl--c1" data-speed="0.50" style={{ top: '18%', right: '26%' }}>
          <span className="dot" style={{ background: '#3ec77f' }} />
          <div>
            <b>Open now</b>
            <span>10 AM – 12 AM</span>
          </div>
        </div>
        <div className="pl pl--card pl--c2" data-speed="0.42" style={{ top: '64%', right: '22%' }}>
          <span className="dot" style={{ background: 'var(--color-warning)' }} />
          <div>
            <b>4.9 ★ rated</b>
            <span>Google · 8 reviews</span>
          </div>
        </div>
      </div>

      <div className="wrap hero__inner">
        <span className="eyebrow">Hair &amp; Beauty · Unisex Salon · Pasyala</span>
        <h1 className="hero__display">
          Looking good is
          <br />
          our <em>business.</em>
        </h1>
        <p className="lead hero__sub">
          Pasyala&apos;s home for hair, colour and beauty — for him and her. Sharp cuts, fresh colour
          and a little pampering, all under one roof.
        </p>
        <div className="hero__actions">
          <a href="#book" className="btn btn--primary btn--lg">
            Book your visit
          </a>
          <a href="#services" className="btn btn--ghost btn--lg">
            See services
          </a>
        </div>
      </div>

      <div className="hero__scroll">
        <span>Scroll</span>
        <span className="mouse" />
      </div>
    </section>
  );
}
