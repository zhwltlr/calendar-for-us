"use client";

import { Card } from "@/components/ui/card";
import { HolidayCache, HolidayEvent } from "@/types/dateTypes";
import axios from "axios";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { ko } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";

const locales = {
  ko: ko,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: ko }),
  getDay,
  locales,
});

const CustomCalendar = () => {
  const [myEvents, setMyEvents] = useState<HolidayEvent[]>([]);
  const [holidays, setHolidays] = useState<HolidayEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // 캐시를 위한 ref 사용 (리렌더링 방지)
  const holidayCache = useRef<HolidayCache>({});
  // API 요청 중복 방지를 위한 ref
  const fetchingMonths = useRef<Set<string>>(new Set());

  // 캐시 키 생성 함수
  const getCacheKey = useCallback((date: Date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
  }, []);

  // 공휴일 데이터 가져오기 함수
  const fetchHolidays = useCallback(
    async (date: Date) => {
      const cacheKey = getCacheKey(date);

      if (holidayCache.current[cacheKey]) {
        setHolidays(holidayCache.current[cacheKey]);
        return;
      }

      if (fetchingMonths.current.has(cacheKey)) {
        return;
      }

      try {
        setIsLoading(true);
        fetchingMonths.current.add(cacheKey);

        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const serviceKey = process.env.NEXT_PUBLIC_HOLIDAY_API_KEY
          ? decodeURIComponent(process.env.NEXT_PUBLIC_HOLIDAY_API_KEY)
          : "";
        if (!serviceKey) {
          throw new Error("Holiday API key is not defined");
        }

        const response = await axios.get(
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

        // JSON 응답 처리
        const items = response.data.response.body.items?.item || [];
        const holidayEvents: HolidayEvent[] = (
          Array.isArray(items) ? items : [items]
        )
          .filter((holiday) => holiday.isHoliday === "Y")
          .map((holiday) => ({
            title: holiday.dateName,
            start: new Date(
              holiday.locdate
                .toString()
                .replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")
            ),
            end: new Date(
              holiday.locdate
                .toString()
                .replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")
            ),
            isHoliday: true,
          }));

        holidayCache.current[cacheKey] = holidayEvents;
        setHolidays(holidayEvents);
      } catch (error) {
        console.error("Failed to fetch holidays:", error);
        setHolidays([]);
      } finally {
        setIsLoading(false);
        fetchingMonths.current.delete(cacheKey);
      }
    },
    [getCacheKey]
  );

  // 초기 로드 및 날짜 변경 시 공휴일 가져오기
  useEffect(() => {
    fetchHolidays(currentDate);
  }, [currentDate, fetchHolidays]);

  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const eventStyleGetter = useCallback((event: HolidayEvent) => {
    const style = {
      backgroundColor: event.isHoliday ? "#499e91" : "#3174ad",
      borderRadius: "4px",
      opacity: 0.8,
      color: "white",
      border: "0px",
      display: "block",
      padding: "2px 5px",
    };
    return { style };
  }, []);

  const messages = {
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

  return (
    <Card className="p-4 w-full">
      <div className="h-[600px] w-full relative">
        {isLoading && (
          <div className="absolute top-0 right-0 m-4 z-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        <Calendar
          localizer={localizer}
          events={[...myEvents, ...holidays]}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%", width: "100%" }}
          eventPropGetter={eventStyleGetter}
          messages={messages}
          culture="ko"
          defaultView="month"
          views={["month"]}
          tooltipAccessor={(event) => event.title}
          date={currentDate}
          onNavigate={handleNavigate}
        />
      </div>
    </Card>
  );
};

export default CustomCalendar;
