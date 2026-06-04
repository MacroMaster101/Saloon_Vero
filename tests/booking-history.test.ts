import { describe, it, expect } from 'vitest';
import { historyOrFilter } from '@/lib/queries';

describe('historyOrFilter', () => {
  it('matches by user_id OR null-user with same email (lowercased)', () => {
    expect(historyOrFilter('uid-1', 'Me@Example.com'))
      .toBe('user_id.eq.uid-1,and(user_id.is.null,customer_email.ilike.me@example.com)');
  });
  it('matches by user_id only when no email present', () => {
    expect(historyOrFilter('uid-1', null)).toBe('user_id.eq.uid-1');
  });
  it('falls back to user_id only when the email has filter metacharacters (injection guard)', () => {
    // crafted email attempting to inject an extra .or() clause
    expect(historyOrFilter('uid-1', 'a@b.com,user_id.eq.victim'))
      .toBe('user_id.eq.uid-1');
    // ilike wildcards are also refused
    expect(historyOrFilter('uid-1', 'a%@b.com')).toBe('user_id.eq.uid-1');
    expect(historyOrFilter('uid-1', 'a(b)@c.com')).toBe('user_id.eq.uid-1');
  });
});
