import Link from 'next/link'
import Image from 'next/image'
import { Shield, FileText, Heart, BookOpen, Download } from 'lucide-react'
import Footer from '../../components/Footer'

export default function EstatePage() {
  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#36596A] to-[#82A6B1] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-6">
              Estate Planning Resources
            </h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Protect your legacy and ensure your loved ones are taken care of with comprehensive 
              estate planning tools and guidance.
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
                      alt="Couple planning their estate"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[#36596A] mb-3">
                      Essential Estate Planning Documents
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Learn about the key documents you need to protect your assets and family.
                    </p>
                    <Link 
                      href="/articles/essential-estate-planning-documents"
                      className="text-[#36596A] font-medium hover:underline"
                    >
                      Read More →
                    </Link>
                  </div>
                </article>

                <article className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-200 relative">
                    <Image
                      src="/images/topics/elder-woman-cell-phone.png"
                      alt="Senior woman reviewing estate documents"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[#36596A] mb-3">
                      Understanding Trusts and Wills
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Discover the differences between trusts and wills and when to use each.
                    </p>
                    <Link 
                      href="/articles/trusts-vs-wills"
                      className="text-[#36596A] font-medium hover:underline"
                    >
                      Read More →
                    </Link>
                  </div>
                </article>
              </div>
            </section>

            {/* Tools Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-serif font-semibold text-[#36596A] mb-8">Estate Planning Tools</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="w-16 h-16 bg-[#E4CDA1] rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-[#36596A]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#36596A] mb-2">Estate Planning Checklist</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Complete checklist to ensure nothing is overlooked
                  </p>
                  <Link 
                    href="/resources/estate-planning-checklist"
                    className="inline-block bg-[#36596A] text-white px-4 py-2 rounded-lg hover:bg-[#2a4a5a] transition-colors"
                  >
                    Get Checklist
                  </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="w-16 h-16 bg-[#E4CDA1] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-[#36596A]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#36596A] mb-2">Will & Trust Guide</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Comprehensive guide to wills and trusts
                  </p>
                  <Link 
                    href="/resources/will-trust-guide"
                    className="inline-block bg-[#36596A] text-white px-4 py-2 rounded-lg hover:bg-[#2a4a5a] transition-colors"
                  >
                    Read Guide
                  </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="w-16 h-16 bg-[#E4CDA1] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-[#36596A]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#36596A] mb-2">Beneficiary Planner</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Plan and organize your beneficiaries
                  </p>
                  <Link 
                    href="/tools/beneficiary-planner"
                    className="inline-block bg-[#36596A] text-white px-4 py-2 rounded-lg hover:bg-[#2a4a5a] transition-colors"
                  >
                    Start Planning
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
                        src="/images/topics/elder-woman-look-down-laptop-phone.png"
                        alt="Senior woman reviewing documents"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#36596A] mb-2">
                        Estate Tax Planning Strategies
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Learn how to minimize estate taxes and maximize what you leave to your heirs.
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>6 min read</span>
                        <span className="mx-2">•</span>
                        <span>Estate Planning</span>
                      </div>
                    </div>
                  </div>
                </article>

                <article className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 relative">
                      <Image
                        src="/images/topics/five-seniors-site-together-ipad.png"
                        alt="Family planning together"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#36596A] mb-2">
                        Talking to Your Family About Estate Planning
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Tips for having difficult conversations about your estate with loved ones.
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>4 min read</span>
                        <span className="mx-2">•</span>
                        <span>Family Communication</span>
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
                    className="block py-2 px-3 bg-[#F5F5F0] text-[#36596A] rounded-md font-medium"
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
                    href="/resources/estate-tax-guide"
                    className="flex items-center space-x-3 text-gray-600 hover:text-[#36596A] transition-colors"
                  >
                    <BookOpen className="h-5 w-5" />
                    <span>Estate Tax Guide</span>
                  </Link>
                  <Link 
                    href="/resources/power-attorney"
                    className="flex items-center space-x-3 text-gray-600 hover:text-[#36596A] transition-colors"
                  >
                    <Download className="h-5 w-5" />
                    <span>Power of Attorney Forms</span>
                  </Link>
                  <Link 
                    href="/resources/estate-planning-checklist"
                    className="flex items-center space-x-3 text-gray-600 hover:text-[#36596A] transition-colors"
                  >
                    <FileText className="h-5 w-5" />
                    <span>Estate Planning Checklist</span>
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
