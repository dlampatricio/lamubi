'use client';
import { useGameStore } from '@/hooks/useGameStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface TimerProps {
  value?: number;
  onEnd?: () => void;
  running?: boolean;
}

const Timer = ({ value, onEnd, running }: TimerProps) => {
  const router = useRouter();
  const { timer, decrementTimer, game_state, endRound } = useGameStore();

  const displayValue = value ?? timer;

  useEffect(() => {
    if (!running && game_state !== 'acting') return;
    if (displayValue <= 0) {
      onEnd?.();
      if (game_state === 'acting') {
        endRound();
        router.replace('/result');
      }
      return;
    }
    const id = setTimeout(() => decrementTimer(), 1000);
    return () => clearTimeout(id);
  }, [running, game_state, displayValue, decrementTimer, endRound, router, onEnd]);

  return (
    <div className="relative flex flex-col items-center">
      <h2
        className={`text-[10rem] md:text-[12rem] font-black tabular-nums leading-none tracking-tighter transition-colors duration-300 ${
          displayValue < 10 ? 'text-red-600' : 'text-text-primary'
        }`}
      >
        {displayValue}
      </h2>
    </div>
  );
};

export default Timer;