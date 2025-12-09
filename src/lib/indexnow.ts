/**
 * IndexNow Utility
 * 
 * Implements IndexNow protocol for instant search engine notifications
 * Documentation: https://www.indexnow.org/documentation
 */

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'b76156595496188668d79d2c94b10297'
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://parentsimple.org'

// IndexNow search engines endpoints
const INDEXNOW_ENDPOINTS = [
  'https://www.bing.com/indexnow',
  'https://api.indexnow.org/indexnow', // Yandex, Seznam.cz, Naver, and others
]

/**
 * Submit a single URL to IndexNow
 */
export async function submitUrlToIndexNow(url: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate URL
    const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url.startsWith('/') ? url : `/${url}`}`
    
    // URL encode the URL
    const encodedUrl = encodeURIComponent(fullUrl)
    
    // Submit to all IndexNow endpoints
    const results = await Promise.allSettled(
      INDEXNOW_ENDPOINTS.map(endpoint => 
        fetch(`${endpoint}?url=${encodedUrl}&key=${INDEXNOW_KEY}`, {
          method: 'GET',
          headers: {
            'User-Agent': 'ParentSimple-IndexNow/1.0',
          },
        })
      )
    )

    // Check if at least one submission succeeded
    const successes = results.filter(r => r.status === 'fulfilled' && r.value.ok)
    
    if (successes.length > 0) {
      return { success: true }
    }

    // Log errors
    const errors = results
      .filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.ok))
      .map(r => r.status === 'rejected' ? r.reason : `HTTP ${r.value.status}`)
    
    return { 
      success: false, 
      error: errors.join(', ') 
    }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    }
  }
}

/**
 * Submit multiple URLs to IndexNow (up to 10,000 per request)
 */
export async function submitUrlsToIndexNow(urls: string[]): Promise<{ success: boolean; submitted: number; errors: string[] }> {
  try {
    // Limit to 10,000 URLs per IndexNow spec
    const urlsToSubmit = urls.slice(0, 10000)
    
    // Prepare full URLs
    const fullUrls = urlsToSubmit.map(url => 
      url.startsWith('http') ? url : `${BASE_URL}${url.startsWith('/') ? url : `/${url}`}`
    )

    // Extract host from BASE_URL
    const host = new URL(BASE_URL).hostname.replace(/^www\./, '')
    
    // Submit to all IndexNow endpoints
    const results = await Promise.allSettled(
      INDEXNOW_ENDPOINTS.map(endpoint =>
        fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'User-Agent': 'ParentSimple-IndexNow/1.0',
          },
          body: JSON.stringify({
            host: host,
            key: INDEXNOW_KEY,
            urlList: fullUrls,
          }),
        })
      )
    )

    // Count successes
    const successes = results.filter(r => 
      r.status === 'fulfilled' && 
      (r.value.status === 200 || r.value.status === 202)
    )
    
    const errors: string[] = []
    results.forEach((r, index) => {
      if (r.status === 'rejected') {
        errors.push(`Endpoint ${index}: ${r.reason}`)
      } else if (!r.value.ok) {
        errors.push(`Endpoint ${index}: HTTP ${r.value.status}`)
      }
    })

    return {
      success: successes.length > 0,
      submitted: successes.length > 0 ? urlsToSubmit.length : 0,
      errors,
    }
  } catch (error) {
    return {
      success: false,
      submitted: 0,
      errors: [error instanceof Error ? error.message : String(error)],
    }
  }
}

/**
 * Submit article URLs to IndexNow (both /articles/[slug] and root-level /[slug])
 */
export async function submitArticleToIndexNow(slug: string): Promise<{ success: boolean; errors: string[] }> {
  const urls = [
    `/articles/${slug}`,
    `/${slug}`,
  ]
  
  const result = await submitUrlsToIndexNow(urls)
  
  return {
    success: result.success,
    errors: result.errors,
  }
}

/**
 * Get the IndexNow key
 */
export function getIndexNowKey(): string {
  return INDEXNOW_KEY
}

