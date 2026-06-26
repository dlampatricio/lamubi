'use client';

import { useTranslation } from '@/hooks/useTranslation';

export default function LanguageToggle() {
  const { lang, setLang, t } = useTranslation();

  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
      aria-label={t('toggleLang')}
      className="fixed top-4 right-16 z-50 h-9 w-9 flex items-center justify-center rounded-full bg-surface-secondary border border-border text-text-secondary hover:text-text-primary shadow-sm transition-all"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    </button>
  );
}
