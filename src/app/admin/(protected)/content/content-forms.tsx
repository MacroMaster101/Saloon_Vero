'use client';
import { useActionState } from 'react';
import { saveBlock } from './actions';
import { saveHours } from './hours-actions';
import type { QuoteContent, CtaContent, StoryContent, HeroContent, StatsContent, ContactContent } from '@/lib/content/blocks';
import type { BusinessHour } from '@/lib/supabase/types';
import { minutesToLabel } from '@/lib/format';

const field: React.CSSProperties = {
  padding: '10px 12px', borderRadius: 10, border: '1.5px solid var(--line)',
  background: 'var(--bg-2)', color: 'var(--fg)', fontFamily: 'inherit', fontSize: 14, width: '100%',
};
const lbl: React.CSSProperties = { display: 'grid', gap: 4, fontSize: 12, color: 'var(--muted)' };
const card: React.CSSProperties = { display: 'grid', gap: 12, maxWidth: 560, marginBottom: 28, padding: 18, border: '1.5px solid var(--line)', borderRadius: 14 };

function useSave() {
  return useActionState(
    async (_p: unknown, fd: FormData) => saveBlock(fd),
    undefined as undefined | { error: string } | { ok: true },
  );
}
function Status({ state }: { state: undefined | { error: string } | { ok: true } }) {
  if (!state) return null;
  if ('error' in state) return <p style={{ color: 'var(--danger, #c0392b)', fontSize: 13, margin: 0 }}>{state.error}</p>;
  return <p style={{ color: 'var(--accent, green)', fontSize: 13, margin: 0 }}>Saved.</p>;
}

export function HeroForm({ content }: { content: HeroContent }) {
  const [state, action, pending] = useSave();
  return (
    <form action={action} style={card}>
      <input type="hidden" name="key" value="hero" />
      <b style={{ fontSize: 14 }}>Hero</b>
      <label style={lbl}>Eyebrow<input name="eyebrow" defaultValue={content.eyebrow} style={field} /></label>
      <label style={lbl}>Display line 1<input name="line1" defaultValue={content.line1} style={field} /></label>
      <label style={lbl}>Display line 2 (emphasized)<input name="line2Em" defaultValue={content.line2Em} style={field} /></label>
      <label style={lbl}>Display line 3<input name="line3" defaultValue={content.line3} style={field} /></label>
      <label style={lbl}>Lead paragraph<textarea name="lead" defaultValue={content.lead} rows={3} style={field} /></label>
      <Status state={state} />
      <button className="btn btn--primary" type="submit" disabled={pending}>{pending ? 'Saving…' : 'Save'}</button>
    </form>
  );
}

export function StatsForm({ content }: { content: StatsContent }) {
  const [state, action, pending] = useSave();
  const cards = [0, 1, 2, 3].map((i) => content.cards[i] ?? { value: '', label: '' });
  return (
    <form action={action} style={card}>
      <input type="hidden" name="key" value="stats" />
      <b style={{ fontSize: 14 }}>Stats (4 cards)</b>
      {cards.map((c, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <label style={lbl}>Value {i + 1}<input name={`value${i}`} defaultValue={c.value} style={field} /></label>
          <label style={lbl}>Label {i + 1}<input name={`label${i}`} defaultValue={c.label} style={field} /></label>
        </div>
      ))}
      <Status state={state} />
      <button className="btn btn--primary" type="submit" disabled={pending}>{pending ? 'Saving…' : 'Save'}</button>
    </form>
  );
}

export function QuoteForm({ content }: { content: QuoteContent }) {
  const [state, action, pending] = useSave();
  return (
    <form action={action} style={card}>
      <input type="hidden" name="key" value="quote" />
      <b style={{ fontSize: 14 }}>Testimonial quote</b>
      <label style={lbl}>Stars<input name="stars" defaultValue={content.stars} style={field} /></label>
      <label style={lbl}>Quote<textarea name="text" defaultValue={content.text} rows={3} style={field} /></label>
      <label style={lbl}>Attribution<input name="by" defaultValue={content.by} style={field} /></label>
      <Status state={state} />
      <button className="btn btn--primary" type="submit" disabled={pending}>{pending ? 'Saving…' : 'Save'}</button>
    </form>
  );
}

export function CtaForm({ content }: { content: CtaContent }) {
  const [state, action, pending] = useSave();
  return (
    <form action={action} style={card}>
      <input type="hidden" name="key" value="cta" />
      <b style={{ fontSize: 14 }}>Call to action</b>
      <label style={lbl}>Title<input name="title" defaultValue={content.title} style={field} /></label>
      <label style={lbl}>Subtext<textarea name="sub" defaultValue={content.sub} rows={3} style={field} /></label>
      <label style={lbl}>Phone button label<input name="phoneLabel" defaultValue={content.phoneLabel} style={field} /></label>
      <label style={lbl}>Phone link (tel:…)<input name="phoneHref" defaultValue={content.phoneHref} style={field} /></label>
      <Status state={state} />
      <button className="btn btn--primary" type="submit" disabled={pending}>{pending ? 'Saving…' : 'Save'}</button>
    </form>
  );
}

