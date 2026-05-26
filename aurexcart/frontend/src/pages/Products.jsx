import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Search, Grid2X2, List } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import api from '../lib/api';

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'digital-products', label: 'Digital Products' },
  { value: 'arts', label: 'Arts' },
  { value: 'illustrations', label: 'Illustrations' },
  { value: 'electronics-used', label: 'Used Electronics' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'home-decor', label: 'Home & Decor' },
  { value: 'books', label: 'Books' },
  { value: 'music', label: 'Music' },
  { value: 'software', label: 'Software' },
  { value: 'templates', label: 'Templates' },
  { value: 'aurex-labs', label: 'Aurex Labs' },
];

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: '-views', label: 'Most Viewed' },
  { value: '-averageRating', label: 'Top Rated' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { category: routeCategory } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const category = routeCategory || searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '-createdAt';
  const featured = searchParams.get('featured') || '';
  const aurex = searchParams.get('aurex') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page, limit: 24, sort });
        if (category) params.set('category', category);
        if (featured) params.set('featured', 'true');
        if (aurex) params.set('aurex', 'true');
        const data = await api.get(`/products?${params}`);
        setProducts(data.products || []);
        setTotal(data.total || 0);
      } catch { setProducts([]); }
      finally { setLoading(false); }
    };
    fetchProducts();
  }, [category, sort, featured, aurex, page]);

  const categoryLabel = CATEGORIES.find(c => c.value === category)?.label || 'All Products';

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-title mb-2"
          >
            {categoryLabel}
          </motion.h1>
          <p className="section-subtitle">{total} products found</p>
          <div className="neon-track mt-4 w-48" />
        </div>

        {/* Filters bar */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {/* Category pills */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.slice(0, 6).map(cat => (
              <button
                key={cat.value}
                onClick={() => navigate(cat.value ? `/category/${cat.value}` : '/products')}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  background: category === cat.value ? 'rgba(0,82,255,0.2)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${category === cat.value ? 'rgba(0,209,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  color: category === cat.value ? '#00D1FF' : 'rgba(255,255,255,0.5)',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="ml-auto">
            <select
              value={sort}
              onChange={e => { const p = new URLSearchParams(searchParams); p.set('sort', e.target.value); setSearchParams(p); }}
              className="input-glass text-sm py-2 pr-3 pl-3 w-auto"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} style={{ background: '#0a0a0a' }}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="glass-card animate-pulse h-72">
                <div className="h-48 rounded-t-2xl bg-white/5" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-white/5 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(0,82,255,0.1)', border: '1px solid rgba(0,82,255,0.2)' }}>
              <Search size={24} className="text-white/20" />
            </div>
            <p className="text-white/40 text-lg">No products found</p>
            <p className="text-white/20 text-sm mt-2">Try a different category or check back later</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <ProductCard product={product} onClick={() => navigate(`/product/${product.slug}`)} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {total > 24 && (
          <div className="flex justify-center gap-2 mt-12">
            {[...Array(Math.ceil(total / 24))].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className="w-9 h-9 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: page === i + 1 ? 'rgba(0,82,255,0.3)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${page === i + 1 ? 'rgba(0,209,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  color: page === i + 1 ? '#00D1FF' : 'rgba(255,255,255,0.5)',
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
