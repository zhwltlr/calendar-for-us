export interface HolidayEvent {
  title: string;
  start: Date;
  end: Date;
  isHoliday: boolean;
}

export interface HolidayCache {
  [key: string]: HolidayEvent[];
}
