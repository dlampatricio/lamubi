"use client";
import { useEffect } from "react";
import { useGameStore } from "@/hooks/useGameStore";
import HandleTimeCard from "@/components/HandleTimeCard";
import HandleTeamsCard from "@/components/HandleTeamsCard";
import { useRouter } from "next/navigation";

export default function LobbyPage() {
  const { prepareGame, teams } = useGameStore();
  const router = useRouter();

  useEffect(() => {
    router.prefetch('/handoff');
    router.prefetch('/acting');
    router.prefetch('/result');
  }, [router]);

  const canStart = teams.length > 0 && teams.every(team => 
    team.players.length > 0 && 
    team.players.every(player => player.name.trim().length > 0)
  );

  const handleStartLogic = () => {
    prepareGame();
    router.push("/handoff");
  };

  const totalPlayers = teams.reduce((sum, team) => sum + team.players.length, 0);

  return (
    <div className="min-h-screen bg-surface flex flex-col p-6 md:p-10 animate-fade-in">
      <div className="w-full max-w-5xl mx-auto pt-8 pb-8 border-b border-border mb-10">
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em] mb-2">
          Game Setup
        </p>
        <h1 className="text-5xl md:text-6xl font-black text-text-primary uppercase tracking-tighter leading-none">
          Lobby
        </h1>
      </div>

      <div className="w-full max-w-5xl mx-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 mb-12">
        <div className="md:col-span-7">
           <HandleTeamsCard />
        </div>

        <div className="md:col-span-5 border-t md:border-t-0 md:border-l border-border pt-10 md:pt-0 md:pl-16">
          <HandleTimeCard />
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto border-t border-border pt-8 pb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm font-bold text-text-primary">
              {totalPlayers} player{totalPlayers !== 1 ? 's' : ''} ready
            </p>
            {!canStart && (
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">
                Name all players to begin
              </p>
            )}
          </div>
          <button
            onClick={handleStartLogic}
            disabled={!canStart}
            className={`w-full md:w-auto px-16 py-5 rounded-full font-black uppercase text-sm tracking-[0.25em] transition-all ${
              canStart
              ? "bg-text-primary text-surface hover:opacity-90 active:scale-95 shadow-xl"
              : "bg-surface-tertiary text-text-muted cursor-not-allowed"
            }`}
          >
            Begin Match
          </button>
        </div>
      </div>
    </div>
  );
}