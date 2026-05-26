import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Animated 404 */}
        <div className="relative mb-8">
          <p className="text-[10rem] font-bold font-display leading-none select-none" style={{ color: 'transparent', WebkitTextStroke: '2px rgba(0,82,255,0.3)' }}>
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[10rem] font-bold font-display leading-none" style={{ color: 'rgba(0,82,255,0.1)' }}>404</p>
          </div>
        </div>
        <h1 className="text-2xl font-bold font-display text-white mb-3">Page Not Found</h1>
        <p className="text-white/40 mb-8 max-w-sm">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
          <Home size={16} /> Go Home
        </Link>
      </motion.div>
    </div>
  );
}
