'use client';

import LanguageToggle from '@/components/LanguageToggle';
import NavButton from '@/components/NavButton';
import ThemeToggle from '@/components/ThemeToggle';
import { useTranslation } from '@/hooks/useTranslation';

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="min-h-dvh bg-surface flex flex-col items-center justify-center p-6 relative">
      <div className="absolute top-6 right-6 flex items-center gap-2">
        <ThemeToggle />
        <LanguageToggle />
      </div>

      <div className="w-full max-w-xs">
        <div className="border-l-4 border-text-primary pl-6 py-2 mb-16">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em] mb-1">
            {t('welcomeTo')}
          </p>
          <h1 className="text-5xl font-black text-text-primary uppercase leading-none tracking-tighter">
            {t('siteTitle')}
          </h1>
        </div>

        <div className="flex flex-col gap-4">
          <NavButton href="/lobby" label={t('enter')} />
          <p className="text-[9px] text-text-muted uppercase font-bold tracking-widest text-center mt-2">
            {t('localMultiplayer')}
          </p>
        </div>
      </div>

      <p className="absolute bottom-6 text-[9px] text-text-muted font-bold uppercase tracking-widest">
        Design &amp; Dev by{' '}
        <a
          href="https://dlampatricio.github.io"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-text-primary transition-colors"
        >
          David Lam
        </a>
      </p>
    </main>
  );
}
