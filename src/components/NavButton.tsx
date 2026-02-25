"use client"

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface NavButtonProps {
  href: string;
  label: string;
  action?: () => void | Promise<void>; // Soporta funciones normales y async
  variant?: "primary" | "secondary";
  className?: string;
  disabled?: boolean;
}

export default function NavButton({ 
  href, 
  label, 
  action, 
  variant = "primary", 
  className = "",
  disabled = false
}: Readonly<NavButtonProps>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigation = async () => {
    setIsLoading(true);
    
    try {
      if (action) {
        // El 'await' es clave: si la función es async, espera a que termine
        // Si no es async, se ejecuta y sigue de inmediato.
        await action();
      }

      // Una vez terminada la acción (ej. cargar pelis), navegamos
      startTransition(() => {
        router.replace(href);
      });
    } catch (error) {
      console.error("Navigation action failed:", error);
      setIsLoading(false); // Si falla, permitimos reintentar
    }
  };

  const baseStyles = "w-full py-5 rounded-2xl font-black text-xl uppercase tracking-tight transition-all active:scale-95 text-center disabled:opacity-50 disabled:active:scale-100";
  
  const variants = {
    primary: "bg-black text-white hover:bg-gray-900 shadow-xl",
    secondary: "text-gray-300 font-bold text-[10px] tracking-[0.3em] hover:text-black bg-transparent"
  };

  return (
    <button
      onClick={handleNavigation}
      disabled={isLoading || isPending || disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {/* Mientras carga o la transición está pendiente, mostramos feedback */}
      {(isLoading || isPending) ? (
        <span className="animate-pulse">...</span>
      ) : (
        label
      )}
    </button>
  );
}