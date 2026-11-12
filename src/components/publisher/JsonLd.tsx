import type { Metadata } from 'next'
import { SITE, absoluteUrl } from '@/lib/publisher/site-config'
import { hubByKey } from '@/lib/publisher/schema'

/**
 * Server-rendered JSON-LD. A plain <script> (not next/script) so the schema
 * is in the initial HTML crawlers fetch — audit defect D1.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data]
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          // `<` escaped so article titles can never close the script tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item).replace(/</g, '\\u003c') }}
        />
      ))}
    </>
  )
}

/** Page metadata for a chassis page — title/description/canonical/OG (audit defect D5). */
export function chassisMetadata(opts: { title: string; description: string; path: string }): Metadata {
  const url = absoluteUrl(opts.path)
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      siteName: SITE.name,
      title: `${opts.title} | ${SITE.name}`,
      description: opts.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${opts.title} | ${SITE.name}`,
      description: opts.description,
    },
  }
}

export function hubMetadata(key: string): Metadata {
  const hub = hubByKey(key)
  return chassisMetadata({ title: hub.title, description: hub.description, path: hub.href })
}
