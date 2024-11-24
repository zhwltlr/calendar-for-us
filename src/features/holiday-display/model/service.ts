import { HolidayEvent } from "@/widgets/calendar/model/types";
import axios from "axios";
import { HolidayItem, HolidayResponse } from "./types";

export const fetchHolidayData = async (
  year: number,
  month: number
): Promise<HolidayEvent[]> => {
  const serviceKey = process.env.NEXT_PUBLIC_HOLIDAY_API_KEY
    ? decodeURIComponent(process.env.NEXT_PUBLIC_HOLIDAY_API_KEY)
    : "";

  if (!serviceKey) {
    throw new Error("Holiday API key is not defined");
  }

  try {
    const response = await axios.get<HolidayResponse>(
      `http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo`,
      {
        params: {
          solMonth: month.toString().padStart(2, "0"),
          ServiceKey: serviceKey,
          solYear: year,
          numOfRows: 100,
        },
      }
    );

    const items = response.data.response.body.items?.item || [];
    return transformToHolidayEvents(items);
  } catch (error) {
    console.error("Failed to fetch holidays:", error);
    return [];
  }
};

const transformToHolidayEvents = (
  items: HolidayItem | HolidayItem[]
): HolidayEvent[] => {
  const itemArray = Array.isArray(items) ? items : [items];

  return itemArray
    .filter((holiday) => holiday.isHoliday === "Y")
    .map((holiday) => ({
      title: holiday.dateName,
      start: new Date(
        holiday.locdate.toString().replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")
      ),
      end: new Date(
        holiday.locdate.toString().replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")
      ),
      isHoliday: true,
    }));
};
