"use client";

import { Button } from "@/shared/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { useState } from "react";

interface ScheduleTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ScheduleType = "work" | "leave" | null;

export const ScheduleTypeModal = ({ isOpen, onClose }: ScheduleTypeModalProps) => {
  const [scheduleType, setScheduleType] = useState<ScheduleType>(null);

  const WorkScheduleInputs = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="day">DAY</Label>
        <Input id="day" placeholder="DAY 근무 시간을 입력하세요" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="evening">EVENING</Label>
        <Input id="evening" placeholder="EVENING 근무 시간을 입력하세요" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="night">NIGHT</Label>
        <Input id="night" placeholder="NIGHT 근무 시간을 입력하세요" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="remote">재택</Label>
        <Input id="remote" placeholder="재택 근무 시간을 입력하세요" />
      </div>
    </div>
  );

  const LeaveScheduleInputs = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="half-day">반차</Label>
        <Input id="half-day" placeholder="반차 시간을 입력하세요" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="full-day">연차</Label>
        <Input id="full-day" placeholder="연차 일수를 입력하세요" />
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>스케줄 등록</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <RadioGroup
            value={scheduleType || ""}
            onValueChange={(value) => setScheduleType(value as ScheduleType)}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="work" id="work" />
              <Label htmlFor="work">근무 스케줄</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="leave" id="leave" />
              <Label htmlFor="leave">연차 스케줄</Label>
            </div>
          </RadioGroup>

          {scheduleType === "work" && <WorkScheduleInputs />}
          {scheduleType === "leave" && <LeaveScheduleInputs />}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit">등록</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};