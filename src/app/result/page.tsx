"use client"

import { useRouter } from "next/navigation";
import { useGameStore } from "../../hooks/useGameStore";
import MovieCard from "../../components/MovieCard";

export default function ResultPage() {
    const router = useRouter();
    const { teams, resetScores, nextTeam, current_movie } = useGameStore();

    const handleExit = () => {
        resetScores();
        router.replace('/lobby');
    };

    const handleNextTurn = () => {
        nextTeam();
        router.replace('/handoff');
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto">
            
            {/* Header Minimalista - Centrado en móvil, Izquierda en desktop opcional */}
            <div className="w-full max-w-4xl border-b border-gray-100 pb-6 mb-12 text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">
                    Round Summary
                </p>
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
                    Results
                </h1>
            </div>

            {/* Layout Principal */}
            <div className="w-full max-w-4xl flex flex-col md:flex-row items-stretch justify-center gap-12 md:gap-24">
                
                {/* Columna Izquierda: Película */}
                <div className="w-full md:max-w-75 mx-auto md:mx-0 ">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 text-center">
                        The Movie Was
                    </p>
                    <MovieCard movie={current_movie} />
                </div>

                {/* Columna Derecha: Scores y Botón */}
                <div className="flex-1 w-full max-w-xs mx-auto md:mx-0 flex flex-col justify-between pt-0 md:pt-8 text-center md:text-left">
                    
                    {/* Top: Scores */}
                    <div className="space-y-8">
                        <p className="pl-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 md:border-l-2 border-black">
                            Current Standings
                        </p>
                        
                        <div className="space-y-6">
                            {teams.map((team, idx) => (
                                <div key={idx} className="flex justify-between items-center group bg-gray-50 md:bg-transparent p-4 md:p-0 rounded-2xl">
                                    <div className="flex flex-col items-start md:items-start text-left">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
                                            Team
                                        </span>
                                        <span className="text-lg font-black uppercase text-gray-900">
                                            {team.name}
                                        </span>
                                    </div>
                                    <span className="text-4xl font-black tabular-nums text-black">
                                        {team.score}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom: Botón Next Turn */}
                    <div className="mt-12 md:mt-0 flex justify-center">
                        <button 
                            className="w-full bg-black text-white font-black py-5 px-4 rounded-2xl text-xl uppercase tracking-tight active:scale-95 transition-transform"
                            onClick={handleNextTurn}
                        >
                            Next Turn
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer: Centrado siempre */}
            <div className="mt-16 pb-8 text-center">
                <button 
                    className="text-gray-300 font-bold py-2 text-[10px] uppercase tracking-[0.3em] hover:text-black transition-colors"
                    onClick={handleExit}
                >
                    Finish Game / Lobby
                </button>
            </div>
        </div>
    );
}