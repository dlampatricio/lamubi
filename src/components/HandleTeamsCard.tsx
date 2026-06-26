'use client';
import { useGameStore } from '../hooks/useGameStore';
import { useTranslation } from '@/hooks/useTranslation';

const HandleTeamsCard = () => {
  const { t } = useTranslation();
  const { teams, updateTeamName, addPlayer, removePlayer, updatePlayerName } = useGameStore();

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-8 w-full max-w-lg mx-auto md:mx-0">
      {teams.map((team, teamIdx) => (
        <div key={teamIdx} className="group relative">
          <div className="flex items-center gap-3 mb-3 md:mb-6">
            <input
              className="bg-transparent border-b-2 border-border focus:border-text-primary text-lg md:text-3xl font-black uppercase tracking-tighter focus:outline-none w-full min-w-0 pb-2 transition-all placeholder:text-text-muted text-text-primary"
              value={team.name}
              onChange={(e) => updateTeamName(teamIdx, e.target.value)}
              placeholder={t('teamNamePlaceholder')}
            />
          </div>

          <div className="space-y-2">
            {team.players.map((p, pIdx) => (
              <div key={pIdx} className="relative group/item">
                <input
                  className="w-full min-w-0 pr-10 bg-surface-secondary hover:bg-surface-tertiary focus:bg-surface-secondary border border-border focus:border-border-strong rounded-xl text-sm font-semibold uppercase tracking-wider text-text-primary outline-none transition-all px-4 py-3"
                  value={p.name}
                  onChange={(e) => updatePlayerName(teamIdx, pIdx, e.target.value)}
                  placeholder={t('playerNamePlaceholder')}
                />
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-red-500 transition-all text-xs p-1 md:opacity-0 md:group-hover/item:opacity-100"
                  onClick={() => removePlayer(teamIdx, pIdx)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            className="mt-3 text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors flex items-center gap-2"
            onClick={() => addPlayer(teamIdx, '')}
          >
            <span className="text-lg leading-none">+</span>
            {t('addPlayer')}
          </button>
        </div>
      ))}
    </div>
  );
};

export default HandleTeamsCard;