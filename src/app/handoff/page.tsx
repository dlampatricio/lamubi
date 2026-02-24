"use client"

import MovieCard from "@/components/MovieCard";
import { useGameStore } from "@/hooks/useGameStore";
import { useRouter } from "next/navigation";

export default function HandoffPage() {
    const router = useRouter();
    const { teams, current_team_index, current_movie, startActing, skipMovie } = useGameStore();
    
    const current_team = teams[current_team_index];
    const current_player = current_team?.players[current_team.current_player_index];

    const handleStartActing = () => {
        startActing();
        router.push('/acting');
    };

    return (
        <div className="h-screen bg-white flex items-center justify-center p-6 overflow-hidden">
            <div className="w-full max-w-4xl flex flex-col md:flex-row items-center gap-12">
                
                {/* Left Column: Info & Actions */}
                <div className="flex-1 flex flex-col justify-center w-full max-w-xs space-y-8">
                    <div className="border-l-4 border-black pl-6 py-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">
                            Next Performer
                        </p>
                        <h1 className="text-3xl font-black text-gray-900 uppercase leading-none mb-2">
                            {current_player?.name || "Player"}
                        </h1>
                        <p className="text-xs font-bold text-gray-400 uppercase">
                            {current_team?.name}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button 
                            className="bg-black text-white font-black py-5 px-8 rounded-2xl text-lg uppercase tracking-tight shadow-xl active:scale-95 transition-all" 
                            onClick={handleStartActing}
                        >
                            I'm Ready
                        </button>

                        <button 
                            className="text-gray-400 font-bold py-2 text-[10px] uppercase tracking-[0.15em] hover:text-black transition-colors text-left pl-2" 
                            onClick={() => skipMovie()}
                        >
                            Skip this movie
                        </button>
                    </div>

                    <p className="text-[9px] text-gray-300 uppercase font-medium tracking-tight pl-2">
                        Pass the device to {current_player?.name}
                    </p>
                </div>

                {/* Right Column: Movie Card */}
                <div className="flex-1 w-full max-w-[280px] md:max-w-[320px]">
                    <MovieCard movie={current_movie} />
                </div>

            </div>
        </div>
    );
}