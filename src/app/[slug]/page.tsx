import { getArticle, getRelatedArticles } from '../../lib/articles'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface RootSlugPageProps {
  params: Promise<{ slug: string }>
}

// Force dynamic rendering - fetch from database on every request
export const dynamic = 'force-dynamic'
export const revalidate = 0

// List of reserved routes that should not be treated as articles
const RESERVED_ROUTES = [
  'articles',
  'category',
  'content',
  'quiz',
  'calculators',
  'consultation',
  'college-planning',
  'contact',
  'privacy-policy',
  'terms-of-service',
  'disclaimers',
  'faq',
  'resources',
  'tools',
  'guides',
  'videos',
  'gallery',
  'ebook',
  'estate',
  'housing',
  'insurance',
  'retirement',
  'tax',
  'thank-you',
  'quote',
  'quote-submitted',
  'quiz-submitted',
  'consultation-booked',
  'consultation-confirmed',
  'book-confirmation',
  'expect-call',
  'life-insurance-quiz',
  'retirement-protection-checklist',
  'retirement-rescue',
  'otp-debug',
  'otp-test',
  'debug-api',
  'debug-env',
  'test-content',
  'test-mega-menu',
  'health',
]

export default async function RootSlugPage({ params }: RootSlugPageProps) {
  const { slug } = await params

  // Skip if this is a reserved route
  if (RESERVED_ROUTES.includes(slug)) {
    notFound()
  }

  // Check if this slug matches an article
  const { article, error } = await getArticle(slug)

  if (error || !article) {
    // Not an article, return 404
    notFound()
  }

  // Get related articles
  const { articles: relatedArticles } = await getRelatedArticles(
    article.id, 
    article.category_id, 
    3
  )

  // Generate structured data for SEO/AEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt || article.meta_description,
    "image": article.featured_image_url ? [article.featured_image_url] : [],
    "datePublished": article.created_at,
    "dateModified": article.updated_at,
    "author": {
      "@type": "Organization",
      "name": "ParentSimple"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ParentSimple",
      "logo": {
        "@type": "ImageObject",
        "url": "https://parentsimple.org/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://parentsimple.org/${article.slug}`
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      {/* Structured Data for SEO/AEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Breadcrumb */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <nav className="flex text-sm text-gray-600">
            <Link href="/" className="hover:text-[#36596A]">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/articles" className="hover:text-[#36596A]">Articles</Link>
            <span className="mx-2">/</span>
            <span className="text-[#36596A]">{article.title}</span>
          </nav>
        </div>
      </section>

      {/* Article Hero */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Category Badge */}
          {article.category_details && (
            <div className="mb-4">
              <span className="inline-block px-4 py-2 bg-[#E4CDA1] text-[#36596A] text-sm font-medium rounded-full">
                {article.category_details.name}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-[#36596A] mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {article.excerpt}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex items-center text-gray-500 text-sm mb-8 pb-8 border-b border-gray-200">
            <span>
              Published {new Date(article.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            {article.updated_at !== article.created_at && (
              <>
                <span className="mx-3">•</span>
                <span>
                  Updated {new Date(article.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </>
            )}
          </div>

          {/* Featured Image */}
          {article.featured_image_url && (
            <div className="mb-12">
              <div className="relative h-96 rounded-xl overflow-hidden">
                <Image
                  src={article.featured_image_url}
                  alt={article.featured_image_alt || article.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Article Content */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-6 pb-16">
          {article.html_body ? (
            <div 
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.html_body }}
              style={{
                fontSize: '18px',
                lineHeight: '1.8',
              }}
            />
          ) : (
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content }}
                style={{
                  fontSize: '18px',
                  lineHeight: '1.8',
                }}
              />
            </div>
          )}
        </div>
      </section>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <section className="bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Articles */}
      {relatedArticles && relatedArticles.length > 0 && (
        <section className="py-16 px-6 bg-[#F5F5F0]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-serif font-semibold text-[#36596A] text-center mb-12">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedArticles.map((relatedArticle) => (
                <article key={relatedArticle.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  {relatedArticle.featured_image_url && (
                    <div className="relative h-48 rounded-t-lg overflow-hidden">
                      <Image
                        src={relatedArticle.featured_image_url}
                        alt={relatedArticle.featured_image_alt || relatedArticle.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-[#36596A] hover:text-[#2a4a5a] transition-colors">
                      <Link href={`/${relatedArticle.slug}`}>
                        {relatedArticle.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {relatedArticle.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        {new Date(relatedArticle.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <Link 
                        href={`/${relatedArticle.slug}`}
                        className="text-[#36596A] font-medium hover:underline"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: RootSlugPageProps) {
  const { slug } = await params
  
  // Skip if reserved route
  if (RESERVED_ROUTES.includes(slug)) {
    return {
      title: 'Page Not Found - ParentSimple',
      description: 'The requested page could not be found.'
    }
  }

  const { article } = await getArticle(slug)

  if (!article) {
    return {
      title: 'Article Not Found - ParentSimple',
      description: 'The requested article could not be found.'
    }
  }

  return {
    title: article.meta_title || `${article.title} - ParentSimple`,
    description: article.meta_description || article.excerpt || 'Expert education and financial planning advice from ParentSimple.',
    openGraph: {
      title: article.title,
      description: article.excerpt || 'Expert education and financial planning advice from ParentSimple.',
      images: article.featured_image_url ? [article.featured_image_url] : [],
      type: 'article',
    },
  }
}

