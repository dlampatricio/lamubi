'use client';

import NavButton from '@/components/NavButton';
import { useTranslation } from '@/hooks/useTranslation';

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="min-h-dvh bg-surface flex flex-col items-center justify-center p-6">
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
          <NavButton href="/how-to-play" label={t('howToPlay')} variant="secondary" className="mt-6" />
        </div>
      </div>
    </main>
  );
}
