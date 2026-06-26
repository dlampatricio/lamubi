'use client';

import { useTranslation } from '@/hooks/useTranslation';

export default function LanguageToggle() {
  const { lang, setLang, t } = useTranslation();

  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
      aria-label={t('toggleLang')}
      className="fixed top-4 right-16 z-50 h-9 px-3 flex items-center justify-center rounded-full bg-surface-secondary border border-border text-text-secondary hover:text-text-primary text-[11px] font-bold uppercase tracking-wider shadow-sm transition-all"
    >
      {t('toggleLang')}
    </button>
  );
}
