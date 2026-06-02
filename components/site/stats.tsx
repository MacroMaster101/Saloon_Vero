'use client';
import { useEffect, useRef, useState } from 'react';
import { Reveal } from '@/components/site/reveal';

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Reduced motion: skip the count-up animation, show the final value at once.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVal(to);
      return;
    }
    let raf = 0;
    let started = false;
    const run = () => {
      if (started) return;
      started = true;
      const dur = 1200;
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(eased * to));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    if (!('IntersectionObserver' in window)) {
      run();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            run();
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [to]);
  return (
    <span className="count" data-to={to} ref={ref}>
      {val}
    </span>
  );
}

export function Stats() {
  return (
    <section
      className="section"
      style={{
        paddingTop: 'clamp(56px,7vw,90px)',
        paddingBottom: 'clamp(56px,7vw,90px)',
      }}
    >
      <div className="wrap">
        <div className="stats">
          <Reveal>
            <div className="stat-card">
              <b>
                4.9<span className="suf">★</span>
              </b>
              <span>Google rating</span>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="stat-card">
              <b>
                <CountUp to={8} />
              </b>
              <span>Five-star reviews</span>
            </div>
          </Reveal>
          <Reveal delay={2}>
            <div className="stat-card">
              <b>
                Him<span className="suf">&amp;</span>Her
              </b>
              <span>Unisex salon</span>
            </div>
          </Reveal>
          <Reveal delay={3}>
            <div className="stat-card">
              <b>
                10<span className="suf">–</span>12
              </b>
              <span>Open daily</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
