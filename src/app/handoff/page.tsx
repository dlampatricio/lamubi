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
        <div className="min-h-screen bg-white flex items-center justify-center p-6 overflow-y-auto">
            <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
                
                {/* 1. Header: Siempre arriba en móvil, izquierda en desktop */}
                <div className="w-full max-w-xs md:flex-1 flex flex-col justify-center">
                    <div className="border-l-4 border-black pl-6 py-2 mb-6 md:mb-8">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">
                            Next Performer
                        </p>
                        <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase leading-none mb-2">
                            {current_player?.name || "Player"}
                        </h1>
                        <p className="text-xs font-bold text-gray-400 uppercase">
                            {current_team?.name}
                        </p>
                    </div>

                    {/* Las acciones se ocultan en móvil y se muestran en desktop aquí */}
                    <div className="hidden md:flex flex-col gap-3">
                        <button 
                            className="bg-black text-white font-black py-5 px-8 rounded-2xl text-lg uppercase tracking-tight active:scale-95 transition-all" 
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
                </div>

                {/* 2. Movie Card: En el medio en móvil, derecha en desktop */}
                <div className="w-full max-w-260px md:max-w-[320px] shrink-0">
                    <MovieCard movie={current_movie} />
                </div>

                {/* 3. Mobile Actions: Solo se muestran en móvil al final del flujo */}
                <div className="w-full max-w-xs flex md:hidden flex-col gap-3 pt-4">
                    <button 
                        className="bg-black text-white font-black py-5 px-8 rounded-2xl text-lg uppercase tracking-tight active:scale-95 transition-all" 
                        onClick={handleStartActing}
                    >
                        I'm Ready
                    </button>
                    <button 
                        className="text-gray-400 font-bold py-2 text-[10px] uppercase tracking-[0.15em] text-center" 
                        onClick={() => skipMovie()}
                    >
                        Skip this movie
                    </button>
                </div>
            </div>
        </div>
    );
}