import React, { useEffect, useState, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Eye, Share2, ShoppingCart, Package, ChevronLeft, Send } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { useCartStore, useAuthStore, useUIStore } from '../store';
import { formatPrice } from '../lib/api';
import api from '../lib/api';
import ShareModal from '../components/product/ShareModal';
import toast from 'react-hot-toast';

// ─── 3D Model Viewer ──────────────────────────────────────────────────────
function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.5} />;
}

function ProductViewer3D({ modelUrl }) {
  return (
    <div className="w-full h-72 rounded-xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0,209,255,0.15)' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#00D1FF" />
        <pointLight position={[-10, -10, -5]} intensity={0.3} color="#0052FF" />
        <Suspense fallback={null}>
          <Model url={modelUrl} />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls enablePan={false} autoRotate autoRotateSpeed={1.5} />
      </Canvas>
      <p className="text-white/30 text-xs text-center mt-2 pb-2">Drag to rotate · Scroll to zoom</p>
    </div>
  );
}

// ─── Star Rating Input ────────────────────────────────────────────────────
function StarRatingInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(n => (
        <button
          key={n} type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
        >
          <Star size={22} className={n <= (hover || value) ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'} />
        </button>
      ))}
    </div>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showShare, setShowShare] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', body: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const { addItem, openCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const currency = useUIStore(s => s.currency);

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${slug}`)
      .then(d => {
        setProduct(d.product);
        return api.get(`/reviews/product/${d.product._id}`);
      })
      .then(d => setReviews(d.reviews || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    addItem(product);
    openCart();
    toast.success(`${product.name} added to cart`, {
      style: { background: '#0a0a0a', color: '#fff', border: '1px solid rgba(0,209,255,0.3)' },
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Sign in to leave a review'); return; }
    setSubmittingReview(true);
    try {
      const data = await api.post('/reviews', { productId: product._id, ...reviewForm });
      setReviews(r => [data.review, ...r]);
      setReviewForm({ rating: 5, title: '', body: '' });
      toast.success('Review posted!');
    } catch (err) { toast.error(err.message); }
    finally { setSubmittingReview(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-blue-royal border-t-blue-neon animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <p className="text-white/50 text-lg mb-4">Product not found</p>
      <Link to="/products" className="btn-primary px-6 py-2.5">Browse Products</Link>
    </div>
  );

  const images = product.images?.length > 0 ? product.images : [{ url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800', alt: product.name }];
  const price = formatPrice(product.price, currency);
  const comparePrice = product.comparePrice > 0 ? formatPrice(product.comparePrice, currency) : null;

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-white/40 mb-8">
          <Link to="/" className="hover:text-white/70 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-white/70 transition-colors">Products</Link>
          <span>/</span>
          <span className="text-white/70 truncate">{product.name}</span>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* ─── Left: Images ─────────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Main image */}
            <motion.div
              className="relative rounded-2xl overflow-hidden"
              style={{ height: 420, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <img
                src={images[selectedImage]?.url}
                alt={images[selectedImage]?.alt || product.name}
                className="w-full h-full object-cover"
              />
              {/* Share button overlay */}
              <button
                onClick={() => setShowShare(true)}
                className="absolute top-4 right-4 p-2.5 rounded-xl flex items-center gap-2 text-xs font-medium"
                style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }}
              >
                <Share2 size={13} /> Share
              </button>
              {/* 3D toggle */}
              {product.model3d?.url && (
                <button
                  onClick={() => setShow3D(!show3D)}
                  className="absolute top-4 left-4 p-2.5 rounded-xl text-xs font-medium"
                  style={{ background: show3D ? 'rgba(0,82,255,0.4)' : 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(0,209,255,0.3)', color: '#00D1FF' }}
                >
                  {show3D ? '2D View' : '3D View'}
                </button>
              )}
              {/* Neon track below image */}
              <div className="absolute bottom-0 left-0 right-0 neon-track" style={{ borderRadius: 0, height: 3 }} />
            </motion.div>

            {/* 3D Viewer */}
            {show3D && product.model3d?.url && <ProductViewer3D modelUrl={product.model3d.url} />}

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 transition-all"
                    style={{ border: `2px solid ${selectedImage === i ? '#00D1FF' : 'rgba(255,255,255,0.07)'}` }}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── Right: Info ──────────────────────────────────────────── */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium capitalize" style={{ background: 'rgba(0,82,255,0.15)', border: '1px solid rgba(0,82,255,0.3)', color: '#00AAFF' }}>
                {product.category?.replace('-', ' ')}
              </span>
              {product.isDigital && <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }}>Digital Download</span>}
              {product.isAurexLabsProduct && <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: 'rgba(0,209,255,0.12)', border: '1px solid rgba(0,209,255,0.3)', color: '#00D1FF' }}>Aurex Labs</span>}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold font-display text-white leading-tight">{product.name}</h1>

            {/* Vendor */}
            {product.vendor && (
              <Link to={`/store/${product.vendor.storeSlug}`} className="flex items-center gap-2 w-fit hover:opacity-80 transition-opacity">
                <div className="w-7 h-7 rounded-full overflow-hidden bg-white/5 flex-shrink-0">
                  {product.vendor.logo?.url ? <img src={product.vendor.logo.url} alt="" className="w-full h-full object-cover" /> : <Package size={12} className="text-white/30 m-1.5" />}
                </div>
                <span className="text-sm text-white/50">by <span className="text-white/70">{product.vendor.storeName || product.vendorName}</span></span>
              </Link>
            )}

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={16} className={s <= Math.round(product.averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-white/15'} />
                ))}
              </div>
              <span className="text-white/40 text-sm">{product.averageRating?.toFixed(1)} ({product.reviewCount} reviews)</span>
              <span className="text-white/20 text-sm">·</span>
              <span className="text-white/40 text-sm flex items-center gap-1"><Eye size={13} />{product.views?.toLocaleString()} views</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold font-display" style={{ color: '#00D1FF' }}>{price}</span>
              {comparePrice && <span className="text-white/30 text-xl line-through">{comparePrice}</span>}
              {product.discountPercent > 0 && (
                <span className="px-2 py-0.5 rounded-lg text-xs font-bold" style={{ background: 'rgba(0,200,100,0.15)', color: '#00C864', border: '1px solid rgba(0,200,100,0.25)' }}>
                  -{product.discountPercent}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-white/60 leading-relaxed text-sm">{product.description}</p>

            {/* Stock */}
            {product.trackInventory && !product.isDigital && (
              <p className="text-sm" style={{ color: product.stock > product.lowStockThreshold ? 'rgba(0,200,100,0.8)' : product.stock > 0 ? '#FFB800' : '#FF5050' }}>
                {product.stock > 0 ? `${product.stock} in stock${product.stock <= product.lowStockThreshold ? ' — low stock!' : ''}` : 'Out of stock'}
              </p>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.trackInventory && product.stock === 0 && !product.isDigital}
                className="btn-order flex-1 flex items-center justify-center gap-2 py-4 text-base font-semibold"
              >
                <ShoppingCart size={18} /> Order Now
              </button>
              <button
                onClick={() => setShowShare(true)}
                className="btn-glass flex items-center justify-center gap-2 px-5 py-4 sm:w-auto"
              >
                <Share2 size={16} /> Share
              </button>
            </div>

            {/* Neon track */}
            <div className="neon-track" />
          </div>
        </div>

        {/* ─── Reviews Section ──────────────────────────────────────── */}
        <section>
          <h2 className="section-title mb-2">Reviews & Ratings</h2>
          <p className="section-subtitle mb-8">{reviews.length} customer review{reviews.length !== 1 ? 's' : ''}</p>
          <div className="neon-track mb-8 w-40" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Write review */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 sticky top-24" style={{ border: '1px solid rgba(0,209,255,0.1)' }}>
                <h3 className="font-semibold font-display text-white mb-5">Write a Review</h3>
                {!isAuthenticated ? (
                  <p className="text-white/40 text-sm">
                    <Link to="/login" style={{ color: '#00D1FF' }}>Sign in</Link> to leave a review.
                  </p>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs text-white/40 block mb-2">Your Rating *</label>
                      <StarRatingInput value={reviewForm.rating} onChange={r => setReviewForm(f => ({ ...f, rating: r }))} />
                    </div>
                    <div>
                      <label className="text-xs text-white/40 block mb-1.5 ml-1">Review Title</label>
                      <input className="input-glass" placeholder="Summarise your experience" value={reviewForm.title} onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-xs text-white/40 block mb-1.5 ml-1">Your Review *</label>
                      <textarea required rows={4} className="input-glass resize-none" placeholder="Share your honest feedback..." value={reviewForm.body} onChange={e => setReviewForm(f => ({ ...f, body: e.target.value }))} />
                    </div>
                    <button type="submit" disabled={submittingReview} className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-sm">
                      <Send size={14} /> {submittingReview ? 'Posting...' : 'Post Review'}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Reviews list */}
            <div className="lg:col-span-2 space-y-4">
              {reviews.length === 0 ? (
                <div className="glass-card p-10 text-center">
                  <Star size={32} className="text-white/15 mx-auto mb-3" />
                  <p className="text-white/30 text-sm">No reviews yet — be the first!</p>
                </div>
              ) : (
                reviews.map((review, i) => (
                  <motion.div
                    key={review._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card p-5"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-white/5">
                        {review.reviewerAvatar
                          ? <img src={review.reviewerAvatar} alt="" className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white/40">{review.reviewerName?.[0]?.toUpperCase()}</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-white text-sm font-medium">{review.reviewerName}</p>
                          <p className="text-white/25 text-xs">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex mt-1">
                          {[1,2,3,4,5].map(s => <Star key={s} size={13} className={s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/15'} />)}
                        </div>
                      </div>
                    </div>
                    {review.title && <p className="font-medium text-white text-sm mb-1">{review.title}</p>}
                    <p className="text-white/60 text-sm leading-relaxed">{review.body}</p>
                    {review.images?.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {review.images.map((img, idx) => (
                          <img key={idx} src={img.url} alt="" className="w-16 h-16 rounded-lg object-cover" />
                        ))}
                      </div>
                    )}
                    {review.isVerifiedPurchase && (
                      <p className="text-xs mt-2 flex items-center gap-1" style={{ color: '#00C864' }}>
                        <Package size={11} /> Verified Purchase
                      </p>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Share Modal */}
      {showShare && product && <ShareModal product={product} onClose={() => setShowShare(false)} />}
    </div>
  );
}
