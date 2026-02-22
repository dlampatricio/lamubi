"use client"

import { useRouter } from "next/navigation";
import { useGameStore } from "../../hooks/useGameStore";
import { useEffect } from "react";

export default function ResultPage() {
    const router = useRouter();
    const { teams, resetScores, nextTeam, game_state } = useGameStore();

    // useEffect(() => {
    //     if (game_state !== 'finished') {
    //         router.replace('/lobby');
    //     }
    // }, [game_state, router]);

    const handleExit = () => {
        resetScores();
        router.replace('/lobby');
    };

    const handleNextTurn = () => {
        nextTeam();
        router.replace('/handoff');
    };

    console.log(game_state)

    return (
        <div className="flex flex-col items-center justify-center h-screen p-4">
            <h1 className="text-4xl font-bold mb-6">Results</h1>
            
            <div className="space-y-2 mb-8 border-b pb-4 w-full max-w-xs text-center">
                {teams.map((team, idx) => (
                    <p key={idx} className="text-2xl">
                        {team.name}: <span className="font-bold">{team.score}</span>
                    </p>
                ))}
            </div>

            <div className="flex flex-col gap-3 w-full max-w-xs">
                <button 
                    className="bg-blue-600 text-white font-bold py-4 px-4 rounded-xl text-lg shadow-md"
                    onClick={handleNextTurn}
                >
                    Next Turn
                </button>

                <button 
                    className="bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl"
                    onClick={handleExit}
                >
                    Finish Game / Lobby
                </button>
            </div>
        </div>
    );
}