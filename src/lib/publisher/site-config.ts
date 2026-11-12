/**
 * SMN publisher chassis — per-site config (ported from SeniorSimple WO-1507 → ParentSimple WO-1516).
 *
 * Every Simple Media Network property renders the same chassis components
 * (hub schema, article directory, extended footer). Only this file changes
 * per site: brand, hubs, topic taxonomy, money action, network links.
 * "Structurally identical, visually per-vertical."
 * Spec: 00 - Reports/SMN-Publisher-Template-Spec-2026-11-12.md
 */

export interface PublisherHub {
  key: string
  name: string
  href: string
  /** <title> segment — the root layout template appends " | ParentSimple". Keep ≤ 45 chars. */
  title: string
  /** Meta description, ≤ 155 chars. */
  description: string
}

export interface PublisherTopic {
  key: string
  name: string
  /** Matched against the free-text `articles.category` column, then the title (case-insensitive). */
  match: RegExp
}

export const SITE = {
  key: 'parentsimple',
  name: 'ParentSimple',
  url: 'https://parentsimple.org',
  logo: 'https://parentsimple.org/images/logos/ParentSimple-logo-mark.png',
  tagline: 'Parenting with purpose. Planning with power.',
  description:
    'Expert guidance for parents on college planning, education savings, financial security, and family financial planning.',
  email: 'support@parentsimple.org',
  sameAs: [] as string[],
  /** The site's money action — directory CTA, sidebar card, footer. */
  primaryCta: { label: 'Get Your Free College Planning Guide', href: '/college-planning' },
  directory: { href: '/articles', name: 'All Articles' },
  /** Brand colors (visual per-vertical). */
  colors: { primary: '#1A2B49', primaryDark: '#152238', accent: '#9DB89D', surface: '#F9F6EF' },
} as const

export const HUBS: PublisherHub[] = [
  {
    key: 'early-years',
    name: 'Early Years',
    href: '/category/early-years',
    title: 'Early Years Parenting Guides (Ages 0–10)',
    description: 'Build the foundation: guides on child development, early learning, and family planning for ages 0 to 10.',
  },
  {
    key: 'middle-school',
    name: 'Middle School',
    href: '/category/middle-school',
    title: 'Middle School Parenting Guides (Ages 11–14)',
    description: 'Build momentum in the middle-school years: academics, activities, and planning ahead for ages 11 to 14.',
  },
  {
    key: 'high-school',
    name: 'High School',
    href: '/category/high-school',
    title: 'High School & College Readiness Guides',
    description: 'College readiness for ages 15 to 17: coursework, testing, activities, and the admissions timeline.',
  },
  {
    key: 'college-planning',
    name: 'College Planning',
    href: '/college-planning',
    title: 'College Planning Guides & Free Resources',
    description: 'Plan for college with confidence: admissions, 529 plans, financial aid, and a free college planning guide.',
  },
  {
    key: 'financial-planning',
    name: 'Financial Planning',
    href: '/category/financial-planning',
    title: 'Family Financial Planning Guides',
    description: 'Education savings, family budgets, taxes, and insurance — plain-English money guidance for parents.',
  },
]

/** Directory "By topic" taxonomy — first match wins (category, then title); unmatched → Parenting Resources. */
export const TOPICS: PublisherTopic[] = [
  { key: 'college', name: 'College Planning', match: /college|529|admission|scholarship|fafsa|university/i },
  { key: 'insurance', name: 'Insurance', match: /insurance/i },
  { key: 'family-finance', name: 'Family Finance', match: /financ|saving|budget|bank|tax|money|expense|cost/i },
  { key: 'early-years', name: 'Baby & Early Years', match: /early|baby|toddler|infant|preschool|development|newborn/i },
  { key: 'health', name: 'Health & Safety', match: /health|safety|mental|sleep/i },
  { key: 'education', name: 'Education & School', match: /educat|school|middle|learning|tech|teen|homework|reading/i },
  { key: 'parenting', name: 'Parenting & Family Life', match: /parent|family|activit|summer|product|shopping|organiz|childcare|kids/i },
]
export const FALLBACK_TOPIC = { key: 'parenting-resources', name: 'Parenting Resources' }

export function topicFor(
  category: string | null | undefined,
  title?: string | null,
): { key: string; name: string } {
  // Some CMS rows carry a format label ("comparison", "pillar-page", "how-to")
  // instead of a topic, so fall back to the title before the catch-all.
  for (const text of [category, title]) {
    if (!text) continue
    for (const t of TOPICS) if (t.match.test(text)) return { key: t.key, name: t.name }
  }
  return FALLBACK_TOPIC
}

/** Footer Zone B — life-stage cross-sell across Simple Media Network. */
export const NETWORK_SITES = [
  { name: 'SeniorSimple', href: 'https://www.seniorsimple.org', blurb: 'Retirement & Medicare' },
  { name: 'MoneySimple', href: 'https://www.moneysimple.org', blurb: 'Everyday money' },
  { name: 'HomeSimple', href: 'https://www.homesimple.org', blurb: 'Home projects & services' },
  { name: 'LegalSimple', href: 'https://www.legalsimple.org', blurb: 'Know your legal rights' },
]
export const NETWORK = { name: 'Simple Media Network', href: 'https://www.simplemedianetwork.com' }

export function absoluteUrl(path: string): string {
  return path.startsWith('http') ? path : `${SITE.url}${path === '/' ? '' : path}`
}
