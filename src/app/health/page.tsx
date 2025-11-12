import Link from 'next/link'
import Image from 'next/image'
import { Calculator, BookOpen, Shield, Heart, DollarSign } from 'lucide-react'
import Footer from '../../components/Footer'

export default function HealthPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#36596A] to-[#82A6B1] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-6">
              Health & Medicare Resources
            </h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Navigate healthcare in retirement with confidence. Get the information you need 
              about Medicare, long-term care, and health savings.
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
                      src="/images/topics/happy-senior-squat-fitness-class.png"
                      alt="Senior in fitness class"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[#36596A] mb-3">
                      Medicare Enrollment Guide
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Everything you need to know about enrolling in Medicare at the right time.
                    </p>
                    <Link 
                      href="/articles/medicare-enrollment-guide"
                      className="text-[#36596A] font-medium hover:underline"
                    >
                      Read More →
                    </Link>
                  </div>
                </article>

                <article className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-200 relative">
                    <Image
                      src="/images/topics/senior-woman-hoop-earings-smile-portrait.png"
                      alt="Senior woman smiling"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[#36596A] mb-3">
                      Long-Term Care Planning
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Plan for your long-term care needs and understand your options.
                    </p>
                    <Link 
                      href="/articles/long-term-care-planning"
                      className="text-[#36596A] font-medium hover:underline"
                    >
                      Read More →
                    </Link>
                  </div>
                </article>
              </div>
            </section>

            {/* Medicare Tools Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-serif font-semibold text-[#36596A] mb-8">Medicare Tools</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="w-16 h-16 bg-[#E4CDA1] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calculator className="h-8 w-8 text-[#36596A]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#36596A] mb-2">Medicare Cost Calculator</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Calculate your Medicare costs and premiums
                  </p>
                  <Link 
                    href="/calculators/medicare-costs"
                    className="inline-block bg-[#36596A] text-white px-4 py-2 rounded-lg hover:bg-[#2a4a5a] transition-colors"
                  >
                    Calculate Now
                  </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="w-16 h-16 bg-[#E4CDA1] rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-[#36596A]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#36596A] mb-2">Medicare Enrollment Guide</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Step-by-step guide to Medicare enrollment
                  </p>
                  <Link 
                    href="/resources/medicare-guide"
                    className="inline-block bg-[#36596A] text-white px-4 py-2 rounded-lg hover:bg-[#2a4a5a] transition-colors"
                  >
                    Read Guide
                  </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="w-16 h-16 bg-[#E4CDA1] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-[#36596A]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#36596A] mb-2">Plan Comparison Tool</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Compare Medicare Advantage and Supplement plans
                  </p>
                  <Link 
                    href="/tools/medicare-comparison"
                    className="inline-block bg-[#36596A] text-white px-4 py-2 rounded-lg hover:bg-[#2a4a5a] transition-colors"
                  >
                    Compare Plans
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
                        src="/images/topics/sunny-outdoor-man-wheelchair-caretaker.png"
                        alt="Senior with caretaker"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#36596A] mb-2">
                        Understanding Medicare Part D
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Learn about prescription drug coverage and how to choose the right plan.
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>5 min read</span>
                        <span className="mx-2">•</span>
                        <span>Medicare</span>
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
                        Health Savings Account Guide
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Maximize your HSA benefits and understand contribution limits.
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>4 min read</span>
                        <span className="mx-2">•</span>
                        <span>Health Savings</span>
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
                    className="block py-2 px-3 bg-[#F5F5F0] text-[#36596A] rounded-md font-medium"
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
                    href="/resources/long-term-care"
                    className="flex items-center space-x-3 text-gray-600 hover:text-[#36596A] transition-colors"
                  >
                    <Heart className="h-5 w-5" />
                    <span>Long-Term Care Guide</span>
                  </Link>
                  <Link 
                    href="/resources/hsa-guide"
                    className="flex items-center space-x-3 text-gray-600 hover:text-[#36596A] transition-colors"
                  >
                    <DollarSign className="h-5 w-5" />
                    <span>HSA Guide</span>
                  </Link>
                  <Link 
                    href="/resources/medicare-guide"
                    className="flex items-center space-x-3 text-gray-600 hover:text-[#36596A] transition-colors"
                  >
                    <BookOpen className="h-5 w-5" />
                    <span>Medicare Guide</span>
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
