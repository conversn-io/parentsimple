import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://parentsimple.org'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/debug-*/',
          '/test-*/',
          '/otp-debug/',
          '/otp-test/',
          '/debug-api/',
          '/debug-env/',
          '/quiz-a/',
          '/quiz-submitted/',
          '/quote-submitted/',
          '/consultation-booked/',
          '/consultation-confirmed/',
          '/expect-call/',
          '/book-confirmation/',
          '/thank-you/',
          '/ebook/',
          '/gallery/',
          '/videos/',
          '/tools/',
          '/guides/',
          '/resources/',
          '/test-content/',
          '/test-mega-menu/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/debug-*/',
          '/test-*/',
          '/otp-debug/',
          '/otp-test/',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/debug-*/',
          '/test-*/',
          '/otp-debug/',
          '/otp-test/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}




