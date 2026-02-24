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
      interval = setInterval(() => decrementTimer(), 1000);
    } else if (timer === 0 && game_state === 'acting') {
      endRound(); 
      router.replace('/result');
    }
    return () => clearInterval(interval);
  }, [game_state, timer, decrementTimer, endRound, router]);

  return (
    <div className="relative flex flex-col items-center">
      <h2 className={`text-[10rem] md:text-[12rem] font-black tabular-nums leading-none tracking-tighter transition-colors duration-300 ${
        timer < 10 ? 'text-red-600' : 'text-black'
      }`}>
        {timer}
      </h2>
      <div className="absolute -bottom-4 bg-white px-4">
         <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em]">Seconds</p>
      </div>
    </div>
  );
};

export default Timer;