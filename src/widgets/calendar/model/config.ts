import { format, getDay, parse, startOfWeek } from "date-fns";
import { ko } from "date-fns/locale";
import { dateFnsLocalizer } from "react-big-calendar";

export const locales = {
  ko: ko,
};

export const calendarLocalizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: ko }),
  getDay,
  locales,
});

export const calendarMessages = {
  today: "오늘",
  previous: "이전",
  next: "다음",
  month: "월",
  week: "주",
  day: "일",
  agenda: "일정",
  date: "날짜",
  time: "시간",
  event: "일정",
  noEventsInRange: "일정이 없습니다",
};

export const eventStyleGetter = (event: { isHoliday: boolean }) => ({
  style: {
    backgroundColor: event.isHoliday ? "#499e91" : "#3174ad",
    borderRadius: "4px",
    opacity: 0.8,
    color: "white",
    border: "0px",
    display: "block",
    padding: "2px 5px",
  },
});
