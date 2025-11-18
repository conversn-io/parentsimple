import Link from 'next/link';
import { Logo } from './brand/Logo';
import { Mail, Phone, Users } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-[#1A2B49] text-[#F9F6EF]">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* About */}
          <div>
            <Logo variant="wordmark" size="md" className="text-[#F9F6EF] mb-4" />
            <p className="text-sm text-[#F9F6EF]/80 mb-4 leading-relaxed">
              Expert guidance for parents navigating college planning, education savings, and family financial security.
            </p>
            <p className="text-xs text-[#F9F6EF]/60 italic">
              "Parenting with Purpose. Planning with Power."
            </p>
          </div>

          {/* Resources */}
          <div>
            <h3 className="footer-heading text-lg font-serif font-bold mb-4 text-white">Resources</h3>
            <div className="space-y-3 text-sm">
              <Link href="/early-years" className="block text-[#F9F6EF]/80 hover:text-[#9DB89D] transition-colors">
                Early Years (0-10)
              </Link>
              <Link href="/middle-school" className="block text-[#F9F6EF]/80 hover:text-[#9DB89D] transition-colors">
                Middle School (11-14)
              </Link>
              <Link href="/high-school" className="block text-[#F9F6EF]/80 hover:text-[#9DB89D] transition-colors">
                High School (15-17)
              </Link>
              <Link href="/college-planning" className="block text-[#F9F6EF]/80 hover:text-[#9DB89D] transition-colors">
                College Planning
              </Link>
              <Link href="/financial-planning" className="block text-[#F9F6EF]/80 hover:text-[#9DB89D] transition-colors">
                Financial Planning
              </Link>
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="footer-heading text-lg font-serif font-bold mb-4 text-[#F9F6EF]">Tools & Calculators</h3>
            <div className="space-y-3 text-sm">
              <Link href="/calculators/college-savings" className="block text-[#F9F6EF]/80 hover:text-[#9DB89D] transition-colors">
                529 Plan Calculator
              </Link>
              <Link href="/calculators/college-cost" className="block text-[#F9F6EF]/80 hover:text-[#9DB89D] transition-colors">
                College Cost Calculator
              </Link>
              <Link href="/calculators/life-insurance" className="block text-[#F9F6EF]/80 hover:text-[#9DB89D] transition-colors">
                Life Insurance Calculator
              </Link>
              <Link href="/resources" className="block text-[#F9F6EF]/80 hover:text-[#9DB89D] transition-colors">
                All Tools & Guides
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="footer-heading text-lg font-serif font-bold mb-4 text-[#F9F6EF]">Get in Touch</h3>
            <div className="space-y-3 text-sm">
              <Link href="/contact" className="flex items-center gap-2 text-[#F9F6EF]/80 hover:text-[#9DB89D] transition-colors">
                <Users className="w-4 h-4" />
                Contact Us
              </Link>
              <Link href="/consultation" className="flex items-center gap-2 text-[#F9F6EF]/80 hover:text-[#9DB89D] transition-colors">
                <Users className="w-4 h-4" />
                Find a Consultant
              </Link>
              <a href="mailto:support@parentsimple.org" className="flex items-center gap-2 text-[#F9F6EF]/80 hover:text-[#9DB89D] transition-colors">
                <Mail className="w-4 h-4" />
                support@parentsimple.org
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-[#9DB89D]/30 pt-12 mb-12">
          <div className="max-w-2xl mx-auto text-center w-full">
            <h3 className="footer-heading text-2xl font-serif font-bold mb-4 text-[#F9F6EF]">
              Stay Informed
            </h3>
            <p className="text-[#F9F6EF]/80 mb-6">
              Get weekly insights on college planning, education savings, and financial strategies for parents.
            </p>
            {/* Newsletter signup would go here */}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#9DB89D]/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-6 text-xs text-[#F9F6EF]/60">
              <Link href="/privacy-policy" className="hover:text-[#9DB89D] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="hover:text-[#9DB89D] transition-colors">
                Terms of Service
              </Link>
              <Link href="/disclaimers" className="hover:text-[#9DB89D] transition-colors">
                Disclaimers
              </Link>
            </div>
            <p className="text-xs text-[#F9F6EF]/60">
              © 2024 ParentSimple. All rights reserved.
          </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
