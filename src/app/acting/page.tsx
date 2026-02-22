"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "../../hooks/useGameStore";
import Timer from "../../components/Timer";

export default function ActingPage() {
    const router = useRouter();
    const { teams, current_team_index, correctGuess, game_state, endRound } = useGameStore();
    
    const current_team = teams[current_team_index];

    // useEffect(() => {
    //     if (game_state !== 'acting') {
    //         router.replace('/lobby');
    //     }
    // }, [game_state, router]);

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

    console.log(game_state)

    return (
        <div className="flex flex-col items-center justify-center h-screen p-4">
            <h1 className="text-2xl font-bold uppercase text-gray-500">Actuando</h1>
            <p className="text-3xl font-black mb-4">{current_team?.name}</p>
            
            <Timer />

            <div className="flex flex-col gap-4 mt-8 w-full max-w-xs">
                <button 
                    className="bg-green-500 text-white font-bold py-6 rounded-2xl text-xl" 
                    onClick={handleCorrect}
                >
                    ¡Guessed!
                </button>
                
                <button 
                    className="bg-red-500 text-white font-bold py-3 rounded-xl" 
                    onClick={handleSurrender}
                >
                    Skip / Surrender
                </button>
            </div>
        </div>
    );
}