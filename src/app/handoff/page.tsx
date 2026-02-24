"use client"

import { useGameStore } from "@/hooks/useGameStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HandoffPage() {
    const router = useRouter();
    const { teams, current_team_index, startActing, game_state } = useGameStore();
    
    const current_team = teams[current_team_index];
    const current_player = current_team?.players[current_team.current_player_index];

    // useEffect(() => {
    //     if (game_state !== 'playing') {
    //         router.replace('/lobby');
    //     }
    // }, [game_state, router]);

    const handleStartActing = () => {
        startActing();
        router.push('/acting');
    };

    console.log(game_state)

    return (
        <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Turn Change!</h1>
            
            <div className="border p-6 rounded-lg mb-6">
                <p className="text-xl text-gray-600">Team's turn:</p>
                <p className="text-3xl font-black uppercase">
                    {current_team?.name}
                </p>
                
                <div className="mt-4 pt-4 border-t">
                    <p className="text-xl text-gray-600">It's turn:</p>
                    <p className="text-2xl font-bold italic">
                        {current_player?.name || "Unnamed Player"}
                    </p>
                </div>
            </div>

            <p className="mb-8 text-sm text-gray-500 italic">
                Pass the phone to {current_player?.name}
            </p>

            <button 
                className="bg-green-600 text-white font-bold py-4 px-8 rounded-xl text-xl w-full max-w-xs"
                onClick={handleStartActing}
            >
                I'm Ready
            </button>
        </div>
    );
}