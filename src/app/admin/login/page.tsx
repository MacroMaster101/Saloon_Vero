'use client';
import { useActionState } from 'react';
import { signIn } from '../actions';

export default function Login() {
  const [state, action, pending] = useActionState(signIn, undefined);
  return (
    <div style={{ maxWidth: 360, margin: '80px auto', padding: 24 }}>
      <h1 className="h-section" style={{ fontSize: 32 }}>Admin sign in</h1>
      <form action={action} style={{ display: 'grid', gap: 12, marginTop: 24 }}>
        <input name="email" type="email" placeholder="Email" required
          style={{ padding: '13px 14px', borderRadius: 12, border: '1.5px solid var(--line)', background: 'var(--surface-2)', color: 'var(--fg)', fontFamily: 'inherit', fontSize: 15 }} />
        <input name="password" type="password" placeholder="Password" required
          style={{ padding: '13px 14px', borderRadius: 12, border: '1.5px solid var(--line)', background: 'var(--surface-2)', color: 'var(--fg)', fontFamily: 'inherit', fontSize: 15 }} />
        {state?.error && <p style={{ color: 'var(--color-danger)', fontSize: 14, margin: 0 }}>{state.error}</p>}
        <button className="btn btn--primary" disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  );
}
