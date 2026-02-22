"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '../hooks/useGameStore';

const Timer = () => {
  const router = useRouter();
  const { timer, decrementTimer, game_state, endRound } = useGameStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (game_state === 'acting' && timer > 0) {
      interval = setInterval(() => {
        decrementTimer();
      }, 1000);
    } else if (timer === 0 && game_state === 'acting') {
      endRound(); 
      router.replace('/result');
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [game_state, timer, decrementTimer, endRound, router]);

  return (
    <div className="text-6xl font-black my-4">
      <h2 className={timer < 10 ? 'text-red-600' : 'text-gray-800'}>
        {timer}s
      </h2>
    </div>
  );
};

export default Timer;