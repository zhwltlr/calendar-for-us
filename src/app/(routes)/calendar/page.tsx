import { authOptions } from '@/shared/lib/auth/auth';
import MainCalendar from "@/widgets/calendar/ui/calendar";
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