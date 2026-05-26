// ─── Search Page ─────────────────────────────────────────────────────────────
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import api from '../lib/api';

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [input, setInput] = useState(query);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        const data = await api.get(`/products?search=${encodeURIComponent(query)}&limit=24`);
        setResults(data.products || []);
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 300);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ q: input });
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="section-title mb-6">Search Products</h1>
        <form onSubmit={handleSearch} className="relative mb-8">
          <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            autoFocus className="input-glass pl-12 pr-4 py-4 text-base"
            placeholder="Search for products, stores, or categories..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </form>
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-7 h-7 rounded-full border-2 border-blue-royal border-t-blue-neon animate-spin" /></div>
        ) : results.length > 0 ? (
          <>
            <p className="text-white/40 text-sm mb-6">{results.length} results for "{query}"</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.map(p => <ProductCard key={p._id} product={p} onClick={() => navigate(`/product/${p.slug}`)} />)}
            </div>
          </>
        ) : query ? (
          <div className="text-center py-16">
            <SearchIcon size={36} className="text-white/15 mx-auto mb-4" />
            <p className="text-white/40">No results for "{query}"</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ─── Vendors Page ─────────────────────────────────────────────────────────────
export function Vendors() {
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
        <p className="section-subtitle mb-8">Discover vendors selling unique products</p>
        <div className="neon-track mb-10 w-40" />
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_,i) => <div key={i} className="glass-card h-40 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {vendors.map((vendor, i) => (
              <motion.div key={vendor._id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.06 }}>
                <div className="glass-card p-5 cursor-pointer" onClick={() => navigate(`/store/${vendor.storeSlug}`)}>
                  <div className="w-12 h-12 rounded-xl overflow-hidden mb-3 bg-white/5">
                    {vendor.logo?.url ? <img src={vendor.logo.url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl font-bold text-white/20">{vendor.storeName?.[0]}</div>}
                  </div>
                  <p className="font-semibold text-white text-sm font-display">{vendor.storeName}</p>
                  <p className="text-white/40 text-xs mt-1 line-clamp-2">{vendor.storeTagline}</p>
                  <p className="text-white/25 text-xs mt-2">{vendor.analytics?.totalProducts || 0} products</p>
                  <div className="neon-track mt-3" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── AurexLabs Page ───────────────────────────────────────────────────────────
export function AurexLabs() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/products?aurex=true&limit=24').then(d => setProducts(d.products || []));
  }, []);

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at center, rgba(0,82,255,0.1) 0%, transparent 70%)' }} />
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
            <span className="inline-block px-4 py-1 rounded-full text-xs font-mono mb-4" style={{ background: 'rgba(0,209,255,0.1)', border: '1px solid rgba(0,209,255,0.25)', color: '#00D1FF' }}>
              Official Aurex Labs Collection
            </span>
            <h1 className="text-5xl font-bold font-display mb-4" style={{ color: '#00D1FF', textShadow: '0 0 30px rgba(0,209,255,0.4)' }}>
              Products by Aurex Labs
            </h1>
            <p className="text-white/50 text-lg max-w-xl mx-auto mb-6">
              Premium digital assets, templates, and tools crafted by the Aurex Labs team.
            </p>
            <a href="https://aurexlabs.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: '#0052FF' }}>
              Visit Aurex Labs →
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
        </div>
      </div>
    </div>
  );
}

// ─── Vendor Store Page ────────────────────────────────────────────────────────
export function VendorStore() {
  const { slug } = require('react-router-dom').useParams();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/vendors/${slug}`).then(d => {
      setVendor(d.vendor);
      return api.get(`/products?vendor=${d.vendor._id}&limit=24`);
    }).then(d => setProducts(d.products || [])).catch(() => {});
  }, [slug]);

  if (!vendor) return <div className="min-h-screen flex items-center justify-center"><div className="w-7 h-7 rounded-full border-2 border-blue-royal border-t-blue-neon animate-spin" /></div>;

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div className="relative h-48 md:h-64" style={{ background: vendor.banner?.url ? `url(${vendor.banner.url}) center/cover` : 'linear-gradient(135deg, #000033, #000066)' }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        {/* Brand colors overlay */}
        <div className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(ellipse at center, ${vendor.brandColors?.primary || '#0052FF'}40 0%, transparent 70%)` }} />
      </div>

      {/* Store header */}
      <div className="max-w-7xl mx-auto px-4 -mt-12 mb-10">
        <div className="flex items-end gap-4">
          <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0" style={{ background: 'rgba(0,82,255,0.2)', border: '3px solid rgba(0,0,0,0.8)' }}>
            {vendor.logo?.url ? <img src={vendor.logo.url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white/40">{vendor.storeName?.[0]}</div>}
          </div>
          <div className="pb-2">
            <h1 className="text-2xl font-bold font-display text-white">{vendor.storeName}</h1>
            {vendor.storeTagline && <p className="text-white/50 text-sm">{vendor.storeTagline}</p>}
          </div>
        </div>
        {vendor.storeDescription && <p className="text-white/50 text-sm mt-4 max-w-2xl">{vendor.storeDescription}</p>}
        {/* Social links */}
        <div className="flex gap-3 mt-3">
          {Object.entries(vendor.socialLinks || {}).filter(([,v]) => v).map(([platform, url]) => (
            <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-white/40 hover:text-white/70 capitalize transition-colors">{platform}</a>
          ))}
        </div>
        <div className="neon-track mt-6 w-48" />
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => <ProductCard key={p._id} product={p} onClick={() => navigate(`/product/${p.slug}`)} />)}
        </div>
        {products.length === 0 && <div className="text-center py-16"><p className="text-white/30">No products yet in this store.</p></div>}
      </div>
    </div>
  );
}

// ─── 404 Not Found ────────────────────────────────────────────────────────────
export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
        <p className="text-8xl font-bold font-display mb-4" style={{ color: '#0052FF', opacity:0.4 }}>404</p>
        <h1 className="text-2xl font-bold font-display text-white mb-2">Page Not Found</h1>
        <p className="text-white/40 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <a href="/" className="btn-primary px-8 py-3 inline-flex items-center gap-2">Go Home</a>
      </motion.div>
    </div>
  );
}

export default Search;
