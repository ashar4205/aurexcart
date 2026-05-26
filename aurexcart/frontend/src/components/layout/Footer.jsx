import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

const LogoSVG = () => (
  <svg width="32" height="32" viewBox="0 0 64 64" fill="none">
    <rect width="64" height="64" rx="10" fill="black" fillOpacity="0.5" />
    <polygon points="32,5 55,18 55,46 32,59 9,46 9,18" fill="none" stroke="url(#fl1)" strokeWidth="1.5" opacity="0.7" />
    <path d="M21 50 L32 18 L43 50" stroke="url(#fl2)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M25 39 L39 39" stroke="url(#fl3)" strokeWidth="3" strokeLinecap="round" />
    <circle cx="32" cy="16" r="3" fill="#00D1FF" />
    <defs>
      <linearGradient id="fl1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#00D1FF" stopOpacity="0.8" /><stop offset="100%" stopColor="#0052FF" stopOpacity="0.3" /></linearGradient>
      <linearGradient id="fl2" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#00D1FF" /><stop offset="100%" stopColor="#0052FF" /></linearGradient>
      <linearGradient id="fl3" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#0052FF" /><stop offset="100%" stopColor="#00D1FF" /></linearGradient>
    </defs>
  </svg>
);

const footerSections = [
  {
    title: 'Marketplace',
    links: [
      { label: 'All Products', to: '/products' },
      { label: 'Digital Products', to: '/category/digital-products' },
      { label: 'Arts & Illustrations', to: '/category/arts' },
      { label: 'Used Electronics', to: '/category/electronics-used' },
      { label: 'Aurex Labs Store', to: '/aurex-labs' },
      { label: 'All Stores', to: '/vendors' },
    ],
  },
  {
    title: 'Sellers',
    links: [
      { label: 'Open Your Store', to: '/create-store' },
      { label: 'Seller Dashboard', to: '/dashboard' },
      { label: 'How It Works', to: '/how-it-works' },
      { label: 'Supported Payouts', to: '/payouts' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'FAQ', to: '/faq' },
      { label: 'Contact Us', to: '/contact' },
      { label: 'Help Center', to: '/help' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms & Conditions', to: '/terms' },
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Cookie Policy', to: '/cookies' },
      { label: 'Refund Policy', to: '/refunds' },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <LogoSVG />
              <span className="font-bold font-display text-xl" style={{ color: '#00D1FF' }}>
                Aurex<span className="text-white">Cart</span>
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-xs">
              The premium multi-vendor marketplace for digital products, art, illustrations, and more. Built for creators and buyers worldwide.
            </p>
            <a
              href="https://aurexlabs.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono transition-all hover:opacity-80"
              style={{ color: '#00D1FF', textShadow: '0 0 8px rgba(0,209,255,0.5)' }}
            >
              A PROJECT BY AUREX-LABS
              <ExternalLink size={11} />
            </a>

            {/* Neon divider */}
            <div className="neon-track mt-6 w-32" />
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold font-display text-white text-sm mb-4 tracking-wide">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map(({ label, to }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-white/40 text-sm hover:text-white/80 transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} AurexCart. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/terms" className="text-white/25 text-xs hover:text-white/50 transition-colors">Terms</Link>
            <Link to="/privacy" className="text-white/25 text-xs hover:text-white/50 transition-colors">Privacy</Link>
            <Link to="/cookies" className="text-white/25 text-xs hover:text-white/50 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
