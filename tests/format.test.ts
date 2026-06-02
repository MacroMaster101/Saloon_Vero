import { describe, it, expect } from 'vitest';
import { money, minutesToLabel } from '@/lib/format';
describe('money', () => {
  it('formats LKR with grouping', () => { expect(money(15000)).toBe('LKR 15,000'); });
  it('formats zero', () => { expect(money(0)).toBe('LKR 0'); });
});
describe('minutesToLabel', () => {
  it('formats 10:00', () => { expect(minutesToLabel(600)).toBe('10:00 AM'); });
  it('formats midnight close (1440)', () => { expect(minutesToLabel(1440)).toBe('12:00 AM'); });
  it('formats noon', () => { expect(minutesToLabel(720)).toBe('12:00 PM'); });
});
