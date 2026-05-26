import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore, useUIStore } from '../../store';
import { formatPrice } from '../../lib/api';

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart } = useCartStore();
  const currency = useUIStore(s => s.currency);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Sidebar */}
          <motion.aside
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col"
            style={{ background: 'rgba(0,0,0,0.98)', backdropFilter: 'blur(24px)', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/8 flex-shrink-0">
              <div className="flex items-center gap-3">
                <ShoppingCart size={20} style={{ color: '#00D1FF' }} />
                <h2 className="font-semibold font-display text-white">Your Cart</h2>
                {items.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: 'rgba(0,82,255,0.2)', color: '#00D1FF', border: '1px solid rgba(0,82,255,0.3)' }}>
                    {items.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button onClick={clearCart} className="text-xs text-white/30 hover:text-red-400 transition-colors px-2 py-1">
                    Clear all
                  </button>
                )}
                <button onClick={closeCart} className="p-2 rounded-xl hover:bg-white/8 transition-colors">
                  <X size={18} className="text-white/60" />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,82,255,0.1)', border: '1px solid rgba(0,82,255,0.2)' }}>
                    <ShoppingCart size={32} className="text-white/20" />
                  </div>
                  <div>
                    <p className="text-white/50 font-medium">Your cart is empty</p>
                    <p className="text-white/25 text-sm mt-1">Browse products and add them here</p>
                  </div>
                  <button onClick={closeCart} className="btn-primary text-sm px-6 py-2.5">
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => {
                  const thumb = item.thumbnail?.url || item.images?.[0]?.url;
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-3 p-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      {/* Image */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                        {thumb && <img src={thumb} alt={item.name} className="w-full h-full object-cover" />}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium font-display truncate">{item.name}</p>
                        {item.vendorName && <p className="text-white/40 text-xs">{item.vendorName}</p>}
                        <p className="font-bold text-sm mt-1" style={{ color: '#00D1FF' }}>
                          {formatPrice(item.price, currency)}
                        </p>

                        {/* Qty controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="w-6 h-6 rounded-md flex items-center justify-center transition-colors hover:bg-white/10"
                            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                          >
                            <Minus size={12} className="text-white/60" />
                          </button>
                          <span className="text-white text-sm w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="w-6 h-6 rounded-md flex items-center justify-center transition-colors hover:bg-white/10"
                            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                          >
                            <Plus size={12} className="text-white/60" />
                          </button>

                          <button
                            onClick={() => removeItem(item._id)}
                            className="ml-auto p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 size={13} className="text-red-400/60" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-white/8 space-y-4 flex-shrink-0">
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Subtotal</span>
                  <span className="font-bold font-display text-lg" style={{ color: '#00D1FF' }}>
                    {formatPrice(subtotal, currency)}
                  </span>
                </div>
                <p className="text-white/25 text-xs">Shipping & taxes calculated at checkout</p>
                <Link
                  to="/booking"
                  onClick={closeCart}
                  className="btn-primary flex items-center justify-center gap-2 w-full py-3 text-sm"
                >
                  Proceed to Booking
                  <ArrowRight size={16} />
                </Link>
                <button onClick={closeCart} className="btn-glass w-full text-sm py-2.5">
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
