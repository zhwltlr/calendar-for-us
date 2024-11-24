export interface CalendarEvent {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  isHoliday: boolean; // optional 제거
  description?: string;
}

export interface HolidayCache {
  [key: string]: CalendarEvent[];
}

export interface Schedule extends Omit<CalendarEvent, "start" | "end"> {
  id: string;
  startDate: Date;
  endDate: Date;
  description?: string;
}
