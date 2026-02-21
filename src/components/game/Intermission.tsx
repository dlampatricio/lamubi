'use client';

import { useGameStore, useCurrentTeam } from '@/store/gameStore';
import { ChevronRight } from 'lucide-react';

export const Intermission = ({ nextPlayer, lastPlayerScore }: { nextPlayer: any, lastPlayerScore: number }) => {
  const { startNextTurn, teams, currentTeamIndex } = useGameStore();
  const currentTeam = useCurrentTeam();
  const nextTeam = teams[(currentTeamIndex + 1) % teams.length];

  // Colores de unidad: Unit A (#94442d) / Unit B (#3d4a5c)
  const getUnitColor = (color: string) => color === 'red' ? '#94442d' : '#3d4a5c';

  return (
    <div className="min-h-screen bg-[#f2ede4] text-[#3a3a3a] flex flex-col p-8 font-sans select-none">
      
      {/* 1. SCOREBOARD: Minimalista y equilibrado */}
      <header className="flex justify-between items-start pt-8 pb-12 border-b border-[#3a3a3a]/10">
        {teams.map((team) => (
          <div key={team.id} className="flex flex-col">
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] opacity-40 mb-1">
              {team.name}
            </span>
            <span className="text-5xl font-black tracking-tighter tabular-nums leading-none">
              {team.score.toString().padStart(2, '0')}
            </span>
          </div>
        ))}
      </header>

      {/* 2. RESULTADO: Fino, sin ruido */}
      <main className="flex-1 flex flex-col justify-center py-8">
        <section className="mb-16">
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] opacity-30 block mb-3">
            Last Performance
          </span>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black uppercase tracking-tight opacity-80">
              {currentTeam?.name}
            </h2>
            <div className="h-[1px] flex-1 bg-[#3a3a3a]/5" />
            <span 
              className="text-3xl font-mono font-bold italic"
              style={{ color: getUnitColor(currentTeam?.color || 'red') }}
            >
              {lastPlayerScore > 0 ? `+${lastPlayerScore}` : '0'}
            </span>
          </div>
        </section>

        {/* 3. SIGUIENTE: El foco principal */}
        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] opacity-30">Up Next</span>
          </div>
          
          <div className="relative">
            <h3 className="text-7xl font-black uppercase tracking-tighter leading-[0.85] break-words">
              {nextPlayer?.name}
            </h3>
            <div className="flex items-center gap-2 mt-6">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: getUnitColor(nextTeam.color) }}
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold opacity-60">
                {nextTeam.name}
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* 4. ACCIÓN: Botón compacto pero con peso */}
      <footer className="pb-8">
        <button
          onClick={() => startNextTurn()}
          className="w-full py-6 bg-[#3a3a3a] text-[#f2ede4] flex items-center justify-between px-8 active:scale-[0.98] transition-all shadow-xl"
        >
          <span className="text-xs font-black uppercase tracking-[0.6em]">Ready to Roll</span>
          <ChevronRight size={18} />
        </button>
      </footer>

    </div>
  );
};