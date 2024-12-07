"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { createScheduleType } from "../model/service";
import { LeaveType, ScheduleType, WorkType } from "../model/types";

interface ScheduleTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduleCreate?: () => void;
  currentMonth: Date;
}

export const ScheduleTypeModal = ({
  isOpen,
  onClose,
  onScheduleCreate,
  currentMonth
}: ScheduleTypeModalProps) => {
  const [scheduleType, setScheduleType] = useState<ScheduleType>(null);
  const [inputs, setInputs] = useState<{[key: string]: string}>({
    day: '',
    evening: '',
    night: '',
    remote: '',
    'half-day': '',
    'full-day': ''
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleInputChange = (id: string, value: string) => {
    setInputs(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const resetForm = () => {
    setScheduleType(null);
    setInputs({
      day: '',
      evening: '',
      night: '',
      remote: '',
      'half-day': '',
      'full-day': ''
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const promises = Object.entries(inputs).map(async ([type, datesString]) => {
        if (!datesString.trim()) return;
        
        const dates = datesString
          .split(" ")
          .map(d => parseInt(d.trim()))
          .filter(d => !isNaN(d));

        if (dates.length > 0) {
          await createScheduleType(
            type as WorkType | LeaveType,
            dates,
            scheduleType as "work" | "leave",
            currentMonth  // 현재 선택된 월 전달
          );
        }
      });

      await Promise.all(promises);
      onScheduleCreate?.();
      handleClose();
    } catch (error) {
      console.error("Failed to create schedules:", error);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-start py-12 justify-center">
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />
      <div 
        className="relative z-50 w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        
        <h2 className="text-lg font-semibold mb-4">스케줄 등록</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  className="w-4 h-4 text-[#2f2f31]"
                  checked={scheduleType === 'work'}
                  onChange={() => setScheduleType('work')}
                />
                <span className="ml-2">근무 스케줄</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  className="w-4 h-4 text-[#2f2f31]"
                  checked={scheduleType === 'leave'}
                  onChange={() => setScheduleType('leave')}
                />
                <span className="ml-2">연차 스케줄</span>
              </label>
            </div>
          </div>

          {scheduleType === 'work' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#e8abaa] mb-1">DAY</label>
                <input
                  className="w-full px-3 py-2 border focus-visible:ring-2 focus-visible:ring-blue-300 outline-none rounded-md"
                  value={inputs.day}
                  onChange={(e) => handleInputChange('day', e.target.value)}
                  placeholder="DAY 근무 날짜를 입력하세요 (예: 1 2 3 4)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#b1c77e] mb-1">EVENING</label>
                <input
                  className="w-full px-3 py-2 border focus-visible:ring-2 focus-visible:ring-blue-300 outline-none rounded-md"
                  value={inputs.evening}
                  onChange={(e) => handleInputChange('evening', e.target.value)}
                  placeholder="EVENING 근무 날짜를 입력하세요 (예: 1 2 3 4)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5d78a5] mb-1">NIGHT</label>
                <input
                  className="w-full px-3 py-2 border focus-visible:ring-2 focus-visible:ring-blue-300 outline-none rounded-md"
                  value={inputs.night}
                  onChange={(e) => handleInputChange('night', e.target.value)}
                  placeholder="NIGHT 근무 날짜를 입력하세요 (예: 1 2 3 4)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#ffc247] mb-1">재택</label>
                <input
                  className="w-full px-3 py-2 border focus-visible:ring-2 focus-visible:ring-blue-300 outline-none rounded-md"
                  value={inputs.remote}
                  onChange={(e) => handleInputChange('remote', e.target.value)}
                  placeholder="재택 근무 날짜를 입력하세요 (예: 1 2 3 4)"
                />
              </div>
            </div>
          )}

          {scheduleType === 'leave' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#8c6d9c] mb-1">반차</label>
                <input
                  className="w-full px-3 py-2 border focus-visible:ring-2 focus-visible:ring-blue-300 outline-none rounded-md"
                  value={inputs['half-day']}
                  onChange={(e) => handleInputChange('half-day', e.target.value)}
                  placeholder="반차 날짜를 입력하세요 (예: 1 2 3 4)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8c6d9c] mb-1">연차</label>
                <input
                  className="w-full px-3 py-2 border focus-visible:ring-2 focus-visible:ring-blue-300 outline-none rounded-md"
                  value={inputs['full-day']}
                  onChange={(e) => handleInputChange('full-day', e.target.value)}
                  placeholder="연차 날짜를 입력하세요 (예: 1 2 3 4)"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
              onClick={handleClose}
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-[#2f2f31] rounded-md hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!scheduleType || Object.values(inputs).every(value => !value.trim())}
            >
              등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};