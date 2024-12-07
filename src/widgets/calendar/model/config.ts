import { format, getDay, startOfWeek } from "date-fns";
import { ko } from "date-fns/locale";
import { CSSProperties } from "react";
import { dateFnsLocalizer } from "react-big-calendar";
import { CalendarEvent } from "./types";

export const locales = {
  ko: ko,
};

export const calendarLocalizer = dateFnsLocalizer({
  format: (date: Date, formatStr: string) => 
    format(date, formatStr, { locale: ko }),
  parse: (str: string) => new Date(str),
  startOfWeek: () => {
    return startOfWeek(new Date(), { locale: ko });
  },
  getDay: (date: Date) => getDay(date),
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

export const eventStyleGetter = (event: CalendarEvent) => {
  // 휴일 스타일
  if (event.isHoliday) {
    return {
      style: {
        backgroundColor: "#499e91",
        borderRadius: "4px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
        padding: "2px 5px",
      }
    };
  }

  // 스케줄 타입별 색상 매핑
  const scheduleTypeColors: { [key: string]: string } = {
    day: '#e8abaa',
    evening: '#b1c77e',
    night: '#5d78a5',
    remote: '#ffc247',
    'half-day': '#8c6d9c',
    'full-day': '#8c6d9c'
  };

  // 스케줄 타입에 해당하는 경우 (근무/연차)
  if (event.title in scheduleTypeColors) {
    return {
      style: {
        backgroundColor: scheduleTypeColors[event.title],
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        position: 'relative',
        top: 0,
        left: '4px',
        margin: '2px',
        padding: '0 10px',
        border: 'none',
        color: 'transparent',
        fontSize: 0,
        lineHeight: 0,
        boxSizing: 'border-box'
      } as CSSProperties
    };
  }

  // 기본 일정 스타일
  return {
    style: {
      backgroundColor: "#3174ad",
      borderRadius: "4px",
      opacity: 0.8,
      color: "white",
      border: "0px",
      display: "block",
      padding: "2px 5px",
    } as CSSProperties
  };
};