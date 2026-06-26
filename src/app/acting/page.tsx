'use client';

import NavButton from '@/components/NavButton';
import Timer from '@/components/Timer';
import { useGameStore } from '@/hooks/useGameStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export default function ActingPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { game_state, teams, current_team_index, correctGuess, endRound } = useGameStore();
  const [surrenderConfirm, setSurrenderConfirm] = useState(false);

  const current_team = teams[current_team_index];
  const current_player = current_team?.players[current_team.current_player_index];

  const handleCorrect = () => {
    correctGuess();
    endRound();
  };

  const handleSurrender = () => {
    endRound();
  };

  useEffect(() => {
    if (game_state !== 'acting') {
      router.replace('/lobby');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-dvh bg-surface flex flex-col items-center p-8 pt-16 overflow-y-auto animate-fade-in">
      <div className="w-full max-w-sm text-center">
        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] mb-2">
          {t('actingNow')}
        </p>
        <h1 className="text-4xl font-black text-text-primary uppercase tracking-tighter leading-none mb-2">
          {current_player?.name}
        </h1>
        <div className="inline-block px-3 py-1 bg-surface-secondary rounded-full">
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
            {current_team?.name}
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center w-full">
        <Timer />
      </div>

      <div className="w-full max-w-xs mb-6 space-y-6">
        <NavButton
          href="/result"
          label={t('guessed')}
          action={handleCorrect}
          className="py-6 rounded-3xl text-2xl"
        />

        {!surrenderConfirm ? (
          <button
            onClick={() => setSurrenderConfirm(true)}
            className="w-full py-5 rounded-2xl font-bold text-[10px] tracking-[0.3em] text-text-muted hover:text-text-primary transition-all uppercase text-center"
          >
            {t('surrender')}
          </button>
        ) : (
          <div className="flex gap-3 animate-fade-in">
            <button
              onClick={() => {
                handleSurrender();
                router.replace('/result');
              }}
              className="flex-1 py-4 rounded-2xl font-black text-sm uppercase bg-red-600 text-white hover:bg-red-700 transition-all"
            >
              {t('giveUp')}
            </button>
            <button
              onClick={() => setSurrenderConfirm(false)}
              className="flex-1 py-4 rounded-2xl font-black text-sm uppercase bg-surface-secondary text-text-secondary hover:text-text-primary transition-all"
            >
              {t('cancel')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}