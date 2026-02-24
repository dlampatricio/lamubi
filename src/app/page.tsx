"use client"

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6 overflow-hidden">
      
      <div className="w-full max-w-xs">
        {/* Sidebar Accent Header */}
        <div className="border-l-4 border-black pl-6 py-2 mb-16">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-1">
            Welcome to
          </p>
          <h1 className="text-5xl font-black text-gray-900 uppercase leading-none tracking-tighter">
            La Mubi
          </h1>
          <p className="text-[11px] font-bold text-gray-400 uppercase mt-2 tracking-widest">
            Charades Edition
          </p>
        </div>

        {/* Action Button */}
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => router.push('/lobby')}
            className="w-full bg-black text-white font-black py-5 px-8 rounded-2xl text-xl uppercase tracking-tight active:scale-95 transition-all"
          >
            Enter Lobby
          </button>
          
          <p className="text-[9px] text-gray-300 uppercase font-bold tracking-widest text-center mt-2">
            Local Multiplayer • No Account Needed
          </p>
        </div>
      </div>
    </main>
  );
}