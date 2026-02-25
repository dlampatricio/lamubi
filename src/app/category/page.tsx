"use client"

import { useGameStore } from "@/hooks/useGameStore";
import { CategoryConfig } from "@/types/game";
import NavButton from "@/components/NavButton";

const CATEGORIES: CategoryConfig[] = [
  { id: null, type: 'top_rated', name: "Pop Culture", theme: 'default' },
  { id: '3', type: 'company', name: "Pixar", theme: 'default' },
  { id: '2', type: 'company', name: "Disney", theme: 'default' },
  { id: '10342', type: 'company', name: "Studio Ghibli", theme: 'theme-ghibli' },
  { id: '420', type: 'company', name: "Marvel Studios", theme: 'default' },
  { id: '521', type: 'company', name: "DreamWorks", theme: 'default' },
  { id: '180547', type: 'keyword', name: "Star Wars Saga", theme: 'default' },
];

export default function CategoryPage() {
  const { category, setCategory } = useGameStore();

  return (
    <div className="min-h-screen bg-white p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl text-center mt-12 mb-12">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-2">
          Step 01
        </p>
        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">
          Choose a Universe
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl mb-12">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id || 'all'}
            onClick={() => setCategory(cat)}
            className={`p-6 rounded-2xl border-2 text-left transition-all active:scale-[0.98] ${
              category.id === cat.id
                ? "border-black bg-black text-white"
                : "border-gray-100 bg-gray-50 text-gray-900 hover:border-gray-200"
            }`}
          >
            <span className="text-[10px] font-black uppercase tracking-widest block opacity-50 mb-1">
              Category
            </span>
            <span className="text-xl font-black uppercase">{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="w-full max-w-xs">
        <NavButton href="/lobby" label="Continue" />
      </div>
    </div>
  );
}