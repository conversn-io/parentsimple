import Link from 'next/link'
import Image from 'next/image'
import { Calculator, BookOpen, TrendingUp, DollarSign, FileText, Video } from 'lucide-react'
import Footer from '../../components/Footer'

export default function RetirementPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#36596A] to-[#82A6B1] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-6">
              Retirement Planning Resources
            </h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Everything you need to plan your retirement with confidence. From calculators to guides, 
              we've got you covered on your journey to financial security.
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
                      src="/images/topics/happy-couple-gray-hard-back-embrace-meadow.png"
                      alt="Happy couple planning retirement"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[#36596A] mb-3">
                      The Complete Guide to Retirement Planning
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Learn the essential steps to create a comprehensive retirement plan that works for you.
                    </p>
                    <Link 
                      href="/articles/complete-retirement-planning-guide"
                      className="text-[#36596A] font-medium hover:underline"
                    >
                      Read More →
                    </Link>
                  </div>
                </article>

                <article className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-200 relative">
                    <Image
                      src="/images/topics/elder-man-beard-laptop-cell-phone.png"
                      alt="Senior using technology for retirement planning"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[#36596A] mb-3">
                      Social Security Optimization Strategies
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Maximize your Social Security benefits with these proven strategies and timing tips.
                    </p>
                    <Link 
                      href="/articles/social-security-optimization"
                      className="text-[#36596A] font-medium hover:underline"
                    >
                      Read More →
                    </Link>
                  </div>
                </article>
              </div>
            </section>

            {/* Calculators Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-serif font-semibold text-[#36596A] mb-8">Retirement Calculators</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="w-16 h-16 bg-[#E4CDA1] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calculator className="h-8 w-8 text-[#36596A]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#36596A] mb-2">Retirement Savings Calculator</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Calculate how much you need to save for retirement
                  </p>
                  <Link 
                    href="/calculators/retirement-savings"
                    className="inline-block bg-[#36596A] text-white px-4 py-2 rounded-lg hover:bg-[#2a4a5a] transition-colors"
                  >
                    Calculate Now
                  </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="w-16 h-16 bg-[#E4CDA1] rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="h-8 w-8 text-[#36596A]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#36596A] mb-2">Social Security Calculator</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Estimate your Social Security benefits
                  </p>
                  <Link 
                    href="/calculators/social-security"
                    className="inline-block bg-[#36596A] text-white px-4 py-2 rounded-lg hover:bg-[#2a4a5a] transition-colors"
                  >
                    Calculate Now
                  </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="w-16 h-16 bg-[#E4CDA1] rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-[#36596A]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#36596A] mb-2">Investment Growth Calculator</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Project your investment growth over time
                  </p>
                  <Link 
                    href="/calculators/investment-growth"
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
                        src="/images/topics/gray-hair-couple-walk-golden-retriever-park.png"
                        alt="Couple walking in park"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#36596A] mb-2">
                        How to Create a Retirement Budget That Works
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Learn how to create a realistic retirement budget that accounts for all your expenses and income sources.
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>5 min read</span>
                        <span className="mx-2">•</span>
                        <span>Retirement Planning</span>
                      </div>
                    </div>
                  </div>
                </article>

                <article className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 relative">
                      <Image
                        src="/images/topics/happy-senior-squat-fitness-class.png"
                        alt="Senior in fitness class"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#36596A] mb-2">
                        Health and Wellness in Retirement
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Discover how to maintain your health and wellness during retirement for a better quality of life.
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>4 min read</span>
                        <span className="mx-2">•</span>
                        <span>Health & Wellness</span>
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
                    className="block py-2 px-3 bg-[#F5F5F0] text-[#36596A] rounded-md font-medium"
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
                    className="block py-2 px-3 text-gray-600 hover:text-[#36596A] hover:bg-[#F5F5F0] rounded-md transition-colors"
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
                    href="/resources/retirement-checklist"
                    className="flex items-center space-x-3 text-gray-600 hover:text-[#36596A] transition-colors"
                  >
                    <FileText className="h-5 w-5" />
                    <span>Pre-Retirement Checklist</span>
                  </Link>
                  <Link 
                    href="/resources/retirement-guide"
                    className="flex items-center space-x-3 text-gray-600 hover:text-[#36596A] transition-colors"
                  >
                    <BookOpen className="h-5 w-5" />
                    <span>Complete Retirement Guide</span>
                  </Link>
                  <Link 
                    href="/videos/retirement"
                    className="flex items-center space-x-3 text-gray-600 hover:text-[#36596A] transition-colors"
                  >
                    <Video className="h-5 w-5" />
                    <span>Video Series</span>
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
