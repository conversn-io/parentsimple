import { NextRequest, NextResponse } from 'next/server'
import { submitUrlToIndexNow, submitUrlsToIndexNow, submitArticleToIndexNow } from '@/lib/indexnow'

/**
 * IndexNow API Route
 * 
 * Submit URLs to IndexNow for instant search engine indexing
 * 
 * POST /api/indexnow
 * {
 *   "urls": ["/articles/slug", "/category/slug"] // Single or multiple URLs
 *   OR
 *   "slug": "article-slug" // Article slug (submits both /articles/[slug] and /[slug])
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { urls, slug } = body

    // Validate input
    if (!urls && !slug) {
      return NextResponse.json(
        { error: 'Either "urls" or "slug" is required' },
        { status: 400 }
      )
    }

    let result

    // Submit article by slug (both /articles/[slug] and /[slug])
    if (slug) {
      result = await submitArticleToIndexNow(slug)
      return NextResponse.json({
        success: result.success,
        slug,
        urls: [`/articles/${slug}`, `/${slug}`],
        errors: result.errors,
      })
    }

    // Submit single or multiple URLs
    if (Array.isArray(urls)) {
      if (urls.length === 0) {
        return NextResponse.json(
          { error: 'URLs array cannot be empty' },
          { status: 400 }
        )
      }

      if (urls.length === 1) {
        // Single URL submission
        const singleResult = await submitUrlToIndexNow(urls[0])
        return NextResponse.json({
          success: singleResult.success,
          url: urls[0],
          error: singleResult.error,
        })
      } else {
        // Multiple URLs submission
        const multiResult = await submitUrlsToIndexNow(urls)
        return NextResponse.json({
          success: multiResult.success,
          submitted: multiResult.submitted,
          total: urls.length,
          errors: multiResult.errors,
        })
      }
    } else if (typeof urls === 'string') {
      // Single URL as string
      const singleResult = await submitUrlToIndexNow(urls)
      return NextResponse.json({
        success: singleResult.success,
        url: urls,
        error: singleResult.error,
      })
    }

    return NextResponse.json(
      { error: 'Invalid request format' },
      { status: 400 }
    )
  } catch (error) {
    console.error('IndexNow API error:', error)
    return NextResponse.json(
      { 
        error: 'Error processing IndexNow request',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint for testing
 */
export async function GET() {
  return NextResponse.json({
    message: 'IndexNow API',
    usage: {
      method: 'POST',
      body: {
        urls: ['/articles/slug', '/category/slug'], // Array of URLs
        // OR
        slug: 'article-slug', // Article slug (submits both routes)
      },
    },
    key: process.env.INDEXNOW_KEY ? 'Set' : 'Not set',
    keyFile: process.env.INDEXNOW_KEY 
      ? `https://parentsimple.org/${process.env.INDEXNOW_KEY}.txt`
      : 'Not available',
  })
}




