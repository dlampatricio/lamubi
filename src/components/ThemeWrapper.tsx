"use client"



import { useGameStore } from "@/hooks/useGameStore";




export default function ThemeWrapper({ children }: Readonly<{ children: React.ReactNode }>) {

  const { category } = useGameStore();

  return (

    <div className={`min-h-screen transition-colors duration-1000 relative ${category?.theme || ''}`}>

      <div className="relative z-10">

        {children}

      </div>

    </div>

  );

}