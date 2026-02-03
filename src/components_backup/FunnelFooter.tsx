import Link from 'next/link';

const FunnelFooter = () => {
  return (
    <footer className="py-12 px-6 bg-gray-50 border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        {/* Standard Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-[#36596A] mb-4">Get in Touch</h3>
            <div className="space-y-2 text-gray-600">
              <Link href="/contact" className="block hover:text-[#36596A] transition-colors">
                Contact Us
              </Link>
              {/* <p>Phone: (888) 440-9669</p> */}
              <p>Email: info@seniorsimple.com</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#36596A] mb-4">Resources</h3>
            <div className="space-y-2 text-gray-600">
              <Link href="/retirement" className="block hover:text-[#36596A] transition-colors">
                Retirement Rescue™
              </Link>
              <Link href="/housing" className="block hover:text-[#36596A] transition-colors">
                Housing & Real Estate
              </Link>
              <Link href="/health" className="block hover:text-[#36596A] transition-colors">
                Healthcare & Medicare
              </Link>
              <Link href="/estate" className="block hover:text-[#36596A] transition-colors">
                Estate Planning
              </Link>
              <Link href="/tax" className="block hover:text-[#36596A] transition-colors">
                Tax Planning
              </Link>
              <Link href="/insurance" className="block hover:text-[#36596A] transition-colors">
                Insurance
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#36596A] mb-4">Featured Content</h3>
            <div className="space-y-2 text-gray-600">
              <Link href="/content" className="block hover:text-[#36596A] transition-colors" prefetch={false}>
                Content Library
              </Link>
              <Link href="/content/tax-free-retirement-income-complete-guide" className="block hover:text-[#36596A] transition-colors">
                Tax-Free Retirement Guide
              </Link>
              <Link href="/content/annuities-explained-secure-your-retirement-income-with-confidence" className="block hover:text-[#36596A] transition-colors">
                Annuities Explained
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#36596A] mb-4">Legal & Compliance</h3>
            <div className="space-y-2 text-gray-600">
              <Link href="/privacy-policy" className="block hover:text-[#36596A] transition-colors" prefetch={false}>
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="block hover:text-[#36596A] transition-colors" prefetch={false}>
                Terms of Service
              </Link>
              <Link href="/disclaimers" className="block hover:text-[#36596A] transition-colors" prefetch={false}>
                Disclaimers
              </Link>
              <Link href="/compliance" className="block hover:text-[#36596A] transition-colors" prefetch={false}>
                Compliance Information
              </Link>
            </div>
          </div>
        </div>

        {/* Funnel-Specific Disclaimer Section */}
        <div className="border-t border-gray-200 pt-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-4">Important Disclaimers</h3>
            <div className="text-sm text-yellow-800 space-y-3">
              <p>
                <strong>Insurance Products:</strong> Insurance products are offered through licensed insurance professionals. 
                Not all products are available in all states. Product availability and terms may vary by state.
              </p>
              <p>
                <strong>Financial Advice:</strong> The information provided is for educational purposes only and does not 
                constitute financial, tax, or legal advice. Consult with qualified professionals before making financial decisions.
              </p>
              <p>
                <strong>Licensing:</strong> Our licensed professionals are authorized to sell insurance products in the states 
                where they are licensed. Licensing information is available upon request.
              </p>
              <p>
                <strong>Third-Party Services:</strong> We may connect you with third-party service providers. We are not 
                responsible for the services or advice provided by third parties.
              </p>
            </div>
          </div>

          {/* Compliance Links */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold text-[#36596A] mb-3">Regulatory Information</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <Link href="/compliance/insurance-licensing" className="block hover:text-[#36596A] transition-colors" prefetch={false}>
                  Insurance Licensing Information
                </Link>
                <Link href="/compliance/state-requirements" className="block hover:text-[#36596A] transition-colors" prefetch={false}>
                  State-Specific Requirements
                </Link>
                <Link href="/compliance/consumer-protection" className="block hover:text-[#36596A] transition-colors" prefetch={false}>
                  Consumer Protection Rights
                </Link>
                <Link href="/compliance/do-not-call" className="block hover:text-[#36596A] transition-colors" prefetch={false}>
                  Do Not Call Registry
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-[#36596A] mb-3">Legal Documents</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <Link href="/privacy-policy" className="block hover:text-[#36596A] transition-colors" prefetch={false}>
                  Privacy Policy
                </Link>
                <Link href="/terms-of-service" className="block hover:text-[#36596A] transition-colors" prefetch={false}>
                  Terms of Service
                </Link>
                <Link href="/legal/cookie-policy" className="block hover:text-[#36596A] transition-colors" prefetch={false}>
                  Cookie Policy
                </Link>
                <Link href="/legal/accessibility" className="block hover:text-[#36596A] transition-colors" prefetch={false}>
                  Accessibility Statement
                </Link>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              © 2024 SeniorSimple. All rights reserved. | Licensed Insurance Agency
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FunnelFooter;






