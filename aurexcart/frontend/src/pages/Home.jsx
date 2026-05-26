import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Store, Zap, Shield, Globe, Star, Package } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

const CATEGORY_SECTIONS = [
  { key: 'aurex-labs', label: 'Products by Aurex Labs', subtitle: 'Premium picks from our own creative studio', params: 'aurex=true', icon: Zap, accent: '#00D1FF' },
  { key: 'digital-products', label: 'Digital Products', subtitle: 'Instant download software, templates & more', params: 'category=digital-products', icon: Package, accent: '#0052FF' },
  { key: 'arts', label: 'Arts & Illustrations', subtitle: 'Original artwork from global creators', params: 'category=arts', icon: Star, accent: '#00AAFF' },
  { key: 'electronics-used', label: 'Used Electronics', subtitle: 'Quality pre-owned devices at great prices', params: 'category=electronics-used', icon: Zap, accent: '#00D1FF' },
  { key: 'featured', label: 'Featured Products', subtitle: 'Hand-picked highlights across all categories', params: 'featured=true', icon: Star, accent: '#0052FF' },
];

const features = [
  { icon: Shield, title: 'Verified Vendors', desc: 'Every seller is ID-verified for your security.' },
  { icon: Globe, title: 'Global Currencies', desc: 'Shop and sell in your local currency.' },
  { icon: Store, title: 'Open Your Store', desc: 'Launch your own storefront in minutes.' },
  { icon: Zap, title: 'Instant Downloads', desc: 'Digital products delivered instantly.' },
];

// ─── Hero background SVG decoration ──────────────────────────────────────────
const HeroDecoration = () => (
  <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice">
    <defs>
      <radialGradient id="hg1" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#0052FF" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx="720" cy="320" rx="600" ry="300" fill="url(#hg1)" />
    <polygon points="720,80 900,200 900,360 720,480 540,360 540,200" fill="none" stroke="rgba(0,209,255,0.15)" strokeWidth="1" />
    <polygon points="720,120 860,220 860,340 720,440 580,340 580,220" fill="none" stroke="rgba(0,82,255,0.1)" strokeWidth="1" />
    {[...Array(12)].map((_, i) => (
      <circle key={i} cx={200 + i * 95} cy={100 + (i % 4) * 80} r="1.5" fill="rgba(0,209,255,0.5)" />
    ))}
  </svg>
);

// ─── Product section hook ────────────────────────────────────────────────────
function useProducts(params) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/products?${params}&limit=8`)
      .then(data => setProducts(data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [params]);

  return { products, loading };
}

// ─── Section Component ───────────────────────────────────────────────────────
function ProductSection({ section }) {
  const { products, loading } = useProducts(section.params);
  const navigate = useNavigate();
  const Icon = section.icon;

  if (!loading && products.length === 0) return null;

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${section.accent}20`, border: `1px solid ${section.accent}40` }}>
                <Icon size={16} style={{ color: section.accent }} />
              </div>
              <h2 className="section-title">{section.label}</h2>
            </div>
            <p className="section-subtitle">{section.subtitle}</p>
          </div>
          <Link
            to={`/products?${section.params}`}
            className="flex items-center gap-1.5 text-sm font-medium whitespace-nowrap transition-colors"
            style={{ color: section.accent }}
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {/* Neon divider */}
        <div className="neon-track mb-10" />

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass-card animate-pulse" style={{ height: 320 }}>
                <div className="h-52 rounded-t-2xl bg-white/5" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-white/5 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
              >
                <ProductCard product={product} onClick={() => navigate(`/product/${product.slug}`)} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Main Home Page ──────────────────────────────────────────────────────────
export default function Home() {
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, -120]);

  return (
    <div className="min-h-screen">
      {/* ─── HERO ──────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <HeroDecoration />

        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(rgba(0,82,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,82,255,1) 1px, transparent 1px)', backgroundSize: '80px 80px' }}
        />

        <motion.div
          style={{ y: heroY }}
          className="relative z-10 text-center max-w-4xl mx-auto px-4"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-mono"
            style={{ background: 'rgba(0,82,255,0.12)', border: '1px solid rgba(0,209,255,0.25)', color: '#00D1FF' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Multi-Vendor Marketplace — Now Live
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold font-display leading-tight tracking-tight mb-6"
          >
            <span className="text-white">The Future of</span>
            <br />
            <span style={{ color: '#00D1FF', textShadow: '0 0 30px rgba(0,209,255,0.5), 0 0 60px rgba(0,82,255,0.3)' }}>
              Digital Commerce
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Discover and sell digital products, art, illustrations, and pre-owned electronics.
            Open your store today — completely free.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link to="/products" className="btn-primary flex items-center justify-center gap-2 px-8 py-3.5 text-sm">
              Explore Products <ArrowRight size={16} />
            </Link>
            <Link to="/create-store" className="btn-glass flex items-center justify-center gap-2 px-8 py-3.5 text-sm">
              <Store size={16} /> Open Your Store
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5" style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
              <div className="w-1 h-2 rounded-full bg-white/40" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Features strip ─────────────────────────────────────────────── */}
      <section className="py-12 px-4 border-y border-white/6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,82,255,0.12)', border: '1px solid rgba(0,82,255,0.25)' }}>
                <Icon size={16} style={{ color: '#00D1FF' }} />
              </div>
              <div>
                <p className="font-semibold text-white text-sm font-display">{title}</p>
                <p className="text-white/40 text-xs mt-0.5">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Product Sections ────────────────────────────────────────────── */}
      {CATEGORY_SECTIONS.map(section => (
        <ProductSection key={section.key} section={section} />
      ))}

      {/* ─── Open a Store CTA ────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-12 relative overflow-hidden"
            style={{ border: '1px solid rgba(0,209,255,0.15)' }}
          >
            {/* Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 -translate-y-1/2 rounded-full blur-3xl" style={{ background: 'rgba(0,82,255,0.3)' }} />

            <Store size={40} className="mx-auto mb-6" style={{ color: '#00D1FF' }} />
            <h2 className="section-title mb-4">Ready to Start Selling?</h2>
            <p className="text-white/50 mb-8 max-w-lg mx-auto">
              Join hundreds of vendors and reach customers worldwide. Your store, your brand, your rules.
            </p>
            <Link to="/create-store" className="btn-primary inline-flex items-center gap-2 px-10 py-4">
              Open Your Store — It's Free <ArrowRight size={16} />
            </Link>
            <div className="neon-track mt-8" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
