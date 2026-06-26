'use client';

import MovieCard from '@/components/MovieCard';
import NavButton from '@/components/NavButton';
import { useGameStore } from '@/hooks/useGameStore';
import { useEffect, useRef } from 'react';

export default function HandoffPage() {
  const { teams, current_team_index, current_movie, movies, startActing, skipMovie } =
    useGameStore();
  const initialLoad = useRef(true);

  const current_team = teams[current_team_index];
  const current_player = current_team?.players[current_team.current_player_index];

  useEffect(() => {
    if (initialLoad.current && !current_movie && movies.length === 0) {
      initialLoad.current = false;
      skipMovie();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 overflow-y-auto animate-fade-in">
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
        <div className="w-full max-w-xs md:flex-1 flex flex-col justify-center">
          <div className="border-l-4 border-black pl-6 py-2 mb-3 md:mb-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">
              Next Performer
            </p>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase leading-none mb-2">
              {current_player?.name || 'Player'}
            </h1>
            <p className="text-xs font-bold text-gray-400 uppercase">{current_team?.name}</p>
          </div>

          <p className="text-[11px] text-gray-500 leading-relaxed mb-6 md:mb-8 pl-6 border-l border-gray-100">
            Memorize the movie details. You will act it out for your team without speaking.
          </p>

          <div className="hidden md:flex flex-col gap-3">
            <NavButton href="/acting" label="I'm Ready" action={startActing} variant="primary" />
            <button
              className="text-gray-400 font-bold py-2 text-[10px] uppercase tracking-[0.15em] hover:text-black transition-colors text-left pl-2"
              onClick={() => skipMovie()}
            >
              Skip this movie
            </button>
          </div>
        </div>

        <div className="w-full max-w-260px md:max-w-[320px] shrink-0">
          <MovieCard movie={current_movie} showHint />
        </div>

        <div className="w-full max-w-xs flex md:hidden flex-col gap-3 pt-4">
          <NavButton href="/acting" label="I'm Ready" action={startActing} variant="primary" />
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
