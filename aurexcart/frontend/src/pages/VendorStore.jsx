// VendorStore.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/product/ProductCard';
import api from '../lib/api';

export default function VendorStore() {
  const { slug } = useParams();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/vendors/${slug}`)
      .then(d => {
        setVendor(d.vendor);
        return api.get(`/products?vendor=${d.vendor._id}&limit=24`);
      })
      .then(d => setProducts(d.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-7 h-7 rounded-full border-2 border-blue-royal border-t-blue-neon animate-spin" /></div>;
  if (!vendor) return <div className="min-h-screen flex items-center justify-center"><p className="text-white/40">Store not found.</p></div>;

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div className="relative h-48 md:h-64 overflow-hidden" style={{ background: vendor.banner?.url ? undefined : 'linear-gradient(135deg, #000033, #000066)' }}>
        {vendor.banner?.url && <img src={vendor.banner.url} alt="" className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(ellipse at center, ${vendor.brandColors?.primary || '#0052FF'} 0%, transparent 70%)` }} />
      </div>

      {/* Store identity */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end gap-4 -mt-10 mb-8">
          <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center" style={{ background: 'rgba(0,82,255,0.2)', border: '3px solid black' }}>
            {vendor.logo?.url ? <img src={vendor.logo.url} alt="" className="w-full h-full object-cover" /> : <span className="text-3xl font-bold text-white/30">{vendor.storeName?.[0]}</span>}
          </div>
          <div className="pb-2">
            <h1 className="text-2xl font-bold font-display text-white">{vendor.storeName}</h1>
            {vendor.storeTagline && <p className="text-white/50 text-sm">{vendor.storeTagline}</p>}
          </div>
        </div>

        {vendor.storeDescription && <p className="text-white/50 text-sm mb-4 max-w-2xl">{vendor.storeDescription}</p>}

        {/* Social links */}
        {Object.entries(vendor.socialLinks || {}).some(([,v]) => v) && (
          <div className="flex gap-4 mb-6">
            {Object.entries(vendor.socialLinks || {}).filter(([,v]) => v).map(([platform, url]) => (
              <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="text-xs capitalize transition-colors" style={{ color: 'rgba(0,209,255,0.7)' }}>
                {platform}
              </a>
            ))}
          </div>
        )}

        <div className="neon-track mb-10 w-48" />

        {/* Products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-16">
          {products.map(p => <ProductCard key={p._id} product={p} onClick={() => navigate(`/product/${p.slug}`)} />)}
          {products.length === 0 && <p className="col-span-4 text-center text-white/30 py-16">No products in this store yet.</p>}
        </div>
      </div>
    </div>
  );
}
