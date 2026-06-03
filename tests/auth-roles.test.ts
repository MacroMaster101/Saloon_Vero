import { describe, it, expect } from 'vitest';
import { authDecision } from '@/lib/supabase/auth';

describe('authDecision', () => {
  const allowed = ['staff', 'admin'] as const;
  it('redirects to login when logged out, preserving next', () => {
    expect(authDecision(null, [...allowed], '/admin/people'))
      .toEqual({ kind: 'login', next: '/admin/people' });
  });
  it('allows when role is in the allowed set', () => {
    expect(authDecision('admin', [...allowed], '/admin')).toEqual({ kind: 'allow' });
    expect(authDecision('staff', [...allowed], '/admin')).toEqual({ kind: 'allow' });
  });
  it('denies (not authorized) when authed but wrong role', () => {
    expect(authDecision('user', [...allowed], '/admin')).toEqual({ kind: 'deny' });
  });
});
