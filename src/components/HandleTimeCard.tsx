'use client';
import { useGameStore } from '@/hooks/useGameStore';
import { useTranslation } from '@/hooks/useTranslation';

const HandleTimeCard = () => {
  const { t } = useTranslation();
  const { initial_timer, setInitialTimer } = useGameStore();
  const options = [30, 60, 90];

  return (
    <div className="flex flex-col">
      <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] mb-6">
        {t('roundTimer')}
      </p>
      <div className="grid grid-cols-3 md:grid-cols-1 gap-3">
        {options.map((time) => (
          <button
            key={time}
            onClick={() => setInitialTimer(time)}
            className={`py-5 rounded-xl font-black text-base transition-all border ${
              initial_timer === time
                ? 'bg-text-primary border-text-primary text-surface shadow-lg'
                : 'bg-surface-secondary border-border text-text-secondary hover:border-border-strong hover:text-text-primary'
            }`}
          >
            {time}
            <span className="text-[9px] ml-0.5 opacity-50">s</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HandleTimeCard;
