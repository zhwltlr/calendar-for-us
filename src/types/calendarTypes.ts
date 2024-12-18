export interface CalendarEvent {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  isHoliday: boolean; 
  description?: string;
}

export interface HolidayCache {
  [key: string]: CalendarEvent[];
}

export interface Schedule {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  description?: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}