import { describe, it, expect } from 'vitest';
import { BLOCK_DEFAULTS, blockSchemas } from '@/lib/content/blocks';
import { mergeContent } from '@/lib/content/merge';

describe('block defaults', () => {
  it('has defaults for all blocks', () => {
    expect(Object.keys(BLOCK_DEFAULTS).sort()).toEqual(['contact', 'cta', 'hero', 'quote', 'stats', 'story']);
  });
  it('story default has two paragraphs', () => {
    expect(BLOCK_DEFAULTS.story.paragraphs.length).toBe(2);
  });
});

describe('block schemas', () => {
  it('quote schema accepts valid data', () => {
    const r = blockSchemas.quote.parse({ stars: '★★★★★', text: 'Great', by: 'Google' });
    expect(r.text).toBe('Great');
  });
  it('cta schema fills missing fields from partial input', () => {
    const r = blockSchemas.cta.parse({ title: 'Hi' });
    expect(r.title).toBe('Hi');
    expect(typeof r.sub).toBe('string');
  });
});

describe('mergeContent', () => {
  it('returns full defaults for an empty db value', () => {
    const r = mergeContent('quote', {});
    expect(r.stars).toBe('★★★★★');
    expect(r.text.length).toBeGreaterThan(0);
  });
  it('overrides only provided fields', () => {
    const r = mergeContent('quote', { text: 'Custom quote' });
    expect(r.text).toBe('Custom quote');
    expect(r.by).toBe('Google review · 4.9 ★ average'); // default kept
  });
  it('ignores unknown/garbage db value and falls back', () => {
    const r = mergeContent('cta', { bogus: 123 } as Record<string, unknown>);
    expect(r.title).toBe('Time to treat yourself.');
  });
});

describe('hero & stats blocks', () => {
  it('hero default has three display lines', () => {
    const h = BLOCK_DEFAULTS.hero;
    expect(h.line1.length).toBeGreaterThan(0);
    expect(h.line2Em.length).toBeGreaterThan(0);
    expect(h.line3.length).toBeGreaterThan(0);
  });
  it('stats default has four cards', () => {
    expect(BLOCK_DEFAULTS.stats.cards.length).toBe(4);
  });
  it('mergeContent fills hero partials', () => {
    const r = mergeContent('hero', { line1: 'Custom' });
    expect(r.line1).toBe('Custom');
    expect(r.lead.length).toBeGreaterThan(0);
  });
});

describe('contact block', () => {
  it('contact default has address and primary phone', () => {
    expect(BLOCK_DEFAULTS.contact.address.length).toBeGreaterThan(0);
    expect(BLOCK_DEFAULTS.contact.phonePrimary.length).toBeGreaterThan(0);
  });
  it('mergeContent fills contact partials', () => {
    const r = mergeContent('contact', { address: 'New Road' });
    expect(r.address).toBe('New Road');
    expect(r.facebookUrl.length).toBeGreaterThan(0);
  });
});
