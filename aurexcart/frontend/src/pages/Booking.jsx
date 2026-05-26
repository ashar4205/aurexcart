import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore, useAuthStore, useUIStore } from '../store';
import { formatPrice } from '../lib/api';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function Booking() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const currency = useUIStore(s => s.currency);
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1=cart, 2=details, 3=confirm
  const [shippingForm, setShippingForm] = useState({ fullName: user?.name || '', address: '', city: '', country: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const hasDigitalOnly = items.every(i => i.isDigital);

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) { navigate('/login', { state: { from: '/booking' } }); return; }
    setLoading(true);
    try {
      const data = await api.post('/orders', {
        items: items.map(i => ({ productId: i._id, quantity: i.quantity })),
        shippingAddress: hasDigitalOnly ? null : shippingForm,
        currency,
      });
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/dashboard');
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(0,82,255,0.1)', border: '1px solid rgba(0,82,255,0.2)' }}>
          <ShoppingCart size={36} className="text-white/20" />
        </div>
        <h2 className="text-2xl font-bold font-display text-white mb-2">Your cart is empty</h2>
        <p className="text-white/40 mb-8">Add some products to get started.</p>
        <Link to="/products" className="btn-primary px-8 py-3">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="section-title mb-2">Your Booking</h1>
          <p className="section-subtitle mb-8">{items.length} item{items.length > 1 ? 's' : ''} in your order</p>
          <div className="neon-track mb-10 w-40" />
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-10">
          {['Cart Review', 'Your Details', 'Confirm Order'].map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => i < step - 1 && setStep(i + 1)}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: step >= i + 1 ? 'rgba(0,82,255,0.3)' : 'rgba(255,255,255,0.06)', border: `1px solid ${step >= i + 1 ? 'rgba(0,209,255,0.5)' : 'rgba(255,255,255,0.1)'}`, color: step >= i + 1 ? '#00D1FF' : 'rgba(255,255,255,0.3)' }}>
                  {i + 1}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${step >= i + 1 ? 'text-white' : 'text-white/30'}`}>{label}</span>
              </div>
              {i < 2 && <div className="flex-1 h-px" style={{ background: step > i + 1 ? 'rgba(0,209,255,0.4)' : 'rgba(255,255,255,0.06)' }} />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-4">
            {step === 1 && (
              <>
                {items.map(item => {
                  const thumb = item.thumbnail?.url || item.images?.[0]?.url;
                  return (
                    <motion.div key={item._id} layout className="glass-card p-4 flex gap-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
                        {thumb && <img src={thumb} alt={item.name} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white font-display truncate">{item.name}</p>
                        {item.vendorName && <p className="text-xs text-white/40 mt-0.5">{item.vendorName}</p>}
                        {item.isDigital && (
                          <span className="inline-flex items-center gap-1 text-xs mt-1 px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,209,255,0.1)', color: '#00D1FF', border: '1px solid rgba(0,209,255,0.2)' }}>
                            <Package size={10} /> Instant Download
                          </span>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/8 transition-colors" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                              <Minus size={12} className="text-white/60" />
                            </button>
                            <span className="text-white text-sm w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/8 transition-colors" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                              <Plus size={12} className="text-white/60" />
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold font-display" style={{ color: '#00D1FF' }}>{formatPrice(item.price * item.quantity, currency)}</span>
                            <button onClick={() => removeItem(item._id)} className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors">
                              <Trash2 size={14} className="text-red-400/60" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                <button onClick={() => setStep(2)} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
                  Continue to Details <ArrowRight size={16} />
                </button>
              </>
            )}

            {step === 2 && (
              <div className="glass-card p-6 space-y-4">
                <h3 className="font-semibold font-display text-white">Your Details</h3>
                {hasDigitalOnly ? (
                  <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'rgba(0,209,255,0.08)', border: '1px solid rgba(0,209,255,0.2)' }}>
                    <AlertCircle size={18} className="text-blue-neon mt-0.5 flex-shrink-0" />
                    <p className="text-white/70 text-sm">All items are digital — no shipping address required. Download links will be sent to your email after order confirmation.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[['fullName', 'Full Name', 'text'], ['address', 'Address', 'text'], ['city', 'City', 'text'], ['country', 'Country', 'text'], ['phone', 'Phone Number', 'tel']].map(([field, label, type]) => (
                      <div key={field}>
                        <label className="text-xs text-white/40 block mb-1.5 ml-1">{label}</label>
                        <input type={type} required className="input-glass" placeholder={label} value={shippingForm[field]} onChange={e => setShippingForm(f => ({ ...f, [field]: e.target.value }))} />
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={() => setStep(3)} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2">
                  Review Order <ArrowRight size={16} />
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="glass-card p-6 space-y-4">
                <h3 className="font-semibold font-display text-white">Confirm Your Order</h3>
                <div className="space-y-2">
                  {items.map(i => (
                    <div key={i._id} className="flex justify-between items-center py-2 border-b border-white/6 text-sm">
                      <span className="text-white/70">{i.name} × {i.quantity}</span>
                      <span className="text-white font-medium">{formatPrice(i.price * i.quantity, currency)}</span>
                    </div>
                  ))}
                </div>
                {!isAuthenticated && (
                  <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(255,165,0,0.08)', border: '1px solid rgba(255,165,0,0.2)', color: 'rgba(255,165,0,0.9)' }}>
                    You need to be signed in to place an order. <Link to="/login" state={{ from: '/booking' }} className="underline">Sign in now</Link>
                  </div>
                )}
                <button onClick={handlePlaceOrder} disabled={loading || !isAuthenticated} className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-base font-semibold">
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="glass-card p-6 h-fit sticky top-24">
            <h3 className="font-semibold font-display text-white mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Subtotal ({items.length} items)</span>
                <span className="text-white">{formatPrice(subtotal, currency)}</span>
              </div>
              {hasDigitalOnly && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
              )}
            </div>
            <div className="border-t border-white/8 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-white">Total</span>
                <span className="text-xl font-bold font-display" style={{ color: '#00D1FF' }}>{formatPrice(subtotal, currency)}</span>
              </div>
            </div>
            <div className="neon-track mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
