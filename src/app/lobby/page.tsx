'use client';
import HandlePlayersCard from '@/components/HandlePlayersCard';
import HandleTeamsCard from '@/components/HandleTeamsCard';
import HandleTimeCard from '@/components/HandleTimeCard';
import LanguageToggle from '@/components/LanguageToggle';
import ThemeToggle from '@/components/ThemeToggle';
import { useGameStore } from '@/hooks/useGameStore';
import { useTranslation } from '@/hooks/useTranslation';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const modes = ['charades', 'impostor'] as const;

const steps = [
  'howToPlayStep1',
  'howToPlayStep2',
  'howToPlayStep3',
  'howToPlayStep4',
  'howToPlayStep5',
] as const;

const impSteps = [
  'impHowToPlayStep1',
  'impHowToPlayStep2',
  'impHowToPlayStep3',
  'impHowToPlayStep4',
  'impHowToPlayStep5',
] as const;

export default function LobbyPage() {
  const { t } = useTranslation();
  const { gameMode, setGameMode, teams, players, debate_timer, setDebateTimer, impostorCount, setImpostorCount, prepareGame, startGame } =
    useGameStore();
  const router = useRouter();

  useEffect(() => {
    router.prefetch('/handoff');
    router.prefetch('/acting');
    router.prefetch('/result');
  }, [router]);

  useEffect(() => {
    const max = Math.floor((players.length - 1) / 2);
    if (impostorCount > max) setImpostorCount(Math.max(1, max));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players.length]);

  const canStart =
    gameMode === 'charades'
      ? teams.length > 0 &&
        teams.every(
          (team) =>
            team.players.length > 0 && team.players.every((player) => player.name.trim().length > 0)
        )
      : players.length >= 3 && players.every((p) => p.name.trim().length > 0);

  const totalPlayers =
    gameMode === 'charades'
      ? teams.reduce((sum, team) => sum + team.players.length, 0)
      : players.length;

  const handleStartLogic = () => {
    prepareGame();
    if (gameMode === 'charades') {
      fetch('/api/movies?count=8')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) startGame(data);
        })
        .catch(() => {});
    }
    router.push(gameMode === 'charades' ? '/handoff' : '/impostor');
  };

  return (
    <div className="min-h-dvh bg-surface flex flex-col p-6 pt-16 md:p-10 animate-fade-in relative">
      {/* HEADER */}
      <div className="w-full max-w-5xl mx-auto pb-6 md:pb-8 border-b border-border mb-8 md:mb-10 flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em] mb-2">
            {t('gameSetup')}
          </p>
          <h1 className="text-5xl md:text-6xl font-black text-text-primary uppercase tracking-tighter leading-none">
            {t('lobby')}
          </h1>
        </div>
        <div className="flex items-center gap-2 shrink-0 pt-1">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </div>

      {/* MODE SELECTION */}
      <div className="w-full max-w-5xl mx-auto mb-8 md:mb-10">
        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] mb-4">
          {t('selectGameMode')}
        </p>
        <div className="grid grid-cols-2 gap-4">
          {modes.map((mode) => (
            <button
              key={mode}
              onClick={() => setGameMode(mode)}
              className={`rounded-xl border-2 p-4 md:p-5 text-left transition-all ${
                gameMode === mode
                  ? 'bg-text-primary border-text-primary text-surface shadow-lg'
                  : 'bg-surface-secondary border-border text-text-secondary hover:border-border-strong hover:text-text-primary'
              }`}
            >
              <span
                className={`block text-lg font-black uppercase tracking-tight ${
                  gameMode === mode ? 'text-surface' : 'text-text-primary'
                }`}
              >
                {t(mode)}
              </span>
              <span
                className={`block text-[10px] font-bold mt-1 leading-relaxed ${
                  gameMode === mode ? 'text-surface/70' : 'text-text-muted'
                }`}
              >
                {t(mode === 'charades' ? 'charadesDesc' : 'impostorDesc')}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* MODE-SPECIFIC SETUP */}
      {gameMode === 'charades' && (
        <div className="w-full max-w-5xl mx-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
          {/* LEFT: Teams + Timer */}
          <div className="flex flex-col gap-8">
            <HandleTeamsCard />
            <div className="md:max-w-64">
              <HandleTimeCard horizontal />
            </div>
          </div>

          {/* RIGHT: How to Play */}
          <div className="flex flex-col md:border-l md:border-border md:pl-8 pt-6 md:pt-0 border-t md:border-t-0 border-border">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] mb-4 md:mb-6">
              {t('howToPlay')}
            </p>
            <ol className="space-y-4 md:space-y-6">
              {steps.map((key, i) => (
                <li key={key} className="flex gap-3 md:gap-4">
                  <span className="shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-surface-tertiary text-text-secondary text-[10px] md:text-sm font-black flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-xs md:text-base font-medium text-text-secondary leading-relaxed">
                    {t(key)}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {gameMode === 'impostor' && (
        <div className="w-full max-w-5xl mx-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
          {/* LEFT: Players + Debate Timer */}
          <div className="flex flex-col gap-8">
            <HandlePlayersCard />
            <div className="md:max-w-64 space-y-6">
              <div>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] mb-4">
                  {t('impostorCount')}
                </p>
                <div className="grid grid-cols-3 gap-2 md:gap-3">
                  {Array.from(
                    { length: Math.max(0, Math.floor((players.length - 1) / 2)) },
                    (_, i) => i + 1
                  ).map((count) => (
                    <button
                      key={count}
                      onClick={() => setImpostorCount(count)}
                      className={`py-3 md:py-5 rounded-xl font-black text-sm md:text-base transition-all border ${
                        impostorCount === count
                          ? 'bg-text-primary border-text-primary text-surface shadow-lg'
                          : 'bg-surface-secondary border-border text-text-secondary hover:border-border-strong hover:text-text-primary'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] mb-4">
                  {t('debateTimer')}
                </p>
                <div className="grid grid-cols-3 gap-2 md:gap-3">
                  {[30, 60, 90].map((time) => (
                    <button
                      key={time}
                      onClick={() => setDebateTimer(time)}
                      className={`py-3 md:py-5 rounded-xl font-black text-sm md:text-base transition-all border ${
                        debate_timer === time
                          ? 'bg-text-primary border-text-primary text-surface shadow-lg'
                          : 'bg-surface-secondary border-border text-text-secondary hover:border-border-strong hover:text-text-primary'
                      }`}
                    >
                      {time}
                      <span className="text-[9px] ml-0.5 opacity-50">s</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: How to Play */}
          <div className="flex flex-col md:border-l md:border-border md:pl-8 pt-6 md:pt-0 border-t md:border-t-0 border-border">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] mb-4 md:mb-6">
              {t('howToPlay')}
            </p>
            <ol className="space-y-4 md:space-y-6">
              {impSteps.map((key, i) => {
                const impKey = impostorCount > 1 && key !== 'impHowToPlayStep1' ? `${key}_plural` : key;
                return (
                <li key={key} className="flex gap-3 md:gap-4">
                  <span className="shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-surface-tertiary text-text-secondary text-[10px] md:text-sm font-black flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-xs md:text-base font-medium text-text-secondary leading-relaxed">
                    {t(impKey as any, { count: impostorCount })}
                  </p>
                </li>);
              })}
            </ol>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="w-full max-w-5xl mx-auto border-t border-border pt-6 md:pt-8 pb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm font-bold text-text-primary">
              {t('playersReady', { count: totalPlayers })}
            </p>
            {!canStart && (
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">
                {t('nameAllPlayers')}
              </p>
            )}
          </div>
          <button
            onClick={handleStartLogic}
            disabled={!canStart}
            className={`w-full md:w-auto px-16 py-5 rounded-full font-black uppercase text-sm tracking-[0.25em] transition-all ${
              canStart
                ? 'bg-text-primary text-surface hover:opacity-90 active:scale-95 shadow-xl'
                : 'bg-surface-tertiary text-text-muted cursor-not-allowed'
            }`}
          >
            {t('beginMatch')}
          </button>
        </div>
      </div>

      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[9px] text-text-muted font-bold uppercase tracking-widest">
        Design &amp; Dev by{' '}
        <a
          href="https://dlampatricio.github.io"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-text-primary transition-colors"
        >
          David Lam
        </a>
      </p>
    </div>
  );
}
