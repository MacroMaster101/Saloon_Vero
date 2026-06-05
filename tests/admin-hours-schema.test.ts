import { describe, it, expect } from 'vitest';
import { hoursDaySchema } from '@/lib/admin/hours-schema';

const base = { day_of_week: 1, open_minute: 600, close_minute: 1440, is_closed: false };

describe('hoursDaySchema', () => {
  it('accepts a valid day', () => {
    expect(hoursDaySchema.parse(base)).toMatchObject({ day_of_week: 1, open_minute: 600 });
  });
  it('coerces string minutes', () => {
    const r = hoursDaySchema.parse({ ...base, open_minute: '630', close_minute: '1410' });
    expect(r.open_minute).toBe(630);
    expect(r.close_minute).toBe(1410);
  });
  it('rejects day_of_week out of range', () => {
    expect(() => hoursDaySchema.parse({ ...base, day_of_week: 7 })).toThrow();
  });
  it('rejects minutes above 1440', () => {
    expect(() => hoursDaySchema.parse({ ...base, close_minute: 1500 })).toThrow();
  });
  it('treats a missing is_closed as false', () => {
    const { is_closed, ...noFlag } = base;
    void is_closed;
    expect(hoursDaySchema.parse(noFlag).is_closed).toBe(false);
  });
});
