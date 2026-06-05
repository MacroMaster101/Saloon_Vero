import Link from 'next/link';
import { requireRole } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import { ServicesList } from './services-list';

export default async function ServicesPage() {
  await requireRole(['admin'], '/admin/services');
  const sb = await createClient();
  const { data: services } = await sb.from('services').select('*').order('sort_order');
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <span className="eyebrow">Catalogue</span>
          <h1 className="h-section" style={{ fontSize: 30, margin: '8px 0 22px' }}>Services</h1>
        </div>
        <Link href="/#services" target="_blank" className="btn btn--ghost">View on site ↗</Link>
      </div>
      <ServicesList services={services ?? []} />
    </div>
  );
}
