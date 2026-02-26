"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/hooks/useGameStore";
import { Movie } from '../types/game';

interface MovieCardProps {
  movie?: Movie | null;
}

const MovieCard = ({ movie: propMovie }: MovieCardProps) => {
  const { current_movie } = useGameStore();
  const [isFlipped, setIsFlipped] = useState(false);
  const movie = propMovie ?? current_movie;

  if (!movie) {
    return (
      <div className="w-full max-w-xs aspect-2/3 rounded-2xl flex items-center justify-center border border-gray-100 bg-gray-50">
        <span className="text-gray-400 font-bold text-[10px] animate-pulse uppercase tracking-widest">Loading...</span>
      </div>
    );
  }

  return (
    <div 
      className="w-full max-w-xs mx-auto [perspective:1000px] cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div 
        className="relative w-full h-full [transform-style:preserve-3d]"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        
        {/* --- CARA FRONTAL --- */}
        {/* Usamos backface-visibility para que desaparezca al girar */}
        <div className="w-full h-full [backface-visibility:hidden]">
          <div className="w-full bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm flex flex-col">
            <div className="relative aspect-2/3 bg-gray-100">
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5 text-left bg-white">
              <h2 className="text-xl font-black leading-tight text-gray-900 uppercase">
                {movie.title} {!!(movie.year) && <span className="text-gray-400 ml-1">({movie.year})</span>}
              </h2>
              <div className="mt-2 text-[11px] font-bold text-gray-500 uppercase">
                Rating: {movie.rating} / 10
              </div>
            </div>
          </div>
        </div>

        {/* --- CARA TRASERA --- */}
        {/* 'absolute inset-0' hace que el reverso calce EXACTO con el tamaño del frontal */}
        <div 
          className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gray-950 rounded-2xl p-6 flex flex-col border border-gray-800 shadow-2xl overflow-hidden"
        >
          <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 text-center">Synopsis</p>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <p className="text-sm text-gray-300 font-medium leading-relaxed italic">
              "{movie.overview || "No description available."}"
            </p>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-800 space-y-3">
            <div className="flex justify-between items-end">
              <div>
                <span className="block text-[8px] font-bold text-gray-500 uppercase tracking-widest">Director</span>
                <span className="text-xs font-black text-white uppercase">{movie.director || "Unknown"}</span>
              </div>
              <div className="text-right">
                <span className="block text-[8px] font-bold text-gray-500 uppercase tracking-widest">Genres</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  {movie.genres?.join(' • ') || "N/A"}
                </span>
              </div>
              
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default MovieCard;