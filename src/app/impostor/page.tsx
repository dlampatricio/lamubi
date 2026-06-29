'use client';

import MovieCard from '@/components/MovieCard';
import Timer from '@/components/Timer';
import { useGameStore } from '@/hooks/useGameStore';
import { useTranslation } from '@/hooks/useTranslation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ImpostorPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    game_state,
    players,
    current_movie,
    impostorState,
    revealIndex,
    impostorIndices,
    eliminatedIndices,
    lastEliminatedIndex,
    timer,
    startImpostorGame,
    nextReveal,
    startDebate,
    stopDebate,
    eliminatePlayer,
    skipElimination,
    resetGame,
  } = useGameStore();

  useEffect(() => {
    if (game_state === 'idle' || game_state === 'loading') {
      let cancelled = false;
      fetch('/api/movies?count=8')
        .then((res) => res.json())
        .then((data) => {
          if (!cancelled && Array.isArray(data) && data.length > 0) {
            startImpostorGame(data);
          }
        })
        .catch(console.error);
      return () => {
        cancelled = true;
      };
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isImpostorReveal = impostorIndices.includes(revealIndex);
  const currentPlayer = players[revealIndex];
  const activePlayers = players.filter((_, i) => !eliminatedIndices.includes(i));
  const [showRole, setShowRole] = useState(true);
  const [revealReady, setRevealReady] = useState(false);
  const isLastReveal = revealIndex >= players.length - 1;

  useEffect(() => {
    if (game_state === 'playing' && current_movie && impostorIndices.length > 0) {
      setRevealReady(true);
    }
  }, [game_state, current_movie, impostorIndices]);

  const handleRevealTap = () => {
    if (showRole) {
      if (isLastReveal) {
        window.scrollTo({ top: 0, behavior: 'instant' });
        nextReveal();
      } else {
        setShowRole(false);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
      nextReveal();
      setShowRole(true);
    }
  };

  const loading =
    game_state === 'idle' ||
    game_state === 'loading' ||
    !current_movie ||
    impostorIndices.length === 0 ||
    !revealReady;

  if (loading) {
    return (
      <div className="min-h-dvh bg-surface flex flex-col items-center justify-center p-6">
        <span className="inline-block w-6 h-6 border-2 border-text-muted border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-text-muted font-bold text-[10px] animate-pulse uppercase tracking-widest">
          {t('loading')}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-surface flex flex-col p-6 pt-4 animate-fade-in">
      {/* REVEALING PHASE */}
      {impostorState === 'revealing' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-xs mx-auto">
            {showRole ? (
              <>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em] mb-4 text-center">
                  {t('revealingTitle')}
                </p>
                <p className="text-2xl md:text-3xl font-black text-text-primary uppercase tracking-tighter mb-4 text-center">
                  {currentPlayer?.name}
                </p>

                {isImpostorReveal ? (
                  <div className="text-center py-12">
                    <p className="text-4xl md:text-5xl font-black text-red-500 uppercase tracking-tighter mb-4">
                      {impostorIndices.length > 1
                        ? t('revealingAImpostor')
                        : t('revealingImpostor')}
                    </p>
                    <p className="text-sm text-text-secondary font-medium">
                      {t('revealingImpostorHint')}
                    </p>
                  </div>
                ) : (
                  <MovieCard movie={current_movie} showHint />
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-text-muted mb-6"
                >
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12" y2="18" />
                </svg>
                {!isLastReveal && (
                  <>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-[0.3em] mb-2">
                      {t('passTo')}
                    </p>
                    <p className="text-2xl md:text-3xl font-black text-text-primary uppercase tracking-tight">
                      {players[revealIndex + 1]?.name}
                    </p>
                  </>
                )}
              </div>
            )}

            <button
              onClick={handleRevealTap}
              className="mt-8 w-full py-5 rounded-2xl font-black text-xl uppercase tracking-tight bg-text-primary text-surface hover:opacity-90 active:scale-95 shadow-xl transition-all"
            >
              {showRole ? t('tapToContinue') : t('tapToReveal')}
            </button>
          </div>
        </div>
      )}

      {/* WORD WAIT PHASE */}
      {impostorState === 'word_wait' && (
        <div className="flex-1 flex flex-col items-center justify-center max-w-xs mx-auto w-full text-center">
          {lastEliminatedIndex !== null && (
            <p
              className={`text-xs font-bold uppercase tracking-wider mb-6 px-4 py-3 rounded-2xl border ${
                impostorIndices.includes(lastEliminatedIndex)
                  ? 'text-red-500 bg-red-500/10 border-red-500/30'
                  : 'text-text-muted bg-surface-secondary border-border'
              }`}
            >
              {impostorIndices.includes(lastEliminatedIndex)
                ? t('eliminatedImpostor', { name: players[lastEliminatedIndex]?.name })
                : impostorIndices.length > 1
                  ? t('eliminatedNotAImpostor', { name: players[lastEliminatedIndex]?.name })
                  : t('eliminatedNotImpostor', { name: players[lastEliminatedIndex]?.name })}
            </p>
          )}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-muted mb-6"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] mb-2">
            {t('wordRound')}
          </p>
          <p className="text-xs font-medium text-text-secondary leading-relaxed mb-8">
            {t('wordRoundDesc')}
          </p>
          <button
            onClick={startDebate}
            className="w-full py-5 rounded-2xl font-black text-xl uppercase tracking-tight bg-text-primary text-surface hover:opacity-90 active:scale-95 shadow-xl transition-all"
          >
            {t('startDebate')}
          </button>
        </div>
      )}

      {/* DEBATE PHASE */}
      {impostorState === 'debate' && (
        <div className="flex-1 flex flex-col items-center justify-center max-w-xs mx-auto w-full">
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] mb-6">
            {t('debateTimer')}
          </p>
          <Timer value={timer} onEnd={stopDebate} running />
          <button
            onClick={stopDebate}
            className="mt-10 w-full py-5 rounded-2xl font-black text-xl uppercase tracking-tight bg-text-primary text-surface hover:opacity-90 active:scale-95 shadow-xl transition-all"
          >
            {t('stopDebate')}
          </button>
        </div>
      )}

      {/* VOTING PHASE */}
      {impostorState === 'voting' && (
        <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-muted mb-6"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] mb-6">
            {impostorIndices.length > 1 ? t('voteToEliminatePlural') : t('voteToEliminate')}
          </p>
          <div className="w-full space-y-3">
            {activePlayers.map((p) => {
              const realIdx = players.indexOf(p);
              return (
                <button
                  key={realIdx}
                  onClick={() => eliminatePlayer(realIdx)}
                  className="w-full py-5 px-6 rounded-2xl bg-surface-secondary border-2 border-border text-left font-black text-lg uppercase tracking-tight text-text-primary hover:bg-surface-tertiary hover:border-text-primary transition-all active:scale-[0.98]"
                >
                  {p.name}
                </button>
              );
            })}
          </div>

          <button
            onClick={skipElimination}
            className="mt-6 w-full py-4 px-6 rounded-2xl font-bold text-base uppercase tracking-wider text-text-secondary border-2 border-border hover:bg-surface-secondary hover:border-text-muted transition-all active:scale-[0.98]"
          >
            {t('noEliminate')}
          </button>
        </div>
      )}

      {/* RESULT PHASE */}
      {impostorState === 'result' && (
        <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full">
          {(() => {
            const allEliminated = impostorIndices.every((i) => eliminatedIndices.includes(i));
            return allEliminated ? (
              <div className="text-center mb-4">
                <p className="text-3xl md:text-4xl font-black text-green-500 uppercase tracking-tighter mb-2">
                  {t('nonImpostorsWin')}
                </p>
                <p className="text-xs font-medium text-text-secondary">
                  {impostorIndices.length === 1 ? t('theImpostorWas') : t('theImpostorsWere')}:{' '}
                  {impostorIndices.map((i) => players[i]?.name).join(', ')}
                </p>
              </div>
            ) : (
              <div className="text-center mb-4">
                <p className="text-3xl md:text-4xl font-black text-red-500 uppercase tracking-tighter mb-2">
                  {impostorIndices.length === 1 ? t('impostorWins') : t('impostorsWin')}
                </p>
                <p className="text-xs font-medium text-text-secondary">
                  {impostorIndices.length === 1 ? t('theImpostorWas') : t('theImpostorsWere')}:{' '}
                  {impostorIndices.map((i) => players[i]?.name).join(', ')}
                </p>
              </div>
            );
          })()}

          <div className="w-full max-w-xs mx-auto border-t border-border pt-4">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] text-center mb-4">
              {t('theMovieWas')}
            </p>
            <MovieCard movie={current_movie} showHint />
          </div>

          <button
            onClick={() => {
              resetGame();
              router.push('/lobby');
            }}
            className="mt-8 w-full max-w-xs py-5 rounded-2xl font-black text-xl uppercase tracking-tight bg-text-primary text-surface hover:opacity-90 active:scale-95 shadow-xl transition-all"
          >
            {t('backToLobby')}
          </button>
        </div>
      )}
    </div>
  );
}
