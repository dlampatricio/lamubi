"use client"

import { useGameStore } from "@/hooks/useGameStore";

export default function ThemeWrapper({ children }: Readonly<{ children: React.ReactNode }>) {
  const { category } = useGameStore();

  const themeClass = category?.theme || "";

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${themeClass}`}>
      {children}
    </div>
  );
}