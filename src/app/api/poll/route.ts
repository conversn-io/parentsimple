import { NextRequest, NextResponse } from 'next/server'
import { newsletterDb, SITE_ID } from '@/lib/newsletter-db'
import { createHash } from 'crypto'

const IP_HASH_SALT = process.env.POLL_IP_HASH_SALT || 'parentsimple-poll-default-salt'

function hashIp(ip: string): string {
  return createHash('sha256').update(`${IP_HASH_SALT}:${ip}`).digest('hex')
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const issueSlug = searchParams.get('issue')
  const questionKey = searchParams.get('q')
  const answerValue = searchParams.get('a')
  const answerLabel = searchParams.get('label')
  const subscriberId = searchParams.get('sid')

  const baseUrl = new URL(request.url).origin

  if (!issueSlug || !questionKey || !answerValue) {
    return NextResponse.json(
      { error: 'issue, q, and a params are required' },
      { status: 400 }
    )
  }

  // Resolve issue_id from slug
  const { data: issue } = await newsletterDb
    .from('newsletter_issues')
    .select('id')
    .eq('slug', issueSlug)
    .maybeSingle()

  if (!issue) {
    return NextResponse.json(
      { error: 'Issue not found' },
      { status: 404 }
    )
  }

  // Hash the IP
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  const ipHash = hashIp(ip)

  // UPSERT the vote — allows changing answer, prevents duplicates
  const { error } = await newsletterDb
    .from('newsletter_poll_responses')
    .upsert(
      {
        issue_id: issue.id,
        site_id: SITE_ID,
        subscriber_id: subscriberId || null,
        question_key: questionKey,
        answer_value: answerValue,
        answer_label: answerLabel || answerValue,
        ip_hash: ipHash,
        created_at: new Date().toISOString(),
      },
      { onConflict: 'ip_hash,issue_id,question_key' }
    )

  if (error) {
    console.error('Poll vote error:', error)
    return NextResponse.json(
      { error: 'Failed to record vote' },
      { status: 500 }
    )
  }

  // Redirect to results page
  return NextResponse.redirect(
    `${baseUrl}/poll/results?issue=${encodeURIComponent(issueSlug)}&q=${encodeURIComponent(questionKey)}`
  )
}
