import React, { useEffect, useState } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

interface TaskCountdownProps {
  deadlineTimestamp: number;
  onExpire?: () => void;
  compact?: boolean;
}

export const TaskCountdown: React.FC<TaskCountdownProps> = ({
  deadlineTimestamp,
  onExpire,
  compact = false,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    totalMs: number;
    hours: number;
    minutes: number;
    seconds: number;
    isUrgent: boolean;
    isExpired: boolean;
  }>(() => calculateTime(deadlineTimestamp));

  function calculateTime(target: number) {
    const diff = target - Date.now();
    if (diff <= 0) {
      return {
        totalMs: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isUrgent: true,
        isExpired: true,
      };
    }
    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    // Dưới 6 giờ là hạn gấp
    const isUrgent = hours < 6;

    return {
      totalMs: diff,
      hours,
      minutes,
      seconds,
      isUrgent,
      isExpired: false,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const calculated = calculateTime(deadlineTimestamp);
      setTimeLeft(calculated);
      if (calculated.isExpired && onExpire) {
        onExpire();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [deadlineTimestamp, onExpire]);

  if (timeLeft.isExpired) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FFD6CC] text-[#B83214]">
        <AlertTriangle className="w-3.5 h-3.5" />
        Đã quá hạn nộp
      </span>
    );
  }

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium font-numbers ${
          timeLeft.isUrgent
            ? 'bg-[#FFD6CC] text-[#B83214]'
            : 'bg-[#F5F9FF] text-[#16243D] border border-[#DCE8F8]'
        }`}
      >
        <Clock className="w-3 h-3" />
        {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
        timeLeft.isUrgent
          ? 'bg-[#FFD6CC] text-[#B83214]'
          : 'bg-[#F5F9FF] text-[#16243D] border border-[#DCE8F8]'
      }`}
    >
      <Clock className="w-3.5 h-3.5" />
      <span>Còn lại:</span>
      <span className="font-heading font-bold tracking-tight font-numbers text-sm">
        {pad(timeLeft.hours)}h {pad(timeLeft.minutes)}m {pad(timeLeft.seconds)}s
      </span>
    </div>
  );
};
