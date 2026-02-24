"use client"

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  return (
    <main className="flex flex-col items-center justify-center h-screen text-white p-6">
      
      {/* Título - Estilo minimalista alineado con Lobby */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-blacktracking-tighter">
          La MUBI
        </h1>
        <p className="text-slate-400 text-xs uppercase tracking-[0.2em] mt-2">
          Charades Edition
        </p>
      </div>

      {/* Botón Principal - Sin efectos raros, sólido como los otros */}
      <button 
        onClick={() => router.push('/lobby')}
        className="w-full max-w-xs bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl text-xl transition-colors shadow-lg"
      >
        ENTER LOBBY
      </button>

      {/* Footer minimalista */}
      <footer className="absolute bottom-10 text-slate-500 text-[10px] uppercase tracking-widest font-medium">
        Single Phone Party Game
      </footer>
    </main>
  );
}