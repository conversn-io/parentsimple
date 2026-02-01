import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Test Content - SeniorSimple',
  description: 'Test page to verify content rendering without database connection',
}

// Sample content for testing
const sampleContent = {
  title: 'Complete Guide to Retirement Planning',
  slug: 'complete-guide-to-retirement-planning',
  content: `
# Complete Guide to Retirement Planning

Retirement planning is one of the most important financial decisions you'll make. This comprehensive guide covers everything you need to know about planning for a secure retirement.

## Key Topics Covered

- **Savings Strategies**: Learn how to maximize your retirement savings
- **Income Planning**: Understand different income sources in retirement
- **Tax Optimization**: Minimize taxes on your retirement income
- **Healthcare Planning**: Plan for medical expenses in retirement
- **Estate Planning**: Protect your assets for future generations

## Getting Started

The first step in retirement planning is understanding your current financial situation. This includes:

1. Calculating your current net worth
2. Estimating your retirement expenses
3. Determining your retirement income needs
4. Creating a savings plan

## Conclusion

Proper retirement planning requires careful consideration of many factors. Start early, save consistently, and seek professional advice when needed.
  `,
  excerpt: 'Everything you need to know about planning for a secure retirement, from savings strategies to income planning.',
  content_type: 'guide',
  difficulty_level: 'beginner',
  category: 'retirement-planning',
  meta_title: 'Complete Guide to Retirement Planning | SeniorSimple',
  meta_description: 'Everything you need to know about planning for a secure retirement, from savings strategies to income planning.',
  meta_keywords: ['retirement planning', 'savings', 'income', 'financial security'],
  reading_time: 15,
  readability_score: 75,
  semantic_keywords: ['retirement', 'planning', 'savings', 'income', 'financial', 'security'],
  topic_cluster: 'retirement-planning',
  featured_snippet_optimized: true,
  status: 'published',
  priority: 'high',
  featured: true,
  published_at: new Date().toISOString()
}

export default function TestContentPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Test Content Page</h1>
          <p className="text-gray-600">This page demonstrates content rendering without database connection</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {sampleContent.title}
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              {sampleContent.excerpt}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {sampleContent.content_type}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                {sampleContent.difficulty_level}
              </span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                {sampleContent.category}
              </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                {sampleContent.reading_time} min read
              </span>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: sampleContent.content.replace(/\n/g, '<br>') }} />
          </div>

          {/* Article Footer */}
          <footer className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span>Published: {new Date(sampleContent.published_at).toLocaleDateString()}</span>
              <span>Readability Score: {sampleContent.readability_score}/100</span>
              <span>Priority: {sampleContent.priority}</span>
            </div>
          </footer>
        </article>

        {/* Debug Information */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-800 mb-4">🔧 Debug Information</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Content Type:</strong> {sampleContent.content_type}</p>
            <p><strong>Slug:</strong> {sampleContent.slug}</p>
            <p><strong>Category:</strong> {sampleContent.category}</p>
            <p><strong>Meta Keywords:</strong> {sampleContent.meta_keywords?.join(', ')}</p>
            <p><strong>Semantic Keywords:</strong> {sampleContent.semantic_keywords?.join(', ')}</p>
            <p><strong>Topic Cluster:</strong> {sampleContent.topic_cluster}</p>
            <p><strong>Featured:</strong> {sampleContent.featured ? 'Yes' : 'No'}</p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-4">📋 Next Steps</h2>
          <div className="space-y-2 text-sm text-blue-700">
            <p>1. <strong>Set up environment variables:</strong> Create a <code>.env.local</code> file with your Supabase credentials</p>
            <p>2. <strong>Run database migration:</strong> <code>npm run migrate:db</code></p>
            <p>3. <strong>Import HTML content:</strong> <code>npm run import:content</code></p>
            <p>4. <strong>Test dynamic pages:</strong> Visit <code>/content/complete-guide-to-retirement-planning</code></p>
          </div>
        </div>
      </main>
    </div>
  )
}





