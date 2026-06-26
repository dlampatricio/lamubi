'use client';

import NavButton from '@/components/NavButton';
import { useTranslation } from '@/hooks/useTranslation';

const steps = [
  'howToPlayStep1',
  'howToPlayStep2',
  'howToPlayStep3',
  'howToPlayStep4',
  'howToPlayStep5',
] as const;

export default function HowToPlayPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-dvh bg-surface flex flex-col items-center justify-center p-6 md:p-12 animate-fade-in">
      <div className="w-full max-w-xs md:max-w-2xl">
        <div className="border-l-4 border-text-primary pl-6 md:pl-8 py-2 mb-10 md:mb-14">
          <p className="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-[0.3em] mb-1">
            {t('siteTitle')}
          </p>
          <h1 className="text-3xl md:text-5xl font-black text-text-primary uppercase leading-none tracking-tighter">
            {t('howToPlay')}
          </h1>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-x-10 md:gap-y-8 mb-10 md:mb-14">
          {steps.map((key, i) => (
            <li key={key} className="flex gap-4 md:gap-5">
              <span className="shrink-0 w-7 h-7 md:w-9 md:h-9 rounded-full bg-text-primary text-surface text-xs md:text-sm font-black flex items-center justify-center">
                {i + 1}
              </span>
              <p className="text-sm md:text-base font-medium text-text-secondary leading-relaxed pt-0.5 md:pt-1">
                {t(key)}
              </p>
            </li>
          ))}
        </ol>

        <div className="flex justify-center">
          <NavButton href="/" label={t('enter')} className="max-w-xs" />
        </div>
      </div>
    </div>
  );
}
