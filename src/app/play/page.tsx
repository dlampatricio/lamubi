"use client"

import { GameCard } from '@/components/GameCard';
import { Intermission } from '@/components/Intermission';
import { useGameStore, useCurrentPlayer } from '@/store/gameStore';

export default function PlayPage() {
  const { gamePhase } = useGameStore();
  const currentPlayer = useCurrentPlayer();

  if (gamePhase === 'intermission') {
    return <Intermission nextPlayer={currentPlayer} lastPlayerScore={0} />;
  }

  return <GameCard />;
}
