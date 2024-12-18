import axios from "axios";
import { LeaveType, WorkType } from "../../types/scheduleTypes";

export const createScheduleType = async (
    type: WorkType | LeaveType,
    dates: number[],
    scheduleType: "work" | "leave",
    currentMonth: Date
  ) => {
    try {
      const response = await axios.post("/api/schedule-types", {
        type,
        dates,
        scheduleType,
        currentMonth: currentMonth.toISOString()  // 현재 선택된 월 정보 전달
      });
      return response.data;
    } catch (error) {
      console.error("Failed to create schedule type:", error);
      throw error;
    }
  };