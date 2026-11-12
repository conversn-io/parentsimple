import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import JsonLd, { chassisMetadata } from '@/components/publisher/JsonLd'
import { breadcrumbJsonLd, collectionPageJsonLd } from '@/lib/publisher/schema'
import { getDirectoryArticles, groupByTopic } from '@/lib/publisher/directory'
import { SITE, HUBS } from '@/lib/publisher/site-config'

/**
 * SMN publisher chassis — article directory (SeniorSimple WO-1507 → ParentSimple WO-1516, spec §5).
 * Latest (reverse-chron, paginated with crawlable ?page= links) + By topic.
 * CollectionPage + ItemList + BreadcrumbList JSON-LD.
 *
 * Legacy `?category=<slug>` links (the mega menu uses them for categories with
 * no articles yet) land on the full directory; canonical stays /articles.
 */

export const revalidate = 300

const PAGE_SIZE = 24
const TOPIC_PREVIEW = 8
const TITLE = 'Parenting & College Planning Articles'
const DESCRIPTION =
  'Every ParentSimple guide in one place — the latest articles on college planning, education savings, family finance, and raising kids from the early years through high school.'

type Props = { searchParams: Promise<{ page?: string | string[] }> }

async function readPage(searchParams: Props['searchParams']) {
  const raw = (await searchParams).page
  const value = Array.isArray(raw) ? raw[0] : raw
  return Math.max(1, parseInt(value ?? '1', 10) || 1)
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const page = await readPage(searchParams)
  return chassisMetadata({
    title: page > 1 ? `${TITLE} — Page ${page}` : TITLE,
    description: DESCRIPTION,
    path: page > 1 ? `/articles?page=${page}` : '/articles',
  })
}

