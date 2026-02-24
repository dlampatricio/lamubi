"use client"
import { useGameStore } from "@/hooks/useGameStore";

const HandleTimeCard = () => {
  const { initial_timer, setInitialTimer } = useGameStore();
  const options = [30, 60, 90];

  return (
    <div className="flex flex-col">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 text-center md:text-left">
        Timer
      </p>
      <div className="flex md:flex-col gap-2 justify-center">
        {options.map((time) => (
          <button
            key={time}
            onClick={() => setInitialTimer(time)}
            className={`flex-1 md:w-full py-2 px-4 rounded-lg font-black text-xs transition-all ${
              initial_timer === time
                ? "bg-black text-white scale-105"
                : "bg-gray-50 text-gray-400 hover:bg-gray-100"
            }`}
          >
            {time}S
          </button>
        ))}
      </div>
    </div>
  );
};

export default HandleTimeCard;