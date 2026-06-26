"use client"

import { useState } from "react";
import Image from "next/image";
import { useGameStore } from "@/hooks/useGameStore";
import { Movie } from '../types/game';

interface MovieCardProps {
  movie?: Movie | null;
  showHint?: boolean;
}

const MovieCard = ({ movie: propMovie, showHint }: MovieCardProps) => {
  const { current_movie } = useGameStore();
  const [isFlipped, setIsFlipped] = useState(false);
  const movie = propMovie ?? current_movie;

  if (!movie) {
    return (
      <div className="w-full max-w-xs mx-auto aspect-2/3 rounded-2xl flex flex-col items-center justify-center gap-4 border border-border bg-surface-secondary">
        <span className="inline-block w-6 h-6 border-2 border-text-muted border-t-transparent rounded-full animate-spin" />
        <span className="text-text-muted font-bold text-[10px] animate-pulse uppercase tracking-widest">Loading...</span>
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-xs mx-auto [perspective:1000px] cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className="relative w-full h-full [transform-style:preserve-3d] transition-transform duration-500 ease-in-out"
        style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >

        {/* FRONT FACE */}
        <div className="w-full h-full [backface-visibility:hidden]">
          <div className="w-full bg-surface rounded-2xl overflow-hidden border border-border shadow-sm flex flex-col">
            <div className="relative aspect-2/3 bg-surface-secondary">
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 384px"
              />
              {showHint && !isFlipped && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-end justify-center pb-6">
                  <span className="text-white/0 group-hover:text-white/70 text-[9px] font-black uppercase tracking-widest transition-all drop-shadow-lg">
                    Tap to flip
                  </span>
                </div>
              )}
            </div>
            <div className="p-5 text-left bg-surface">
              <h2 className="text-xl font-black leading-tight text-text-primary uppercase">
                {movie.title} {!!(movie.year) && <span className="text-text-muted ml-1">({movie.year})</span>}
              </h2>
              <div className="mt-2 text-[11px] font-bold text-text-secondary uppercase">
                Rating: {movie.rating} / 10
              </div>
            </div>
          </div>
        </div>

        {/* BACK FACE */}
        <div
          className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] dark:bg-surface-tertiary bg-gray-900 rounded-2xl p-6 flex flex-col border dark:border-border-strong border-gray-800 shadow-2xl overflow-hidden"
        >
          <p className="text-[9px] font-black dark:text-text-muted text-gray-500 uppercase tracking-[0.3em] mb-4 text-center">Synopsis</p>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <p className="text-sm dark:text-text-secondary text-gray-300 font-medium leading-relaxed italic">
              &ldquo;{movie.overview || 'No description available.'}&rdquo;
            </p>
          </div>

          <div className="mt-6 pt-6 border-t dark:border-border-strong border-gray-800 space-y-3">
            <div className="flex justify-between items-end">
              <div>
                <span className="block text-[8px] font-bold dark:text-text-muted text-gray-500 uppercase tracking-widest">Director</span>
                <span className="text-xs font-black dark:text-text-primary text-white uppercase">{movie.director || "Unknown"}</span>
              </div>
              <div className="text-right">
                <span className="block text-[8px] font-bold dark:text-text-muted text-gray-500 uppercase tracking-widest">Genres</span>
                <span className="text-[10px] font-bold dark:text-text-secondary text-gray-400 uppercase">
                  {movie.genres?.join(' • ') || "N/A"}
                </span>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MovieCard;