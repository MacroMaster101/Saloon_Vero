import { describe, it, expect } from 'vitest';
import { safeNext } from '@/lib/auth/redirect';
import { roleDefaultPath } from '@/lib/auth/roles';

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

describe('roleDefaultPath', () => {
  it('routes admin and staff to /admin', () => {
    expect(roleDefaultPath('admin')).toBe('/admin');
    expect(roleDefaultPath('staff')).toBe('/admin');
  });
  it('routes user to /', () => {
    expect(roleDefaultPath('user')).toBe('/');
  });
});
