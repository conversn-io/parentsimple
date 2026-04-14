import { NextRequest, NextResponse } from 'next/server'
import { newsletterDb } from '@/lib/newsletter-db'

// Site display names for the confirmation page
const SITE_NAMES: Record<string, string> = {
  parentsimple: 'ParentSimple',
  seniorsimple: 'SeniorSimple',
  moneysimple: 'MoneySimple',
  homesimple: 'HomeSimple',
  creditrepairsimple: 'CreditRepairSimple',
  scalingsimple: 'ScalingSimple',
  smallbizsimple: 'SmallBizSimple',
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sid = searchParams.get('sid')
  const email = searchParams.get('email')
  const site = searchParams.get('site')

  const baseUrl = new URL(request.url).origin

  // Look up subscriber
  let query = newsletterDb
    .from('newsletter_subscribers')
    .select('id, email, site_id, status')

  if (sid) {
    query = query.eq('id', sid)
  } else if (email && site) {
    query = query.eq('email', email.toLowerCase().trim()).eq('site_id', site)
  } else {
    return NextResponse.redirect(`${baseUrl}/unsubscribe/confirmed?status=not_found`)
  }

  const { data: subscriber } = await query.maybeSingle()

  if (!subscriber) {
    return NextResponse.redirect(`${baseUrl}/unsubscribe/confirmed?status=not_found`)
  }

  if (subscriber.status === 'unsubscribed') {
    return NextResponse.redirect(`${baseUrl}/unsubscribe/confirmed?status=already`)
  }

  // Redirect to the confirmation page with subscriber ID
  return NextResponse.redirect(`${baseUrl}/unsubscribe?sid=${subscriber.id}`)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subscriber_id, email, site_id } = body

    let query = newsletterDb
      .from('newsletter_subscribers')
      .update({
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

    if (subscriber_id) {
      query = query.eq('id', subscriber_id)
    } else if (email && site_id) {
      query = query.eq('email', email.toLowerCase().trim()).eq('site_id', site_id)
    } else {
      return NextResponse.json(
        { error: 'subscriber_id or (email + site_id) required' },
        { status: 400 }
      )
    }

    const { error } = await query

    if (error) {
      console.error('Unsubscribe error:', error)
      return NextResponse.json(
        { error: 'Failed to unsubscribe' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Unsubscribe error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
