"use client"
import { useState } from "react";
import { useGameStore } from "@/hooks/useGameStore";
import NavButton from "@/components/NavButton";
import MakeYourOwn from "@/components/MakeYourOwn";

const CATEGORIES = [
  { id: null, type: 'popular', name: "Popular" },
  { id: '16', type: 'genre', name: "Animation" },          
  { id: 'top_rated', type: 'quality', name: "Top Rated" },
  { id: '10342', type: 'company', name: "Studio Ghibli" },
  { id: '1032', type: 'person', name: "Martin Scorsese" },
  { id: 'CU', type: 'country', name: "Cuba" },
];

export default function CategoryPage() {
  const { category, setCategory, movies, setMovies } = useGameStore();
  const [loading, setLoading] = useState(false);

  const handleSelectCategory = async (cat: any) => {
    setLoading(true);
    setCategory(cat);
    
    try {
      const params = new URLSearchParams();
      
      // MAPEO LÓGICO SEGÚN EL TIPO ELEGIDO
      if (cat.type === 'popular') {
        params.append('sort_by', 'popularity.desc');
        params.append('vote_count.gte', '1000'); // Asegura calidad
      } 
      else if (cat.type === 'quality') {
        params.append('sort_by', 'vote_average.desc');
        params.append('vote_count.gte', '5000'); // Solo clásicos reales
      }
      else if (cat.type === 'genre') {
        params.append('with_genres', cat.id);
      }
      else if (cat.type === 'country') {
        params.append('with_origin_country', cat.id);
      }
      else if (cat.type === 'person') {
        params.append('with_crew', cat.id);
      }
      else if (cat.type === 'company') {
        params.append('with_companies', cat.id);
      }

      const res = await fetch(`/api/movies?${params.toString()}`);
      const data = await res.json();
      
      if (res.ok) {
        setMovies(data);
      }
    } catch (error) {
      console.error("Fetch error", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-white p-6 flex flex-col items-center pb-40">
      {/* Header Editorial */}
      <div className="w-full max-w-4xl pt-20 pb-16 border-b border-gray-100 mb-12">
        <h1 className="text-6xl font-black text-black uppercase tracking-tighter leading-[0.85]">
          Select Your <br /> Universe.
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-20">
        <MakeYourOwn />
        
        {CATEGORIES.map((cat) => {
          const isSelected = category.name === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => handleSelectCategory(cat)}
              disabled={loading}
              className={`p-10 rounded-[2rem] border transition-all text-left flex flex-col justify-between h-48 ${
                isSelected 
                  ? "bg-black border-black text-white shadow-2xl scale-[0.98]" 
                  : "bg-white border-gray-100 text-black hover:border-gray-300 hover:scale-[1.02]"
              }`}
            >
              <span className={`text-[9px] font-black uppercase tracking-widest ${isSelected ? "opacity-40" : "text-gray-300"}`}>
                {loading && isSelected ? "Loading..." : "Collection"}
              </span>
              <span className="text-3xl font-black uppercase tracking-tighter leading-none">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Preview Section */}
      {movies.length > 0 && (
        <div className="w-full max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-baseline justify-between mb-8 border-b border-gray-100 pb-4 text-black">
            <h2 className="font-black uppercase tracking-tighter text-2xl">Deck Preview</h2>
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{category.name}</span>
               <span className="bg-black text-white text-[9px] px-3 py-1 rounded-full font-black">{movies.length} CARDS</span>
            </div>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-10 scrollbar-hide">
            {movies.map((m: any) => (
              <div key={m.id} className="flex-shrink-0 w-32 group transition-all duration-500">
                <div className="relative aspect-[2/3] overflow-hidden rounded-sm bg-gray-100 border border-gray-100">
                  <img 
                    src={`https://image.tmdb.org/t/p/w300${m.poster_path}`} 
                    className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700" 
                    alt="" 
                  />
                </div>
                <p className="mt-3 text-[10px] font-black uppercase leading-tight truncate">{m.title}</p>
                <p className="text-[8px] font-bold text-gray-400 uppercase">{m.year}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <NavButton href="/lobby" label="Continue to Lobby" className="bg-black text-white px-12 py-5" />
          </div>
        </div>
      )}
    </div>
  );
}