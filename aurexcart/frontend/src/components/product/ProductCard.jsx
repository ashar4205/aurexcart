import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Share2, Star, Eye, Package } from 'lucide-react';
import { useCartStore, useUIStore } from '../../store';
import { formatPrice } from '../../lib/api';
import ShareModal from './ShareModal';
import toast from 'react-hot-toast';

// ─── Glass Shard configs for break animation ───────────────────────────────
const SHARDS = [
  { id: 1, clip: 'polygon(0 0, 55% 0, 35% 45%, 0 60%)',        dx: -80,  dy: 120, dr: -25 },
  { id: 2, clip: 'polygon(55% 0, 100% 0, 100% 50%, 40% 40%)',  dx: 90,   dy: 100, dr: 30  },
  { id: 3, clip: 'polygon(0 60%, 35% 45%, 50% 100%, 0 100%)',  dx: -70,  dy: 140, dr: -20 },
  { id: 4, clip: 'polygon(40% 40%, 100% 50%, 100% 100%, 50% 100%)', dx: 85, dy: 130, dr: 20 },
  { id: 5, clip: 'polygon(35% 45%, 55% 0, 40% 40%, 50% 100%, 0 100%, 0 60%)', dx: -10, dy: 160, dr: -5 },
];

export default function ProductCard({ product, onClick }) {
  const [broken, setBroken] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const hoverTimeout = useRef(null);
  const addItem = useCartStore(s => s.addItem);
  const openCart = useCartStore(s => s.openCart);
  const currency = useUIStore(s => s.currency);

  const handleMouseEnter = () => {
    clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => setBroken(true), 80);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => setBroken(false), 50);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem(product);
    openCart();
    toast.success(`${product.name} added to cart`, {
      style: { background: '#0a0a0a', color: '#fff', border: '1px solid rgba(0,209,255,0.3)' },
      iconTheme: { primary: '#00D1FF', secondary: '#000' },
    });
  };

  const thumbnail = product.thumbnail?.url || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400';
  const price = formatPrice(product.price, currency);
  const comparePrice = product.comparePrice > 0 ? formatPrice(product.comparePrice, currency) : null;

  return (
    <>
      <div
        className="relative group cursor-pointer select-none"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => onClick?.(product)}
      >
        {/* ─── Card Container ─────────────────────────────────────────── */}
        <motion.div
          className="relative rounded-2xl overflow-visible"
          animate={{ y: broken ? -6 : 0, scale: broken ? 1.02 : 1 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ perspective: '1000px' }}
        >
          {/* ─── Image Area with Glass Break ────────────────────────── */}
          <div className="relative rounded-t-2xl overflow-hidden" style={{ height: '220px' }}>
            {/* Base image (always visible, dims during break) */}
            <motion.img
              src={thumbnail}
              alt={product.name}
              className="w-full h-full object-cover"
              animate={{ opacity: broken ? 0.15 : 1 }}
              transition={{ duration: 0.2 }}
              loading="lazy"
            />

            {/* ─── Shards Overlay ─────────────────────────────────── */}
            <AnimatePresence>
              {broken && SHARDS.map((shard) => (
                <motion.div
                  key={shard.id}
                  className="absolute inset-0"
                  style={{
                    clipPath: shard.clip,
                    backgroundImage: `url(${thumbnail})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    '--dx': `${shard.dx}px`,
                    '--dy': `${shard.dy}px`,
                    '--dr': `${shard.dr}deg`,
                  }}
                  initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                  animate={{ x: shard.dx, y: shard.dy, rotate: shard.dr, opacity: 0 }}
                  exit={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                  transition={{
                    exit: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                    default: { duration: 0.4, ease: [0.76, 0, 0.24, 1] },
                  }}
                >
                  {/* Glass shine on shard */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)',
                      border: '1px solid rgba(0,209,255,0.3)',
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2 z-10">
              {product.isFeatured && (
                <span className="px-2 py-0.5 text-xs font-medium rounded-full"
                  style={{ background: 'rgba(0,209,255,0.2)', border: '1px solid rgba(0,209,255,0.4)', color: '#00D1FF' }}>
                  Featured
                </span>
              )}
              {product.isAurexLabsProduct && (
                <span className="px-2 py-0.5 text-xs font-medium rounded-full"
                  style={{ background: 'rgba(0,82,255,0.3)', border: '1px solid rgba(0,82,255,0.5)', color: '#fff' }}>
                  Aurex Labs
                </span>
              )}
              {product.isDigital && (
                <span className="px-2 py-0.5 text-xs font-medium rounded-full"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' }}>
                  Digital
                </span>
              )}
            </div>

            {/* Share button */}
            <button
              className="absolute top-3 right-3 z-10 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
              onClick={(e) => { e.stopPropagation(); setShowShare(true); }}
            >
              <Share2 size={14} className="text-white" />
            </button>

            {/* Hover gradient overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)' }}
              animate={{ opacity: broken ? 0.5 : 1 }}
            />
          </div>

          {/* ─── Card Body ──────────────────────────────────────────── */}
          <div
            className="p-4 rounded-b-2xl"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderTop: 'none',
            }}
          >
            {/* Vendor name */}
            {product.vendorName && (
              <p className="text-xs text-white/40 font-mono mb-1 tracking-wide">{product.vendorName}</p>
            )}

            {/* Product name */}
            <h3 className="font-semibold font-display text-white text-sm leading-snug mb-2 line-clamp-2">
              {product.name}
            </h3>

            {/* Rating */}
            {product.reviewCount > 0 && (
              <div className="flex items-center gap-1 mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={10} className={s <= Math.round(product.averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'} />
                  ))}
                </div>
                <span className="text-xs text-white/40">({product.reviewCount})</span>
              </div>
            )}

            {/* Price + CTA row */}
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-lg font-bold font-display" style={{ color: '#00D1FF' }}>
                  {price}
                </span>
                {comparePrice && (
                  <span className="ml-2 text-xs text-white/30 line-through">{comparePrice}</span>
                )}
              </div>

              <button
                className="btn-order text-xs"
                onClick={handleAddToCart}
              >
                Order Now
              </button>
            </div>

            {/* Meta info */}
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5">
              <div className="flex items-center gap-1 text-white/30 text-xs">
                <Eye size={11} />
                <span>{product.views || 0}</span>
              </div>
              <div className="flex items-center gap-1 text-white/30 text-xs">
                <Package size={11} />
                <span>{product.totalOrders || 0} orders</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Neon Track ─────────────────────────────────────────────── */}
        <div className="neon-track mt-1 mx-2 rounded-full" />
      </div>

      {/* Share Modal */}
      {showShare && (
        <ShareModal product={product} onClose={() => setShowShare(false)} />
      )}
    </>
  );
}
