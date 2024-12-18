export type ScheduleType = "work" | "leave" | null;

export type WorkType = "day" | "evening" | "night" | "remote";
export type LeaveType = "half-day" | "full-day";

export interface WorkSchedule {
  type: WorkType;
  dates: number[];
  color: string;
}

export interface LeaveSchedule {
  type: LeaveType;
  dates: number[];
  color: string;
}

export interface ScheduleTypeEvent {
  id: string;
  type: WorkType | LeaveType;
  date: Date;
  color: string;
}