import { describe, it, expect } from 'vitest';
import { serviceInputSchema, slugify } from '@/lib/admin/service-schema';

describe('slugify', () => {
  it('lowercases, trims, and hyphenates', () => {
    expect(slugify('  Gents Cut & Style ')).toBe('gents-cut-style');
  });
  it('collapses repeats and strips edge hyphens', () => {
    expect(slugify("Kids' Cut (under 12)")).toBe('kids-cut-under-12');
  });
});

describe('serviceInputSchema', () => {
  const base = {
    name: 'Gents Cut', slug: 'gents-cut', description: 'Wash & cut.',
    category: 'hair', price_lkr: 900, duration_min: 40, icon: 'scissors',
    bookable: true, is_active: true, sort_order: 1,
  };
  it('accepts a valid service', () => {
    expect(serviceInputSchema.parse(base)).toMatchObject({ name: 'Gents Cut', category: 'hair' });
  });
  it('rejects an empty name', () => {
    expect(() => serviceInputSchema.parse({ ...base, name: '' })).toThrow();
  });
  it('rejects a non hair/beauty category', () => {
    expect(() => serviceInputSchema.parse({ ...base, category: 'nails' })).toThrow();
  });
  it('rejects negative price', () => {
    expect(() => serviceInputSchema.parse({ ...base, price_lkr: -1 })).toThrow();
  });
  it('rejects zero or negative duration', () => {
    expect(() => serviceInputSchema.parse({ ...base, duration_min: 0 })).toThrow();
  });
  it('coerces numeric strings from form data', () => {
    const r = serviceInputSchema.parse({ ...base, price_lkr: '1500', duration_min: '60', sort_order: '2' });
    expect(r.price_lkr).toBe(1500);
    expect(r.duration_min).toBe(60);
    expect(r.sort_order).toBe(2);
  });
  it('derives slug from name when slug omitted', () => {
    const r = serviceInputSchema.parse({ ...base, slug: '' });
    expect(r.slug).toBe('gents-cut');
  });
});
