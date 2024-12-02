const CalendarLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">일정 관리</h1>
      {children}
    </div>
  );
};

export default CalendarLayout;
