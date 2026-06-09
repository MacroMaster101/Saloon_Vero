import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { safeNext } from '@/lib/auth/redirect';
import { defaultLandingPath } from '@/lib/auth/roles';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = safeNext(url.searchParams.get('next'));
  if (code) {
    const sb = await createClient();
    const { error } = await sb.auth.exchangeCodeForSession(code);
    if (error) return NextResponse.redirect(new URL('/login?error=oauth', url.origin));
  }
  if (next) return NextResponse.redirect(new URL(next, url.origin));
  return NextResponse.redirect(new URL(defaultLandingPath(), url.origin));
}
