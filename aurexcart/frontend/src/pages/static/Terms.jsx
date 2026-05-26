import React from 'react';
import StaticPage, { Section } from './StaticPage';

export default function Terms() {
  return (
    <StaticPage title="Terms & Conditions" subtitle={`Last updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`}>
      <Section title="1. Acceptance of Terms">
        <p>By accessing and using AurexCart ("the Platform"), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the Platform. AurexCart is operated by Aurex Labs.</p>
      </Section>

      <Section title="2. Platform Description">
        <p>AurexCart is a multi-vendor marketplace that allows registered vendors to sell digital products, artwork, illustrations, and used electronics to customers worldwide. We act solely as an intermediary platform and are not a direct buyer or seller of goods.</p>
      </Section>

      <Section title="3. User Accounts">
        <p>You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate, current, and complete information during registration. AurexCart reserves the right to terminate accounts that violate these terms.</p>
      </Section>

      <Section title="4. Vendor Obligations">
        <p>Vendors must provide valid CNIC (National Identity Number) and payout account details for identity verification. Vendors are solely responsible for the accuracy of product descriptions, pricing, and availability. Vendors must not list counterfeit, illegal, or prohibited items. AurexCart reserves the right to remove any listing that violates platform policies.</p>
        <p>Vendors agree to a platform commission of 10% on each completed sale. Payouts are processed through Payoneer, Easypaisa, or JazzCash as selected during registration.</p>
      </Section>

      <Section title="5. Buyer Obligations">
        <p>Buyers agree to provide accurate shipping and contact information. All purchases are final unless a product is significantly different from its description. For digital products, refunds are not available once the download link has been accessed.</p>
      </Section>

      <Section title="6. Prohibited Content">
        <p>The following are strictly prohibited on AurexCart: illegal items or services, counterfeit goods, adult content, content promoting violence or discrimination, malware or harmful software, items that infringe intellectual property rights.</p>
      </Section>

      <Section title="7. Intellectual Property">
        <p>All content on the Platform, including logos, brand assets, and original product listings, remain the property of their respective owners. Users grant AurexCart a non-exclusive license to display and promote their listings on the Platform.</p>
      </Section>

      <Section title="8. Limitation of Liability">
        <p>AurexCart is not liable for any indirect, incidental, or consequential damages arising from the use of the Platform. Our maximum liability shall not exceed the amount paid by the user in the twelve months preceding the claim.</p>
      </Section>

      <Section title="9. Privacy">
        <p>Your use of the Platform is also governed by our Privacy Policy, which is incorporated into these Terms by reference.</p>
      </Section>

      <Section title="10. Governing Law">
        <p>These Terms shall be governed by the laws of Pakistan. Any disputes shall be subject to the exclusive jurisdiction of the courts of Pakistan.</p>
      </Section>

      <Section title="11. Changes to Terms">
        <p>AurexCart reserves the right to modify these Terms at any time. Continued use of the Platform after changes constitutes acceptance of the new Terms. Users will be notified of significant changes via email or platform notifications.</p>
      </Section>

      <Section title="12. Contact">
        <p>For questions regarding these Terms, please contact us through the Help Center or visit <a href="https://aurexlabs.netlify.app/" target="_blank" rel="noopener noreferrer" style={{ color: '#00D1FF' }}>aurexlabs.netlify.app</a>.</p>
      </Section>
    </StaticPage>
  );
}
