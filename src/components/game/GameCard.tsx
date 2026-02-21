'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, useCurrentPlayer, useCurrentTeam } from '@/store/gameStore';
import { useTimer } from '@/hooks/useTimer';
import { Check, Play, RotateCcw, Film, Timer } from 'lucide-react';

export const GameCard = () => {
  const currentPlayer = useCurrentPlayer();
  const currentTeam = useCurrentTeam();
  const { formattedTime, isTimerRunning, startTimer } = useTimer();
  const { 
    currentMovie, 
    markGuessAsCorrect, 
    skipMovie, 
    teams,
    currentRound,
    gameSettings
  } = useGameStore();

  if (!currentPlayer || !currentTeam || !currentMovie) return null;

  const seconds = parseInt(formattedTime.split(':')[1]) || 0;

  return (
    <div className="min-h-screen bg-[#f2ede4] text-[#3a3a3a] flex flex-col relative overflow-hidden font-sans">

      {/* HEADER: Información del Turno */}
      <nav className="relative z-30 pt-16 pb-6 px-8 flex justify-between items-end">
        <div className="flex flex-col">
          <span className={`font-mono text-[9px] tracking-[0.4em] opacity-40 uppercase mb-1 font-bold ${
            currentTeam.color === 'red' ? 'text-red-600' : 'text-blue-600'
          }`}>
            ● {currentTeam.name.toUpperCase()}
          </span>
          <h2 className="text-2xl font-black uppercase tracking-tighter leading-none">
            {currentPlayer.name}
          </h2>
          <span className="font-mono text-[9px] opacity-30 uppercase tracking-[0.2em] mt-1">
            Score: {currentTeam.score} — Round {currentRound}
          </span>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 mb-1 opacity-40">
            <Timer size={10} />
            <span className="font-mono text-[9px] tracking-[0.4em] uppercase">Remaining</span>
          </div>
          <span className={`text-3xl font-mono font-bold tracking-tighter tabular-nums ${
            seconds <= 10 ? 'text-red-600 animate-pulse' : 'text-[#3a3a3a]'
          }`}>
            00:{seconds.toString().padStart(2, '0')}
          </span>
        </div>
      </nav>

      {/* MAIN: El Póster de la Película */}
      <main className="relative z-30 flex-1 flex items-center justify-center p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMovie.id}
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -20 }}
            className="w-full max-w-[340px] aspect-[2/3] bg-white border border-[#3a3a3a]/5 shadow-[20px_20px_60px_rgba(0,0,0,0.05),-5px_-5px_30px_rgba(255,255,255,0.8)] relative p-1"
          >
            {/* El "Papel" del Póster */}
            <div className="w-full h-full border border-[#3a3a3a]/10 flex flex-col items-center justify-between p-8 text-center relative">
              
              {/* Marca de agua / Decoración lateral */}
              <div className="absolute top-0 left-0 w-full h-full flex justify-between px-2 pointer-events-none opacity-[0.03]">
                <div className="h-full w-4 border-l border-r border-[#3a3a3a]" />
                <div className="h-full w-4 border-l border-r border-[#3a3a3a]" />
              </div>

              {!isTimerRunning ? (
                <div className="my-auto space-y-4">
                  <div className="w-16 h-16 rounded-full border border-[#3a3a3a]/10 flex items-center justify-center mx-auto">
                    <Film size={24} className="opacity-20" />
                  </div>
                  <p className="font-mono text-[10px] tracking-[0.5em] opacity-30 uppercase italic">Standby for action</p>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="my-auto space-y-8 w-full"
                >
                  <div>
                    <span className="font-mono text-[9px] tracking-[0.5em] opacity-40 uppercase block mb-4 italic italic-outline-small">Feature Film</span>
                    <h1 className="text-4xl font-black uppercase tracking-tighter leading-[0.9] text-[#3a3a3a]">
                      {currentMovie.title}
                    </h1>
                  </div>
                  
                  <div className="h-[1px] w-12 bg-[#3a3a3a]/20 mx-auto" />
                  
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-widest">{currentMovie.year}</span>
                    <div className="flex items-center justify-center gap-2">
                       <span className="w-1 h-1 rounded-full bg-red-600" />
                       <span className="text-[9px] font-mono opacity-40 uppercase tracking-widest">{currentMovie.difficulty}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Pie de página del póster */}
              <div className="w-full flex justify-between items-end opacity-20">
                <span className="font-mono text-[7px] uppercase tracking-tighter">Production No. {currentMovie.id.slice(0,5)}</span>
                <span className="font-mono text-[7px] uppercase tracking-tighter">MUBI_GAME_V1</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* FOOTER: Acciones integradas */}
      <footer className="relative z-30 p-8 pt-0 flex flex-col gap-4">
        <AnimatePresence mode="wait">
          {!isTimerRunning ? (
            <motion.button
              key="start"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              onClick={startTimer}
              className="w-full py-6 bg-[#3a3a3a] text-[#f2ede4] flex items-center justify-center gap-4 group active:scale-[0.98] transition-transform"
            >
              <Play size={16} fill="currentColor" />
              <span className="text-sm font-black uppercase tracking-[0.6em]">Roll Camera</span>
            </motion.button>
          ) : (
            <motion.div 
              key="actions"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 gap-3"
            >
              <button 
                onClick={skipMovie}
                className="py-8 border border-[#3a3a3a]/10 flex flex-col items-center justify-center gap-2 opacity-50 hover:opacity-100 transition-all active:bg-[#3a3a3a]/5"
              >
                <RotateCcw size={18} />
                <span className="font-mono text-[9px] tracking-[0.4em] uppercase">Skip Take</span>
              </button>

              <button 
                onClick={markGuessAsCorrect}
                className="py-8 bg-[#3a3a3a] text-[#f2ede4] flex flex-col items-center justify-center gap-2 active:scale-95 transition-all shadow-xl"
              >
                <Check size={24} strokeWidth={3} />
                <span className="font-mono text-[9px] tracking-[0.4em] uppercase font-bold">Cut!</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </footer>

      <style jsx global>{`
        .italic-outline-small {
          -webkit-text-stroke: 0.5px #3a3a3a;
          color: transparent;
        }
      `}</style>
    </div>
  );
};