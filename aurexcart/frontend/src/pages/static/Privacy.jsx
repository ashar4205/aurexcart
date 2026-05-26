import React from 'react';
import StaticPage, { Section } from './StaticPage';

export default function Privacy() {
  return (
    <StaticPage title="Privacy Policy" subtitle="We take your privacy seriously. Here's how we handle your data.">
      <Section title="1. Information We Collect">
        <p><strong className="text-white/80">Account Information:</strong> Name, email address, profile photo (if provided via Google), and account preferences.</p>
        <p><strong className="text-white/80">Vendor Information:</strong> CNIC/National ID number, payout account details (Payoneer, Easypaisa, or JazzCash), store name, and business information.</p>
        <p><strong className="text-white/80">Transaction Data:</strong> Order history, purchase amounts, shipping addresses, and payment references.</p>
        <p><strong className="text-white/80">Usage Data:</strong> Pages visited, products viewed, search queries, and interaction data (collected for platform analytics).</p>
        <p><strong className="text-white/80">Technical Data:</strong> IP address, browser type, device type, and operating system.</p>
      </Section>

      <Section title="2. How We Use Your Information">
        <p>We use collected information to: provide and improve the Platform, process transactions, communicate with users about orders and updates, verify vendor identities, prevent fraud and abuse, and generate anonymised platform analytics.</p>
      </Section>

      <Section title="3. Data Sharing">
        <p>We do not sell your personal information to third parties. We may share data with: payment processors (Payoneer, Easypaisa, JazzCash) to facilitate payouts, Google Firebase for authentication services, hosting providers for platform operation, and law enforcement when legally required.</p>
      </Section>

      <Section title="4. CNIC Data">
        <p>National ID numbers (CNIC) collected from vendors are used solely for identity verification purposes. This information is encrypted at rest and in transit. CNIC data is never shared with buyers, third parties, or used for marketing purposes.</p>
      </Section>

      <Section title="5. Cookies">
        <p>AurexCart uses cookies and similar technologies to maintain your session, remember preferences (theme, currency), and analyse platform usage. You can control cookie settings through your browser. Disabling essential cookies may impair Platform functionality.</p>
      </Section>

      <Section title="6. Data Retention">
        <p>We retain account data for as long as your account is active. Transaction data is retained for seven years for accounting and legal compliance. Analytics data is anonymised after 90 days. You can request account deletion by contacting support.</p>
      </Section>

      <Section title="7. Your Rights">
        <p>You have the right to: access your personal data, correct inaccurate data, request deletion of your data, object to certain data processing, data portability, and withdraw consent at any time. To exercise these rights, contact us through the Help Center.</p>
      </Section>

      <Section title="8. Security">
        <p>We implement industry-standard security measures including TLS encryption, hashed passwords, and access controls. However, no method of internet transmission is 100% secure. We encourage users to use strong, unique passwords.</p>
      </Section>

      <Section title="9. Children's Privacy">
        <p>AurexCart is not intended for users under 18 years of age. We do not knowingly collect personal information from minors. If you believe a minor has provided us with personal information, please contact us immediately.</p>
      </Section>

      <Section title="10. Changes to This Policy">
        <p>We may update this Privacy Policy periodically. We will notify you of significant changes via email or platform notification. Continued use of the Platform after changes constitutes acceptance.</p>
      </Section>
    </StaticPage>
  );
}
