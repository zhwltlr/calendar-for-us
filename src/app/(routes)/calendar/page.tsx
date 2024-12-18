import MainCalendar from "@/layouts/calendar";
import { authOptions } from '@/utils/auth/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

const CalendarPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  return <MainCalendar />;
};

export default CalendarPage;