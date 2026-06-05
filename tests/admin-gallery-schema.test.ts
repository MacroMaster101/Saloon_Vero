import { describe, it, expect } from 'vitest';
import { galleryInputSchema } from '@/lib/admin/gallery-schema';

const base = { title: 'Bridal Look', tag: 'Bridal', category: 'Hair & makeup', image_url: '/x.png', sort_order: 1, is_active: true };

describe('galleryInputSchema', () => {
  it('accepts a valid gallery item', () => {
    expect(galleryInputSchema.parse(base)).toMatchObject({ title: 'Bridal Look' });
  });
  it('rejects empty title', () => {
    expect(() => galleryInputSchema.parse({ ...base, title: '' })).toThrow();
  });
  it('rejects empty image_url (required)', () => {
    expect(() => galleryInputSchema.parse({ ...base, image_url: '' })).toThrow();
  });
  it('coerces sort_order from string', () => {
    expect(galleryInputSchema.parse({ ...base, sort_order: '3' }).sort_order).toBe(3);
  });
});
