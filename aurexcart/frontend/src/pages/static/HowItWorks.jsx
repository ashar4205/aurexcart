import React from 'react';
import StaticPage, { Section } from './StaticPage';

export default function HowItWorks() {
  return (
    <StaticPage title="How It Works" subtitle="Your complete guide to buying and selling on AurexCart.">
      <Section title="For Buyers">
        <p><strong className="text-white/80">Browse Freely:</strong> No account needed to explore thousands of products across all categories — digital products, arts, illustrations, templates, software, and used electronics.</p>
        <p><strong className="text-white/80">Sign In to Order:</strong> Create a free account with Google or email. Then click "Order Now" on any product to add it to your cart.</p>
        <p><strong className="text-white/80">Checkout via Booking:</strong> Review your cart, enter your delivery details, and confirm your order. Digital products are delivered instantly to your email address.</p>
        <p><strong className="text-white/80">Track Orders:</strong> Monitor all your purchases from your personal Dashboard under "My Orders".</p>
      </Section>
      <Section title="For Sellers">
        <p><strong className="text-white/80">Create an Account:</strong> Register in seconds using Google or email.</p>
        <p><strong className="text-white/80">Open Your Store:</strong> Provide your store name, a short description, your CNIC for identity verification, and choose a payout channel — Payoneer, Easypaisa, or JazzCash.</p>
        <p><strong className="text-white/80">Get Approved:</strong> Our admin team reviews applications within 1–24 hours.</p>
        <p><strong className="text-white/80">List Products:</strong> Add products with photos, descriptions, and pricing. Digital products can include download files. You can even upload 3D models (GLB/GLTF) for an interactive 3D viewer.</p>
        <p><strong className="text-white/80">Manage & Earn:</strong> Track sales, views, and orders from your Vendor Dashboard. Payouts are processed via your chosen method, minus a 10% platform commission.</p>
      </Section>
      <Section title="Platform Features Summary">
        <p>Multi-currency display (USD, PKR, EUR, GBP, AED, SAR, INR, BDT, CAD, AUD) · Dark, Light, and Gradient themes · Social sharing with product link previews · 3D product viewer (GLB/GLTF) · Star ratings and multimedia reviews · Real-time stock tracking · Admin analytics dashboard with visitor, click, and share tracking.</p>
      </Section>
      <Section title="Fees & Commissions">
        <p>Opening a store and listing products is completely free. AurexCart earns a 10% commission on each completed sale. There are no monthly fees, listing fees, or hidden charges.</p>
      </Section>
    </StaticPage>
  );
}
