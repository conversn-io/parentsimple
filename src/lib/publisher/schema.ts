/**
 * SMN publisher chassis — JSON-LD builders (WO-1507, audit defect D1).
 * Every page type gets schema: Organization + WebSite sitewide (root layout),
 * CollectionPage + BreadcrumbList on hubs, CollectionPage + ItemList on the
 * directory. Articles keep their existing Article schema.
 */
import { SITE, HUBS, absoluteUrl, type PublisherHub } from './site-config'

const ORG_ID = `${SITE.url}/#organization`
const SITE_ID = `${SITE.url}/#website`

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    url: SITE.url,
    logo: SITE.logo,
    description: SITE.description,
    parentOrganization: { '@type': 'Organization', name: 'Simple Media Network', url: 'https://www.simplemedianetwork.com' },
    ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE_ID,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-US',
  }
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function collectionPageJsonLd(opts: {
  path: string
  name: string
  description: string
  items?: Array<{ name: string; path: string }>
}) {
  const url = absoluteUrl(opts.path)
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    url,
    name: opts.name,
    description: opts.description,
    isPartOf: { '@id': SITE_ID },
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-US',
    ...(opts.items && opts.items.length
      ? {
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: opts.items.length,
            itemListElement: opts.items.map((it, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: it.name,
              url: absoluteUrl(it.path),
            })),
          },
        }
      : {}),
  }
}

export function hubByKey(key: string): PublisherHub {
  const hub = HUBS.find((h) => h.key === key)
  if (!hub) throw new Error(`Unknown publisher hub: ${key}`)
  return hub
}

/** CollectionPage + BreadcrumbList for a section hub. */
export function hubJsonLd(key: string) {
  const hub = hubByKey(key)
  return [
    collectionPageJsonLd({ path: hub.href, name: hub.name, description: hub.description }),
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: hub.name, path: hub.href },
    ]),
  ]
}
