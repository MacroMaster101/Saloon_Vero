import { Nav } from '@/components/site/nav';
import { ScrollProgress } from '@/components/site/scroll-progress';
import { LenisProvider } from '@/components/site/lenis-provider';
import { RevealObserver } from '@/components/site/reveal-observer';
import { Hero } from '@/components/site/hero';
import { Marquee } from '@/components/site/marquee';
import { Stats } from '@/components/site/stats';
import { Services } from '@/components/site/services';
import { Lookbook } from '@/components/site/lookbook';
import { HowItWorks } from '@/components/site/how-it-works';
import { Stylists } from '@/components/site/stylists';
import { Story } from '@/components/site/story';
import { Quote } from '@/components/site/quote';
import { Visit } from '@/components/site/visit';
import { Cta } from '@/components/site/cta';
import { Footer } from '@/components/site/footer';
import { BookingWizard } from '@/components/booking/booking-wizard';
import { LoadingScreen } from '@/components/site/loading-screen';
import { getGallery, getBookableServices, getStylists } from '@/lib/queries';

export default async function Home() {
  const [gallery, services, stylists] = await Promise.all([
    getGallery(),
    getBookableServices(),
    getStylists(),
  ]);
  return (
    <>
      <LoadingScreen />
      <ScrollProgress />
      <LenisProvider />
      <RevealObserver />
      <Nav />
      <main id="top">
        <Hero />
        <Marquee />
        <Stats />
        <Services />
        <Lookbook items={gallery} />
        <HowItWorks />
        <section className="section booking" id="book">
          <div className="wrap">
            <div className="sec-head reveal in" style={{ marginBottom: 34 }}>
              <div>
                <span className="eyebrow">Book now</span>
                <h2 className="h-section">Reserve your visit</h2>
              </div>
              <p className="lead">
                Four quick steps. No account, no deposit — just pick a service, a stylist, and a time.
              </p>
            </div>
            <BookingWizard services={services} stylists={stylists} />
          </div>
        </section>
        <Stylists />
        <Story />
        <Quote />
        <Visit />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
