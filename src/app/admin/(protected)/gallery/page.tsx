import Link from 'next/link';
import { requireRole } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import { GalleryList } from './gallery-list';

export default async function GalleryPage() {
  await requireRole(['admin'], '/admin/gallery');
  const sb = await createClient();
  const { data: items } = await sb.from('gallery').select('*').order('sort_order');
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <span className="eyebrow">Lookbook</span>
          <h1 className="h-section" style={{ fontSize: 30, margin: '8px 0 22px' }}>Gallery</h1>
        </div>
        <Link href="/#destinations" target="_blank" className="btn btn--ghost">View on site ↗</Link>
      </div>
      <GalleryList items={items ?? []} />
    </div>
  );
}
