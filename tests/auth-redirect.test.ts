import { describe, it, expect } from 'vitest';
import { safeNext } from '@/lib/auth/redirect';
import { defaultLandingPath } from '@/lib/auth/roles';

describe('safeNext', () => {
  it('accepts a same-origin relative path', () => {
    expect(safeNext('/account')).toBe('/account');
    expect(safeNext('/admin/people')).toBe('/admin/people');
  });
  it('rejects protocol-relative and absolute URLs', () => {
    expect(safeNext('//evil.com')).toBeNull();
    expect(safeNext('https://evil.com')).toBeNull();
    expect(safeNext('http://evil.com')).toBeNull();
  });
  it('rejects non-path and empty values', () => {
    expect(safeNext('')).toBeNull();
    expect(safeNext(undefined)).toBeNull();
    expect(safeNext('account')).toBeNull();
    expect(safeNext('javascript:alert(1)')).toBeNull();
  });
});

describe('defaultLandingPath', () => {
  it('sends everyone to the home page after login', () => {
    // staff/admin reach their dashboard via the avatar dropdown, not on login
    expect(defaultLandingPath()).toBe('/');
  });
});
