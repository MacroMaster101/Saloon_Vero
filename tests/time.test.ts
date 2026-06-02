import { it, expect } from 'vitest';
import { toUtcInstant, minutesOfDayInTz } from '@/lib/time';

it('converts a salon-local date+minute to a UTC instant', () => {
  // 2026-06-02 10:00 Asia/Colombo (UTC+5:30) = 2026-06-02T04:30:00Z
  const iso = toUtcInstant('2026-06-02', 600, 'Asia/Colombo');
  expect(iso).toBe('2026-06-02T04:30:00.000Z');
});

it('reads minutes-of-day in tz from a UTC instant', () => {
  const min = minutesOfDayInTz('2026-06-02T04:30:00.000Z', 'Asia/Colombo');
  expect(min).toBe(600);
});
