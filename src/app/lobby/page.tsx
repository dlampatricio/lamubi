"use client";
import { useGameStore } from "@/hooks/useGameStore";
import HandleTimeCard from "@/components/HandleTimeCard";
import HandleTeamsCard from "@/components/HandleTeamsCard";
import NavButton from "@/components/NavButton";
import { useRouter } from "next/navigation";

export default function LobbyPage() {
  const { startGame, resetScores, teams, category, movies } = useGameStore();
  const router = useRouter();
  
  const canStart = teams.length > 0 && teams.every(team => 
    team.players.length > 0 && 
    team.players.every(player => player.name.trim().length > 0)
  );

  const handleStartLogic = () => {
    // Ya no hacemos fetch. Usamos las movies que ya guardamos en CategoryPage
    resetScores();
    startGame(movies); // El store ya tiene las películas cargadas
    router.push("/handoff");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6 md:p-12">
      
      {/* Header Estilo Editorial */}
      <div className="w-full max-w-4xl pt-12 pb-12 border-b border-gray-100 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-6xl font-black text-black uppercase tracking-tighter leading-none">
            Game Setup.
          </h1>
        </div>
        <div className="bg-black text-white px-4 py-2 rounded-full inline-flex items-center gap-2">
          <span className="text-[9px] font-black uppercase tracking-widest">{category.name}</span>
        </div>
      </div>

      {/* Grid de Configuración */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
        <div className="md:col-span-8">
           <HandleTeamsCard />
        </div>
        
        <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-gray-100 pt-12 md:pt-0 md:pl-12">
          <HandleTimeCard />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-auto w-full max-w-4xl flex flex-col items-center border-t border-gray-100 pt-12">
        <button
          onClick={handleStartLogic}
          disabled={!canStart}
          className={`w-full max-w-xs py-6 rounded-full font-black uppercase text-xs tracking-[0.3em] transition-all ${
            canStart 
            ? "bg-black text-white hover:scale-105 active:scale-95 shadow-2xl shadow-gray-200" 
            : "bg-gray-100 text-gray-300 cursor-not-allowed"
          }`}
        >
          Begin Match
        </button>
        
        {!canStart && (
          <p className="text-[9px] text-gray-400 font-bold uppercase mt-6 tracking-widest animate-pulse">
            Complete all player names to unlock
          </p>
        )}
      </div>
    </div>
  );
}