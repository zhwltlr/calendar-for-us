import { CalendarEvent } from "@/widgets/calendar/model/types";
import axios from "axios";
import { HolidayItem, HolidayResponse } from "./types";

export const fetchHolidayData = async (
  year: number,
  month: number
): Promise<CalendarEvent[]> => {
  try {
    const response = await axios.get<HolidayResponse>(
      `/api/holidays`,
      {
        params: {
          solMonth: month.toString().padStart(2, "0"),
          solYear: year,
          numOfRows: 100,
        },
      }
    );

    const items = response.data.response.body.items?.item || [];
    return transformToCalendarEvents(items);
  } catch (error) {
    console.error("Failed to fetch holidays:", error);
    return [];
  }
};

const transformToCalendarEvents = (
  items: HolidayItem | HolidayItem[]
): CalendarEvent[] => {
  const itemArray = Array.isArray(items) ? items : [items];

  return itemArray
    .filter((holiday) => holiday.isHoliday === "Y")
    .map((holiday) => {
      const date = new Date(
        holiday.locdate.toString().replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")
      );
      return {
        title: holiday.dateName,
        start: date,
        end: date,
        isHoliday: true,
        description: `${holiday.dateName} (공휴일)`,
      };
    });
};