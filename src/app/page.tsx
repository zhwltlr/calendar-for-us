import { LoginForm } from '@/layouts/login/login-form';
import { authOptions } from '@/utils/auth/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/calendar');
  }

  return (
    <div className="min-h-screen flex items-start py-24 justify-center">
      <LoginForm />
    </div>
  );
}