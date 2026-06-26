'use client';
import { useGameStore } from '@/hooks/useGameStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Timer = () => {
  const router = useRouter();
  const { timer, decrementTimer, game_state, endRound } = useGameStore();

  useEffect(() => {
    if (game_state !== 'acting') return;
    if (timer <= 0) {
      endRound();
      router.replace('/result');
      return;
    }
    const id = setTimeout(() => decrementTimer(), 1000);
    return () => clearTimeout(id);
  }, [game_state, timer, decrementTimer, endRound, router]);

  return (
    <div className="relative flex flex-col items-center">
      <h2
        className={`text-[10rem] md:text-[12rem] font-black tabular-nums leading-none tracking-tighter transition-colors duration-300 ${
          timer < 10 ? 'text-red-600' : 'text-black'
        }`}
      >
        {timer}
      </h2>
    </div>
  );
};

export default Timer;
