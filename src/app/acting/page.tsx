"use client"

import { useRouter } from "next/navigation";
import { useGameStore } from "../../hooks/useGameStore";
import Timer from "../../components/Timer";
import MovieCard from "../../components/MovieCard";

export default function ActingPage() {
    const router = useRouter();
    const { game_state, teams, current_team_index, current_movie, correctGuess, endRound } = useGameStore();
    
    const current_team = teams[current_team_index];

    const handleCorrect = () => {
        correctGuess();
        endRound();
        router.replace('/result'); 
    };

    const handleSurrender = () => {
        endRound();
        router.replace('/result');
    };

    if (game_state !== 'acting') return null;

    return (
        <div className="flex flex-col items-center justify-center h-screen p-4">
            <h1 className="text-2xl font-bold mb-6">Acting</h1>
            
            <div className="text-center mb-8 w-full max-w-xs">
                <p className="text-lg text-gray-600 mb-2">Current Player:</p>
                <p className="text-xl font-bold">
                    {current_team?.players[current_team.current_player_index]?.name}
                </p>
            </div>

            <div className="mb-8 w-full max-w-xs text-center">
                <Timer />
            </div>

            <div className="flex flex-col gap-3 w-full max-w-xs">
                <button 
                    className="bg-green-500 text-white font-bold py-3 px-4 rounded text-lg"
                    onClick={handleCorrect}
                >
                    Guessed!
                </button>
                
                <button 
                    className="bg-red-500 text-white font-bold py-3 px-4 rounded"
                    onClick={handleSurrender}
                >
                    Skip / Surrender
                </button>
            </div>
        </div>
    );
}