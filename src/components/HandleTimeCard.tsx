"use client"
import { useGameStore } from "@/hooks/useGameStore";

const HandleTimeCard = () => {
  const { initial_timer, setInitialTimer } = useGameStore();
  const options = [30, 60, 90];

  return (
    <div className="flex flex-col h-full">
      <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] mb-8">
        Round Timer
      </p>
      <div className="grid grid-cols-3 md:grid-cols-1 gap-3">
        {options.map((time) => (
          <button
            key={time}
            onClick={() => setInitialTimer(time)}
            className={`py-6 rounded-2xl font-black text-sm transition-all border ${
              initial_timer === time
                ? "bg-black border-black text-white shadow-xl shadow-gray-200 -translate-y-1"
                : "bg-white border-gray-100 text-gray-300 hover:border-gray-200"
            }`}
          >
            {time}<span className="text-[10px] ml-0.5 opacity-50">S</span>
          </button>
        ))}
      </div>
      <p className="mt-auto pt-8 text-[9px] font-medium text-gray-400 italic leading-relaxed">
        Recommended: 60s for standard play.
      </p>
    </div>
  );
};

export default HandleTimeCard;