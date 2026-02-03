import Link from 'next/link'
import Image from 'next/image'
import { Calculator, DollarSign, TrendingUp, BookOpen, FileText } from 'lucide-react'
import Footer from '../../components/Footer'

export default function TaxPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#36596A] to-[#82A6B1] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-6">
              Tax Planning Resources
            </h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Optimize your tax strategy in retirement. Learn about RMDs, Roth conversions, 
              and tax-efficient withdrawal strategies.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Articles */}
            <section className="mb-12">
              <h2 className="text-3xl font-serif font-semibold text-[#36596A] mb-8">Featured Articles</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <article className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-200 relative">
                    <Image
                      src="/images/topics/elder-man-beard-laptop-cell-phone.png"
                      alt="Senior reviewing tax documents"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[#36596A] mb-3">
                      Tax Strategy Guide for Retirees
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Comprehensive guide to tax planning strategies for retirement.
                    </p>
                    <Link 
                      href="/articles/tax-strategy-guide"
                      className="text-[#36596A] font-medium hover:underline"
                    >
                      Read More →
                    </Link>
                  </div>
                </article>

                <article className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-200 relative">
                    <Image
                      src="/images/topics/elder-woman-look-down-laptop-phone.png"
                      alt="Senior woman planning taxes"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[#36596A] mb-3">
                      IRA Withdrawal Strategies
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Learn the best strategies for withdrawing from your IRA.
                    </p>
                    <Link 
                      href="/articles/ira-withdrawal-strategies"
                      className="text-[#36596A] font-medium hover:underline"
                    >
                      Read More →
                    </Link>
                  </div>
                </article>
              </div>
            </section>

            {/* Tax Tools Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-serif font-semibold text-[#36596A] mb-8">Tax Tools</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="w-16 h-16 bg-[#E4CDA1] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calculator className="h-8 w-8 text-[#36596A]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#36596A] mb-2">Tax Impact Calculator</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Calculate the tax impact of different withdrawal strategies
                  </p>
                  <Link 
                    href="/calculators/tax-impact"
                    className="inline-block bg-[#36596A] text-white px-4 py-2 rounded-lg hover:bg-[#2a4a5a] transition-colors"
                  >
                    Calculate Now
                  </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="w-16 h-16 bg-[#E4CDA1] rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="h-8 w-8 text-[#36596A]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#36596A] mb-2">Roth Conversion Calculator</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Calculate the benefits of Roth IRA conversions
                  </p>
                  <Link 
                    href="/calculators/roth-conversion"
                    className="inline-block bg-[#36596A] text-white px-4 py-2 rounded-lg hover:bg-[#2a4a5a] transition-colors"
                  >
                    Calculate Now
                  </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="w-16 h-16 bg-[#E4CDA1] rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-[#36596A]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#36596A] mb-2">RMD Calculator</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Calculate your required minimum distributions
                  </p>
                  <Link 
                    href="/calculators/rmd"
                    className="inline-block bg-[#36596A] text-white px-4 py-2 rounded-lg hover:bg-[#2a4a5a] transition-colors"
                  >
                    Calculate Now
                  </Link>
                </div>
              </div>
            </section>

            {/* Latest Articles */}
            <section>
              <h2 className="text-3xl font-serif font-semibold text-[#36596A] mb-8">Latest Articles</h2>
              <div className="space-y-6">
                <article className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 relative">
                      <Image
                        src="/images/topics/five-seniors-site-together-ipad.png"
                        alt="Seniors discussing taxes"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#36596A] mb-2">
                        Understanding RMDs in Retirement
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Everything you need to know about Required Minimum Distributions.
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>5 min read</span>
                        <span className="mx-2">•</span>
                        <span>Tax Planning</span>
                      </div>
                    </div>
                  </div>
                </article>

                <article className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 relative">
                      <Image
                        src="/images/topics/elder-woman-cell-phone.png"
                        alt="Senior woman on phone"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#36596A] mb-2">
                        Tax-Efficient Withdrawal Strategies
                      </h3>
                      <p className="text-gray-600 mb-3">
                        How to minimize taxes when withdrawing from retirement accounts.
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>6 min read</span>
                        <span className="mx-2">•</span>
                        <span>Withdrawal Strategies</span>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Navigation */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-[#36596A] mb-4">Explore Topics</h3>
                <nav className="space-y-2">
                  <Link 
                    href="/retirement"
                    className="block py-2 px-3 text-gray-600 hover:text-[#36596A] hover:bg-[#F5F5F0] rounded-md transition-colors"
                  >
                    Retirement
                  </Link>
                  <Link 
                    href="/estate"
                    className="block py-2 px-3 text-gray-600 hover:text-[#36596A] hover:bg-[#F5F5F0] rounded-md transition-colors"
                  >
                    Estate Planning
                  </Link>
                  <Link 
                    href="/health"
                    className="block py-2 px-3 text-gray-600 hover:text-[#36596A] hover:bg-[#F5F5F0] rounded-md transition-colors"
                  >
                    Health & Medicare
                  </Link>
                  <Link 
                    href="/housing"
                    className="block py-2 px-3 text-gray-600 hover:text-[#36596A] hover:bg-[#F5F5F0] rounded-md transition-colors"
                  >
                    Housing
                  </Link>
                  <Link 
                    href="/tax"
                    className="block py-2 px-3 bg-[#F5F5F0] text-[#36596A] rounded-md font-medium"
                  >
                    Tax Planning
                  </Link>
                  <Link 
                    href="/insurance"
                    className="block py-2 px-3 text-gray-600 hover:text-[#36596A] hover:bg-[#F5F5F0] rounded-md transition-colors"
                  >
                    Insurance
                  </Link>
                </nav>
              </div>

              {/* Quick Resources */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-[#36596A] mb-4">Quick Resources</h3>
                <div className="space-y-3">
                  <Link 
                    href="/resources/tax-strategy"
                    className="flex items-center space-x-3 text-gray-600 hover:text-[#36596A] transition-colors"
                  >
                    <BookOpen className="h-5 w-5" />
                    <span>Tax Strategy Guide</span>
                  </Link>
                  <Link 
                    href="/resources/ira-withdrawal"
                    className="flex items-center space-x-3 text-gray-600 hover:text-[#36596A] transition-colors"
                  >
                    <FileText className="h-5 w-5" />
                    <span>IRA Withdrawal Guide</span>
                  </Link>
                  <Link 
                    href="/resources/rmd-guide"
                    className="flex items-center space-x-3 text-gray-600 hover:text-[#36596A] transition-colors"
                  >
                    <Calculator className="h-5 w-5" />
                    <span>RMD Guide</span>
                  </Link>
                </div>
              </div>

              {/* Advertisement Space */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-[#36596A] mb-4">Sponsored</h3>
                <div className="bg-[#F5F5F0] rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-3">Advertisement Space</p>
                  <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Ad Content</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
