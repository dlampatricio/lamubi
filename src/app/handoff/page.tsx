'use client';

import NavButton from '@/components/NavButton';
import { useGameStore } from '@/hooks/useGameStore';
import { useTranslation } from '@/hooks/useTranslation';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';

const MovieCard = dynamic(() => import('@/components/MovieCard'), {
  loading: () => {
    const Fallback = () => {
      const { t } = useTranslation();
      return (
        <div className="w-full max-w-xs mx-auto aspect-2/3 rounded-2xl flex flex-col items-center justify-center gap-4 border border-border bg-surface-secondary">
          <span className="inline-block w-6 h-6 border-2 border-text-muted border-t-transparent rounded-full animate-spin" />
          <span className="text-text-muted font-bold text-[10px] animate-pulse uppercase tracking-widest">
            {t('loadingMovie')}
          </span>
        </div>
      );
    };
    return <Fallback />;
  },
});

export default function HandoffPage() {
  const { t } = useTranslation();
  const {
    game_state,
    teams,
    current_team_index,
    current_movie,
    startActing,
    skipMovie,
    startGame,
  } = useGameStore();

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
  };

  const showSkeleton = game_state === 'loading' || (!current_movie && game_state !== 'playing');

  return (
    <div className="min-h-dvh bg-surface flex items-center justify-center p-6 overflow-y-auto animate-fade-in">
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
        <div className="w-full max-w-xs md:flex-1 flex flex-col justify-center">
          <div className="border-l-4 border-text-primary pl-6 py-2 mb-3 md:mb-4">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1">
              {t('nextPerformer')}
            </p>
            <h1 className="text-2xl md:text-3xl font-black text-text-primary uppercase leading-none mb-2">
              {current_player?.name || t('player')}
            </h1>
            <p className="text-xs font-bold text-text-muted uppercase">{current_team?.name}</p>
          </div>

          <p className="text-[11px] text-text-secondary leading-relaxed mb-6 md:mb-8 pl-6 border-l border-border">
            {t('memorizeInstructions')}
          </p>

          {!showSkeleton && (
            <div className="hidden md:flex flex-col gap-3">
              <NavButton
                href="/acting"
                label={t('imReady')}
                action={startActing}
                variant="primary"
              />
              <button
                className="text-text-muted font-bold py-2 text-[10px] uppercase tracking-[0.15em] hover:text-text-primary transition-colors text-left pl-2"
                onClick={handleSkip}
              >
                {t('skipMovie')}
              </button>
            </div>
          )}
        </div>

        <div className="w-full max-w-xs md:max-w-[320px] shrink-0">
          <MovieCard movie={showSkeleton ? null : current_movie} showHint />
        </div>

        {!showSkeleton && (
          <div className="w-full max-w-xs flex md:hidden flex-col gap-3 pt-4">
            <NavButton href="/acting" label={t('imReady')} action={startActing} variant="primary" />
            <button
              className="text-text-muted font-bold py-2 text-[10px] uppercase tracking-[0.15em] text-center"
              onClick={handleSkip}
            >
              {t('skipMovie')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
