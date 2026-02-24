"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/hooks/useGameStore";
import HandleTimeCard from "@/components/HandleTimeCard";
import HandleTeamsCard from "@/components/HandleTeamsCard";

export default function LobbyPage() {
  const router = useRouter();
  const { startGame, teams } = useGameStore();
  const [loading, setLoading] = useState(false);

  const canStart = teams.every(team => team.players.length > 0);

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/movies");
      const movies = await res.json();
      startGame(movies);
      router.push("/handoff");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-8 md:p-12 overflow-y-auto">
      
      {/* Header Centrado */}
      <div className="w-full max-w-4xl border-b border-gray-100 pb-8 mb-12 text-center md:text-left md:border-l-4 md:border-b-0 md:pl-8 md:border-black">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-1">Setup</p>
        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Lobby</h1>
      </div>

      {/* Grid de Configuración: 2 Cols Equipos + 1 Col Tiempo */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
        <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-12">
          <HandleTeamsCard />
        </div>
        
        <div className="md:col-span-3 border-t md:border-t-0 md:border-l border-gray-100 pt-8 md:pt-0 md:pl-8">
          <HandleTimeCard />
        </div>
      </div>

      {/* Botón Start debajo, centrado y prominente */}
      <div className="w-full max-w-xs mt-auto">
        <button
          onClick={handleStart}
          disabled={loading || !canStart}
          className={`w-full py-5 rounded-2xl font-black text-xl uppercase tracking-tight transition-all active:scale-95
            ${loading || !canStart 
              ? "bg-gray-100 text-gray-300 cursor-not-allowed" 
              : "bg-black text-white hover:bg-gray-900"
            }`}
        >
          {loading ? "..." : "Start Game"}
        </button>
        {!canStart && (
          <p className="text-[9px] text-gray-400 font-bold uppercase mt-4 text-center tracking-widest">
            Missing players to start
          </p>
        )}
      </div>
    </div>
  );
}