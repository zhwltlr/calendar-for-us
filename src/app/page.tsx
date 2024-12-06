import { LoginForm } from '@/features/auth/ui/login-form';
import { authOptions } from '@/shared/lib/auth/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/calendar');
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  );
}