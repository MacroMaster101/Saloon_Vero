export type Role = 'user' | 'staff' | 'admin';

export function roleDefaultPath(role: Role): string {
  return role === 'admin' || role === 'staff' ? '/admin' : '/';
}
