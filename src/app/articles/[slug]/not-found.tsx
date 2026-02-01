import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F5F5F0]">


      {/* Not Found Content */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-[#36596A] mb-4">404</h1>
          <h2 className="text-3xl font-serif font-semibold text-gray-800 mb-6">
            Article Not Found
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The article you&apos;re looking for doesn&apos;t exist or may have been moved. 
            Let&apos;s get you back to exploring our retirement planning resources.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/articles"
              className="bg-[#36596A] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#2a4a5a] transition-colors"
            >
              Browse All Articles
            </Link>
            <Link 
              href="/"
              className="border-2 border-[#36596A] text-[#36596A] px-8 py-3 rounded-lg font-medium hover:bg-[#36596A] hover:text-white transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* Suggested Articles */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-serif font-semibold text-[#36596A] text-center mb-12">
            Popular Articles
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#F5F5F0] rounded-lg p-6 border border-gray-200">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-[#E4CDA1] text-[#36596A] text-sm font-medium rounded-full">
                  Annuities
                </span>
              </div>
              <h3 className="text-lg font-semibold text-[#36596A] mb-3">
                Understanding Fixed Index Annuities
              </h3>
              <p className="text-gray-600 mb-4">
                Learn how fixed index annuities can provide guaranteed income while protecting your principal.
              </p>
              <Link href="/articles" className="text-[#36596A] font-medium hover:underline">
                Browse Articles →
              </Link>
            </div>

            <div className="bg-[#F5F5F0] rounded-lg p-6 border border-gray-200">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-[#E4CDA1] text-[#36596A] text-sm font-medium rounded-full">
                  Tax Planning
                </span>
              </div>
              <h3 className="text-lg font-semibold text-[#36596A] mb-3">
                Tax-Efficient Retirement Strategies
              </h3>
              <p className="text-gray-600 mb-4">
                Discover strategies to minimize taxes in retirement and maximize your income.
              </p>
              <Link href="/articles" className="text-[#36596A] font-medium hover:underline">
                Browse Articles →
              </Link>
            </div>

            <div className="bg-[#F5F5F0] rounded-lg p-6 border border-gray-200">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-[#E4CDA1] text-[#36596A] text-sm font-medium rounded-full">
                  Estate Planning
                </span>
              </div>
              <h3 className="text-lg font-semibold text-[#36596A] mb-3">
                Protecting Your Legacy
              </h3>
              <p className="text-gray-600 mb-4">
                Essential steps to ensure your assets are protected and passed on according to your wishes.
              </p>
              <Link href="/articles" className="text-[#36596A] font-medium hover:underline">
                Browse Articles →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-[#36596A] mb-4">Get in Touch</h3>
              <div className="space-y-2 text-gray-600">
                <p>Contact Us</p>
                <p>Phone: 800-555-2040</p>
                <p>Email: support@seniorsimple.org</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#36596A] mb-4">Resources</h3>
              <div className="space-y-2 text-gray-600">
                <p>Annuities</p>
                <p>Estate Planning</p>
                <p>Health</p>
                <p>Housing</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#36596A] mb-4">About</h3>
              <div className="space-y-2 text-gray-600">
                <p>Mission</p>
                <p>Team</p>
                <p>Press</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#36596A] mb-4">Legal</h3>
              <div className="space-y-2 text-gray-600">
                <p>Privacy Policy</p>
                <p>Terms of Service</p>
                <p>Disclaimers</p>
              </div>
            </div>
          </div>
          <div className="text-center mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">© 2024 SeniorSimple. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
