import { LoginForm } from './login-form';
import { safeNext } from '@/lib/auth/redirect';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const sp = await searchParams;
  const next = safeNext(sp.next) ?? '';
  return (
    <main className="section"><div className="wrap"><LoginForm next={next} /></div></main>
  );
}
