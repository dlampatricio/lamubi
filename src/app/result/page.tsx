"use client"

import MovieCard from "@/components/MovieCard";
import ScoreList from "@/components/ScoreList";
import NavButton from "@/components/NavButton";
import { useGameStore } from "@/hooks/useGameStore";

export default function ResultPage() {
  const { nextTeam } = useGameStore();
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 md:p-12">
      
      <div className="w-full max-w-4xl border-b border-gray-100 pb-6 mb-12 text-center">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Round Summary</p>
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Results</h1>
      </div>

      <div className="w-full max-w-4xl flex flex-col md:flex-row items-stretch justify-center gap-12 md:gap-24">
        
        {/* Lado Izquierdo: MovieCard */}
        <div className="w-full md:max-w-75 mx-auto md:mx-0">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 text-center">The Movie Was</p>
          <MovieCard /> 
        </div>

        {/* Lado Derecho: Scores y Botones */}
        <div className="flex-1 w-full max-w-xs mx-auto md:mx-0 flex flex-col pt-0 md:pt-8">
            
            {/* Contenedor Superior: Puntajes */}
            <div className="flex-1">
                <ScoreList />
            </div>

            {/* Contenedor Inferior: Acciones */}
            {/* En móvil se apilan, en desktop se mantienen al fondo del contenedor flex */}
            <div className="mt-12 md:mt-auto space-y-4 w-full">
                <NavButton 
                    href="/handoff" 
                    label="Next Turn" 
                    action={nextTeam} 
                />
                
                <div className="flex justify-center w-full">
                    <NavButton 
                        href="/lobby" 
                        label="Finish Game / Lobby" 
                        variant="secondary" 
                    />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}