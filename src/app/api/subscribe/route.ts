import { NextRequest, NextResponse } from 'next/server'
import { newsletterDb, SITE_ID } from '@/lib/newsletter-db'

// Simple in-memory rate limiter: 5 requests per IP per minute
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60_000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(ip) || []
  const recent = timestamps.filter((t) => now - t < RATE_WINDOW_MS)
  if (recent.length >= RATE_LIMIT) return true
  recent.push(now)
  rateLimitMap.set(ip, recent)
  return false
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email, site_id, first_name, zip_code, source, source_detail, tags } = body

    // Validation
    if (!email || !site_id) {
      return NextResponse.json(
        { error: 'email and site_id are required' },
        { status: 400 }
      )
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check if subscriber already exists
    const { data: existing } = await newsletterDb
      .from('newsletter_subscribers')
      .select('id, status, tags')
      .eq('email', normalizedEmail)
      .eq('site_id', site_id)
      .maybeSingle()

    let subscriberId: string
    let isNew: boolean

    if (existing) {
      // Existing subscriber — merge tags and reactivate if unsubscribed
      isNew = false
      subscriberId = existing.id

      const existingTags: string[] = existing.tags || []
      const incomingTags: string[] = tags || []
      const mergedTags = [...new Set([...existingTags, ...incomingTags])]

      const updatePayload: Record<string, unknown> = {
        tags: mergedTags,
        updated_at: new Date().toISOString(),
      }

      // Reactivate if previously unsubscribed
      if (existing.status === 'unsubscribed') {
        updatePayload.status = 'active'
        updatePayload.unsubscribed_at = null
        updatePayload.subscribed_at = new Date().toISOString()
      }

      // Merge optional fields if provided
      if (first_name) updatePayload.first_name = first_name
      if (zip_code) updatePayload.zip_code = zip_code
      if (source) updatePayload.source = source
      if (source_detail) updatePayload.source_detail = source_detail

      const { error: updateError } = await newsletterDb
        .from('newsletter_subscribers')
        .update(updatePayload)
        .eq('id', existing.id)

      if (updateError) {
        console.error('Newsletter subscribe update error:', updateError)
        return NextResponse.json(
          { error: 'Failed to update subscriber' },
          { status: 500 }
        )
      }
    } else {
      // New subscriber
      isNew = true
      const now = new Date().toISOString()

      const { data: inserted, error: insertError } = await newsletterDb
        .from('newsletter_subscribers')
        .insert({
          email: normalizedEmail,
          site_id,
          first_name: first_name || null,
          zip_code: zip_code || null,
          source: source || null,
          source_detail: source_detail || null,
          tags: tags || [],
          status: 'active',
          subscribed_at: now,
          created_at: now,
          updated_at: now,
        })
        .select('id')
        .single()

      if (insertError) {
        console.error('Newsletter subscribe insert error:', insertError)
        return NextResponse.json(
          { error: 'Failed to create subscriber' },
          { status: 500 }
        )
      }

      subscriberId = inserted.id
    }

    return NextResponse.json({
      success: true,
      subscriber_id: subscriberId,
      is_new: isNew,
      site: site_id,
    })
  } catch (err) {
    console.error('Newsletter subscribe error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
