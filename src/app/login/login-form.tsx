'use client';
import { useActionState } from 'react';
import { signInWithGoogle, signInWithPassword } from './actions';

export function LoginForm({ next }: { next: string }) {
  const [state, action] = useActionState(signInWithPassword, undefined);
  return (
    <div className="book__card" style={{ maxWidth: 420, margin: '0 auto', display: 'block', padding: 32 }}>
      <h1 className="step__title">Sign in</h1>
      <form action={signInWithGoogle}>
        <input type="hidden" name="next" value={next} />
        <button className="btn btn--primary btn--lg" style={{ width: '100%' }} type="submit">Continue with Google</button>
      </form>
      <p className="step__hint" style={{ textAlign: 'center', margin: '18px 0' }}>or sign in with email</p>
      <form action={action}>
        <input type="hidden" name="next" value={next} />
        <div className="field"><label>Email</label><input name="email" type="email" required /></div>
        <div className="field"><label>Password</label><input name="password" type="password" required /></div>
        {state?.error && <p className="field invalid"><span className="msg" style={{ display: 'block' }}>{state.error}</span></p>}
        <button className="btn btn--ghost btn--lg" style={{ width: '100%' }} type="submit">Sign in</button>
      </form>
    </div>
  );
}
