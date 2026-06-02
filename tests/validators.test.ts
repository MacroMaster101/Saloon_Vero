import { it, expect } from 'vitest';
import { bookingDetailsSchema, slLankaPhone } from '@/lib/validators';

it('accepts a valid Sri Lankan mobile', () => {
  expect(slLankaPhone.safeParse('077 369 9620').success).toBe(true);
  expect(slLankaPhone.safeParse('+94773699620').success).toBe(true);
});
it('rejects too-short phone', () => {
  expect(slLankaPhone.safeParse('123').success).toBe(false);
});
it('accepts empty email but rejects malformed', () => {
  const base = { name: 'Nimal', phone: '0773699620', notes: '' };
  expect(bookingDetailsSchema.safeParse({ ...base, email: '' }).success).toBe(true);
  expect(bookingDetailsSchema.safeParse({ ...base, email: 'nope' }).success).toBe(false);
});
it('rejects a 1-char name', () => {
  expect(bookingDetailsSchema.safeParse({ name: 'A', phone: '0773699620', email: '', notes: '' }).success).toBe(false);
});
