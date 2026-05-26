import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import StaticPage from './StaticPage';

const faqs = [
  {
    category: 'General',
    items: [
      { q: 'What is AurexCart?', a: 'AurexCart is a multi-vendor marketplace where independent sellers can list and sell digital products, artwork, illustrations, software, templates, and used electronics. Buyers can browse, discover, and purchase from multiple stores in one place.' },
      { q: 'Is AurexCart free to use?', a: 'Yes! Browsing and purchasing on AurexCart is completely free with no hidden fees. Opening a store as a vendor is also free. AurexCart earns a small 10% commission on completed sales to maintain the platform.' },
      { q: 'Do I need an account to browse products?', a: 'No! You can browse all products and stores without signing up. An account is only required to place an order, open a store, or leave a review.' },
      { q: 'How do I sign up?', a: 'You can sign up instantly using your Google account (via Gmail) or by registering with an email and password. Click "Sign In" in the top navigation to get started.' },
    ],
  },
  {
    category: 'Buying',
    items: [
      { q: 'How do I place an order?', a: 'Browse products, click "Order Now" on any product to add it to your cart. When ready, go to your Booking page, review your items, fill in your details, and confirm your order. You\'ll need to be signed in to complete a purchase.' },
      { q: 'What currencies are supported?', a: 'AurexCart supports multiple currencies including USD, PKR, EUR, GBP, AED, SAR, INR, BDT, CAD, and AUD. You can switch your display currency from the navigation bar or your account preferences. Note: All transactions are processed in USD.' },
      { q: 'How are digital products delivered?', a: 'Digital products are delivered instantly after order confirmation. Download links are sent to your registered email address. No shipping required!' },
      { q: 'What is the return policy?', a: 'For digital products, refunds are not available once the download has been accessed, as the product is immediately delivered. For physical items, contact the vendor directly within 7 days of delivery. AurexCart facilitates dispute resolution between buyers and vendors.' },
      { q: 'Is my payment information secure?', a: 'AurexCart uses industry-standard encryption for all data transmission. We do not store raw payment card details.' },
    ],
  },
  {
    category: 'Selling / Opening a Store',
    items: [
      { q: 'How do I open a store on AurexCart?', a: 'Sign in to your account, then click "Open Your Store" in the navigation or your dashboard. Complete the three-step form: provide store details, enter your CNIC for verification, and select your payout method. Your store will be reviewed within 24 hours.' },
      { q: 'What information do I need to open a store?', a: 'You need: a store name and description, your CNIC (National Identity Number) for identity verification, and a payout account — either Payoneer, Easypaisa, or JazzCash. Social media links are optional.' },
      { q: 'Why is CNIC required?', a: 'CNIC verification ensures seller accountability, reduces fraud, and protects buyers. Your CNIC is encrypted and never shared with buyers or third parties.' },
      { q: 'Which payout methods are available?', a: 'AurexCart currently supports three payout methods: Payoneer (international transfers), Easypaisa (Pakistan mobile wallet), and JazzCash (Pakistan mobile wallet). More methods may be added in future.' },
      { q: 'How long does store approval take?', a: 'Store applications are reviewed by our admin team within 1–24 hours. You will receive a notification once your store is approved or if any additional information is needed.' },
      { q: 'Can I sell used electronics?', a: 'Yes! AurexCart has a dedicated "Used Electronics" category for pre-owned devices and accessories. List your items with accurate descriptions and photos to attract buyers.' },
      { q: 'Can I add 3D product previews?', a: 'Yes! When adding a product, you can upload a 3D model file (GLB/GLTF format). Customers will be able to view and interact with it in a 3D viewer directly on the product page.' },
    ],
  },
  {
    category: 'Account & Settings',
    items: [
      { q: 'Can I change my display currency?', a: 'Yes. You can change your preferred currency from the navigation bar dropdown or from your Account Dashboard under Preferences. The change applies immediately to all displayed prices.' },
      { q: 'Can I change the site theme?', a: 'AurexCart supports multiple themes: Dark (default), Light, Blue Gradient, and Purple Gradient. You can switch themes from the navigation drawer or your Account Dashboard.' },
      { q: 'How do I delete my account?', a: 'To request account deletion, please contact our support team through the Help Center. Note that vendor accounts with pending transactions may not be immediately deletable.' },
      { q: 'I forgot my password. What do I do?', a: 'Use the "Forgot Password" link on the login page. If you signed up with Google, simply use the Google login button — no password needed.' },
    ],
  },
  {
    category: 'Aurex Labs',
    items: [
      { q: 'What is Aurex Labs?', a: 'Aurex Labs is the creative studio that built and operates AurexCart. They also list their own premium digital products — UI kits, templates, and creative assets — in the "Products by Aurex Labs" section.' },
      { q: 'Where can I learn more about Aurex Labs?', a: 'Visit aurexlabs.netlify.app to learn more about Aurex Labs, their other projects, and services.' },
    ],
  },
];

function FAQItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/6 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left transition-colors hover:text-white"
      >
        <span className={`text-sm font-medium transition-colors ${open ? 'text-white' : 'text-white/70'}`}>{item.q}</span>
        <ChevronDown size={16} className={`flex-shrink-0 text-white/40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm text-white/50 leading-relaxed">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  return (
    <StaticPage title="Frequently Asked Questions" subtitle="Find answers to the most common questions about AurexCart.">
      {faqs.map(section => (
        <div key={section.category}>
          <h2 className="text-white font-semibold font-display text-base mb-3 pb-2 border-b border-white/8">{section.category}</h2>
          <div className="mb-6">
            {section.items.map(item => <FAQItem key={item.q} item={item} />)}
          </div>
        </div>
      ))}
    </StaticPage>
  );
}
