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

  const buttonText = isLoading 
    ? "Loading movies..." 
    : canStart 
      ? "START GAME!" 
      : "Missing players";

  const buttonClass = canStart && !isLoading
    ? "bg-green-600" 
    : "bg-gray-400";

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
      <h1 className="text-xl font-bold text-center mb-6">Lobby</h1>
      
      <HandleTeamsCard />

      <button 
        disabled={!canStart || isLoading}
        className={`p-4 w-full mt-8 mb-2 text-white font-bold rounded ${buttonClass}`} 
        onClick={handleStart}
      >
        {buttonText}
      </button>

      {!canStart && (
        <p className="text-red-500 text-sm text-center mb-4">
          * Each team needs at least 1 player to play.
        </p>
      )}

      <div className="mt-8 pt-4">
        <p className="text-sm font-medium mb-2">Round duration:</p>
        <div className="flex gap-2">
          {[30, 60, 90].map((s) => (
            <button 
              key={s} 
              className={`flex-1 py-2 border rounded ${
                initial_timer === s 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white'
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