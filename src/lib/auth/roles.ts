export type Role = 'user' | 'staff' | 'admin';

// After login everyone lands on the home page, regardless of role. Staff and
// admins reach their dashboard from the profile avatar dropdown. (An explicit
// `next` destination still takes precedence — see the login action/callback.)
export function defaultLandingPath(): string {
  return '/';
}
