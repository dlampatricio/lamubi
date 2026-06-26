"use client"

import { useGameStore } from "@/hooks/useGameStore";
import { useTranslation } from "@/hooks/useTranslation";

export default function ScoreList() {
  const { t } = useTranslation();
  const { teams } = useGameStore();

  return (
    <div className="space-y-8">
      <p className="pl-2 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-6 md:border-l-2 border-text-primary">
        {t('currentStandings')}
      </p>

      <div className="space-y-6">
        {teams.map((team, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center group bg-surface-secondary md:bg-transparent p-4 md:p-0 rounded-2xl transition-colors hover:bg-surface-tertiary md:hover:bg-transparent"
          >
            <div className="flex flex-col items-start text-left">
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest leading-none mb-1">
                {t('team')} {idx + 1}
              </span>
              <span className="text-lg font-black uppercase text-text-primary">
                {team.name}
              </span>
            </div>
            <span className="text-4xl font-black tabular-nums text-text-primary animate-score-pop" key={team.score}>
              {team.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}