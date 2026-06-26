'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { motion } from 'framer-motion';

interface LanguageToggleProps {
  className?: string;
}

export default function LanguageToggle({ className = '' }: LanguageToggleProps) {
  const { lang, setLang, t } = useTranslation();

  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
      aria-label={t('toggleLang')}
      className={`h-9 w-9 flex items-center justify-center rounded-full bg-surface-secondary border border-border text-text-secondary hover:text-text-primary shadow-sm transition-all overflow-hidden ${className}`}
    >
      <motion.div
        key={lang}
        initial={{ rotate: -180, scale: 0 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      </motion.div>
    </button>
  );
}
