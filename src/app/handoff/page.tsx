'use client';

import dynamic from 'next/dynamic';
import NavButton from '@/components/NavButton';
import { useGameStore } from '@/hooks/useGameStore';
import { useEffect, useState } from 'react';

const MovieCard = dynamic(() => import('@/components/MovieCard'), {
  loading: () => (
    <div className="w-full max-w-xs mx-auto aspect-2/3 rounded-2xl flex flex-col items-center justify-center gap-4 border border-gray-100 bg-gray-50">
      <span className="inline-block w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
      <span className="text-gray-400 font-bold text-[10px] animate-pulse uppercase tracking-widest">
        Loading movie...
      </span>
    </div>
  ),
});

export default function HandoffPage() {
  const { game_state, teams, current_team_index, current_movie, startActing, skipMovie, startGame } =
    useGameStore();
  const [toast, setToast] = useState<string | null>(null);

  const current_team = teams[current_team_index];
  const current_player = current_team?.players[current_team.current_player_index];

  useEffect(() => {
    if (game_state !== 'loading') return;
    fetch('/api/movies?count=8')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          startGame(data);
        }
      })
      .catch(console.error);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSkip = () => {
    skipMovie();
    setToast('Skipped — loading next movie...');
    setTimeout(() => setToast(null), 2000);
  };

  const showSkeleton = game_state === 'loading' || (!current_movie && game_state !== 'playing');

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

          {!showSkeleton && (
            <div className="hidden md:flex flex-col gap-3">
              <NavButton href="/acting" label="I'm Ready" action={startActing} variant="primary" />
              <button
                className="text-gray-400 font-bold py-2 text-[10px] uppercase tracking-[0.15em] hover:text-black transition-colors text-left pl-2"
                onClick={handleSkip}
              >
                Skip this movie
              </button>
            </div>
          )}
        </div>

        <div className="w-full max-w-260px md:max-w-[320px] shrink-0">
          <MovieCard movie={showSkeleton ? null : current_movie} showHint />
        </div>

        {!showSkeleton && (
          <div className="w-full max-w-xs flex md:hidden flex-col gap-3 pt-4">
            <NavButton href="/acting" label="I'm Ready" action={startActing} variant="primary" />
            <button
              className="text-gray-400 font-bold py-2 text-[10px] uppercase tracking-[0.15em] text-center"
              onClick={handleSkip}
            >
              Skip this movie
            </button>
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest animate-fade-in shadow-2xl z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
