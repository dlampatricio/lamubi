"use client"

import { useRouter } from "next/navigation";
import { useGameStore } from "../../hooks/useGameStore";
import Timer from "../../components/Timer";

export default function ActingPage() {
    const router = useRouter();
    const { game_state, teams, current_team_index, correctGuess, endRound } = useGameStore();
    
    const current_team = teams[current_team_index];
    const current_player = current_team?.players[current_team.current_player_index];

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
        <div className="h-screen bg-white flex flex-col items-center p-8 overflow-hidden">
            
            {/* Header: Player & Team */}
            <div className="w-full max-w-sm mt-4 text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-2">
                    Acting Now
                </p>
                <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-2">
                    {current_player?.name}
                </h1>
                <div className="inline-block px-3 py-1 bg-gray-100 rounded-full">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        {current_team?.name}
                    </p>
                </div>
            </div>

            {/* Timer*/}
            <div className="flex-1 flex items-center justify-center w-full">
                <Timer />
            </div>

            {/* Footer: Botones */}
            <div className="w-full max-w-xs mb-6 space-y-6">
                <button 
                    className="w-full bg-black text-white font-black py-6 rounded-3xl text-2xl uppercase tracking-tight active:scale-95 transition-all"
                    onClick={handleCorrect}
                >
                    Guessed!
                </button>
                
                <button 
                    className="w-full text-gray-300 font-bold text-[11px] uppercase tracking-[0.3em] hover:text-black transition-colors"
                    onClick={handleSurrender}
                >
                    Surrender
                </button>
            </div>

        </div>
    );
}