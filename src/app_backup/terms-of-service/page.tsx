import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use | ParentSimple',
  description: 'ParentSimple Terms of Use agreement, including arbitration and role disclosures.',
}

const LAST_UPDATED = 'December 16, 2024'
const GOVERNING_STATE = 'California'
const CONTACT_EMAIL = 'support@parentsimple.org'

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-[#F9F6EF]">
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-10">
        <header className="space-y-3">
          <p className="text-sm text-[#1A2B49]/60">Last Updated: {LAST_UPDATED}</p>
          <h1 className="text-3xl font-bold text-[#1A2B49]">ParentSimple Terms of Use Agreement</h1>
          <p className="text-[#1A2B49]/80">
            Please read this agreement carefully. It includes a binding arbitration agreement, a waiver of jury trial, and a
            waiver of participation in class, collective, or representative actions.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">1. Acceptance of This Agreement</h2>
          <p className="text-[#1A2B49]/80">
            These Terms of Use ("Agreement") govern your access to and use of websites, applications, tools, forms, and related
            services operated by ParentSimple ("ParentSimple," "we," "us," or "our") (collectively, the "Platform").
          </p>
          <p className="text-[#1A2B49]/80">
            By accessing, browsing, or using the Platform, you acknowledge that you have read, understand, and agree to be bound
            by this Agreement, our Privacy Policy, and our Electronic Consent Agreement (each incorporated by reference). If you
            do not agree, you must not access or use the Platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">2. Eligibility and Geographic Scope</h2>
          <p className="text-[#1A2B49]/80">
            The Platform is intended for individuals who are at least 18 years of age and who access the Platform from within the
            United States. By using the Platform, you represent and warrant that you meet these requirements.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">3. Definitions</h2>
          <ul className="list-disc pl-6 space-y-2 text-[#1A2B49]/80">
            <li>"You" or "Your" means the individual accessing or using the Platform.</li>
            <li>"Platform" means the ParentSimple websites, applications, forms, tools, and related services.</li>
            <li>
              "Network Partners" means independent third-party companies that may offer educational, financial, or related products or
              services and that may receive inquiries or information through the Platform.
            </li>
            <li>
              "Inquiry Form" means any form, questionnaire, or submission through which you request information, options, or
              potential connections related to college planning, education savings, or financial products or services.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">4. Role of ParentSimple</h2>
          <p className="text-[#1A2B49]/80">
            ParentSimple is not a lender, creditor, financial advisor, insurance producer, or agent of any consumer or provider. ParentSimple does not make credit decisions, underwrite, approve, or deny
            applications, determine eligibility, set pricing or terms, or originate, service, or fund loans or financial
            products.
          </p>
          <p className="text-[#1A2B49]/80">
            The Platform provides technology, educational content, and marketplace tools that allow users to explore options and
            be connected with independent Network Partners that may offer products or services of interest. All decisions
            regarding offers, eligibility, pricing, terms, and availability are made solely by Network Partners.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">5. Nature of Inquiries</h2>
          <p className="text-[#1A2B49]/80">
            Submitting an Inquiry Form is not an application for credit or insurance, does not guarantee that you will receive an
            offer or approval, and does not obligate you to proceed with any Network Partner. Any offer or eligibility
            determination is conditional and subject to additional verification, application steps, and criteria established by
            the Network Partner.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">6. Authorization to Obtain Consumer Reports and Conduct Research</h2>
          <p className="text-[#1A2B49]/80">
            By submitting an Inquiry Form, you expressly authorize ParentSimple and its Network Partners to obtain consumer reports,
            credit profiles, and other credit-related information; verify and supplement information you provide; and conduct
            research to evaluate eligibility, facilitate matching, and provide relevant information or recommendations. These
            activities may be conducted to respond to your inquiry, facilitate potential connections, provide information about
            products or services, for internal analytics, quality assurance, and fraud prevention.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">7. Information Sharing</h2>
          <p className="text-[#1A2B49]/80">
            You authorize ParentSimple to share your information with Network Partners and their service providers. Network Partners
            may further share information as necessary to evaluate your inquiry, provide products or services, comply with legal
            obligations, or maintain records. ParentSimple may also receive information from Network Partners regarding the status or
            outcome of inquiries for operational, compliance, analytics, and quality assurance purposes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">8. Electronic Communications</h2>
          <p className="text-[#1A2B49]/80">
            By using the Platform, you consent to receive communications electronically in accordance with the Electronic Consent
            Agreement, which governs notices, disclosures, documents, eligibility information, and other communications and is
            incorporated by reference.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">9. No Professional Advice</h2>
          <p className="text-[#1A2B49]/80">
            All content and information provided through the Platform is for informational and educational purposes only. Nothing
            on the Platform constitutes legal, financial, tax, insurance, or investment advice. You are solely responsible for
            evaluating any information obtained through the Platform and for decisions you make based on that information.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">10. Compensation Disclosure</h2>
          <p className="text-[#1A2B49]/80">
            ParentSimple may receive compensation from Network Partners in connection with consumer inquiries. Compensation may
            influence which Network Partners appear or are matched, and ParentSimple does not represent that all available products,
            services, or providers in the marketplace are included.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">11. User Responsibilities</h2>
          <p className="text-[#1A2B49]/80">
            You represent that all information you provide is true, accurate, current, and complete. You agree not to misuse the
            Platform, interfere with its operation, or use it for unlawful purposes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">12. Intellectual Property</h2>
          <p className="text-[#1A2B49]/80">
            All content, design, text, graphics, logos, software, and other materials on the Platform are owned by or licensed to
            ParentSimple and are protected by intellectual property laws. You may not copy, reproduce, distribute, modify, scrape, or
            exploit the Platform or its content without prior written permission.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">13. Disclaimers</h2>
          <p className="text-[#1A2B49]/80">
            THE PLATFORM AND ALL CONTENT ARE PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTIES OF ANY KIND, WHETHER
            EXPRESS, IMPLIED, OR STATUTORY. PARENTSIMPLE DISCLAIMS ALL WARRANTIES, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS
            FOR A PARTICULAR PURPOSE, ACCURACY, AVAILABILITY, AND NON-INFRINGEMENT. PARENTSIMPLE DOES NOT GUARANTEE ANY RESULT,
            OFFER, APPROVAL, OR OUTCOME.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">14. Limitation of Liability</h2>
          <p className="text-[#1A2B49]/80">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, PARENTSIMPLE SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, CONSEQUENTIAL,
            SPECIAL, OR PUNITIVE DAMAGES. PARENTSIMPLE'S TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF OR RELATING TO THE PLATFORM
            SHALL NOT EXCEED ONE HUNDRED U.S. DOLLARS ($100.00). Some jurisdictions do not allow certain limitations, so some
            provisions may not apply to you.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">15. Indemnification</h2>
          <p className="text-[#1A2B49]/80">
            You agree to indemnify and hold harmless ParentSimple, its officers, directors, employees, and affiliates from any
            claims, losses, liabilities, damages, and expenses arising out of your use of the Platform, violation of this
            Agreement, or violation of applicable law.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">16. Dispute Resolution and Arbitration</h2>
          <div className="space-y-2 text-[#1A2B49]/80">
            <p>
              <strong>a. Mandatory Arbitration.</strong> Any dispute arising out of or relating to this Agreement or the Platform
              shall be resolved through binding individual arbitration, except where prohibited by law.
            </p>
            <p>
              <strong>b. Class Action and Jury Trial Waiver.</strong> You waive the right to participate in any class, collective,
              or representative action and waive the right to a jury trial to the fullest extent permitted by law.
            </p>
            <p>
              <strong>c. Third-Party Beneficiaries.</strong> Network Partners that contact you in connection with your use of the
              Platform are intended third-party beneficiaries of this Dispute Resolution section and may enforce it.
            </p>
            <p>
              <strong>d. Governing Arbitration Law.</strong> The Federal Arbitration Act governs this arbitration agreement.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">17. Governing Law</h2>
          <p className="text-[#1A2B49]/80">
            Except as governed by the Federal Arbitration Act, this Agreement is governed by the laws of the State of{' '}
            {GOVERNING_STATE}, without regard to conflict-of-law principles.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">18. Modifications</h2>
          <p className="text-[#1A2B49]/80">
            ParentSimple may modify this Agreement at any time. Continued use of the Platform after changes are posted constitutes
            acceptance of the modified Agreement.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">19. Entire Agreement and Severability</h2>
          <p className="text-[#1A2B49]/80">
            This Agreement constitutes the entire agreement between you and ParentSimple regarding the Platform. If any provision is
            found unenforceable, the remaining provisions shall remain in full force and effect.
          </p>
        </section>        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">20. Contact Information</h2>
          <p className="text-[#1A2B49]/80">
            For questions regarding this Agreement, please contact:
          </p>
          <div className="text-[#1A2B49]/80 space-y-1">
            <p>ParentSimple</p>
            <p>{CONTACT_EMAIL}</p>
          </div>
        </section>
      </div>
    </main>
  )
}
