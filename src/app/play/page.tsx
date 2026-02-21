"use client"

import { GameCard } from '@/components/game/GameCard';
import { Intermission } from '@/components/game/Intermission';
import { useGameStore, useCurrentPlayer } from '@/store/gameStore';

export default function PlayPage() {
  const { gamePhase } = useGameStore();
  const currentPlayer = useCurrentPlayer();

  if (gamePhase === 'intermission') {
    return <Intermission nextPlayer={currentPlayer} lastPlayerScore={0} />;
  }

  return <GameCard />;
}
