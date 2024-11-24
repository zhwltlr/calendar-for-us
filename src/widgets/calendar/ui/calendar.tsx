"use client";

import { fetchHolidayData } from "@/features/holiday-display/model/service";
import { Card } from "@/shared/ui/card";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Calendar } from "react-big-calendar";
import {
  calendarLocalizer,
  calendarMessages,
  eventStyleGetter,
} from "../model/config";
import { HolidayCache, HolidayEvent } from "../model/types";

const CALENDAR_HEIGHT = "calc(100vh - 200px)";
interface Schedule {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
}

const MainCalendar: React.FC = () => {
  const [myEvents, setMyEvents] = useState<HolidayEvent[]>([]);
  const [holidays, setHolidays] = useState<HolidayEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const holidayCache = useRef<HolidayCache>({});
  const fetchingMonths = useRef<Set<string>>(new Set());

  const getCacheKey = useCallback((date: Date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const fetchHolidays = useCallback(
    async (date: Date) => {
      const cacheKey = getCacheKey(date);

      if (holidayCache.current[cacheKey]) {
        setHolidays(holidayCache.current[cacheKey]);
        return;
      }

      if (fetchingMonths.current.has(cacheKey)) return;

      try {
        setIsLoading(true);
        fetchingMonths.current.add(cacheKey);

        const holidayEvents = await fetchHolidayData(
          date.getFullYear(),
          date.getMonth() + 1
        );

        holidayCache.current[cacheKey] = holidayEvents;
        setHolidays(holidayEvents);
      } finally {
        setIsLoading(false);
        fetchingMonths.current.delete(cacheKey);
      }
    },
    [getCacheKey]
  );

  useEffect(() => {
    fetchHolidays(currentDate);
  }, [currentDate, fetchHolidays]);

  return (
    <Card className="p-4 w-full min-h-[600px]">
      <div className="relative" style={{ height: CALENDAR_HEIGHT }}>
        {isLoading && (
          <div className="absolute top-0 right-0 m-4 z-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        <Calendar
          localizer={calendarLocalizer}
          events={[...myEvents, ...holidays]}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          eventPropGetter={eventStyleGetter}
          messages={calendarMessages}
          culture="ko"
          defaultView="month"
          views={["month"]}
          tooltipAccessor={(event) => event.title}
          date={currentDate}
          onNavigate={setCurrentDate}
        />
      </div>
    </Card>
  );
};

export default MainCalendar;
