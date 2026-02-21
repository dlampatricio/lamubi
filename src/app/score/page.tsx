'use client';

import { ScoreBoard } from '@/components/game/ScoreBoard';
import { CategorySelector } from '@/components/game/CategorySelector';

export default function ScorePage() {
  return (
    <div className="min-h-screen bg-[#f5f2ed]">
      {/* Category Selector */}
      <div className="absolute top-4 right-4 z-10">
        <CategorySelector />
      </div>

      {/* Score Board Component */}
      <ScoreBoard />
    </div>
  );
}
