"use client"

import MovieCard from "@/components/MovieCard";
import ScoreList from "@/components/ScoreList";
import NavButton from "@/components/NavButton";
import { useGameStore } from "@/hooks/useGameStore";

export default function ResultPage() {
  const { nextTeam, teams, current_team_index } = useGameStore();

  const nextIndex = (current_team_index + 1) % teams.length;
  const nextTeamData = teams[nextIndex];
  const nextPlayerIndex = nextTeamData?.players.length > 0
    ? (nextTeamData.current_player_index + 1) % nextTeamData.players.length
    : 0;
  const nextPlayer = nextTeamData?.players[nextPlayerIndex];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 md:p-12 animate-fade-in">
      
      <div className="w-full max-w-4xl border-b border-gray-100 pb-6 mb-12 text-center">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Round Summary</p>
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Results</h1>
      </div>

      <div className="w-full max-w-4xl flex flex-col md:flex-row items-stretch justify-center gap-12 md:gap-24">
        
        <div className="w-full md:max-w-75 mx-auto md:mx-0">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 text-center">The Movie Was</p>
          <MovieCard /> 
        </div>

        <div className="flex-1 w-full max-w-xs mx-auto md:mx-0 flex flex-col pt-0 md:pt-8">
            
            <div className="flex-1">
                <ScoreList />
            </div>

            {nextPlayer && (
              <div className="mt-6 p-4 bg-gray-50 rounded-2xl text-center">
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Next Up</p>
                <p className="text-base font-black text-gray-900 uppercase">{nextPlayer.name}</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{nextTeamData?.name}</p>
              </div>
            )}

            <div className="mt-6 md:mt-auto space-y-4 w-full">
                <NavButton 
                    href="/handoff" 
                    label="Next Turn" 
                    action={nextTeam} 
                />
                
                <div className="flex justify-center w-full">
                    <NavButton 
                        href="/lobby" 
                        label="Finish Game / Lobby" 
                        variant="secondary" 
                    />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
