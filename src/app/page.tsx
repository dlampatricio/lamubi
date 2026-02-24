"use client"

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  return (
    <main className="flex flex-col items-center justify-center h-screen p-6">
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">
          La MUBI
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Charades Edition
        </p>
      </div>

      <button 
        onClick={() => router.push('/lobby')}
        className="w-full max-w-xs bg-green-600 text-white font-bold py-4 rounded text-xl"
      >
        ENTER LOBBY
      </button>

      <footer className="absolute bottom-10 text-gray-500 text-sm">
        Single Phone Party Game
      </footer>
    </main>
  );
}