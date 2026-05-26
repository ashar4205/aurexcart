import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ShoppingBag, Eye, Star, Plus, Edit3, Trash2, ToggleLeft, ToggleRight, Store, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../store';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function VendorDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: 0, category: 'digital-products', stock: 0, isDigital: false });

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!['vendor', 'admin'].includes(user?.role) && !user?.vendorStore) return <Navigate to="/create-store" />;

  useEffect(() => {
    api.get('/vendors/my-store/dashboard')
      .then(d => { setVendor(d.vendor); setProducts(d.products || []); setOrders(d.recentOrders || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const data = await api.post('/products', newProduct);
      setProducts(p => [data.product, ...p]);
      setShowAddProduct(false);
      setNewProduct({ name: '', description: '', price: 0, category: 'digital-products', stock: 0, isDigital: false });
      toast.success('Product added!');
    } catch (err) { toast.error(err.message); }
  };

  const toggleProductStatus = async (product) => {
    const newStatus = product.status === 'active' ? 'paused' : 'active';
    await api.put(`/products/${product._id}`, { status: newStatus });
    setProducts(p => p.map(pr => pr._id === product._id ? { ...pr, status: newStatus } : pr));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-blue-royal border-t-blue-neon animate-spin" /></div>;

  const stats = vendor?.analytics || {};

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="section-title mb-1">{vendor?.storeName || 'My Store'}</h1>
            <p className="section-subtitle">{vendor?.storeTagline || 'Manage your products and orders'}</p>
            <div className="neon-track mt-3 w-32" />
          </div>
          {vendor?.status && (
            <span className={`mt-1 px-3 py-1 rounded-full text-xs font-medium capitalize flex-shrink-0 ${vendor.status === 'active' ? 'text-green-400 bg-green-400/10 border border-green-400/20' : vendor.status === 'pending' ? 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/20' : 'text-red-400 bg-red-400/10 border border-red-400/20'}`}>
              {vendor.status}
            </span>
          )}
        </div>

        {vendor?.status === 'pending' && (
          <div className="p-4 rounded-xl mb-8" style={{ background: 'rgba(255,184,0,0.08)', border: '1px solid rgba(255,184,0,0.2)' }}>
            <p className="text-yellow-400 text-sm">Your store is pending admin approval. You can add products now but they'll go live once approved.</p>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Package, label: 'Products', value: stats.totalProducts || 0, color: '#00D1FF' },
            { icon: ShoppingBag, label: 'Orders', value: stats.totalOrders || 0, color: '#0052FF' },
            { icon: TrendingUp, label: 'Revenue', value: `$${(stats.totalRevenue || 0).toFixed(2)}`, color: '#00D1FF' },
            { icon: Star, label: 'Avg Rating', value: (stats.averageRating || 0).toFixed(1), color: '#FFB800' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="glass-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={15} style={{ color }} />
                <span className="text-white/40 text-xs">{label}</span>
              </div>
              <p className="text-xl font-bold font-display text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/8 pb-1">
          {['products', 'orders', 'store-settings'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className="px-4 py-2 rounded-t-lg text-sm font-medium capitalize transition-all" style={{ borderBottom: activeTab === tab ? '2px solid #00D1FF' : '2px solid transparent', color: activeTab === tab ? '#00D1FF' : 'rgba(255,255,255,0.4)' }}>
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-white/50 text-sm">{products.length} products</p>
              <button onClick={() => setShowAddProduct(!showAddProduct)} className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
                <Plus size={15} /> Add Product
              </button>
            </div>

            {/* Add product form */}
            {showAddProduct && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mb-6" style={{ border: '1px solid rgba(0,209,255,0.15)' }}>
                <h3 className="font-semibold font-display text-white mb-4">Add New Product</h3>
                <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-xs text-white/40 block mb-1.5 ml-1">Product Name *</label>
                    <input required className="input-glass" placeholder="Amazing product name" value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-white/40 block mb-1.5 ml-1">Description *</label>
                    <textarea rows={3} required className="input-glass resize-none" placeholder="Product description..." value={newProduct.description} onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1.5 ml-1">Price (USD)</label>
                    <input type="number" min="0" step="0.01" className="input-glass" value={newProduct.price} onChange={e => setNewProduct(p => ({ ...p, price: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1.5 ml-1">Category *</label>
                    <select required className="input-glass" value={newProduct.category} onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))}>
                      {['digital-products','arts','illustrations','electronics-used','fashion','templates','software','other'].map(c => <option key={c} value={c} style={{ background: '#0a0a0a' }}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1.5 ml-1">Stock</label>
                    <input type="number" min="0" className="input-glass" value={newProduct.stock} onChange={e => setNewProduct(p => ({ ...p, stock: parseInt(e.target.value) || 0 }))} />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-white/60">Digital Product?</label>
                    <button type="button" onClick={() => setNewProduct(p => ({ ...p, isDigital: !p.isDigital }))} className="transition-colors">
                      {newProduct.isDigital ? <ToggleRight size={24} style={{ color: '#00D1FF' }} /> : <ToggleLeft size={24} className="text-white/30" />}
                    </button>
                  </div>
                  <div className="md:col-span-2 flex gap-3">
                    <button type="submit" className="btn-primary py-2.5 px-6 text-sm">Add Product</button>
                    <button type="button" onClick={() => setShowAddProduct(false)} className="btn-glass py-2.5 px-6 text-sm">Cancel</button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Products table */}
            <div className="glass-card overflow-hidden">
              {products.length === 0 ? (
                <div className="p-12 text-center">
                  <Package size={36} className="text-white/15 mx-auto mb-4" />
                  <p className="text-white/30 text-sm">No products yet. Add your first product above.</p>
                </div>
              ) : (
                <div className="divide-y divide-white/6">
                  {products.map(product => (
                    <div key={product._id} className="flex items-center gap-3 p-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
                        {product.images?.[0]?.url && <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{product.name}</p>
                        <p className="text-white/40 text-xs">{product.category} · {product.totalOrders || 0} orders · {product.views || 0} views</p>
                      </div>
                      <span className="text-white font-mono text-sm">${product.price}</span>
                      <button onClick={() => toggleProductStatus(product)} className="p-1.5 rounded-lg hover:bg-white/8 transition-colors">
                        {product.status === 'active' ? <ToggleRight size={20} style={{ color: '#00D1FF' }} /> : <ToggleLeft size={20} className="text-white/30" />}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="glass-card overflow-hidden">
            {orders.length === 0 ? (
              <div className="p-12 text-center">
                <ShoppingBag size={36} className="text-white/15 mx-auto mb-4" />
                <p className="text-white/30 text-sm">No orders yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/6">
                {orders.map(order => (
                  <div key={order._id} className="p-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-white font-mono text-xs">{order.orderNumber}</p>
                      <p className="text-white/40 text-xs mt-0.5">{order.customer?.name}</p>
                    </div>
                    <span className="font-bold text-sm" style={{ color: '#00D1FF' }}>${order.totalAmount?.toFixed(2)}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs capitalize" style={{ background: 'rgba(0,82,255,0.12)', color: '#00AAFF' }}>{order.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Store Settings Tab */}
        {activeTab === 'store-settings' && vendor && (
          <StoreSettingsForm vendor={vendor} onUpdate={setVendor} />
        )}
      </div>
    </div>
  );
}

function StoreSettingsForm({ vendor, onUpdate }) {
  const [form, setForm] = useState({
    storeName: vendor.storeName || '',
    storeTagline: vendor.storeTagline || '',
    storeDescription: vendor.storeDescription || '',
    socialLinks: vendor.socialLinks || { instagram: '', facebook: '', tiktok: '', linkedin: '' },
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = await api.patch('/vendors/my-store', form);
      onUpdate(data.vendor);
      toast.success('Store settings saved!');
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="glass-card p-6 space-y-5" style={{ border: '1px solid rgba(0,209,255,0.1)' }}>
      <h3 className="font-semibold font-display text-white">Store Settings</h3>
      {[['storeName', 'Store Name'], ['storeTagline', 'Tagline']].map(([f, l]) => (
        <div key={f}>
          <label className="text-xs text-white/40 block mb-1.5 ml-1">{l}</label>
          <input className="input-glass" value={form[f]} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))} />
        </div>
      ))}
      <div>
        <label className="text-xs text-white/40 block mb-1.5 ml-1">Description</label>
        <textarea rows={4} className="input-glass resize-none" value={form.storeDescription} onChange={e => setForm(p => ({ ...p, storeDescription: e.target.value }))} />
      </div>
      <div className="pt-2 border-t border-white/8">
        <p className="text-xs text-white/30 mb-3">Social Media Links</p>
        {['instagram', 'facebook', 'tiktok', 'linkedin'].map(s => (
          <div key={s} className="mb-3">
            <label className="text-xs text-white/40 block mb-1.5 ml-1 capitalize">{s}</label>
            <input className="input-glass" value={form.socialLinks[s]} onChange={e => setForm(p => ({ ...p, socialLinks: { ...p.socialLinks, [s]: e.target.value } }))} placeholder={`https://${s}.com/yourprofile`} />
          </div>
        ))}
      </div>
      <button onClick={handleSave} disabled={saving} className="btn-primary w-full py-3">{saving ? 'Saving...' : 'Save Changes'}</button>
    </div>
  );
}
