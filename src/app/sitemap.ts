import { MetadataRoute } from 'next'
import { getPublishedArticles, getUxCategories } from '@/lib/articles'

// Cache sitemap generation to prevent timeouts
export const revalidate = 3600 // Revalidate every hour
export const dynamic = 'force-dynamic' // But still generate dynamically

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://parentsimple.org'
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/college-planning`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/consultation`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/calculators/college-savings`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/calculators/college-cost`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/calculators/life-insurance`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Category pages - with error handling
  let categoryPages: MetadataRoute.Sitemap = []
  try {
    const { categories, error } = await getUxCategories()
    if (!error && categories) {
      categoryPages = categories.map((category) => ({
        url: `${baseUrl}/category/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    }
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error)
  }

  // Article pages - with error handling and timeout protection
  let articlePages: MetadataRoute.Sitemap = []
  try {
    // Add timeout protection for large article lists
    const fetchPromise = getPublishedArticles()
    const timeoutPromise = new Promise<{ articles: never[], error: Error }>((_, reject) => 
      setTimeout(() => reject(new Error('Sitemap generation timeout')), 10000)
    )
    
    const { articles, error } = await Promise.race([fetchPromise, timeoutPromise]).catch(() => ({
      articles: [],
      error: new Error('Sitemap generation timed out')
    })) as { articles: any[], error: Error | null }

    if (!error && articles && articles.length > 0) {
      // Include both /articles/[slug] and root-level [slug] URLs for SEO
      articlePages = articles.flatMap((article) => [
        {
          url: `${baseUrl}/articles/${article.slug}`,
          lastModified: new Date(article.updated_at),
          changeFrequency: 'monthly' as const,
          priority: 0.8, // Higher priority for canonical /articles/ route
        },
        {
          url: `${baseUrl}/${article.slug}`,
          lastModified: new Date(article.updated_at),
          changeFrequency: 'monthly' as const,
          priority: 0.7, // Lower priority for root-level route
        },
      ])
    }
  } catch (error) {
    console.error('Error fetching articles for sitemap:', error)
    // Return partial sitemap even if articles fail
  }

  return [...staticPages, ...categoryPages, ...articlePages]
}

