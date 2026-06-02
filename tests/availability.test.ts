import { it, expect } from 'vitest';
import { computeOpenSlots, type Interval } from '@/lib/availability';

const day = '2026-06-02'; // a Tuesday
const hours = { open_minute: 600, close_minute: 1440 }; // 10:00–24:00
const tz = 'Asia/Colombo';

it('generates slots on the grid that fit before close', () => {
  const slots = computeOpenSlots({ date: day, hours, durationMin: 40, stepMin: 30, busy: [], tz });
  expect(slots[0]).toBe('10:00'); // first slot at open
  // last slot must finish by 24:00 → start <= 23:20; on a 30-min grid that's 23:00
  expect(slots[slots.length - 1]).toBe('23:00');
});

it('removes slots overlapping a busy interval', () => {
  const busy: Interval[] = [{ startMin: 600, endMin: 690 }]; // 10:00–11:30
  const slots = computeOpenSlots({ date: day, hours, durationMin: 40, stepMin: 30, busy, tz });
  expect(slots).not.toContain('10:00');
  expect(slots).not.toContain('10:30');
  expect(slots).not.toContain('11:00'); // 11:00–11:40 overlaps the busy block (ends 11:30)
  expect(slots).toContain('11:30'); // 11:30–12:10 is clear now
});

it('returns nothing when closed', () => {
  const slots = computeOpenSlots({ date: day, hours: { open_minute: 0, close_minute: 0, is_closed: true }, durationMin: 40, stepMin: 30, busy: [], tz });
  expect(slots).toEqual([]);
});

it('drops a slot whose duration would not fit before close', () => {
  const slots = computeOpenSlots({ date: day, hours: { open_minute: 1380, close_minute: 1440 }, durationMin: 90, stepMin: 30, busy: [], tz });
  expect(slots).toEqual([]); // only 60 min open, needs 90
});
