import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * On-Demand Revalidation API
 * 
 * Call this API when articles are published/updated to revalidate Next.js cache
 * 
 * Usage:
 * POST /api/revalidate
 * {
 *   "path": "/articles/my-article-slug",
 *   "secret": "your-revalidation-secret"
 * }
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { path, secret, tag } = body

    // Verify secret to prevent unauthorized revalidation
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      )
    }

    // Revalidate specific path
    if (path) {
      revalidatePath(path)
      console.log(`✅ Revalidated path: ${path}`)
    }

    // Revalidate by tag (if using tag-based revalidation)
    if (tag) {
      revalidateTag(tag)
      console.log(`✅ Revalidated tag: ${tag}`)
    }

    // If no path or tag specified, revalidate all articles
    if (!path && !tag) {
      revalidatePath('/articles')
      revalidatePath('/content')
      console.log('✅ Revalidated all article paths')
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      path: path || 'all articles',
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { error: 'Error revalidating' },
      { status: 500 }
    )
  }
}

