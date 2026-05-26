import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── AurexCart SVG Logo ────────────────────────────────────────────────────
const LogoSVG = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="16" fill="black" fillOpacity="0.6" />
    <polygon points="40,6 68,22 68,58 40,74 12,58 12,22" fill="none" stroke="url(#lg1)" strokeWidth="1.5" opacity="0.7" />
    <path d="M25 60 L40 20 L55 60" stroke="url(#lg2)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M30 47 L50 47" stroke="url(#lg3)" strokeWidth="3.5" strokeLinecap="round" />
    <circle cx="40" cy="18" r="3.5" fill="#00D1FF" />
    <defs>
      <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00D1FF" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#0052FF" stopOpacity="0.3" />
      </linearGradient>
      <linearGradient id="lg2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#00D1FF" />
        <stop offset="100%" stopColor="#0052FF" />
      </linearGradient>
      <linearGradient id="lg3" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#0052FF" />
        <stop offset="100%" stopColor="#00D1FF" />
      </linearGradient>
    </defs>
  </svg>
);

// ─── Glass Shards ──────────────────────────────────────────────────────────
const shards = [
  { id: 1, style: { top: '0%', left: '0%', width: '50%', height: '50%' }, clipPath: 'polygon(0 0, 100% 0, 70% 100%, 0 80%)' },
  { id: 2, style: { top: '0%', right: '0%', width: '50%', height: '50%' }, clipPath: 'polygon(30% 0, 100% 0, 100% 80%, 0 100%)' },
  { id: 3, style: { bottom: '0%', left: '0%', width: '50%', height: '50%' }, clipPath: 'polygon(0 20%, 70% 0, 100% 100%, 0 100%)' },
  { id: 4, style: { bottom: '0%', right: '0%', width: '50%', height: '50%' }, clipPath: 'polygon(30% 0, 100% 20%, 100% 100%, 0 100%)' },
  { id: 5, style: { top: '20%', left: '20%', width: '60%', height: '60%' }, clipPath: 'polygon(20% 0, 80% 0, 100% 50%, 80% 100%, 20% 100%, 0 50%)' },
];

export default function LoadingScreen({ onComplete }) {
  const [phase, setPhase] = useState('logo'); // logo → shatter → reveal → done

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('shatter'), 1800);
    const t2 = setTimeout(() => setPhase('reveal'), 2600);
    const t3 = setTimeout(() => { setPhase('done'); onComplete?.(); }, 3400);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ background: 'radial-gradient(ellipse at center, #001133 0%, #000000 100%)' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Background grid */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'linear-gradient(rgba(0,82,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,82,255,0.3) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          {/* Shutter panels */}
          {phase === 'shatter' && shards.map((shard, i) => (
            <motion.div
              key={shard.id}
              className="absolute"
              style={{
                ...shard.style,
                clipPath: shard.clipPath,
                background: 'linear-gradient(135deg, rgba(0,82,255,0.15) 0%, rgba(0,209,255,0.05) 100%)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(0,209,255,0.2)',
              }}
              initial={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }}
              animate={{
                opacity: 0,
                scale: 0.3,
                x: (i % 2 === 0 ? -1 : 1) * (80 + i * 30),
                y: (i < 2 ? -1 : 1) * (80 + i * 20),
                rotate: (i % 2 === 0 ? -1 : 1) * (20 + i * 10),
              }}
              transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: i * 0.05 }}
            />
          ))}

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{
                scale: phase === 'shatter' ? 1.3 : 1,
                opacity: phase === 'reveal' ? 0 : 1,
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <LogoSVG />
            </motion.div>

            {/* Brand name */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: phase === 'reveal' ? 0 : 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h1
                className="text-4xl font-bold font-display tracking-widest"
                style={{ color: '#00D1FF', textShadow: '0 0 20px rgba(0,209,255,0.8), 0 0 40px rgba(0,82,255,0.5)' }}
              >
                AUREX<span style={{ color: '#0052FF' }}>CART</span>
              </h1>
              <p className="text-white/40 text-sm font-body tracking-[0.3em] mt-1 uppercase">
                Multi-Vendor Marketplace
              </p>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 'reveal' ? 0 : 1 }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #0052FF, #00D1FF)' }}
                initial={{ width: '0%' }}
                animate={{ width: phase === 'logo' ? '60%' : phase === 'shatter' ? '90%' : '100%' }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </motion.div>

            {/* Powered by */}
            <motion.p
              className="text-white/20 text-xs font-mono tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 'reveal' ? 0 : 0.6 }}
              transition={{ delay: 0.5 }}
            >
              A PROJECT BY AUREX-LABS
            </motion.p>
          </div>

          {/* Corner decorations */}
          {['top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4'].map((pos, i) => (
            <motion.div
              key={i}
              className={`absolute ${pos} w-8 h-8`}
              style={{
                borderTop: i < 2 ? '2px solid rgba(0,209,255,0.4)' : 'none',
                borderBottom: i >= 2 ? '2px solid rgba(0,209,255,0.4)' : 'none',
                borderLeft: i % 2 === 0 ? '2px solid rgba(0,209,255,0.4)' : 'none',
                borderRight: i % 2 === 1 ? '2px solid rgba(0,209,255,0.4)' : 'none',
              }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}

          {/* Scan line */}
          <motion.div
            className="absolute left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #00D1FF, #0052FF, transparent)' }}
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
