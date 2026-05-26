// Cookies.jsx
import React from 'react';
import StaticPage, { Section } from './StaticPage';

export function Cookies() {
  return (
    <StaticPage title="Cookie Policy" subtitle="How AurexCart uses cookies and similar tracking technologies.">
      <Section title="What Are Cookies?">
        <p>Cookies are small text files placed on your device when you visit a website. They help websites remember your preferences and improve your experience. AurexCart uses cookies to provide a smooth, personalised experience.</p>
      </Section>
      <Section title="Types of Cookies We Use">
        <p><strong className="text-white/80">Essential Cookies:</strong> Required for the Platform to function. These include session cookies (keeping you logged in) and security cookies. Cannot be disabled.</p>
        <p><strong className="text-white/80">Preference Cookies:</strong> Remember your settings like preferred currency, theme (dark/light), and language. Stored locally in your browser.</p>
        <p><strong className="text-white/80">Analytics Cookies:</strong> Help us understand how users interact with the Platform — which pages are visited, how long sessions last, etc. This data is anonymised.</p>
      </Section>
      <Section title="Managing Cookies">
        <p>You can control and delete cookies through your browser settings. Note that disabling essential cookies will prevent you from using core Platform features like logging in or adding items to your cart.</p>
      </Section>
      <Section title="Third-Party Cookies">
        <p>We use Google Firebase for authentication, which may set its own cookies. Please refer to Google's Privacy Policy for more information about how Firebase handles data.</p>
      </Section>
      <Section title="Updates">
        <p>This Cookie Policy may be updated from time to time. Continued use of the Platform constitutes acceptance of the updated policy.</p>
      </Section>
    </StaticPage>
  );
}

// Refunds.jsx
export function Refunds() {
  return (
    <StaticPage title="Refund Policy" subtitle="Our policy on refunds and returns.">
      <Section title="Digital Products">
        <p>Due to the nature of digital goods, all sales are final once a digital product has been downloaded or its access link has been used. Please review product descriptions carefully before purchasing.</p>
        <p>Exceptions may apply if: the product file is corrupted or cannot be opened, the product description is materially misleading, or the product does not function as described.</p>
      </Section>
      <Section title="Physical Products & Used Electronics">
        <p>For physical items (including used electronics), you may be eligible for a refund if: the item is significantly different from the listing description, the item arrives damaged due to shipping, or the item is non-functional.</p>
        <p>Refund requests must be submitted within 7 days of delivery. Contact the vendor through your order page and include photos of the issue.</p>
      </Section>
      <Section title="How to Request a Refund">
        <p>Step 1: Go to your Dashboard → My Orders. Step 2: Select the relevant order. Step 3: Click "Request Refund" and provide details. Step 4: The vendor has 48 hours to respond. Step 5: If unresolved, AurexCart's team will mediate.</p>
      </Section>
      <Section title="Processing Time">
        <p>Approved refunds are processed within 5–10 business days depending on your payout method. AurexCart's platform fees are non-refundable.</p>
      </Section>
    </StaticPage>
  );
}

// HowItWorks.jsx
export function HowItWorks() {
  return (
    <StaticPage title="How AurexCart Works" subtitle="Everything you need to know to start buying or selling.">
      <Section title="For Buyers">
        <p><strong className="text-white/80">Step 1 — Browse:</strong> Explore thousands of products across categories: digital products, arts, illustrations, templates, software, and used electronics — no account needed.</p>
        <p><strong className="text-white/80">Step 2 — Discover:</strong> Use search, category filters, or explore curated sections like "Products by Aurex Labs" and "Featured Products".</p>
        <p><strong className="text-white/80">Step 3 — Sign In:</strong> Create a free account with Google or email to place an order.</p>
        <p><strong className="text-white/80">Step 4 — Order:</strong> Click "Order Now", review your booking, enter delivery details (for physical items), and confirm. Digital products are delivered instantly to your email.</p>
      </Section>
      <Section title="For Sellers">
        <p><strong className="text-white/80">Step 1 — Create an Account:</strong> Sign up with Google or email in seconds.</p>
        <p><strong className="text-white/80">Step 2 — Open Your Store:</strong> Fill in your store name, description, CNIC (for verification), and choose a payout method (Payoneer, Easypaisa, or JazzCash).</p>
        <p><strong className="text-white/80">Step 3 — Get Approved:</strong> Our team reviews your store within 1–24 hours.</p>
        <p><strong className="text-white/80">Step 4 — List Products:</strong> Add products with photos, descriptions, pricing, and categories. Upload 3D models for an interactive viewer experience.</p>
        <p><strong className="text-white/80">Step 5 — Get Paid:</strong> When customers order your products, earnings are tracked in your Vendor Dashboard. Payouts are processed via your chosen method, minus AurexCart's 10% platform fee.</p>
      </Section>
      <Section title="Platform Features">
        <p>AurexCart includes: multi-currency display (10+ currencies), dark/light/gradient themes, social sharing with link previews, 3D product viewer, product reviews and star ratings, real-time stock tracking, and a full admin dashboard for platform owners.</p>
      </Section>
    </StaticPage>
  );
}

export default Cookies;
