import type { Metadata } from 'next'
import { generateSEOTitle, generateSEODescription, generateSemanticKeywords } from './seo-templates'
import { EnhancedArticle } from './enhanced-articles'

// Generate metadata for content pages
export function generateContentMetadata(article: EnhancedArticle): Metadata {
  const title = generateSEOTitle(article.title)
  const description = generateSEODescription(article.excerpt || article.content)
  const keywords = generateSemanticKeywords(
    article.content, 
    article.meta_keywords || [article.category || 'retirement planning']
  )

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://seniorsimple.org/content/${article.slug}`,
      siteName: 'SeniorSimple',
      publishedTime: article.created_at,
      modifiedTime: article.updated_at,
      authors: ['SeniorSimple Team'],
      images: article.featured_image_url ? [
        {
          url: article.featured_image_url,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ] : [
        {
          url: '/images/webp/hero/couple-share-coffee-meeting-home-couch.webp',
          width: 1200,
          height: 630,
          alt: 'SeniorSimple - Retirement Planning',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: article.featured_image_url ? [article.featured_image_url] : ['/images/webp/hero/couple-share-coffee-meeting-home-couch.webp'],
    },
    alternates: {
      canonical: `https://seniorsimple.org/content/${article.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

// Generate metadata for listing pages
export function generateListingMetadata(
  pageTitle: string,
  description: string,
  category?: string
): Metadata {
  const title = generateSEOTitle(pageTitle)
  const metaDescription = generateSEODescription(description)
  const keywords = generateSemanticKeywords(description, [category || 'retirement planning'])

  return {
    title,
    description: metaDescription,
    keywords,
    openGraph: {
      title,
      description: metaDescription,
      type: 'website',
      url: `https://seniorsimple.org/${category || 'content'}`,
      siteName: 'SeniorSimple',
      images: [
        {
          url: '/images/webp/hero/couple-share-coffee-meeting-home-couch.webp',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: metaDescription,
      images: ['/images/webp/hero/couple-share-coffee-meeting-home-couch.webp'],
    },
    alternates: {
      canonical: `https://seniorsimple.org/${category || 'content'}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

// Generate metadata for calculator pages
export function generateCalculatorMetadata(
  calculatorName: string,
  description: string,
  category: string = 'calculator'
): Metadata {
  const title = generateSEOTitle(`${calculatorName} Calculator`)
  const metaDescription = generateSEODescription(description)
  const keywords = generateSemanticKeywords(description, [category, 'calculator', 'retirement planning'])

  return {
    title,
    description: metaDescription,
    keywords,
    openGraph: {
      title,
      description: metaDescription,
      type: 'website',
      url: `https://seniorsimple.org/calculators/${calculatorName.toLowerCase().replace(/\s+/g, '-')}`,
      siteName: 'SeniorSimple',
      images: [
        {
          url: '/images/webp/hero/couple-share-coffee-meeting-home-couch.webp',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: metaDescription,
      images: ['/images/webp/hero/couple-share-coffee-meeting-home-couch.webp'],
    },
    alternates: {
      canonical: `https://seniorsimple.org/calculators/${calculatorName.toLowerCase().replace(/\s+/g, '-')}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

// Generate breadcrumb data for structured data
export function generateBreadcrumbs(path: string, title: string) {
  const segments = path.split('/').filter(Boolean)
  const breadcrumbs = [
    { name: 'Home', url: 'https://seniorsimple.org' }
  ]

  let currentPath = ''
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === segments.length - 1
    const name = isLast ? title : segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
    breadcrumbs.push({
      name,
      url: `https://seniorsimple.org${currentPath}`
    })
  })

  return breadcrumbs
}

// Validate SEO metadata
export function validateSEOMetadata(metadata: Metadata): string[] {
  const errors: string[] = []

  if (!metadata.title || (typeof metadata.title === 'string' && metadata.title.length > 60)) {
    errors.push('Title should be under 60 characters')
  }

  if (!metadata.description || (typeof metadata.description === 'string' && metadata.description.length > 160)) {
    errors.push('Description should be under 160 characters')
  }

  if (!metadata.openGraph?.images || (Array.isArray(metadata.openGraph.images) && metadata.openGraph.images.length === 0)) {
    errors.push('Open Graph image is required')
  }

  return errors
}

// Generate sitemap data
export function generateSitemapData(pages: Array<{
  url: string
  lastModified: string
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}>) {
  return pages.map(page => ({
    url: `https://seniorsimple.org${page.url}`,
    lastModified: page.lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority
  }))
}
