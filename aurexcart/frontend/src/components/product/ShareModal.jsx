import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

// ─── Platform SVG Icons ────────────────────────────────────────────────────
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const platforms = [
  {
    name: 'Instagram',
    icon: InstagramIcon,
    color: '#E1306C',
    bg: 'rgba(225,48,108,0.12)',
    border: 'rgba(225,48,108,0.3)',
    getUrl: (url, name) => `https://www.instagram.com/`,
    key: 'instagram',
  },
  {
    name: 'Facebook',
    icon: FacebookIcon,
    color: '#1877F2',
    bg: 'rgba(24,119,242,0.12)',
    border: 'rgba(24,119,242,0.3)',
    getUrl: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    key: 'facebook',
  },
  {
    name: 'TikTok',
    icon: TikTokIcon,
    color: '#69C9D0',
    bg: 'rgba(105,201,208,0.12)',
    border: 'rgba(105,201,208,0.3)',
    getUrl: (url) => `https://www.tiktok.com/`,
    key: 'tiktok',
  },
  {
    name: 'LinkedIn',
    icon: LinkedInIcon,
    color: '#0A66C2',
    bg: 'rgba(10,102,194,0.12)',
    border: 'rgba(10,102,194,0.3)',
    getUrl: (url, name) => `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(name)}`,
    key: 'linkedin',
  },
];

export default function ShareModal({ product, onClose }) {
  const [copied, setCopied] = useState(false);
  const productUrl = `${window.location.origin}/product/${product.slug || product._id}`;

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleShare = async (platform) => {
    await api.post(`/products/${product._id}/share`, { platform: platform.key }).catch(() => {});
    const url = platform.getUrl(productUrl, product.name);
    window.open(url, '_blank', 'width=600,height=500');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(productUrl);
    setCopied(true);
    toast.success('Link copied!', { style: { background: '#0a0a0a', color: '#fff', border: '1px solid rgba(0,209,255,0.3)' } });
    setTimeout(() => setCopied(false), 2000);
  };

  const thumbnail = product.thumbnail?.url || product.images?.[0]?.url;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        <motion.div
          className="relative glass rounded-2xl p-6 w-full max-w-sm z-10"
          style={{ border: '1px solid rgba(0,209,255,0.2)' }}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <X size={16} className="text-white/60" />
          </button>

          {/* Product preview */}
          <div className="flex gap-3 mb-6 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {thumbnail && (
              <img src={thumbnail} alt={product.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-white font-medium text-sm truncate font-display">{product.name}</p>
              <p className="text-white/40 text-xs mt-0.5 truncate">{productUrl}</p>
            </div>
          </div>

          <h3 className="text-white font-semibold font-display mb-4 text-sm">Share on Social Media</h3>

          {/* Platform buttons */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              return (
                <motion.button
                  key={platform.name}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleShare(platform)}
                  className="flex items-center gap-2.5 p-3 rounded-xl transition-all duration-200 text-sm font-medium"
                  style={{ background: platform.bg, border: `1px solid ${platform.border}`, color: platform.color }}
                >
                  <Icon />
                  {platform.name}
                </motion.button>
              );
            })}
          </div>

          {/* Copy link */}
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium text-white/70 transition-all duration-200 hover:text-white"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
