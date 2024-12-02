"use client";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { CalendarEvent } from "@/widgets/calendar/model/types";
import { useState } from "react";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onSubmit: (data: Omit<CalendarEvent, "id" | "isHoliday">) => void;
}

export const ScheduleModal = ({
  isOpen,
  onClose,
  selectedDate,
  onSubmit,
}: ScheduleModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      start: selectedDate,
      end: selectedDate,
    });
    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>일정 등록</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">제목</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="일정 제목을 입력하세요"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">설명</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="일정 설명을 입력하세요"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">날짜</label>
            <Input
              type="text"
              value={selectedDate.toLocaleDateString()}
              disabled
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={onClose}>
              취소
            </Button>
            <Button type="submit">등록</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
