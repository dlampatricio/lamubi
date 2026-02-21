'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  const router = useRouter()

  return (
    <div 
      className="min-h-screen bg-[#f2ede4] flex flex-col items-center justify-center p-8 overflow-hidden cursor-pointer"
      onClick={() => router.push('setup')}
    >
      
      {/* Líneas sutiles de encuadre cinematográfico */}
      <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent to-black/5" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center"
      >
        <span className="text-xs tracking-[0.5em] text-[#3a3a3a]/40 mb-4 block font-mono select-none">
          A PRIVATE SCREENING BY
        </span>
        
        <h1 className="text-[12vw] md:text-[8rem] font-black text-[#3a3a3a] leading-none tracking-tighter mb-2 select-none">
          LA MUBI
        </h1>
        
        <div className="h-1px w-12 bg-[#3a3a3a] mx-auto my-8" />
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-[#3a3a3a]/60 text-sm tracking-[0.3em] font-light uppercase select-none"
        >
          Cinema Mimic Experience
        </motion.p>
      </motion.div>

      {/* Indicador inferior minimalista */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ delay: 2, duration: 3, repeat: Infinity }}
        className="absolute bottom-12 z-10 text-[#3a3a3a]/30 text-[10px] tracking-[0.4em] uppercase font-mono select-none"
      >
        Tap anywhere to play
      </motion.div>

      {/* Viñeta Cinematográfica: Gradiente radial para oscurecer esquinas */}
      <div 
        className="absolute inset-0 pointer-events-none z-20" 
        style={{
          background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.12) 100%)'
        }} 
      />
    </div>
  );
}