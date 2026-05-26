import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Store, User, Settings, Package, Star } from 'lucide-react';
import { useAuthStore, useUIStore } from '../store';
import { CURRENCY_RATES } from '../lib/api';
import api from '../lib/api';

export default function Dashboard() {
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const { theme, setTheme, currency, setCurrency } = useUIStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingPrefs, setSavingPrefs] = useState(false);

  if (!isAuthenticated) return <Navigate to="/login" state={{ from: '/dashboard' }} />;
  if (user?.role === 'admin') return <Navigate to="/admin" />;

  useEffect(() => {
    api.get('/orders/my-orders')
      .then(d => setOrders(d.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const savePreferences = async () => {
    setSavingPrefs(true);
    try {
      await api.patch('/auth/preferences', { currency, theme });
      updateUser({ currency, theme });
    } catch (_) {}
    finally { setSavingPrefs(false); }
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0" style={{ background: 'rgba(0,82,255,0.2)', border: '1px solid rgba(0,82,255,0.3)' }}>
              {user?.avatar
                ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                : <User size={20} className="text-blue-neon m-2.5" />}
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display text-white">{user?.name}</h1>
              <p className="text-white/40 text-sm">{user?.email}</p>
            </div>
          </div>
          <div className="neon-track mt-4 w-40" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: ShoppingBag, label: 'Total Orders', value: user?.totalOrders || 0 },
            { icon: Package, label: 'Wishlist Items', value: 0 },
            { icon: Star, label: 'Reviews Given', value: 0 },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="glass-card p-5">
              <Icon size={18} className="text-white/40 mb-2" />
              <p className="text-2xl font-bold font-display text-white">{value}</p>
              <p className="text-white/40 text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* CTA if no store */}
        {!user?.vendorStore && (
          <div className="glass-card p-6 mb-6 flex items-center justify-between gap-4" style={{ border: '1px solid rgba(0,209,255,0.12)' }}>
            <div>
              <p className="font-semibold text-white font-display">Want to sell on AurexCart?</p>
              <p className="text-white/40 text-sm mt-1">Open your free store and reach thousands of buyers.</p>
            </div>
            <Link to="/create-store" className="btn-primary flex items-center gap-2 text-sm py-2.5 px-5 whitespace-nowrap">
              <Store size={15} /> Open Store
            </Link>
          </div>
        )}

        {user?.vendorStore && (
          <Link to="/vendor-dashboard" className="glass-card p-5 mb-6 flex items-center justify-between gap-4 hover:border-blue-neon/30 transition-all" style={{ border: '1px solid rgba(0,82,255,0.15)' }}>
            <div className="flex items-center gap-3">
              <Store size={18} style={{ color: '#00D1FF' }} />
              <div>
                <p className="text-white font-medium text-sm">Manage Your Store</p>
                <p className="text-white/40 text-xs">Products, orders, and settings</p>
              </div>
            </div>
            <Settings size={16} className="text-white/30" />
          </Link>
        )}

        {/* Preferences */}
        <div className="glass-card p-6 mb-6">
          <h3 className="font-semibold font-display text-white mb-4">Preferences</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-white/40 block mb-1.5 ml-1">Currency</label>
              <select value={currency} onChange={e => setCurrency(e.target.value)} className="input-glass">
                {Object.keys(CURRENCY_RATES).map(c => <option key={c} value={c} style={{ background: '#0a0a0a' }}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 block mb-1.5 ml-1">Theme</label>
              <select value={theme} onChange={e => setTheme(e.target.value)} className="input-glass">
                {['dark','light','gradient-blue','gradient-purple'].map(t => <option key={t} value={t} style={{ background: '#0a0a0a' }}>{t}</option>)}
              </select>
            </div>
          </div>
          <button onClick={savePreferences} disabled={savingPrefs} className="btn-primary text-sm py-2.5 px-6">
            {savingPrefs ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>

        {/* Orders */}
        <div className="glass-card overflow-hidden">
          <div className="p-5 border-b border-white/8">
            <h3 className="font-semibold font-display text-white">My Orders</h3>
          </div>
          {loading ? (
            <div className="p-8 flex justify-center"><div className="w-6 h-6 rounded-full border-2 border-blue-royal border-t-blue-neon animate-spin" /></div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center">
              <ShoppingBag size={32} className="text-white/15 mx-auto mb-3" />
              <p className="text-white/30 text-sm">No orders yet. <Link to="/products" style={{ color: '#00D1FF' }}>Start shopping</Link></p>
            </div>
          ) : (
            <div className="divide-y divide-white/6">
              {orders.map(order => (
                <div key={order._id} className="p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-white font-mono text-xs">{order.orderNumber}</p>
                    <p className="text-white/40 text-xs mt-0.5">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</p>
                  </div>
                  <span className="font-bold text-sm" style={{ color: '#00D1FF' }}>${order.totalAmount?.toFixed(2)}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs capitalize" style={{ background: 'rgba(0,82,255,0.12)', color: '#00AAFF' }}>{order.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
