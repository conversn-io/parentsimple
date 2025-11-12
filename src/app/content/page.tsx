import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Content Library - SeniorSimple',
  description: 'Browse our library of retirement planning guides and resources',
};

export default function ContentLibraryPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-[#36596A] mb-4">Content Library</h1>
        <p className="text-lg text-gray-600 mb-8">
          Explore our comprehensive guides and resources for retirement planning.
        </p>
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-semibold text-[#36596A] mb-4">Featured Guides</h2>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link 
                    href="/content/tax-free-retirement-income-complete-guide" 
                    className="hover:text-[#36596A] transition-colors"
                  >
                    Tax-Free Retirement Income Guide
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/content/annuities-explained-secure-your-retirement-income-with-confidence" 
                    className="hover:text-[#36596A] transition-colors"
                  >
                    Annuities Explained
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/content/reverse-mortgage-vs-home-equity-loan-for-seniors-a-comprehensive-guide" 
                    className="hover:text-[#36596A] transition-colors"
                  >
                    Reverse Mortgage Guide
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/content/social-security-spousal-benefits-guide" 
                    className="hover:text-[#36596A] transition-colors"
                  >
                    Social Security Benefits
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-[#36596A] mb-4">Browse by Category</h2>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/retirement" className="hover:text-[#36596A] transition-colors">
                    Retirement Planning
                  </Link>
                </li>
                <li>
                  <Link href="/housing" className="hover:text-[#36596A] transition-colors">
                    Housing & Real Estate
                  </Link>
                </li>
                <li>
                  <Link href="/health" className="hover:text-[#36596A] transition-colors">
                    Healthcare & Medicare
                  </Link>
                </li>
                <li>
                  <Link href="/estate" className="hover:text-[#36596A] transition-colors">
                    Estate Planning
                  </Link>
                </li>
                <li>
                  <Link href="/tax" className="hover:text-[#36596A] transition-colors">
                    Tax Planning
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




