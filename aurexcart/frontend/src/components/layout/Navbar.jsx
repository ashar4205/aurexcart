import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Menu, X, Search, User, Store, LayoutDashboard,
  Home, Package, Palette, Cpu, BookOpen, HelpCircle, FileText,
  Shield, ChevronRight, LogOut, Sun, Moon, Sparkles,
} from 'lucide-react';
import { useAuthStore, useCartStore, useUIStore } from '../../store';
import { CURRENCY_RATES } from '../../lib/api';

// ─── AurexCart Logo SVG ────────────────────────────────────────────────────
const LogoSVG = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <rect width="64" height="64" rx="10" fill="black" fillOpacity="0.5" />
    <polygon points="32,5 55,18 55,46 32,59 9,46 9,18" fill="none" stroke="url(#nl1)" strokeWidth="1.5" opacity="0.7" />
    <path d="M21 50 L32 18 L43 50" stroke="url(#nl2)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M25 39 L39 39" stroke="url(#nl3)" strokeWidth="3" strokeLinecap="round" />
    <circle cx="32" cy="16" r="3" fill="#00D1FF" />
    <defs>
      <linearGradient id="nl1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#00D1FF" stopOpacity="0.8" /><stop offset="100%" stopColor="#0052FF" stopOpacity="0.3" /></linearGradient>
      <linearGradient id="nl2" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#00D1FF" /><stop offset="100%" stopColor="#0052FF" /></linearGradient>
      <linearGradient id="nl3" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#0052FF" /><stop offset="100%" stopColor="#00D1FF" /></linearGradient>
    </defs>
  </svg>
);

const navLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/products', label: 'All Products', icon: Package },
  { to: '/category/digital-products', label: 'Digital Products', icon: Cpu },
  { to: '/category/arts', label: 'Arts & Illustrations', icon: Palette },
  { to: '/category/electronics-used', label: 'Used Electronics', icon: Cpu },
  { to: '/vendors', label: 'Stores', icon: Store },
  { to: '/aurex-labs', label: 'Aurex Labs', icon: Sparkles },
];

const footerLinks = [
  { to: '/faq', label: 'FAQ', icon: HelpCircle },
  { to: '/terms', label: 'Terms', icon: FileText },
  { to: '/privacy', label: 'Privacy', icon: Shield },
];

const themes = [
  { key: 'dark', label: 'Dark', icon: Moon },
  { key: 'light', label: 'Light', icon: Sun },
  { key: 'gradient-blue', label: 'Blue Gradient', icon: Sparkles },
];

