import React from 'react';
import { motion } from 'framer-motion';

export default function StaticPage({ title, subtitle, children }) {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="section-title mb-2">{title}</h1>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
          <div className="neon-track mt-4 w-40" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-8 space-y-6 text-white/70 leading-relaxed text-sm"
          style={{ border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {children}
        </motion.div>
        <p className="text-white/20 text-xs text-center mt-8 font-mono">
          A PROJECT BY AUREX-LABS — aurexlabs.netlify.app
        </p>
      </div>
    </div>
  );
}

export function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-white font-semibold font-display text-base mb-3">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
