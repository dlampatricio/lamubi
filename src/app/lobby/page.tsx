"use client"

import { useGameStore } from "@/hooks/useGameStore";
import HandleTimeCard from "@/components/HandleTimeCard";
import HandleTeamsCard from "@/components/HandleTeamsCard";
import NavButton from "@/components/NavButton";

export default function LobbyPage() {
  const { startGame, resetScores, teams } = useGameStore();
  const canStart = teams.length > 0 && teams.every(team => 
    team.players.length > 0 && 
    team.players.every(player => player.name.trim().length > 0)
  );

  const handleStartLogic = async () => {
    try {
      const res = await fetch("/api/movies");
      if (!res.ok) throw new Error("Network response was not ok");
      
      const movies = await res.json();
      
      resetScores();
      startGame(movies);
    } catch (error) {
      console.error("Error starting game:", error);
      throw error; 
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-8 md:p-12 overflow-y-auto">
      
      {/* Header */}
      <div className="w-full max-w-4xl border-b border-gray-100 pb-8 mb-12 text-center md:text-left md:border-l-4 md:border-b-0 md:pl-8 md:border-black">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-1">Setup</p>
        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Lobby</h1>
      </div>

      {/* Grid de Configuración */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
        <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-12">
          <HandleTeamsCard />
        </div>
        
        <div className="md:col-span-3 border-t md:border-t-0 md:border-l border-gray-100 pt-8 md:pt-0 md:pl-8">
          <HandleTimeCard />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="w-full max-w-xs mt-auto flex flex-col items-center">
        <NavButton
          href="/handoff"
          label="Start Game"
          action={handleStartLogic}
          disabled={!canStart}
        />
        
        {/* Mensaje de feedback dinámico */}
        {!canStart && (
          <p className="text-[9px] text-red-400 font-bold uppercase mt-4 text-center tracking-widest px-4">
            All players must have a valid name to start
          </p>
        )}
      </div>
    </div>
  );
}