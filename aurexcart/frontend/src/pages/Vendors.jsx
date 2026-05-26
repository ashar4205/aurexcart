// Vendors.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/vendors').then(d => setVendors(d.vendors || [])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="section-title mb-2">All Stores</h1>
        <p className="section-subtitle mb-8">Discover independent vendors and their unique products</p>
        <div className="neon-track mb-10 w-40" />
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_,i) => <div key={i} className="glass-card h-44 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {vendors.map((vendor, i) => (
              <motion.div key={vendor._id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.06 }}>
                <div className="glass-card p-5 cursor-pointer" onClick={() => navigate(`/store/${vendor.storeSlug}`)}>
                  <div className="w-12 h-12 rounded-xl overflow-hidden mb-3 bg-white/5 flex items-center justify-center">
                    {vendor.logo?.url ? <img src={vendor.logo.url} alt="" className="w-full h-full object-cover" /> : <span className="text-2xl font-bold text-white/20">{vendor.storeName?.[0]}</span>}
                  </div>
                  <p className="font-semibold text-white text-sm font-display">{vendor.storeName}</p>
                  {vendor.storeTagline && <p className="text-white/40 text-xs mt-1 line-clamp-2">{vendor.storeTagline}</p>}
                  <p className="text-white/25 text-xs mt-2">{vendor.analytics?.totalProducts || 0} products</p>
                  <div className="neon-track mt-3" />
                </div>
              </motion.div>
            ))}
            {vendors.length === 0 && <p className="col-span-4 text-center text-white/30 py-16">No stores yet — be the first!</p>}
          </div>
        )}
      </div>
    </div>
  );
}
