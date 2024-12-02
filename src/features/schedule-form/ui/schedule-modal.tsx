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
import { useEffect, useState } from "react";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  selectedEvent?: CalendarEvent;
  onSubmit: (data: Omit<CalendarEvent, "id" | "isHoliday">) => void;
  onUpdate?: (id: string, data: Omit<CalendarEvent, "id" | "isHoliday">) => void;
  onDelete?: (id: string) => void;
}

export const ScheduleModal = ({
  isOpen,
  onClose,
  selectedDate,
  selectedEvent,
  onSubmit,
  onUpdate,
  onDelete,
}: ScheduleModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [initialTitle, setInitialTitle] = useState("");
  const [initialDescription, setInitialDescription] = useState("");

  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title);
      setDescription(selectedEvent.description || "");
      setInitialTitle(selectedEvent.title);
      setInitialDescription(selectedEvent.description || "");
    } else {
      setTitle("");
      setDescription("");
      setInitialTitle("");
      setInitialDescription("");
    }
  }, [selectedEvent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title,
      description,
      start: selectedDate,
      end: selectedDate,
    };

    if (!selectedEvent) {
      onSubmit(data);
    }

    onClose();
  };

  const handleUpdate = () => {
    if (!selectedEvent?.id || !onUpdate) return;
    
    // 변경사항이 있는 경우에만 update 호출
    if (title !== initialTitle || description !== initialDescription) {
      onUpdate(selectedEvent.id, {
        title,
        description,
        start: selectedDate,
        end: selectedDate,
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (selectedEvent?.id && onDelete) {
      onDelete(selectedEvent.id);
      onClose();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const isEditMode = !!selectedEvent;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "일정 상세" : "일정 등록"}
          </DialogTitle>
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
            {isEditMode ? (
              <>
                <Button variant="outline" type="button" onClick={onClose}>
                  취소
                </Button>
                <Button 
                  type="button" 
                  onClick={handleUpdate}
                  disabled={title === initialTitle && description === initialDescription}
                >
                  수정
                </Button>
                <Button 
                  variant="destructive" 
                  type="button" 
                  onClick={handleDelete}
                >
                  삭제
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" type="button" onClick={onClose}>
                  취소
                </Button>
                <Button type="submit">등록</Button>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};