"use client";

import { fetchHolidayData } from "@/features/holiday-display/model/service";
import { ScheduleModal } from "@/features/schedule-form/ui/schedule-modal";
import { Card } from "@/shared/ui/card";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Calendar } from "react-big-calendar";
import {
  calendarLocalizer,
  calendarMessages,
  eventStyleGetter,
} from "../model/config";
import { CalendarEvent, HolidayCache, Schedule } from "../model/types";
import '../styles/calendar.css';

const CALENDAR_HEIGHT = "calc(100vh - 200px)";

const MainCalendar: React.FC = () => {
  const [myEvents, setMyEvents] = useState<CalendarEvent[]>([]);
  const [holidays, setHolidays] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const holidayCache = useRef<HolidayCache>({});
  const fetchingMonths = useRef<Set<string>>(new Set());

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getCacheKey = useCallback((date: Date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get("/api/schedules");
      const fetchedSchedules = response.data.map((schedule: Schedule) => ({
        ...schedule,
        startDate: new Date(schedule.startDate),
        endDate: new Date(schedule.endDate),
      }));
      setSchedules(fetchedSchedules);
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleSelectSlot = useCallback(({ start }: { start: Date }) => {
    setSelectedDate(start);
    setIsModalOpen(true);
  }, []);

  const handleScheduleSubmit = async (
    data: Omit<CalendarEvent, "id" | "isHoliday">
  ) => {
    try {
      await axios.post("/api/schedules", {
        title: data.title,
        description: data.description,
        startDate: data.start, // start를 startDate로 변환
        endDate: data.end, // end를 endDate로 변환
      });
      fetchSchedules();
    } catch (error) {
      console.error("Failed to create schedule:", error);
    }
  };

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

  const allEvents: CalendarEvent[] = [
    ...myEvents,
    ...holidays,
    ...schedules.map((schedule) => ({
      id: schedule.id,
      title: schedule.title,
      start: schedule.startDate,
      end: schedule.endDate,
      isHoliday: false,
      description: schedule.description,
    })),
  ];

  return (
    <Card className="p-4 w-full">
      <div 
        style={{ height: isMobile ? 'calc(100vh - 250px)' : CALENDAR_HEIGHT }} 
        className="w-full relative"
      >
        {isLoading && (
          <div className="absolute top-0 right-0 m-4 z-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        <Calendar
          localizer={calendarLocalizer}
          events={allEvents}
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
          onSelectSlot={handleSelectSlot}
          selectable
        />
      </div>
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        onSubmit={handleScheduleSubmit}
      />
    </Card>
  );
};

export default MainCalendar;
