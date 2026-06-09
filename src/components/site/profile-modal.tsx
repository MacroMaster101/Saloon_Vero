'use client';
import { useEffect, useRef, useState, useTransition } from 'react';
import { uploadAvatar, removeAvatar, updateName } from '@/app/account/avatar-actions';
import { avatarSrc } from '@/lib/avatar';

export function ProfileModal({
  open,
  onClose,
  seed,
  initialName,
  initialAvatar,
  email,
}: {
  open: boolean;
  onClose: () => void;
  seed: string;            // email/name used for the DiceBear fallback
  initialName: string;
  initialAvatar: string | null;
  email: string | null;
}) {
  const [name, setName] = useState(initialName);
  const [avatar, setAvatar] = useState<string | null>(initialAvatar);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [pending, start] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);

  if (!open) return null;

  function pickFile() {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setError(null); setOk(false);
    const fd = new FormData();
    fd.set('file', file);
    start(async () => {
      const res = await uploadAvatar(fd);
      if ('error' in res) setError(res.error);
      else { setAvatar(res.url); setOk(true); }
    });
  }

  function clearPhoto() {
    setError(null); setOk(false);
    start(async () => {
      const res = await removeAvatar();
      if ('error' in res) setError(res.error);
      else { setAvatar(null); setOk(true); }
    });
  }

  function saveName() {
    setError(null); setOk(false);
    start(async () => {
      const res = await updateName(name);
      if ('error' in res) setError(res.error);
      else setOk(true);
    });
  }

  const shown = avatarSrc(avatar, seed);

  return (
    <div className="pm__overlay" onMouseDown={onClose}>
      <div className="pm" role="dialog" aria-modal="true" aria-label="Edit profile" onMouseDown={(e) => e.stopPropagation()}>
        <button type="button" className="pm__x" aria-label="Close" onClick={onClose}>×</button>
        <h2 className="pm__title">Edit profile</h2>

        <div className="pm__avatar-row">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shown} alt="Your avatar" className="pm__avatar" />
          <div className="pm__avatar-actions">
            <button type="button" className="btn btn--ghost" disabled={pending}
              onClick={() => fileRef.current?.click()}>
              {pending ? 'Working…' : 'Upload photo'}
            </button>
            {avatar && (
              <button type="button" className="btn btn--ghost-light" disabled={pending} onClick={clearPhoto}>
                Remove
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={pickFile} />
            <p className="pm__hint">JPG, PNG, WEBP or GIF · up to 5 MB. No photo? We use a generated avatar.</p>
          </div>
        </div>

        <label className="pm__field">
          <span>Full name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        </label>
        <label className="pm__field">
          <span>Email</span>
          <input value={email ?? ''} disabled />
        </label>

        {error && <p className="astatus astatus--err">{error}</p>}
        {ok && !error && <p className="astatus astatus--ok">Saved.</p>}

        <div className="pm__foot">
          <button type="button" className="btn btn--primary" disabled={pending} onClick={saveName}>
            {pending ? 'Saving…' : 'Save changes'}
          </button>
          <button type="button" className="btn btn--ghost" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}
