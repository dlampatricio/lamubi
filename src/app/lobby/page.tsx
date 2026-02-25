"use client"

import { useGameStore } from "@/hooks/useGameStore";
import HandleTimeCard from "@/components/HandleTimeCard";
import HandleTeamsCard from "@/components/HandleTeamsCard";
import NavButton from "@/components/NavButton";

export default function LobbyPage() {
  // Extraemos 'category' del store
  const { startGame, resetScores, teams, category } = useGameStore();
  
  const canStart = teams.length > 0 && teams.every(team => 
    team.players.length > 0 && 
    team.players.every(player => player.name.trim().length > 0)
  );

  const handleStartLogic = async () => {
    try {
      // 1. Construimos los parámetros de búsqueda basados en la categoría seleccionada
      const params = new URLSearchParams();
      if (category.id) params.append('id', category.id);
      if (category.type) params.append('type', category.type);

      // 2. Llamamos a la API con los parámetros
      const res = await fetch(`/api/movies?${params.toString()}`);
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
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-1 md:mt-5">Setup</p>
        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Lobby</h1>
        <div className="mt-2 inline-block bg-gray-100 px-3 py-1 rounded-full">
          <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
            {category.name}
          </p>
        </div>
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
        
        {!canStart && (
          <p className="text-[9px] text-red-400 font-bold uppercase mt-4 text-center tracking-widest px-4">
            All players must have a valid name to start
          </p>
        )}
      </div>
    </div>
  );
}