'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import { Plus, Play, X, ChevronRight, ChevronLeft, Menu } from 'lucide-react';

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<'red' | 'blue'>('red');
  const [roundTime, setRoundTime] = useState(() => {
    // Get initial time from store
    const store = useGameStore.getState();
    return store.gameSettings.roundTime;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const { 
    teams, addPlayerToTeam, removePlayerFromTeam, 
    selectedCategory, availableCategories,
    selectCategory, startGame, updateRoundTime, gameSettings
  } = useGameStore();

  // Sync roundTime with store (avoid infinite loop)
  useEffect(() => {
    const currentTime = gameSettings.roundTime;
    if (currentTime !== roundTime) {
      setRoundTime(currentTime);
    }
  }, [gameSettings.roundTime]);

  const times = ['30s', '60s', '90s'];
  const langs = ['EN', 'ES'];

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addPlayerToTeam(`team-${selectedTeam}`, name.trim());
      setName('');
    }
  };

  return (
    <div className="min-h-screen bg-[#f2ede4] text-[#3a3a3a] flex flex-col relative overflow-hidden font-sans select-none">
      
      <main className="relative z-30 flex-1 flex flex-col max-w-md mx-auto w-full pt-24 pb-8 px-8">
        
        {/* Indicador de Progreso Refinado */}
        <div className="mb-12 flex items-center gap-6">
          <span className="font-mono text-[10px] tracking-[0.4em] opacity-40 uppercase font-bold">
            {step === 1 ? 'Phase 01 / Specs' : 'Phase 02 / Casting'}
          </span>
          <div className="flex-1 h-px bg-[#3a3a3a]/10" />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
              className="flex-1 flex flex-col"
            >
              <h2 className="text-6xl font-black uppercase tracking-tighter leading-[0.8] mb-12">
                Technical <br /> <span className="italic-outline text-transparent italic">Specs</span>
              </h2>
              
              <div className="space-y-10">
                {/* Selección de Categoría (Genre) */}
                <div className="space-y-4">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40 block font-bold italic">Select Genre</span>
                  <div className="grid grid-cols-2 gap-3">
                    {availableCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => selectCategory(cat)}
                        className={`py-4 px-4 text-[11px] font-mono uppercase tracking-widest border-2 transition-all duration-300 ${
                          selectedCategory === cat 
                            ? 'bg-[#3a3a3a] text-[#f2ede4] border-[#3a3a3a] shadow-lg' 
                            : 'border-[#3a3a3a]/10 opacity-40 hover:opacity-100 hover:border-[#3a3a3a]/30'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ajustes Rápidos (Tiempo e Idioma) */}
                <div className="grid grid-cols-1 gap-10">
                  {[
                    { 
                      label: 'Timer', 
                      options: times, 
                      current: times.find(t => Number.parseInt(t.replace('s', '')) === roundTime) || `${roundTime}s`,
                      action: (value: string) => {
                        const time = Number.parseInt(value.replace('s', ''));
                        setRoundTime(time);
                        updateRoundTime(time);
                      }
                    },
                    { label: 'Language', options: langs, current: 'EN' }
                  ].map((group) => (
                    <div key={group.label} className="space-y-4">
                      <span className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40 block font-bold italic">{group.label}</span>
                      <div className="flex border-2 border-[#3a3a3a]/10 bg-white/20">
                        {group.options.map((opt) => (
                          <button
                            key={`${group.label}-${opt}`}
                            onClick={() => group.action && group.action(opt)}
                            className={`flex-1 py-4 text-[10px] font-mono uppercase tracking-[0.2em] transition-all duration-300 ${
                              opt === group.current 
                                ? 'bg-[#3a3a3a] text-[#f2ede4] border-[#3a3a3a] shadow-lg'
                                : 'opacity-30 hover:opacity-100'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                className="mt-6 py-6 bg-[#3a3a3a] text-[#f2ede4] flex items-center justify-center gap-6 group active:scale-[0.98] transition-all shadow-xl"
              >
                <span className="text-sm font-black uppercase tracking-[0.5em] ml-4">To Casting</span>
                <ChevronRight size={18} strokeWidth={2.5} />
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className="flex-1 flex flex-col"
            >
              <button onClick={() => setStep(1)} className="flex items-center gap-2 opacity-30 hover:opacity-100 mb-6 text-[9px] font-mono tracking-[0.3em] uppercase italic transition-opacity">
                <ChevronLeft size={14} /> Edit Technical Specs
              </button>
              
              <h2 className="text-6xl font-black uppercase tracking-tighter mb-10 leading-[0.8]">
                Casting <br /> <span className="italic-outline text-transparent italic">Call</span>
              </h2>

              {/* INPUT DE ACTOR */}
              <form onSubmit={handleAddPlayer} className="mb-12 relative">
                <div className="relative group">
                  <input
                    autoFocus
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ENTER TALENT NAME..."
                    className="w-full bg-transparent py-6 text-4xl font-black uppercase tracking-tighter outline-none border-b-2 border-[#3a3a3a] placeholder:opacity-5 transition-all focus:placeholder:translate-x-4 focus:border-[#94442d]"
                    maxLength={14}
                  />
                  <button 
                    type="submit" 
                    disabled={!name.trim()}
                    className="absolute right-0 bottom-4 flex items-center gap-3 group-focus-within:opacity-100 opacity-20 transition-all disabled:opacity-0"
                  >
                    <span className="font-mono text-[10px] tracking-[0.4em] font-bold">ADD TO CAST</span>
                    <div className="w-12 h-12 bg-[#3a3a3a] text-[#f2ede4] flex items-center justify-center rounded-full active:scale-90 transition-transform">
                      <Plus size={22} strokeWidth={2.5} />
                    </div>
                  </button>
                </div>
              </form>

              {/* SELECTOR DE PRODUCTORA */}
              <div className="mb-10">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-40 italic">Assign to Production Unit</span>
                  <span className="text-[9px] font-mono opacity-20">REF_ID: {selectedTeam === 'red' ? 'UNIT_A' : 'UNIT_B'}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'team-red', color: 'red', name: 'Production A' },
                    { id: 'team-blue', color: 'blue', name: 'Production B' }
                  ].map((team) => {
                    const isSelected = selectedTeam === team.color;
                    return (
                      <button
                        key={team.id}
                        onClick={() => setSelectedTeam(team.color as 'red' | 'blue')}
                        className={`relative py-5 px-4 text-[10px] font-mono uppercase tracking-[0.2em] border transition-all duration-500 overflow-hidden ${
                          isSelected 
                            ? 'border-[#3a3a3a] text-[#f2ede4] shadow-[0_10px_20px_rgba(0,0,0,0.1)]' 
                            : 'border-[#3a3a3a]/10 opacity-40 hover:opacity-100'
                        }`}
                      >
                        <motion.div 
                          className="absolute inset-0 z-0"
                          initial={false}
                          animate={{ 
                            backgroundColor: isSelected 
                              ? (team.color === 'red' ? '#94442d' : '#3d4a5c') 
                              : 'transparent' 
                          }}
                        />
                        <span className="relative z-10 font-bold">{team.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* LISTADO DE CASTING */}
              <div className="flex-1 space-y-8 overflow-y-auto scrollbar-hide mb-8 pr-1">
                <AnimatePresence mode="popLayout">
                  {teams.map((team) => (
                    <div key={team.id} className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-1 h-4 ${team.color === 'red' ? 'bg-[#94442d]' : 'bg-[#3d4a5c]'}`} />
                        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] opacity-80">
                          {team.color === 'red' ? 'Unit A Personnel' : 'Unit B Personnel'}
                        </span>
                        <div className="flex-1 h-px bg-[#3a3a3a]/5" />
                      </div>

                      {team.players.length === 0 ? (
                        <div className="py-6 border border-dashed border-[#3a3a3a]/10 text-center">
                          <p className="text-[9px] font-mono opacity-20 uppercase tracking-[0.5em] italic">Waiting for talent enrollment...</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-1">
                          {team.players.map((player, i) => (
                            <motion.div 
                              key={player.id} 
                              layout 
                              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }}
                              className="flex items-center group py-3 px-4 hover:bg-white/50 transition-all border border-transparent hover:border-[#3a3a3a]/5"
                            >
                              <span className="font-mono text-[9px] opacity-20 mr-6">{(i + 1).toString().padStart(2, '0')}</span>
                              <span className="text-2xl font-black uppercase tracking-tighter group-hover:tracking-normal transition-all duration-300">
                                {player.name}
                              </span>
                              <div className="flex-1" />
                              <button 
                                onClick={() => removePlayerFromTeam(team.id, player.id)} 
                                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 text-[#3a3a3a]/40 hover:text-red-600 rounded-full transition-all"
                              >
                                <X size={18} strokeWidth={2} />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </AnimatePresence>
              </div>

              {/* BOTÓN ACTION */}
              {teams.reduce((sum, team) => sum + team.players.length, 0) >= 2 && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { startGame(); router.push('/play'); }}
                  className="mt-auto flex flex-col group overflow-hidden border border-[#3a3a3a] shadow-2xl"
                >
                  <div className="w-full h-3 bg-[#3a3a3a] flex gap-2 px-1 overflow-hidden">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="w-4 h-full bg-[#f2ede4] -skew-x- opacity-20 group-hover:translate-x-1 transition-transform duration-500" />
                    ))}
                  </div>
                  <div className="w-full bg-[#3a3a3a] text-[#f2ede4] py-6 px-8 flex justify-between items-center">
                    <div className="text-left">
                      <span className="block text-[9px] font-mono tracking-[0.5em] opacity-40 uppercase mb-0.5 font-bold italic">Final Approval</span>
                      <span className="text-2xl font-black uppercase tracking-[0.4em]">Action!</span>
                    </div>
                    <Play size={24} fill="currentColor" />
                  </div>
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style jsx global>{`
        .italic-outline { -webkit-text-stroke: 1.2px #3a3a3a; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}