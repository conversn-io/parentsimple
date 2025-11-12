import type { Metadata } from 'next'
import { getPublishedArticles, getCategories } from '../../lib/articles'
import Link from 'next/link'
import Image from 'next/image'
import { generateListingMetadata } from '../../lib/seo-utils'

export const metadata: Metadata = generateListingMetadata(
  "Retirement Education & Insights",
  "Expert guidance on annuities, tax planning, estate planning, and more. Stay informed with our latest articles and resources for retirement planning.",
  "retirement planning"
)

export default async function ArticlesPage() {
  const { articles, error } = await getPublishedArticles()
  const { categories } = await getCategories()

  if (error) {
    console.error('Error fetching articles:', error)
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0]">


      {/* Hero Section */}
      <section className="py-16 px-6" style={{ background: 'linear-gradient(135deg, #36596A 0%, #82A6B1 100%)' }}>
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-white mb-6">
            Retirement Education & Insights
          </h1>
          <p className="text-xl text-white opacity-90 mb-8 max-w-3xl mx-auto">
            Expert guidance on annuities, tax planning, estate planning, and more. 
            Stay informed with our latest articles and resources.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      {categories && categories.length > 0 && (
        <section className="py-8 px-6 bg-white border-b">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-3">
              <span className="text-[#36596A] font-medium mr-2">Filter by:</span>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="px-4 py-2 bg-[#F5F5F0] text-[#36596A] rounded-full text-sm font-medium hover:bg-[#E4CDA1] transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {error ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Unable to load articles at this time. Please try again later.</p>
            </div>
          ) : articles && articles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <article key={article.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  {/* Featured Image */}
                  {article.featured_image_url && (
                    <div className="relative h-48 rounded-t-lg overflow-hidden">
                      <Image
                        src={article.featured_image_url}
                        alt={article.featured_image_alt || article.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* Category */}
                    {article.category_details && (
                      <div className="mb-3">
                        <span className="inline-block px-3 py-1 bg-[#E4CDA1] text-[#36596A] text-sm font-medium rounded-full">
                          {article.category_details.name}
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="text-xl font-semibold mb-3 text-[#36596A] hover:text-[#2a4a5a] transition-colors">
                      <Link href={`/articles/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        {new Date(article.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <Link 
                        href={`/articles/${article.slug}`}
                        className="text-[#36596A] font-medium hover:underline"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No articles available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-6" style={{ background: 'linear-gradient(135deg, #36596A 0%, #82A6B1 100%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-semibold text-white mb-4">
            Stay Updated with Retirement Insights
          </h2>
          <p className="text-xl text-white mb-8 opacity-90">
            Get the latest articles and expert advice delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-3 rounded-lg border-0 text-gray-900"
            />
            <button className="bg-white text-[#36596A] px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
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


