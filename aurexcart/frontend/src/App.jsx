import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartSidebar from './components/layout/CartSidebar';
import LoadingScreen from './components/effects/LoadingScreen';
import { useAuthStore, useUIStore } from './store';
import api from './lib/api';

// ─── Lazy-loaded pages ───────────────────────────────────────────────────────
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Booking = lazy(() => import('./pages/Booking'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const VendorDashboard = lazy(() => import('./pages/VendorDashboard'));
const CreateStore = lazy(() => import('./pages/CreateStore'));
const VendorStore = lazy(() => import('./pages/VendorStore'));
const Search = lazy(() => import('./pages/Search'));
const AurexLabs = lazy(() => import('./pages/AurexLabs'));
const Vendors = lazy(() => import('./pages/Vendors'));
const FAQ = lazy(() => import('./pages/static/FAQ'));
const Terms = lazy(() => import('./pages/static/Terms'));
const Privacy = lazy(() => import('./pages/static/Privacy'));
const Cookies = lazy(() => import('./pages/static/Cookies'));
const Refunds = lazy(() => import('./pages/static/Refunds'));
const HowItWorks = lazy(() => import('./pages/static/HowItWorks'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Page spinner
const PageSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-blue-royal border-t-blue-neon animate-spin" />
  </div>
);

// Route with page transition
const PageTransition = ({ children }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <div key={location.pathname}>{children}</div>
    </AnimatePresence>
  );
};

export default function App() {
  const [showLoading, setShowLoading] = useState(true);
  const { restoreToken, isAuthenticated } = useAuthStore();
  const { theme, loadingDone, setLoadingDone } = useUIStore();

  // Restore auth token on mount
  useEffect(() => {
    restoreToken();
  }, []);

  // Apply theme class
  useEffect(() => {
    const html = document.documentElement;
    html.className = theme === 'dark' ? 'dark' : theme === 'light' ? 'light' : `theme-${theme}`;
  }, [theme]);

  const handleLoadingComplete = () => {
    setShowLoading(false);
    setLoadingDone();
  };

  return (
    <>
      {/* Loading Screen */}
      {showLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* App Shell */}
      <div className={`min-h-screen ${showLoading ? 'overflow-hidden' : ''}`}>
        <Navbar />

        {/* Main content — offset for fixed navbar */}
        <main className="pt-16">
          <Suspense fallback={<PageSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/category/:category" element={<Products />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/vendor-dashboard" element={<VendorDashboard />} />
              <Route path="/create-store" element={<CreateStore />} />
              <Route path="/store/:slug" element={<VendorStore />} />
              <Route path="/search" element={<Search />} />
              <Route path="/vendors" element={<Vendors />} />
              <Route path="/aurex-labs" element={<AurexLabs />} />
              {/* Static pages */}
              <Route path="/faq" element={<FAQ />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/refunds" element={<Refunds />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
        <CartSidebar />
      </div>

      {/* Toast notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { background: '#0a0a0a', color: '#fff', border: '1px solid rgba(0,209,255,0.2)', borderRadius: '12px', fontSize: '14px' },
          duration: 3000,
        }}
      />
    </>
  );
}
