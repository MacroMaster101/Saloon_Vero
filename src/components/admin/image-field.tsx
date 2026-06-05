'use client';
import { useRef, useState, useTransition } from 'react';
import { uploadImage } from '@/lib/admin/upload';

const field: React.CSSProperties = {
  padding: '10px 12px', borderRadius: 10, border: '1.5px solid var(--line)',
  background: 'var(--bg-2)', color: 'var(--fg)', fontFamily: 'inherit', fontSize: 14,
};
const lbl: React.CSSProperties = { display: 'grid', gap: 4, fontSize: 12, color: 'var(--muted)' };

export function ImageField({ name, label = 'Image', defaultValue = '' }: { name: string; label?: string; defaultValue?: string | null }) {
  const [url, setUrl] = useState(defaultValue ?? '');
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  function onPick() {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setError(null);
    const fd = new FormData();
    fd.set('file', file);
    start(async () => {
      const res = await uploadImage(fd);
      if ('error' in res) setError(res.error);
      else setUrl(res.url);
    });
  }

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <label style={lbl}>{label} URL
        <input name={name} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://… or upload below" style={field} />
      </label>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <input ref={fileRef} type="file" accept="image/*" onChange={onPick} style={{ fontSize: 12 }} />
        {pending && <span className="step__hint" style={{ margin: 0 }}>Uploading…</span>}
      </div>
      {error && <p style={{ color: 'var(--danger, #c0392b)', fontSize: 12, margin: 0 }}>{error}</p>}
      {url && (
        // plain img (not next/image) so no remote-host config is needed for admin previews
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="preview" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 10, border: '1.5px solid var(--line)' }} />
      )}
    </div>
  );
}
