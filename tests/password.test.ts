import { describe, it, expect } from 'vitest';
import { checkPassword, PASSWORD_RULES } from '@/lib/auth/password';

describe('checkPassword', () => {
  it('exposes the five rules in order', () => {
    expect(PASSWORD_RULES.map((r) => r.id)).toEqual(['len', 'upper', 'lower', 'number', 'symbol']);
  });
  it('fails an empty password on every rule', () => {
    const r = checkPassword('');
    expect(r.passed).toBe(false);
    expect(r.results.every((x) => x.met === false)).toBe(true);
    expect(r.score).toBe(0);
  });
  it('passes a strong password on every rule', () => {
    const r = checkPassword('Sup3rSecret!');
    expect(r.passed).toBe(true);
    expect(r.score).toBe(5);
    expect(r.results.every((x) => x.met)).toBe(true);
  });
  it('detects individual missing rules', () => {
    expect(checkPassword('alllowercase1!').results.find((x) => x.id === 'upper')!.met).toBe(false);
    expect(checkPassword('ALLUPPER1!').results.find((x) => x.id === 'lower')!.met).toBe(false);
    expect(checkPassword('NoNumbers!').results.find((x) => x.id === 'number')!.met).toBe(false);
    expect(checkPassword('NoSymbol12').results.find((x) => x.id === 'symbol')!.met).toBe(false);
    expect(checkPassword('Ab1!').results.find((x) => x.id === 'len')!.met).toBe(false);
  });
  it('is not passed until all five rules are met', () => {
    expect(checkPassword('Sup3rSecret').passed).toBe(false); // no symbol
  });
});
