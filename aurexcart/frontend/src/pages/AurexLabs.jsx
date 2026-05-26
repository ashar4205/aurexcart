// AurexLabs.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import api from '../lib/api';

export default function AurexLabs() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/products?aurex=true&limit=24').then(d => setProducts(d.products || [])).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at center, rgba(0,82,255,0.1) 0%, transparent 70%)' }} />
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
            <span className="inline-block px-4 py-1 rounded-full text-xs font-mono mb-4" style={{ background: 'rgba(0,209,255,0.1)', border: '1px solid rgba(0,209,255,0.25)', color: '#00D1FF' }}>
              Official Collection
            </span>
            <h1 className="text-5xl font-bold font-display mb-4" style={{ color: '#00D1FF', textShadow: '0 0 30px rgba(0,209,255,0.4)' }}>
              Products by Aurex Labs
            </h1>
            <p className="text-white/50 text-lg max-w-xl mx-auto mb-6">
              Premium digital assets, UI kits, templates, and creative tools — crafted with precision by the Aurex Labs team.
            </p>
            <a href="https://aurexlabs.netlify.app/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-80" style={{ color: '#0052FF' }}>
              Visit Aurex Labs <ExternalLink size={13} />
            </a>
          </motion.div>
          <div className="neon-track mt-10 max-w-xs mx-auto" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p, i) => (
            <motion.div key={p._id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.07 }}>
              <ProductCard product={p} onClick={() => navigate(`/product/${p.slug}`)} />
            </motion.div>
          ))}
          {products.length === 0 && (
            <div className="col-span-4 text-center py-16">
              <p className="text-white/30">No Aurex Labs products listed yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
