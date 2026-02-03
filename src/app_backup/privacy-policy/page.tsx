import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | ParentSimple',
  description: 'How ParentSimple collects, uses, and protects your information.',
}

const LAST_UPDATED = 'December 16, 2024'

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#F9F6EF]">
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-10">
        <header className="space-y-2">
          <p className="text-sm text-[#1A2B49]/60">Last Updated: {LAST_UPDATED}</p>
          <h1 className="text-3xl font-bold text-[#1A2B49]">Privacy Policy</h1>
          <p className="text-[#1A2B49]/80">
            ParentSimple ("Company," "we," "us," or "our"), respects your privacy and is committed
            to protecting it through our compliance with this Privacy Policy.
          </p>
          <p className="text-[#1A2B49]/80">
            By using the Site or otherwise providing information to us, you agree to the terms of this Privacy Policy. If you do
            not agree with any term herein, please discontinue using our Site and/or providing any personal information to us.
          </p>
        </header>

        <section className="space-y-2">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">1. Who We Are</h2>
          <div className="text-[#1A2B49]/80 space-y-1">
            <p>Business Name: ParentSimple</p>
            <p>Contact Email: support@parentsimple.org</p>
          </div>
          <p className="text-[#1A2B49]/80">
            If you have any questions about this Privacy Policy or how we handle your personal information, please contact us
            using the information above.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">2. Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-1 text-[#1A2B49]/80">
            <li>
              <strong>Personal Information:</strong> Information that can be used to identify you, such as your name, email address,
              phone number, postal address, or other identifiers by which you may be contacted online or offline.
            </li>
            <li>
              <strong>Non-Personal Information:</strong> Information that does not directly reveal your identity, such as browser
              information, device information, and statistical data regarding your use of the Site.
            </li>
            <li>
              <strong>User Contributions:</strong> You may also provide information for us to publish or display on public areas of
              the Site or transmit to other users ("User Content").
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">3. How We Collect Information</h2>
          <ul className="list-disc pl-6 space-y-1 text-[#1A2B49]/80">
            <li>
              <strong>Directly From You:</strong> When you fill out forms on our Site, register for services, subscribe to our
              newsletter, or otherwise communicate with us.
            </li>
            <li>
              <strong>Automatically:</strong> Through tracking technologies (e.g., cookies, web beacons, log files) as you navigate
              the Site, which helps us understand usage patterns and improve user experience.
            </li>
            <li>
              <strong>From Third Parties:</strong> We may receive information about you from third parties, such as analytics
              providers, social media platforms, and service partners, where they have a legal basis to share it with us. User
              Content is posted on and transmitted to others at your own risk.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">4. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-1 text-[#1A2B49]/80">
            <li>Operate, maintain, and improve our Site and services.</li>
            <li>Personalize your experience with the Site.</li>
            <li>Provide you with information, products, or services you request from us.</li>
            <li>Send you newsletters or marketing communications, where you have opted in to receive them.</li>
            <li>Respond to your inquiries and provide customer support.</li>
            <li>Analyze how you use the Site and improve its content and functionality.</li>
            <li>Comply with any legal obligations and enforce our Terms and Conditions.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">5. Disclosure of Your Information</h2>
          <ul className="list-disc pl-6 space-y-1 text-[#1A2B49]/80">
            <li>
              <strong>To Affiliates and Service Providers:</strong> We may share your information with our affiliates, contractors,
              service providers, and other third parties we use to support our business, provided they agree to keep your
              information confidential.
            </li>
            <li>
              <strong>Business Transfers:</strong> If we are involved in a merger, acquisition, reorganization, bankruptcy, or sale
              of all or a portion of our assets, user information may be transferred as part of that transaction.
            </li>
            <li>
              <strong>Legal Compliance:</strong> We may disclose your information if required to do so by law or in response to a
              court order, subpoena, or other legal request.
            </li>
            <li>
              <strong>With Your Consent:</strong> We may share your information for any other purpose disclosed by us when you
              provide the information or with your consent.
            </li>
          </ul>
          <p className="text-[#1A2B49]/80">
            We do not sell or rent your personal information to third parties for their marketing purposes without your explicit
            consent.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">6. Cookies and Other Tracking Technologies</h2>
          <p className="text-[#1A2B49]/80">
            We use cookies and similar technologies to collect information about how you use our Site, to remember your
            preferences, and to serve relevant content. You can adjust your browser settings to refuse all or some browser cookies,
            or to alert you when cookies are being sent. However, if you disable or refuse cookies, some parts of the Site may
            become inaccessible or not function properly.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">7. Data Security</h2>
          <p className="text-[#1A2B49]/80">
            We take reasonable measures to secure your personal information from accidental loss and from unauthorized access, use,
            alteration, and disclosure. However, transmission of information over the internet is not entirely secure, and we
            cannot guarantee the security of your personal information transmitted to or through our Site. Any transmission of
            personal information is at your own risk.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">8. Data Retention</h2>
          <p className="text-[#1A2B49]/80">
            We retain personal information only for as long as necessary to fulfill the purposes for which we collected it,
            including to satisfy any legal, accounting, or reporting requirements. The duration for which we retain personal
            information may vary depending on the nature of the information and the purpose for which it was collected.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">9. Children&apos;s Privacy</h2>
          <p className="text-[#1A2B49]/80">
            Our Site is not intended for children under the age of 13. We do not knowingly collect personal information from
            children under 13 (or older if required by applicable law). If you believe we may have collected personal information
            from a child, please contact us using the information provided at the beginning of this Privacy Policy.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">10. Your Rights and Choices</h2>
          <p className="text-[#1A2B49]/80">Depending on where you live, you may have certain rights regarding your personal information, such as:</p>
          <ul className="list-disc pl-6 space-y-1 text-[#1A2B49]/80">
            <li><strong>Access:</strong> You may have the right to request access to the personal information we hold about you.</li>
            <li><strong>Rectification:</strong> You may have the right to correct any inaccurate or incomplete personal information.</li>
            <li><strong>Deletion:</strong> You may have the right to request deletion of your personal information, subject to legal exceptions.</li>
            <li><strong>Objection:</strong> You may have the right to object to certain processing of your personal information.</li>
            <li><strong>Withdraw Consent:</strong> If processing is based on your consent, you may withdraw that consent at any time.</li>
          </ul>
          <p className="text-[#1A2B49]/80">
            To exercise these rights, please contact us using the details in the "Contact Us" section. We will respond to your
            request in accordance with applicable law.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">11. International Data Transfers</h2>
          <p className="text-[#1A2B49]/80">
            If you are accessing our Site from outside the United States, please note that we may store and process your personal
            information in the United States or other countries. The data protection laws of these countries may differ from those
            in your country, but we will take appropriate measures to ensure that your personal information remains protected in
            accordance with this Privacy Policy.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">12. Third-Party Websites</h2>
          <p className="text-[#1A2B49]/80">
            Our Site may contain links to third-party websites that we do not control. We are not responsible for the privacy
            practices or content of these third-party websites. We encourage you to review the privacy policies of any website you
            visit.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">13. Changes to This Privacy Policy</h2>
          <p className="text-[#1A2B49]/80">
            We may update this Privacy Policy from time to time at our sole discretion. If we make material changes, we will notify
            you by updating the "Last Updated" date at the top of this page. Your continued use of our Site after we make changes
            is deemed to be acceptance of those changes, so please check the policy periodically for updates.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">14. Contact Us</h2>
          <div className="text-[#1A2B49]/80 space-y-1">
            <p>ParentSimple</p>
            <p>support@parentsimple.org</p>
          </div>
        </section>        <footer className="pt-6 text-sm text-[#1A2B49]/60">
          <p>Copyright © {new Date().getFullYear()} ParentSimple. All rights reserved.</p>
        </footer>
      </div>
    </main>
  )
}
