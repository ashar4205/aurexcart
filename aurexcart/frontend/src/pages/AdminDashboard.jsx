import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Store, Package, ShoppingBag, DollarSign, TrendingUp, Eye, Share2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store';
import api from '../lib/api';

const StatCard = ({ icon: Icon, label, value, accent = '#00D1FF', delta }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
    <div className="flex items-start justify-between mb-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}>
        <Icon size={18} style={{ color: accent }} />
      </div>
      {delta !== undefined && (
        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: delta >= 0 ? 'rgba(0,200,100,0.12)' : 'rgba(255,80,80,0.12)', color: delta >= 0 ? '#00C864' : '#FF5050' }}>
          {delta >= 0 ? '+' : ''}{delta}%
        </span>
      )}
    </div>
    <p className="text-2xl font-bold font-display text-white">{value}</p>
    <p className="text-white/40 text-xs mt-1">{label}</p>
  </motion.div>
);

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const [data, setData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [vendors, setVendors] = useState([]);

  if (!isAuthenticated || user?.role !== 'admin') return <Navigate to="/login" />;

  useEffect(() => {
    Promise.all([
      api.get('/admin/overview'),
      api.get('/analytics/platform-stats?range=30d'),
    ]).then(([overview, stats]) => {
      setData(overview);
      setAnalytics(stats);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab === 'vendors') {
      api.get('/admin/vendors').then(d => setVendors(d.vendors || [])).catch(() => {});
    }
  }, [activeTab]);

  const handleVendorStatus = async (id, status) => {
    await api.patch(`/vendors/${id}/status`, { status });
    setVendors(v => v.map(v => v._id === id ? { ...v, status } : v));
  };

  const tabs = ['overview', 'vendors', 'orders', 'users'];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title mb-1">Admin Control Center</h1>
          <p className="section-subtitle">Full platform management — AurexCart by Aurex Labs</p>
          <div className="neon-track mt-4 w-48" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-white/8 pb-1">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-t-lg text-sm font-medium capitalize transition-all"
              style={{
                background: activeTab === tab ? 'rgba(0,82,255,0.15)' : 'transparent',
                borderBottom: activeTab === tab ? '2px solid #00D1FF' : '2px solid transparent',
                color: activeTab === tab ? '#00D1FF' : 'rgba(255,255,255,0.4)',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 rounded-full border-2 border-blue-royal border-t-blue-neon animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === 'overview' && data && (
              <div className="space-y-8">
                {/* Stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard icon={Users} label="Total Users" value={data.totalUsers?.toLocaleString() || '0'} accent="#00D1FF" />
                  <StatCard icon={Store} label="Vendors" value={data.totalVendors?.toLocaleString() || '0'} accent="#0052FF" />
                  <StatCard icon={Package} label="Active Products" value={data.totalProducts?.toLocaleString() || '0'} accent="#00AAFF" />
                  <StatCard icon={ShoppingBag} label="Total Orders" value={data.totalOrders?.toLocaleString() || '0'} accent="#00D1FF" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard icon={DollarSign} label="Total Revenue" value={`$${(data.totalRevenue || 0).toFixed(2)}`} accent="#00D1FF" />
                  <StatCard icon={AlertCircle} label="Pending Vendors" value={data.pendingVendors || '0'} accent="#FFB800" />
                  {analytics && <>
                    <StatCard icon={Eye} label="Page Views (30d)" value={(analytics.pageViews || 0).toLocaleString()} accent="#00AAFF" />
                    <StatCard icon={Share2} label="Product Shares (30d)" value={(analytics.shares || 0).toLocaleString()} accent="#0052FF" />
                  </>}
                </div>

                {/* Share by platform */}
                {analytics?.sharesByPlatform?.length > 0 && (
                  <div className="glass-card p-6">
                    <h3 className="font-semibold font-display text-white mb-4">Shares by Platform</h3>
                    <div className="space-y-3">
                      {analytics.sharesByPlatform.map(({ _id, count }) => (
                        <div key={_id} className="flex items-center gap-3">
                          <span className="text-white/60 text-sm capitalize w-20">{_id || 'Other'}</span>
                          <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${Math.min(100, (count / (analytics.shares || 1)) * 100)}%`, background: 'linear-gradient(90deg, #0052FF, #00D1FF)' }} />
                          </div>
                          <span className="text-white/50 text-sm w-8 text-right">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent activity */}
                {data.recentOrders?.length > 0 && (
                  <div className="glass-card p-6">
                    <h3 className="font-semibold font-display text-white mb-4">Recent Orders</h3>
                    <div className="space-y-2">
                      {data.recentOrders.slice(0, 5).map(order => (
                        <div key={order._id} className="flex items-center justify-between py-2.5 border-b border-white/6 text-sm">
                          <div>
                            <span className="text-white font-mono text-xs">{order.orderNumber}</span>
                            <span className="text-white/40 ml-3">{order.customer?.name || 'Guest'}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-medium" style={{ color: '#00D1FF' }}>${order.totalAmount?.toFixed(2) || '0.00'}</span>
                            <span className="px-2 py-0.5 rounded-full text-xs capitalize" style={{ background: order.status === 'delivered' ? 'rgba(0,200,100,0.12)' : 'rgba(0,82,255,0.12)', color: order.status === 'delivered' ? '#00C864' : '#00AAFF' }}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'vendors' && (
              <div className="glass-card overflow-hidden">
                <div className="p-5 border-b border-white/8">
                  <h3 className="font-semibold font-display text-white">All Vendors</h3>
                </div>
                <div className="divide-y divide-white/6">
                  {vendors.map(vendor => (
                    <div key={vendor._id} className="flex items-center gap-4 p-4">
                      <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
                        {vendor.logo?.url ? <img src={vendor.logo.url} alt="" className="w-full h-full object-cover" /> : <Store size={18} className="text-white/30 m-2.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm">{vendor.storeName}</p>
                        <p className="text-white/40 text-xs">{vendor.owner?.email}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${vendor.status === 'active' ? 'text-green-400 bg-green-400/10' : vendor.status === 'pending' ? 'text-yellow-400 bg-yellow-400/10' : 'text-red-400 bg-red-400/10'}`}>
                        {vendor.status}
                      </span>
                      {vendor.status === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleVendorStatus(vendor._id, 'active')} className="p-1.5 rounded-lg hover:bg-green-500/10 transition-colors">
                            <CheckCircle size={16} className="text-green-400" />
                          </button>
                          <button onClick={() => handleVendorStatus(vendor._id, 'rejected')} className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors">
                            <XCircle size={16} className="text-red-400" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {vendors.length === 0 && <p className="text-white/30 text-center py-12 text-sm">No vendors yet</p>}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
