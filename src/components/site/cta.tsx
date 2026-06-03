export function Cta() {
  return (
    <section className="section cta" id="cta">
      <div className="pl--sun" style={{ top: '-40px', right: '-40px', width: '280px', height: '280px' }}></div>
      <div className="wrap reveal" style={{ position: 'relative', zIndex: 2 }}>
        <h2 className="cta__title">Time to <em>treat yourself.</em></h2>
        <p className="cta__sub">Book a hair, colour or beauty appointment at Vero Salon — for him or her. We&apos;re open till midnight, every day.</p>
        <div className="cta__actions">
          <a href="#book" className="btn btn--primary btn--lg">Book your visit</a>
          <a href="tel:0773699620" className="btn btn--ghost-light btn--lg">Call 077 369 9620</a>
        </div>
      </div>
    </section>
  );
}
