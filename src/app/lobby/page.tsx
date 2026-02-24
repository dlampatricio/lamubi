"use client"

import { useRouter } from "next/navigation";
import { useGameStore } from "../../hooks/useGameStore";
import { useMovies } from "../../hooks/useMovies"; // Importamos el hook
import HandleTeamsCard from "../../components/HandleTeamsCard";

export default function LobbyPage() {
  const router = useRouter();
  const { startGame, teams, initial_timer, setInitialTimer } = useGameStore();
  const { fetchMovieBatch, isLoading } = useMovies();

  // Validación: ambos equipos deben tener jugadores
  const canStart = teams.every(team => team.players && team.players.length > 0);

  const handleStart = async () => {
    if (!canStart) return;

    // 1. Llamamos a nuestra API Route para obtener las pelis
    const moviePool = await fetchMovieBatch();

    if (moviePool.length > 0) {
      // 2. Pasamos las pelis al store y arrancamos:
      startGame(moviePool);
      router.push('/handoff');
    } else {
      alert("Error loading movies. Try again.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Lobby</h1>
      
      {/* Marcadores */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        {teams.map((team, idx) => (
          <div key={idx} className="border p-2 text-center rounded">
            <p className="text-xs uppercase text-gray-500">{team.name}</p>
            <p className="text-xl font-bold">{team.score} pts</p>
          </div>
        ))}
      </div>

      {/* Botón Principal con estado de carga */}
      <button 
        disabled={!canStart || isLoading}
        className={`p-4 w-full mb-2 text-white font-bold rounded-xl transition-all ${
          canStart && !isLoading
            ? "bg-green-600 hover:bg-green-700 shadow-lg" 
            : "bg-gray-400 cursor-not-allowed"
        }`} 
        onClick={handleStart}
      >
        {isLoading 
          ? "Loading movies..." 
          : canStart 
            ? "START GAME!" 
            : "Missing players"}
      </button>

      {!canStart && (
        <p className="text-red-500 text-[10px] text-center mb-4 italic">
          * Each team needs at least 1 player to play.
        </p>
      )}

      <HandleTeamsCard />

      {/* Ajustes de tiempo */}
      <div className="mt-8 border-t pt-4">
        <p className="text-sm font-medium mb-2">Round duration:</p>
        <div className="flex gap-2">
          {[30, 60, 90].map((s) => (
            <button 
              key={s} 
              className={`flex-1 py-2 border rounded-lg transition-colors ${
                initial_timer === s 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white text-gray-700'
              }`}
              onClick={() => setInitialTimer(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}