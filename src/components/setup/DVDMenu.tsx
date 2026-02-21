'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X } from 'lucide-react';

interface DVDMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DVDMenu = ({ isOpen, onClose }: DVDMenuProps) => {
  const menuItems = [
    { label: '01. MAIN MENU', href: '/' },
    { label: '02. CASTING (SETUP)', href: '/setup' },
    { label: '03. THE ARCHIVE', href: '/archive' },
    { label: '04. TECHNICAL SPECS', href: '/settings' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-200 bg-[#f2ede4] flex flex-col items-center justify-center"
        >
          {/* Grano extra para el menú */}
          <div className="absolute inset-0 opacity-[0.15] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
          
          <button 
            onClick={onClose}
            className="absolute top-12 right-12 text-[#3a3a3a] opacity-30 hover:opacity-100 transition-opacity uppercase font-mono text-xs tracking-widest flex items-center gap-2"
          >
            Close <X size={14} />
          </button>

          <nav className="relative z-10 flex flex-col gap-6 text-center">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  href={item.href}
                  onClick={onClose}
                  className="group relative inline-block"
                >
                  <span className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-[#3a3a3a] group-hover:italic transition-all">
                    {item.label}
                  </span>
                  {/* El "selector" de DVD clásico (la línea que aparece al hover) */}
                  <motion.div 
                    className="absolute -left-8 top-1/2 -translate-y-1/2 w-4 h-2px bg-[#3a3a3a] opacity-0 group-hover:opacity-100 transition-opacity"
                    layoutId="dvd-selector"
                  />
                </Link>
              </motion.div>
            ))}
          </nav>

          <footer className="absolute bottom-12 font-mono text-[10px] opacity-20 tracking-[0.5em] uppercase">
            © 2024 La Mubi Studios / All Rights Reserved
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};