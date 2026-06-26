'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

interface NavButtonProps {
  href: string;
  label: string;
  action?: () => void | Promise<void>;
  variant?: 'primary' | 'secondary';
  className?: string;
  disabled?: boolean;
}

export default function NavButton({
  href,
  label,
  action,
  variant = 'primary',
  className = '',
  disabled = false,
}: Readonly<NavButtonProps>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigation = async () => {
    setIsLoading(true);

    try {
      if (action) {
        await action();
      }

      startTransition(() => {
        router.replace(href);
      });
    } catch (error) {
      console.error('Navigation action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const baseStyles =
    'w-full py-5 rounded-2xl font-black text-xl uppercase tracking-tight transition-all active:scale-95 text-center disabled:opacity-50 disabled:active:scale-100';

  const variants = {
    primary: 'bg-black text-white hover:bg-gray-900 shadow-xl',
    secondary:
      'text-gray-300 font-bold text-[10px] tracking-[0.3em] hover:text-black bg-transparent',
  };

  return (
    <button
      onClick={handleNavigation}
      disabled={isLoading || isPending || disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {label}
    </button>
  );
}
