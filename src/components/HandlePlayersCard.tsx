'use client';
import { useGameStore } from '@/hooks/useGameStore';
import { useTranslation } from '@/hooks/useTranslation';

const HandlePlayersCard = () => {
  const { t } = useTranslation();
  const { players, addIndividualPlayer, removeIndividualPlayer, updateIndividualPlayerName } =
    useGameStore();

  return (
    <div className="w-full max-w-lg mx-auto">
      <p className="border-b-2 border-border text-lg md:text-3xl font-black uppercase tracking-tighter pb-2 mb-4 md:mb-6 text-text-primary">
        {t('playersLabel')}
      </p>
      <div className="space-y-2">
        {players.map((p, idx) => (
          <div key={idx} className="relative group/item">
            <input
              className="w-full min-w-0 pr-10 bg-surface-secondary hover:bg-surface-tertiary focus:bg-surface-secondary border border-border focus:border-border-strong rounded-xl text-sm font-semibold uppercase tracking-wider text-text-primary outline-none transition-all px-4 py-3"
              value={p.name}
              onChange={(e) => updateIndividualPlayerName(idx, e.target.value)}
              placeholder={t('playerNamePlaceholder')}
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-red-500 transition-all text-xs p-1 md:opacity-0 md:group-hover/item:opacity-100"
              onClick={() => removeIndividualPlayer(idx)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        className="mt-3 text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors flex items-center gap-2"
        onClick={() => addIndividualPlayer('')}
      >
        <span className="text-lg leading-none">+</span>
        {t('addPlayer')}
      </button>
    </div>
  );
};

export default HandlePlayersCard;
