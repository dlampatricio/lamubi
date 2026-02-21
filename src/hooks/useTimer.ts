import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';

export const useTimer = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const {
    timeRemaining,
    isTimerRunning,
    startTimer,
    stopTimer,
    decrementTime
  } = useGameStore();

  useEffect(() => {
    if (isTimerRunning) {
      intervalRef.current = setInterval(() => {
        decrementTime();
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTimerRunning, decrementTime]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    timeRemaining,
    isTimerRunning,
    formattedTime: formatTime(timeRemaining),
    startTimer,
    stopTimer
  };
};
