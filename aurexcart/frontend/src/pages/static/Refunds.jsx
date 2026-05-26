import React from 'react';
import StaticPage, { Section } from './StaticPage';

export default function Refunds() {
  return (
    <StaticPage title="Refund Policy" subtitle="Our policy on refunds, returns, and disputes.">
      <Section title="Digital Products — No Refund Policy">
        <p>Due to the instant and non-returnable nature of digital goods, all digital product sales are final once the download link has been accessed or the file has been delivered. Please read all product descriptions carefully before purchasing.</p>
        <p>Exceptions are considered if: the product file is corrupted or unreadable, the product is materially different from its description, or a technical error occurred during delivery.</p>
      </Section>
      <Section title="Physical Products & Used Electronics">
        <p>For physical items, including used electronics, you may request a refund if the item is significantly different from the listing description, arrives in a damaged condition due to shipping, or is non-functional upon arrival.</p>
        <p>Refund requests must be submitted within 7 days of confirmed delivery. Include clear photos and a detailed description of the issue when submitting a request.</p>
      </Section>
      <Section title="How to Request a Refund">
        <p>1. Navigate to your Dashboard and select My Orders. 2. Locate the relevant order and click "Report Issue." 3. Describe the problem and attach supporting evidence. 4. The vendor will respond within 48 hours. 5. If no resolution is reached, AurexCart support will mediate.</p>
      </Section>
      <Section title="Payout Reversal Timeline">
        <p>Approved refunds are processed within 5–10 business days. Refund timing depends on your bank or mobile wallet provider. AurexCart's 10% platform commission is non-refundable once a payout has been processed.</p>
      </Section>
      <Section title="Disputes">
        <p>AurexCart acts as a neutral mediator between buyers and vendors. Final refund decisions made by AurexCart staff are binding. Repeated abuse of the refund system may result in account suspension.</p>
      </Section>
    </StaticPage>
  );
}
