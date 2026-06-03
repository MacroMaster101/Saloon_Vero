import { ImgSlot } from '@/components/site/img-slot';

export function Story() {
  return (
    <section className="section story" id="story">
      <div className="wrap story__grid">
        <div className="story__art reveal">
          <div className="pole"></div>
          <ImgSlot alt="Salon interior" />
        </div>
        <div className="story__copy reveal">
          <span className="eyebrow gold">Our Story</span>
          <h2 className="h-section">Pasyala&apos;s unisex hair &amp; beauty home.</h2>
          <p>Vero Salon is a friendly neighbourhood salon on Attanagalla Road, Pasyala — a unisex space for hair, colour and beauty, for him and her. We keep it warm, welcoming and unhurried.</p>
          <p>Sharp cuts, fresh colour, beard grooming, facials and full bridal — done by a team that takes the time to get you right. The 4.9-star reviews say the rest.</p>
          <div className="story__stats">
            <div className="stat"><b>4.9★</b><span>Google rating</span></div>
            <div className="stat"><b>Unisex</b><span>Him &amp; her</span></div>
            <div className="stat"><b>Daily</b><span>10 AM – 12 AM</span></div>
          </div>
          <div className="story__sign">— The Vero Salon team</div>
        </div>
      </div>
    </section>
  );
}
