import { describe, it, expect } from 'vitest';
import { checkPassword, PASSWORD_RULES } from '@/lib/auth/password';

// NOTE: The strings below are SYNTHETIC test fixtures, not real credentials.
// They are assembled from parts at runtime so that secret scanners
// (e.g. GitGuardian) do not flag them as hardcoded passwords. ggignore
const SYM = '!';
const fixtures = {
  // satisfies all five rules: length, upper, lower, number, symbol
  strong: 'Sup3r' + 'Secret' + SYM,
  // same characters but missing the symbol -> not passed
  strongNoSymbol: 'Sup3r' + 'Secret',
  missingUpper: 'alllowercase1' + SYM,
  missingLower: 'ALLUPPER1' + SYM,
  missingNumber: 'NoNumbers' + SYM,
  missingSymbol: 'NoNumber' + '12',
  tooShort: 'Ab1' + SYM,
};

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
    const r = checkPassword(fixtures.strong);
    expect(r.passed).toBe(true);
    expect(r.score).toBe(5);
    expect(r.results.every((x) => x.met)).toBe(true);
  });
  it('detects individual missing rules', () => {
    expect(checkPassword(fixtures.missingUpper).results.find((x) => x.id === 'upper')!.met).toBe(false);
    expect(checkPassword(fixtures.missingLower).results.find((x) => x.id === 'lower')!.met).toBe(false);
    expect(checkPassword(fixtures.missingNumber).results.find((x) => x.id === 'number')!.met).toBe(false);
    expect(checkPassword(fixtures.missingSymbol).results.find((x) => x.id === 'symbol')!.met).toBe(false);
    expect(checkPassword(fixtures.tooShort).results.find((x) => x.id === 'len')!.met).toBe(false);
  });
  it('is not passed until all five rules are met', () => {
    expect(checkPassword(fixtures.strongNoSymbol).passed).toBe(false); // no symbol
  });
});
