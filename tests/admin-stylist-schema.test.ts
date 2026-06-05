import { describe, it, expect } from 'vitest';
import { stylistInputSchema } from '@/lib/admin/stylist-schema';

const base = { name: 'Ruwan', slug: 'ruwan', role: 'Gents Stylist', tags: 'Cuts, Colour', avatar_url: '/x.png', sort_order: 1, is_active: true };

describe('stylistInputSchema', () => {
  it('parses tags from a comma string into a trimmed array', () => {
    const r = stylistInputSchema.parse(base);
    expect(r.tags).toEqual(['Cuts', 'Colour']);
  });
  it('drops empty tag entries', () => {
    expect(stylistInputSchema.parse({ ...base, tags: 'A, , B,' }).tags).toEqual(['A', 'B']);
  });
  it('derives slug from name when omitted', () => {
    expect(stylistInputSchema.parse({ ...base, slug: '' }).slug).toBe('ruwan');
  });
  it('rejects empty name', () => {
    expect(() => stylistInputSchema.parse({ ...base, name: '' })).toThrow();
  });
  it('allows empty avatar_url (nullable)', () => {
    expect(stylistInputSchema.parse({ ...base, avatar_url: '' }).avatar_url).toBeNull();
  });
});
