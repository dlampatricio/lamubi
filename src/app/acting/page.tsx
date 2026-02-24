"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "../../hooks/useGameStore";
import Timer from "../../components/Timer";

export default function ActingPage() {
    const router = useRouter();
    const { game_state, teams, current_team_index, current_movie, skipMovie, correctGuess, endRound } = useGameStore();
    
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
            <h1 className="text-2xl font-bold uppercase text-gray-500">Acting</h1>
            <p className="text-3xl font-black mb-4">{current_team?.name}</p>
            
            <div className="my-10 text-center border-4 border-dashed border-blue-500 p-8 rounded-xl">
                <h2 className="text-4xl font-black">
                    {current_movie?.title || "LOADING..."}
                </h2>
                {current_movie?.year && (
                    <p className="text-xl text-gray-600 mt-2">{current_movie.year}</p>
                )}
                {current_movie?.poster_path && (
                    <img 
                        src={`https://image.tmdb.org/t/p/w200${current_movie.poster_path}`}
                        alt={current_movie.title}
                        className="mt-4 mx-auto max-w-[200px] rounded-lg"
                    />
                )}
            </div>

            <Timer />

            <div className="flex flex-col gap-4 mt-8 w-full max-w-xs">
                <button 
                    className="bg-gray-400 text-white font-bold py-3 rounded-xl text-sm" 
                    onClick={() => skipMovie()}
                >
                    Skip Movie (0 pts)
                </button>
                <button 
                    className="bg-green-500 text-white font-bold py-6 rounded-2xl text-xl" 
                    onClick={handleCorrect}
                >
                    Guessed!
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