const currencies = Object.keys(CURRENCY_RATES);

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items, openCart } = useCartStore();
  const { navOpen, toggleNav, closeNav, theme, setTheme, currency, setCurrency } = useUIStore();

  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  // Close nav on route change
  useEffect(() => { closeNav(); }, [location.pathname]);

  // Lock body scroll when nav open
  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [navOpen]);

  const handleLogout = () => { logout(); closeNav(); navigate('/'); };

  return (
    <>
      {/* ─── Top Navbar ─────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-40 h-16"
        style={{
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleNav}
              className="p-2 rounded-xl hover:bg-white/8 transition-colors"
              aria-label="Toggle navigation"
            >
              <Menu size={20} className="text-white/80" />
            </button>
            <Link to="/" className="flex items-center gap-2.5 group" onClick={closeNav}>
              <LogoSVG size={34} />
              <span className="font-bold font-display text-lg hidden sm:block" style={{ color: '#00D1FF', letterSpacing: '-0.01em' }}>
                Aurex<span className="text-white">Cart</span>
              </span>
            </Link>
          </div>

          {/* Center: Search bar (desktop) */}
          <div className="hidden md:flex flex-1 max-w-md">
            <Link
              to="/search"
              className="flex items-center gap-2 w-full px-4 py-2 rounded-xl text-white/40 text-sm transition-all hover:text-white/60"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Search size={15} />
              <span>Search products, stores…</span>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5">
            {/* Search (mobile) */}
            <Link to="/search" className="md:hidden p-2 rounded-xl hover:bg-white/8 transition-colors">
              <Search size={18} className="text-white/70" />
            </Link>

            {/* Currency picker */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="hidden sm:block text-xs text-white/60 bg-transparent border-none outline-none cursor-pointer py-1 pr-1"
              aria-label="Select currency"
            >
              {currencies.map(c => <option key={c} value={c} style={{ background: '#0a0a0a' }}>{c}</option>)}
            </select>

            {/* Cart button */}
            <button
              onClick={openCart}
              className="cart-btn relative"
              aria-label={`Cart: ${cartCount} items`}
            >
              <ShoppingCart size={18} className="text-white/80" />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-bold"
                  style={{ background: 'linear-gradient(135deg, #0052FF, #00D1FF)', fontSize: '10px' }}
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </motion.span>
              )}
            </button>

            {/* Auth */}
            {isAuthenticated ? (
              <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="p-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,82,255,0.2)', border: '1px solid rgba(0,82,255,0.4)' }}>
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <User size={16} className="text-blue-neon" />
                )}
              </Link>
            ) : (
              <Link to="/login" className="hidden sm:flex btn-glass text-xs px-4 py-2 rounded-xl">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ─── Backdrop ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {navOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeNav}
          />
        )}
      </AnimatePresence>

      {/* ─── Slide Drawer — Desktop (Left) / Mobile (Top) ───────────────── */}
      <AnimatePresence>
        {navOpen && (
          <motion.nav
            className="fixed z-50 overflow-y-auto"
            style={{
              background: 'rgba(0,0,0,0.97)',
              backdropFilter: 'blur(24px)',
              // Mobile: full width, slides from top
              // Desktop: sidebar, slides from left
            }}
            // Desktop sidebar
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            // Responsive sizing
            sx={{}}
          >
            {/* We use inline style for responsive drawer sizing */}
            <style>{`
              @media (max-width: 767px) {
                nav.drawer-nav {
                  top: 0; left: 0; right: 0;
                  bottom: auto;
                  border-bottom: 1px solid rgba(255,255,255,0.08);
                  border-right: none;
                  max-height: 90vh;
                }
              }
              @media (min-width: 768px) {
                nav.drawer-nav {
                  top: 0; left: 0; bottom: 0;
                  width: 300px;
                  border-right: 1px solid rgba(255,255,255,0.08);
                }
              }
            `}</style>
            <div
              className="drawer-nav fixed z-50 overflow-y-auto"
              style={{
                background: 'rgba(0,0,0,0.97)',
                backdropFilter: 'blur(24px)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/8">
                <div className="flex items-center gap-3">
                  <LogoSVG size={30} />
                  <span className="font-bold font-display" style={{ color: '#00D1FF' }}>AurexCart</span>
                </div>
                <button onClick={closeNav} className="p-2 rounded-xl hover:bg-white/8 transition-colors">
                  <X size={18} className="text-white/60" />
                </button>
              </div>

              {/* Auth state */}
              <div className="p-5 border-b border-white/6">
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0" style={{ background: 'rgba(0,82,255,0.2)', border: '1px solid rgba(0,82,255,0.3)' }}>
                      {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : <User size={18} className="text-blue-neon m-1.5" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                      <p className="text-white/40 text-xs truncate">{user?.email}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link to="/login" onClick={closeNav} className="flex-1 btn-primary text-center text-sm py-2.5">Sign In</Link>
                    <Link to="/register" onClick={closeNav} className="flex-1 btn-glass text-center text-sm py-2.5">Register</Link>
                  </div>
                )}
              </div>

              {/* Nav links */}
              <div className="p-4 space-y-1">
                {navLinks.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={closeNav}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group"
                    style={{
                      background: location.pathname === to ? 'rgba(0,82,255,0.15)' : 'transparent',
                      border: location.pathname === to ? '1px solid rgba(0,82,255,0.3)' : '1px solid transparent',
                    }}
                  >
                    <Icon size={16} className={location.pathname === to ? 'text-blue-neon' : 'text-white/50 group-hover:text-white/80'} />
                    <span className={`text-sm font-medium ${location.pathname === to ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>{label}</span>
                    {location.pathname === to && <ChevronRight size={14} className="ml-auto text-blue-neon" />}
                  </Link>
                ))}
              </div>

              {/* User actions (if logged in) */}
              {isAuthenticated && (
                <div className="px-4 py-2 border-t border-white/6 space-y-1">
                  <Link to="/dashboard" onClick={closeNav} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors">
                    <LayoutDashboard size={16} className="text-white/50" />
                    <span className="text-sm text-white/70">My Dashboard</span>
                  </Link>
                  {!user?.vendorStore && (
                    <Link to="/create-store" onClick={closeNav} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors">
                      <Store size={16} className="text-white/50" />
                      <span className="text-sm text-white/70">Open a Store</span>
                    </Link>
                  )}
                  {user?.role === 'admin' && (
                    <Link to="/admin" onClick={closeNav} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(0,82,255,0.1)', border: '1px solid rgba(0,82,255,0.2)' }}>
                      <LayoutDashboard size={16} className="text-blue-neon" />
                      <span className="text-sm text-blue-neon font-medium">Admin Panel</span>
                    </Link>
                  )}
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors text-left">
                    <LogOut size={16} className="text-red-400/70" />
                    <span className="text-sm text-red-400/70">Sign Out</span>
                  </button>
                </div>
              )}

              {/* Theme switcher */}
              <div className="px-4 py-3 border-t border-white/6">
                <p className="text-white/30 text-xs uppercase tracking-wider mb-2 px-1">Theme</p>
                <div className="flex gap-2">
                  {themes.map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setTheme(key)}
                      className="flex-1 flex flex-col items-center gap-1 py-2 rounded-lg text-xs transition-all"
                      style={{
                        background: theme === key ? 'rgba(0,82,255,0.2)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${theme === key ? 'rgba(0,209,255,0.4)' : 'rgba(255,255,255,0.06)'}`,
                        color: theme === key ? '#00D1FF' : 'rgba(255,255,255,0.4)',
                      }}
                    >
                      <Icon size={14} />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Currency picker (mobile) */}
              <div className="px-4 py-3 border-t border-white/6">
                <p className="text-white/30 text-xs uppercase tracking-wider mb-2 px-1">Currency</p>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full input-glass text-sm"
                >
                  {currencies.map(c => <option key={c} value={c} style={{ background: '#0a0a0a' }}>{c}</option>)}
                </select>
              </div>

              {/* Footer links */}
              <div className="px-4 py-4 border-t border-white/6">
                <div className="flex flex-wrap gap-3">
                  {footerLinks.map(({ to, label }) => (
                    <Link key={to} to={to} onClick={closeNav} className="text-xs text-white/30 hover:text-white/60 transition-colors">
                      {label}
                    </Link>
                  ))}
                </div>
                <p className="text-white/15 text-xs mt-3 font-mono">A PROJECT BY AUREX-LABS</p>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
