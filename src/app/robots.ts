import type { MetadataRoute } from 'next'

const FALLBACK_SITE_URL = 'https://parentsimple.org'

const getSiteUrl = () => {
  const c = process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL
  try { return new URL(c).origin } catch { return FALLBACK_SITE_URL }
}

// KEENAN ALLOWS ROBOTS (2026-07-07): explicitly permit all AI answer-engine
// crawlers. Whole strategy is to be cited by AI answers — blocking them
// forfeits the citation upside.
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/portal/', '/admin/'] },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'Claude-Web', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Perplexity-User', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
      { userAgent: 'Meta-ExternalAgent', allow: '/' },
      { userAgent: 'Bytespider', allow: '/' },
    ],
    sitemap: [`${siteUrl}/sitemap.xml`],
    host: siteUrl,
  }
}