export function StoryForm({ content }: { content: StoryContent }) {
  const [state, action, pending] = useSave();
  return (
    <form action={action} style={card}>
      <input type="hidden" name="key" value="story" />
      <b style={{ fontSize: 14 }}>Story section</b>
      <label style={lbl}>Eyebrow<input name="eyebrow" defaultValue={content.eyebrow} style={field} /></label>
      <label style={lbl}>Heading<input name="heading" defaultValue={content.heading} style={field} /></label>
      <label style={lbl}>Paragraphs (blank line between)
        <textarea name="paragraphs" defaultValue={content.paragraphs.join('\n\n')} rows={7} style={field} />
      </label>
      <label style={lbl}>Sign-off<input name="sign" defaultValue={content.sign} style={field} /></label>
      <Status state={state} />
      <button className="btn btn--primary" type="submit" disabled={pending}>{pending ? 'Saving…' : 'Save'}</button>
    </form>
  );
}

export function ContactForm({ content }: { content: ContactContent }) {
  const [state, action, pending] = useSave();
  return (
    <form action={action} style={card}>
      <input type="hidden" name="key" value="contact" />
      <b style={{ fontSize: 14 }}>Contact & footer</b>
      <label style={lbl}>Address<input name="address" defaultValue={content.address} style={field} /></label>
      <label style={lbl}>Plus code<input name="plusCode" defaultValue={content.plusCode} style={field} /></label>
      <label style={lbl}>Primary phone<input name="phonePrimary" defaultValue={content.phonePrimary} style={field} /></label>
      <label style={lbl}>Other phones<input name="phoneOther" defaultValue={content.phoneOther} style={field} /></label>
      <label style={lbl}>Facebook URL<input name="facebookUrl" defaultValue={content.facebookUrl} style={field} /></label>
      <label style={lbl}>Footer blurb<textarea name="footerBlurb" defaultValue={content.footerBlurb} rows={2} style={field} /></label>
      <Status state={state} />
      <button className="btn btn--primary" type="submit" disabled={pending}>{pending ? 'Saving…' : 'Save'}</button>
    </form>
  );
}

const DAY_LABELS: { dow: number; label: string }[] = [
  { dow: 1, label: 'Monday' }, { dow: 2, label: 'Tuesday' }, { dow: 3, label: 'Wednesday' },
  { dow: 4, label: 'Thursday' }, { dow: 5, label: 'Friday' }, { dow: 6, label: 'Saturday' },
  { dow: 0, label: 'Sunday' },
];
const TIME_OPTIONS: number[] = (() => { const o: number[] = []; for (let m = 0; m <= 1440; m += 30) o.push(m); return o; })();

export function HoursForm({ hours }: { hours: BusinessHour[] }) {
  const [state, action, pending] = useActionState(
    async (_p: unknown, fd: FormData) => saveHours(fd),
    undefined as undefined | { error: string } | { ok: true },
  );
  const byDow = new Map(hours.map((h) => [h.day_of_week, h]));
  return (
    <form action={action} style={card}>
      <b style={{ fontSize: 14 }}>Opening hours</b>
      {DAY_LABELS.map(({ dow, label }) => {
        const h = byDow.get(dow);
        const open = h?.open_minute ?? 600;
        const close = h?.close_minute ?? 1440;
        const closed = h?.is_closed ?? false;
        return (
          <div key={dow} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 1fr auto', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 13 }}>{label}</span>
            <select name={`open_${dow}`} defaultValue={open} style={field} aria-label={`${label} open`}>
              {TIME_OPTIONS.map((m) => <option key={m} value={m}>{minutesToLabel(m)}</option>)}
            </select>
            <select name={`close_${dow}`} defaultValue={close} style={field} aria-label={`${label} close`}>
              {TIME_OPTIONS.map((m) => <option key={m} value={m}>{minutesToLabel(m)}</option>)}
            </select>
            <label style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', gap: 4, alignItems: 'center' }}>
              <input type="checkbox" name={`closed_${dow}`} defaultChecked={closed} /> Closed
            </label>
          </div>
        );
      })}
      <Status state={state} />
      <button className="btn btn--primary" type="submit" disabled={pending}>{pending ? 'Saving…' : 'Save hours'}</button>
    </form>
  );
}
