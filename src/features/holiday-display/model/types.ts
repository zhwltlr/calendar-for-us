export interface HolidayResponse {
  response: {
    body: {
      items: {
        item: HolidayItem | HolidayItem[];
      };
    };
  };
}

export interface HolidayItem {
  dateKind: string;
  dateName: string;
  isHoliday: string;
  locdate: number;
  seq: number;
}
