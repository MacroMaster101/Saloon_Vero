import Link from 'next/link';
import { requireRole } from '@/lib/supabase/auth';
import { getSiteContent } from '@/lib/content/get';
import { getBusinessHours } from '@/lib/queries';
import { QuoteForm, CtaForm, StoryForm, HeroForm, StatsForm, ContactForm, HoursForm } from './content-forms';

export default async function ContentPage() {
  await requireRole(['admin'], '/admin/content');
  const [quote, cta, story, hero, stats, contact, hours] = await Promise.all([
    getSiteContent('quote'),
    getSiteContent('cta'),
    getSiteContent('story'),
    getSiteContent('hero'),
    getSiteContent('stats'),
    getSiteContent('contact'),
    getBusinessHours(),
  ]);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <span className="eyebrow">Homepage</span>
          <h1 className="h-section" style={{ fontSize: 30, margin: '8px 0 22px' }}>Content</h1>
        </div>
        <Link href="/" target="_blank" className="btn btn--ghost">View on site ↗</Link>
      </div>
      <HeroForm content={hero} />
      <StatsForm content={stats} />
      <StoryForm content={story} />
      <QuoteForm content={quote} />
      <CtaForm content={cta} />
      <HoursForm hours={hours} />
      <ContactForm content={contact} />
    </div>
  );
}
