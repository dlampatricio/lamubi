"use client"

import { useRouter } from "next/navigation";
import { useGameStore } from "../../hooks/useGameStore";
import HandleTeamsCard from "../../components/HandleTeamsCard";

export default function LobbyPage() {
  const router = useRouter();
  const { startGame, teams, initial_timer, setInitialTimer, game_state } = useGameStore();

  const handleStart = () => {
    startGame();
    router.push('/handoff');
  };

  console.log(game_state)

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center">Lobby</h1>
      
      {/* Marcadores */}
      <div className="my-4 border p-2">
        {teams.map((team, idx) => (
          <p key={idx}>Score {team.name}: {team.score}</p>
        ))}
      </div>

      <button 
        className="bg-green-600 text-white p-2 w-full mb-4" 
        onClick={handleStart}
      >
        Empezar Partida (Handoff)
      </button>

      <HandleTeamsCard />

      {/* Ajustes de tiempo */}
      <div className="mt-4 border-t pt-4">
        <p>Duración de la ronda: {initial_timer}s</p>
        <div className="flex gap-2">
          {[30, 60, 90].map((s) => (
            <button 
              key={s} 
              className={`p-2 border ${initial_timer === s ? 'bg-gray-300' : ''}`}
              onClick={() => setInitialTimer(s)}
            >
              {s}s
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}