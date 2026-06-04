import { describe, it, expect } from 'vitest';
import { isDeleteConfirmed, canAdminDelete } from '@/lib/account/guards';

describe('isDeleteConfirmed', () => {
  it('accepts exactly DELETE', () => {
    expect(isDeleteConfirmed('DELETE')).toBe(true);
  });
  it('rejects anything else', () => {
    for (const v of ['', 'delete', 'DELETE ', ' DELETE', 'DELET', 'yes', undefined, null]) {
      expect(isDeleteConfirmed(v as string)).toBe(false);
    }
  });
});

describe('canAdminDelete', () => {
  it('allows deleting another user', () => {
    expect(canAdminDelete('admin-1', 'user-2')).toBe(true);
  });
  it('forbids an admin deleting themselves via the admin path', () => {
    expect(canAdminDelete('admin-1', 'admin-1')).toBe(false);
  });
});
