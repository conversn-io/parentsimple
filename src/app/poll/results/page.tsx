import { newsletterDb } from '@/lib/newsletter-db'

interface PollResult {
  answer_value: string
  answer_label: string
  count: number
}

export const dynamic = 'force-dynamic'

export default async function PollResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ issue?: string; q?: string }>
}) {
  const params = await searchParams
  const issueSlug = params.issue
  const questionKey = params.q

  if (!issueSlug || !questionKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F6EF] px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <h1 className="text-2xl font-bold text-[#1A2B49] mb-4">
            Poll Not Found
          </h1>
          <p className="text-gray-600">Missing issue or question parameters.</p>
        </div>
      </div>
    )
  }

  // Resolve issue_id
  const { data: issue } = await newsletterDb
    .from('newsletter_issues')
    .select('id, subject')
    .eq('slug', issueSlug)
    .maybeSingle()

  if (!issue) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F6EF] px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <h1 className="text-2xl font-bold text-[#1A2B49] mb-4">
            Issue Not Found
          </h1>
          <p className="text-gray-600">
            We couldn&apos;t find results for this poll.
          </p>
        </div>
      </div>
    )
  }

  // Aggregate results
  const { data: rawResults } = await newsletterDb
    .from('newsletter_poll_responses')
    .select('answer_value, answer_label')
    .eq('issue_id', issue.id)
    .eq('question_key', questionKey)

  // Group and count
  const countsMap = new Map<string, { label: string; count: number }>()
  for (const row of rawResults || []) {
    const key = row.answer_value
    const existing = countsMap.get(key)
    if (existing) {
      existing.count++
    } else {
      countsMap.set(key, { label: row.answer_label || key, count: 1 })
    }
  }

  const results: PollResult[] = Array.from(countsMap.entries())
    .map(([value, { label, count }]) => ({
      answer_value: value,
      answer_label: label,
      count,
    }))
    .sort((a, b) => b.count - a.count)

  const totalVotes = results.reduce((sum, r) => sum + r.count, 0)

  // Bar colors — cycle through brand palette
  const barColors = ['#1A2B49', '#9DB89D', '#6B8F6B', '#4A6741', '#2D4A2D']

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F6EF] px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#9DB89D]/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-[#9DB89D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#1A2B49] mb-1">
            Thanks for Voting!
          </h1>
          <p className="text-gray-500 text-sm">
            {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'} so far
          </p>
        </div>

        <div className="space-y-4">
          {results.map((result, i) => {
            const pct = totalVotes > 0 ? Math.round((result.count / totalVotes) * 100) : 0
            const isWinner = i === 0 && results.length > 1
            const color = barColors[i % barColors.length]

            return (
              <div key={result.answer_value}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-[#1A2B49]">
                    {isWinner && (
                      <span className="mr-1" aria-label="Leading">
                        {'> '}
                      </span>
                    )}
                    {result.answer_label}
                  </span>
                  <span className="text-sm text-gray-500">
                    {pct}% ({result.count})
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.max(pct, 2)}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {results.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No votes yet. Be the first!
          </p>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <a
            href="/"
            className="inline-flex items-center text-sm font-medium text-[#9DB89D] hover:text-[#1A2B49] transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to ParentSimple
          </a>
        </div>
      </div>
    </div>
  )
}
