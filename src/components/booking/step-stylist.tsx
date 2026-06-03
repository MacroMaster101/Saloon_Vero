'use client';
import type { Stylist } from '@/lib/supabase/types';

export function StepStylist({
  stylists,
  selectedId,
  touched,
  onSelect,
}: {
  stylists: Stylist[];
  selectedId: string | null;
  touched: boolean;
  /** id === null → "No preference" */
  onSelect: (id: string | null) => void;
}) {
  const noPref = touched && selectedId === null;
  return (
    <div className="step active" data-step="1">
      <h3 className="step__title">Who&apos;s styling you?</h3>
      <p className="step__hint">Choose a stylist, or let us match you with whoever&apos;s free.</p>
      <div className="choices choices--2" id="barberList">
        <button
          type="button"
          className={`choice${noPref ? ' sel' : ''}`}
          onClick={() => onSelect(null)}
          aria-pressed={noPref}
        >
          <span className="choice__ic">✦</span>
          <span className="choice__txt">
            <b>No preference</b>
            <small>Next available stylist</small>
          </span>
        </button>
        {stylists.map((st) => {
          const sel = touched && selectedId === st.id;
          return (
            <button
              type="button"
              key={st.id}
              className={`choice${sel ? ' sel' : ''}`}
              onClick={() => onSelect(st.id)}
              aria-pressed={sel}
            >
              <span className="choice__ic">{st.name.charAt(0)}</span>
              <span className="choice__txt">
                <b>{st.name}</b>
                <small>{st.role}</small>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
