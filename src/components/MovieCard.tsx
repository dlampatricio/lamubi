"use client"

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useGameStore } from "@/hooks/useGameStore";
import { Movie } from '../types/game';
import { useTranslation } from '@/hooks/useTranslation';

interface MovieCardProps {
  movie?: Movie | null;
  showHint?: boolean;
}

const MovieCard = ({ movie: propMovie, showHint }: MovieCardProps) => {
  const { t } = useTranslation();
  const { current_movie } = useGameStore();
  const [isFlipped, setIsFlipped] = useState(false);
  const movie = propMovie ?? current_movie;

  if (!movie) {
    return (
      <div className="w-full max-w-xs mx-auto aspect-2/3 rounded-2xl flex flex-col items-center justify-center gap-4 border border-border bg-surface-secondary">
        <span className="inline-block w-6 h-6 border-2 border-text-muted border-t-transparent rounded-full animate-spin" />
        <span className="text-text-muted font-bold text-[10px] animate-pulse uppercase tracking-widest">{t('loading')}</span>
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-xs mx-auto [perspective:1000px] cursor-pointer group relative"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {/* Invisible sizing element: gives the container explicit height */}
      <div className="invisible" aria-hidden="true">
        <div className="bg-surface border border-border shadow-sm flex flex-col rounded-2xl overflow-hidden">
          <div className="relative aspect-2/3 bg-surface-secondary" />
          <div className="p-5">
            <div className="text-xl font-black leading-tight">W</div>
            <div className="mt-2 text-[11px]">R</div>
          </div>
        </div>
      </div>

      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        initial={false}
      >

        {/* FRONT FACE */}
        <div className="absolute inset-0 [backface-visibility:hidden]">
          <div className="w-full h-full bg-surface border border-border shadow-sm flex flex-col rounded-2xl overflow-hidden">
            <div className="relative flex-1 bg-surface-secondary">
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
                    {t('tapToFlip')}
                  </span>
                </div>
              )}
            </div>
            <div className="p-5 text-left bg-surface shrink-0">
              <h2 className="text-xl font-black leading-tight text-text-primary uppercase">
                {movie.title} {!!(movie.year) && <span className="text-text-muted ml-1">({movie.year})</span>}
              </h2>
              <div className="mt-2 text-[11px] font-bold text-text-secondary uppercase">
                {t('rating')}: {movie.rating} / 10
              </div>
            </div>
          </div>
        </div>

        {/* BACK FACE */}
        <div
          className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] dark:bg-surface-tertiary bg-gray-900 rounded-2xl p-6 flex flex-col border dark:border-border-strong border-gray-800 shadow-2xl overflow-hidden"
        >
          <p className="text-[9px] font-black dark:text-text-muted text-gray-500 uppercase tracking-[0.3em] mb-4 text-center">{t('synopsis')}</p>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <p className="text-sm dark:text-text-secondary text-gray-300 font-medium leading-relaxed italic">
              &ldquo;{movie.overview || t('noDescription')}&rdquo;
            </p>
          </div>

          <div className="mt-6 pt-6 border-t dark:border-border-strong border-gray-800 space-y-3">
            <div className="flex justify-between items-end">
              <div>
                <span className="block text-[8px] font-bold dark:text-text-muted text-gray-500 uppercase tracking-widest">{t('director')}</span>
                <span className="text-xs font-black dark:text-text-primary text-white uppercase">{movie.director || t('unknown')}</span>
              </div>
              <div className="text-right">
                <span className="block text-[8px] font-bold dark:text-text-muted text-gray-500 uppercase tracking-widest">{t('genres')}</span>
                <span className="text-[10px] font-bold dark:text-text-secondary text-gray-400 uppercase">
                  {movie.genres?.join(' • ') || t('na')}
                </span>
              </div>
            </div>

            <a
              href={`https://letterboxd.com/tmdb/${movie.id}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border dark:border-border-strong border-gray-700 text-[10px] font-bold uppercase tracking-widest dark:text-text-muted text-gray-400 hover:dark:text-text-primary hover:text-white transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 97 36">
                <ellipse fill="#40BCF4" cx="79.21" cy="18" rx="18.027" ry="18" />
                <ellipse fill="#00E054" cx="48.619" cy="18" rx="18.027" ry="18" />
                <ellipse fill="#FF8000" cx="18.027" cy="18" rx="18.027" ry="18" />
                <path d="M33.323 27.53a10.57 10.57 0 0 1-2.731-9.53 10.57 10.57 0 0 1 2.73-9.53 10.57 10.57 0 0 1 2.732 9.53 10.57 10.57 0 0 1-2.731 9.53z" fill="#FFF" />
                <path d="M63.914 8.47a10.57 10.57 0 0 1 2.732 9.53 10.57 10.57 0 0 1-2.732 9.53 10.57 10.57 0 0 1-2.73-9.53 10.57 10.57 0 0 1 2.73-9.53z" fill="#FFF" />
              </svg>
              {t('watchlist')}
            </a>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default MovieCard;