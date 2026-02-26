"use client";
import { useState } from "react";
import { useGameStore } from "@/hooks/useGameStore";
import Typewriter from "./Typewriter";

export default function MakeYourOwn() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState("");
  const { setCategory, setMovies } = useGameStore();

  const handleGenerate = async (promptOverride?: string) => {
    const prompt = promptOverride || input;
    if (!prompt.trim()) return;
    setLoading(true);
    setAiFeedback("");

    try {
      const aiRes = await fetch("/api/ai-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const aiData = await aiRes.json();
      setAiFeedback(aiData.interpretation);

      const params = new URLSearchParams();
      Object.entries(aiData).forEach(([key, value]) => {
        if (key !== "interpretation" && value) params.append(key, String(value));
      });
      params.append("custom", "true");

      const movieRes = await fetch(`/api/movies?${params.toString()}`);
      const movies = await movieRes.json();

      setMovies(movies);
      setCategory({ id: params.toString(), type: "custom", name: prompt, theme: "default" });
      if (!promptOverride) setInput("");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group p-8 bg-gray-50 rounded-[2rem] border border-gray-100 col-span-1 sm:col-span-2 transition-all">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
        <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">
          AI Search Engine
        </h3>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          placeholder="Type any movie idea (e.g. 70s Noir in NY)"
          className="flex-1 bg-transparent border-b-2 border-gray-200 py-3 text-lg font-medium outline-none focus:border-black transition-colors placeholder:text-gray-300"
        />
        <button
          onClick={() => handleGenerate()}
          disabled={loading}
          className="bg-black text-white px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-widest disabled:bg-gray-200 transition-all hover:scale-[1.02] active:scale-95"
        >
          {loading ? "SEARCHING" : "GENERATE"}
        </button>
      </div>

      <div className="mt-6 h-8 flex items-center">
        {aiFeedback && (
          <p className="text-[11px] text-gray-500 font-medium italic overflow-hidden whitespace-nowrap">
            <span className="text-black not-italic font-black mr-2 uppercase text-[9px] opacity-30">AI Result:</span>
            <Typewriter text={aiFeedback} speed={20} />
          </p>
        )}
      </div>
    </div>
  );
}