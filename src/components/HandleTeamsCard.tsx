'use client';
import { useGameStore } from '../hooks/useGameStore';
import { useTranslation } from '@/hooks/useTranslation';

const HandleTeamsCard = () => {
  const { t } = useTranslation();
  const { teams, updateTeamName, addPlayer, removePlayer, updatePlayerName } = useGameStore();

  return (
    <div className="flex flex-col gap-12 w-full max-w-lg mx-auto md:mx-0">
      {teams.map((team, teamIdx) => (
        <div key={teamIdx} className="group relative">
          <div className="flex items-center gap-3 mb-6">
            <input
              className="bg-transparent border-b-2 border-border focus:border-text-primary text-3xl font-black uppercase tracking-tighter focus:outline-none w-full pb-2 transition-all placeholder:text-text-muted text-text-primary"
              value={team.name}
              onChange={(e) => updateTeamName(teamIdx, e.target.value)}
              placeholder={t('teamNamePlaceholder')}
            />
          </div>

          <div className="space-y-2">
            {team.players.map((p, pIdx) => (
              <div key={pIdx} className="flex items-center gap-2 group/item">
                <input
                  className="flex-1 bg-surface-secondary hover:bg-surface-tertiary focus:bg-surface-secondary border border-border focus:border-border-strong rounded-xl text-sm font-semibold uppercase tracking-wider text-text-primary outline-none transition-all px-4 py-3"
                  value={p.name}
                  onChange={(e) => updatePlayerName(teamIdx, pIdx, e.target.value)}
                  placeholder={t('playerNamePlaceholder')}
                />
                <button
                  className="opacity-0 group-hover/item:opacity-100 text-text-muted hover:text-red-500 transition-all px-2 text-xs"
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

          {teamIdx < teams.length - 1 && <div className="mt-12 border-b border-border w-full" />}
        </div>
      ))}
    </div>
  );
};

export default HandleTeamsCard;