function formatDate(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default async function ArticlesDirectoryPage({ searchParams }: Props) {
  const { articles, error } = await getDirectoryArticles()
  if (error) console.error('[articles directory] fetch failed:', error)

  const totalPages = Math.max(1, Math.ceil(articles.length / PAGE_SIZE))
  const page = Math.min(totalPages, await readPage(searchParams))
  const latest = articles.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const topics = groupByTopic(articles)

  const path = page > 1 ? `/articles?page=${page}` : '/articles'
  const schema = [
    collectionPageJsonLd({
      path,
      name: TITLE,
      description: DESCRIPTION,
      items: latest.map((a) => ({ name: a.title, path: `/articles/${a.slug}` })),
    }),
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Articles', path: '/articles' },
    ]),
  ]

  return (
    <div className="min-h-screen bg-[#F9F6EF]">
      <JsonLd data={schema} />

      {/* Hero */}
      <section className="py-14 px-6 bg-gradient-to-br from-[#1A2B49] to-[#152238]">
        <div className="max-w-6xl mx-auto text-center text-white">
          <nav aria-label="Breadcrumb" className="text-sm opacity-80 mb-4">
            <Link href="/" className="hover:underline">Home</Link> <span aria-hidden>›</span> Articles
          </nav>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-5">{TITLE}</h1>
          <div className="w-24 h-1 bg-[#9DB89D] mx-auto mb-6" />
          <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
            Clear, practical guidance for every stage of raising kids. Browse our {articles.length || 'latest'} guides
            by date or by topic — each one is written to help you feel more confident about your next step.
          </p>
        </div>
      </section>

      {/* Topic jump links */}
      {topics.length > 0 && (
        <section className="py-6 px-6 bg-white border-b">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-3">
            <span className="text-[#1A2B49] font-semibold mr-1">Browse by topic:</span>
            {topics.map((t) => (
              <a
                key={t.key}
                href={`#topic-${t.key}`}
                className="px-4 py-2 bg-[#F9F6EF] text-[#1A2B49] rounded-full text-sm font-medium hover:bg-[#9DB89D]/30 transition-colors"
              >
                {t.name} <span className="opacity-60">({t.articles.length})</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Latest */}
      <section className="py-14 px-6" aria-labelledby="latest-heading">
        <div className="max-w-6xl mx-auto">
          <h2 id="latest-heading" className="text-3xl font-serif font-bold text-[#1A2B49] mb-8">
            {page > 1 ? `Latest Articles — Page ${page}` : 'Latest Articles'}
          </h2>

          {latest.length === 0 ? (
            <p className="text-gray-600">New guides are on the way — check back soon.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latest.map((a) => (
                <article key={a.slug} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow flex flex-col">
                  {a.featured_image_url && (
                    <Link href={`/articles/${a.slug}`} className="relative block h-48 rounded-t-xl overflow-hidden" tabIndex={-1} aria-hidden>
                      <Image
                        src={a.featured_image_url}
                        alt={a.featured_image_alt || a.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </Link>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <span className="self-start px-3 py-1 bg-[#9DB89D]/25 text-[#1A2B49] text-xs font-semibold rounded-full mb-3">
                      {a.topic.name}
                    </span>
                    <h3 className="text-xl font-serif font-bold mb-3 text-[#1A2B49]">
                      <Link href={`/articles/${a.slug}`} className="hover:underline">{a.title}</Link>
                    </h3>
                    {a.excerpt && <p className="text-gray-600 mb-4 line-clamp-3">{a.excerpt}</p>}
                    <div className="mt-auto flex items-center justify-between text-sm text-gray-500">
                      <time dateTime={a.published_at ?? a.created_at}>{formatDate(a.published_at ?? a.created_at)}</time>
                      <span>{SITE.name} Editorial</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav aria-label="Article pages" className="mt-12 flex flex-wrap justify-center gap-2">
              {page > 1 && (
                <Link rel="prev" href={page === 2 ? '/articles' : `/articles?page=${page - 1}`} className="px-4 py-2 rounded-lg bg-white border text-[#1A2B49] hover:bg-[#9DB89D]/30">
                  ← Newer
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={n === 1 ? '/articles' : `/articles?page=${n}`}
                  aria-current={n === page ? 'page' : undefined}
                  className={`px-4 py-2 rounded-lg border ${n === page ? 'bg-[#1A2B49] text-white' : 'bg-white text-[#1A2B49] hover:bg-[#9DB89D]/30'}`}
                >
                  {n}
                </Link>
              ))}
              {page < totalPages && (
                <Link rel="next" href={`/articles?page=${page + 1}`} className="px-4 py-2 rounded-lg bg-white border text-[#1A2B49] hover:bg-[#9DB89D]/30">
                  Older →
                </Link>
              )}
            </nav>
          )}
        </div>
      </section>

      {/* By topic — crawlable text links into every cluster */}
      {topics.length > 0 && (
        <section className="py-14 px-6 bg-white" aria-labelledby="topics-heading">
          <div className="max-w-6xl mx-auto">
            <h2 id="topics-heading" className="text-3xl font-serif font-bold text-[#1A2B49] mb-8">Articles by Topic</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {topics.map((t) => (
                <div key={t.key} id={`topic-${t.key}`} className="scroll-mt-24">
                  <h3 className="text-xl font-serif font-bold text-[#1A2B49] mb-3 border-b border-[#9DB89D] pb-2">
                    {t.name} <span className="text-sm font-normal text-gray-500">· {t.articles.length} guides</span>
                  </h3>
                  <ul className="space-y-2">
                    {t.articles.slice(0, TOPIC_PREVIEW).map((a) => (
                      <li key={a.slug}>
                        <Link href={`/articles/${a.slug}`} className="text-gray-700 hover:text-[#1A2B49] hover:underline">
                          {a.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hubs + money action */}
      <section className="py-14 px-6 bg-gradient-to-br from-[#1A2B49] to-[#152238]">
        <div className="max-w-5xl mx-auto text-center text-white">
          <h2 className="text-3xl font-serif font-bold mb-4">Not sure where to start?</h2>
          <p className="text-lg opacity-90 mb-8">
            Our free college planning guide walks you through every step, from first savings to acceptance letters.
          </p>
          <Link href={SITE.primaryCta.href} className="inline-block bg-[#9DB89D] text-[#1A2B49] px-8 py-3 rounded-lg font-semibold hover:bg-[#8BA68B] transition-colors">
            {SITE.primaryCta.label}
          </Link>
          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {HUBS.map((h) => (
              <Link key={h.key} href={h.href} className="underline-offset-4 hover:underline opacity-90">{h.name}</Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
