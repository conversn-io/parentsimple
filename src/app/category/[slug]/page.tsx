import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

import { getArticlesByCategory, getCategories } from '@/lib/articles'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

const formatCategoryName = (slug: string) =>
  slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const categoryName = formatCategoryName(slug)
  return {
    title: `${categoryName} Insights | ParentSimple`,
    description: `Explore ParentSimple's latest research, guides, and expert advice for ${categoryName.toLowerCase()} families.`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const [categoryResult, categoriesResult] = await Promise.all([
    getArticlesByCategory(slug),
    getCategories(),
  ])

  if (categoryResult.error) {
    console.error('Error loading category articles:', categoryResult.error)
  }

  const articles = categoryResult.articles || []
  const categories = categoriesResult.categories || []

  const categoryName =
    articles[0]?.category_details?.name || formatCategoryName(slug)

  if (!articles.length) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <section
        className="py-16 px-6"
        style={{ background: 'linear-gradient(135deg, #1A2B49 0%, #36596A 100%)' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-[#E4CDA1] mb-3">
            ParentSimple Pillar
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-white mb-6">
            {categoryName}
          </h1>
          <p className="text-xl text-white/85 max-w-3xl mx-auto">
            Curated insights, planning guides, and actionable strategies for families focused on{' '}
            {categoryName.toLowerCase()}.
          </p>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="py-6 px-6 bg-white border-b">
          <div className="max-w-5xl mx-auto flex flex-wrap gap-3">
            {categories.map((category) => {
              const isActive = category.slug === slug
              return (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#1A2B49] text-white'
                      : 'bg-[#F5F5F0] text-[#1A2B49] hover:bg-[#E4CDA1]'
                  }`}
                >
                  {category.name}
                </Link>
              )
            })}
          </div>
        </section>
      )}

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-2xl shadow-sm border border-[#E3E0D5] overflow-hidden"
            >
              {article.featured_image_url && (
                <div className="relative h-72">
                  <Image
                    src={article.featured_image_url}
                    alt={article.featured_image_alt || article.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#9DB89D]" />
                    {categoryName}
                  </span>
                  <span>
                    {new Date(article.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <h2 className="text-3xl font-serif font-semibold text-[#1A2B49] mb-4">
                  <Link href={`/articles/${article.slug}`}>
                    {article.title}
                  </Link>
                </h2>

                <p className="text-lg text-gray-600 mb-6">
                  {article.excerpt}
                </p>

                <Link
                  href={`/articles/${article.slug}`}
                  className="inline-flex items-center text-[#1A2B49] font-semibold hover:underline"
                >
                  Read full guide
                  <span className="ml-2" aria-hidden>
                    →
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 bg-white border-t border-b border-[#E3E0D5]">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-[#9DB89D] mb-4">
            Need a partner?
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-[#1A2B49] mb-6">
            Talk with a ParentSimple education strategist
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Get personalized guidance on college planning, financial strategy, and your family’s long-term goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/consultation"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#1A2B49] text-white font-semibold hover:bg-[#152238] transition-colors"
            >
              Book a consultation
            </Link>
            <Link
              href="/quiz/elite-university-readiness"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-[#1A2B49] text-[#1A2B49] font-semibold hover:bg-[#F5F5F0] transition-colors"
            >
              Take the readiness quiz
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

